let backend;
let storage;

function storageChanged() {
    $('#targetProgress').val(storage.data.targetProgress);
    $('#bitsProgressAmount').val(storage.data.config.bitsProgressAmount);
    $('#redeemProgressAmount').val(storage.data.config.redeemProgressAmount);
    $('#riggingValue').val(storage.data.config.riggingValue);
    $('#maxInactiveVisibleTime').val(storage.data.config.maxInactiveVisibleTime);
}

$(() => {
    storage = new ProgressStorage(storageChanged);
    backend = new Backend(undefined, storage);
    $('#bitsProgressAmount').on('change', () => {
        storage.data.config.bitsProgressAmount = parseInt($('#bitsProgressAmount').val());
        backend.pushStorage();
    });
    $('#redeemProgressAmount').on('change', () => {
        storage.data.config.redeemProgressAmount = parseInt($('#redeemProgressAmount').val());
        backend.pushStorage();
    });
    $('#riggingValue').on('change', () => {
        storage.data.config.riggingValue = parseInt($('#riggingValue').val());
        backend.pushStorage();
    });
    $('#maxInactiveVisibleTime').on('change', () => {
        storage.data.config.maxInactiveVisibleTime = parseInt($('#maxInactiveVisibleTime').val());
        backend.pushStorage();
    });
    $('#targetProgress').on('change', () => {
        storage.data.targetProgress = parseInt($('#targetProgress').val());
        backend.pushStorage();
    });
    $('#changeValue').on('change', () => {
        storage.data.targetProgress += parseInt($('#changeValue').val());
        $('#changeValue').val('');
        backend.pushStorage();
    });
    $("#minus1kButton").click(() => {
        storage.data.targetProgress -= 1000;
        backend.pushStorage();
    });
});