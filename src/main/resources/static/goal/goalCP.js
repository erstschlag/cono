let backend;
let storage;

function addToGoal(change) {
    storage.data.currentValue += change;
    backend.pushStorage();
}

function toggleGoal() {
    storage.data.config.enabled = !storage.data.config.enabled;
    backend.pushStorage();
}

function storageChanged() {
    $('#currentAmount').val(storage.data.currentValue);
    $('#riggingValue').val(storage.data.config.riggingValue);
    $("#enableGoal").attr("class", storage.data.config.enabled ? "btn btn-success" : "btn btn-danger");
    $("#enableGoal").text(storage.data.config.enabled ? "disable" : "enable");
}

$(() =>  {
    storage = new GoalStorage(storageChanged);
    backend = new Backend(undefined, storage);
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
        storage.data.currentValue = parseInt($('#currentAmount').val());
        backend.pushStorage();
    });
    $('#riggingValue').on('change', () => {
        storage.data.config.riggingValue = parseInt($('#riggingValue').val());
        backend.pushStorage();
    });
});