let backend;

function addToGoal(change) {
    store.state.currentValue += change;
    store.push();
}

function toggleGoal() {
    store.state.config.enabled = !store.state.config.enabled;
    store.push();
}

function goalStorageEventReceived(event) {
    store.storageEventReceived(event);
    $('#currentAmount').val(store.state.currentValue);
    $('#riggingValue').val(store.state.config.riggingValue);
    $("#enableGoal").attr("class", store.state.config.enabled ? "btn btn-success" : "btn btn-danger");
    $("#enableGoal").text(store.state.config.enabled ? "disable" : "enable");
}

function onBackendConnect(backend) {
    store.pull();
}

$(() =>  {
    backend = Backend.connect(onBackendConnect, goalStorageEventReceived);
    $("#addToGoal").click(() => {
        addToGoal(10);
    });
    $("#removeFromGoal").click(() => {
        addToGoal(-10);
    });
    $("#enableGoal").click(() => {
        toggleGoal();
    });
    $('#currentAmount').on('change', () => {
        store.state.currentValue = parseInt($('#currentAmount').val());
        store.push();
    });
    $('#riggingValue').on('change', () => {
        store.state.config.riggingValue = parseInt($('#riggingValue').val());
        store.push();
    });
});