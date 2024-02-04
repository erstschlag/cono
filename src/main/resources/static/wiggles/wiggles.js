let connection;

let currentWiggles = 0;
let widgetShown = false;
let riggingCost = 1;

const audio = new Audio('wiggle.wav');
audio.loop = false;
audio.volume = 0.6;
const WIGGLES_STORAGE_UUID = "7ad8bc22-ed67-4e90-beaa-9a3673f86931";

function updateWigglesDisplay(wiggles) {
    currentWiggles = wiggles;
    const widget = document.getElementById('back');
    widget.innerHTML = '' + currentWiggles;
    showWidget(currentWiggles !== 0, widget);
};

function showWidget(show, widget) {
    if (widgetShown !== show) {
        widget.classList.toggle('show');
        widgetShown = show;
        if (show) {
            audio.play();
        }
    }
}

function onRigRequestReceived(riggingEvent) {
    if (riggingEvent.consumer === 'wiggle') {
        amount = 1;
        if (riggingEvent.command !== "") {
            amount = parseInt(riggingEvent.command, 10);
        }
        connection.chargeUser(riggingEvent.user.id, riggingCost * amount, 'rigging wiggles',
                () => {
                    changeWiggles(amount);
        });
    }
}

function onTwitchRewardRedeemed(redemptionEvent) {
    if (redemptionEvent.title === 'Wiggle your back') {
        changeWiggles(1);
    }
}

function changeWiggles(change) {
    connection.store(WIGGLES_STORAGE_UUID, currentWiggles + change);
}

function storageEventReceived(event) {
    if (event.uuid !== WIGGLES_STORAGE_UUID) {
        return;
    }
    if (event.data !== null) {
        updateWigglesDisplay(parseInt(event.data, 10));
    } else {
        connection.store(WIGGLES_STORAGE_UUID, 0);
    }
}

function onBackendConnect(connection) {
    connection.subscribe('/topic/twitchRewardRedeemed', onTwitchRewardRedeemed);
    connection.subscribe('/topic/riggingRequested', onRigRequestReceived);
    connection.loadFromStorage(WIGGLES_STORAGE_UUID);
}

$(() => {
    connection = Backend.connect(onBackendConnect, storageEventReceived);
});