let backend;
let storage;

const riggingCost = 1;

let widget;

const audio = new Audio('wiggle.wav');
audio.loop = false;
audio.volume = 0.6;

function updateWigglesDisplay(wiggles) {
    widget.innerHTML = '' + wiggles;
    showWidget(wiggles !== 0);
}

function showWidget(show) {
    if (show && !widget.classList.contains('show')) {
        audio.play();
    }
    show ? widget.classList.add('show') : widget.classList.remove('show');
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
    widget = document.getElementById('back');
    storage = new WigglesStorage(storageChanged);
    backend = new Backend(onBackendConnect, storage);
});