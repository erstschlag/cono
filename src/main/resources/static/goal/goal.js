let backend;
let storage;

function updateGoalDisplay(value, show) {
    $('#widget').toggleClass('show', show);
    if (value !== "" && !isNaN(value) && value <= 100 && value >= 0) {
        $(".progress .percent").text(`${value}%`);
        $(".progress .liquid").css("top", `${100 - value}%`);
    } else {
        $(".progress").parent().attr("class", "color");
        $(".progress .liquid").css("top", "100%");
        $(".progress .percent").text(0 + "%");
    }
}

function onRigEventReceived(event) {
    if (!storage.data.config.enabled
            || storage.data.currentValue >= 1000
            || event.consumer !== 'goal') {
        return;
    }
    let amount = event.command !== "" ? parseInt(event.command, 10) : 1;
    if (storage.data.currentValue + storage.data.config.riggingValue * amount > 1000) {
        amount = (1000 - storage.data.currentValue)/ storage.data.config.riggingValue;
    }
    backend.chargeUser(event.user.id, amount, 'rigging goal', () => {
        storage.data.currentValue += storage.data.config.riggingValue * amount;
        backend.pushStorage();
    });
}

function storageChanged() {
    updateGoalDisplay(storage.data.currentValue / 10, storage.data.config.enabled);
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/riggingRequested', onRigEventReceived);
}

$(() => {
    storage = new GoalStorage(storageChanged);
    backend = new Backend(onBackendConnect, storage);
});