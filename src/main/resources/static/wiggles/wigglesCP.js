let backend;
let storage;

function addWiggle(change) {
    storage.data.currentWiggles += change;
    backend.pushStorage();
}

function storageChanged() {
    $('#currentAmount').html(storage.data.currentWiggles);
}

$(() => {
    storage = new WigglesStorage(storageChanged);
    backend = new Backend(undefined, storage);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#addWiggle").click(function () {
        addWiggle(1);
    });
    $("#removeWiggle").click(function () {
        addWiggle(-1);
    });
});