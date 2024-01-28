let connection;
let currentAmount = 0;

const WIGGLES_STORAGE_UUID = "7ad8bc22-ed67-4e90-beaa-9a3673f86931";

function addWiggle(change) {
    connection.store(WIGGLES_STORAGE_UUID, currentAmount + change);
};

function storageEventReceived(event) {
    if (event.uuid !== WIGGLES_STORAGE_UUID) {
        return;
    }
    if (event.data !== null) {
        $('#currentAmount').html(event.data);
        currentAmount = parseInt(event.data, 10);
    } else {
        connection.store(WIGGLES_STORAGE_UUID, 0);
    }
}

function onBackendConnect(connection) {
    connection.loadFromStorage(WIGGLES_STORAGE_UUID);
}

$(function () {
    connection = Backend.connect(onBackendConnect, storageEventReceived);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#addWiggle" ).click(function() { addWiggle(1); });
    $( "#removeWiggle" ).click(function() { addWiggle(-1); });
});