let backend;
let storage;

let currentWiggles = 0;
let widgetShown = false;
let riggingCost = 1;

const audio = new Audio('wiggle.wav');
audio.loop = false;
audio.volume = 0.6;

function updateWigglesDisplay(wiggles) {
    const widget = document.getElementById('back');
    widget.innerHTML = '' + wiggles;
    showWidget(wiggles !== 0, widget);
}

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
        backend.chargeUser(riggingEvent.user.id, riggingCost * amount, 'rigging wiggles',
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
    storage.data.currentWiggles += change;
    backend.pushStorage();
}

function storageChanged() {
    updateWigglesDisplay(storage.data.currentWiggles);
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/twitchRewardRedeemed', onTwitchRewardRedeemed);
    backend.subscribe('/topic/riggingRequested', onRigRequestReceived);
}

$(() => {
    storage = new WigglesStorage(storageChanged);
    backend = new Backend(onBackendConnect, storage);
});