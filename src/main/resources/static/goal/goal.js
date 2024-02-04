let backend;

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
    if (!store.state.config.enabled
            || store.state.currentValue >= 1000
            || event.consumer !== 'goal') {
        return;
    }
    let amount = event.command !== "" ? parseInt(event.command, 10) : 1;
    if (store.state.currentValue + store.state.config.riggingValue * amount > 1000) {
        amount = (1000 - store.state.currentValue)/ store.state.config.riggingValue;
    }
    backend.chargeUser(event.user.id, amount, 'rigging goal', () => {
        store.state.currentValue += store.state.config.riggingValue * amount;
        store.push();
    });
}

function storageEventReceived(event) {
    store.storageEventReceived(event); 
    updateGoalDisplay(store.state.currentValue / 10, store.state.config.enabled);
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/riggingRequested', onRigEventReceived);
    store.pull();
}

$(() => {
    backend = Backend.connect(onBackendConnect, storageEventReceived);
});