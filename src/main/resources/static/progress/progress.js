const REFRESH_RATE = 1000 / 60;
const MAX_STROKE_OFFSET = 1194;
const ONE_HUNDRED_PERCENT = 1000;
const STEP_SIZE = 2;

const PROGRESS_STORAGE_UUID = "7875924a-7b6d-4e24-a09b-993b70d85b87";

let backend;
let storage;

let currentVisualProgress = 0;
let lastChangeTimestamp = 0;

function updateProgress() {
    if (currentVisualProgress === storage.data.targetProgress)
        return;
    currentVisualProgress += storage.data.targetProgress < currentVisualProgress ? -STEP_SIZE : STEP_SIZE;
    if (Math.abs(storage.data.targetProgress - currentVisualProgress) < STEP_SIZE)
        currentVisualProgress = storage.data.targetProgress;
    $('circle').attr('stroke-dashoffset', Math.round(MAX_STROKE_OFFSET - MAX_STROKE_OFFSET / ONE_HUNDRED_PERCENT * currentVisualProgress));
    $('#number').html(Math.round(100 / ONE_HUNDRED_PERCENT * currentVisualProgress) + '%');
}

function onTwitchRewardRedeemed(redemptionEvent) {
    if (redemptionEvent.title === 'Charge!') {
        changeProgress(storage.data.config.redeemProgressAmount);
    }
}

function onTwitchBitsReceived(bitsEvent) {
    changeProgress(bitsEvent.bitsUsed * storage.data.config.bitsProgressAmount);
}

function onRigRequestReceived(riggingEvent) {
    if (riggingEvent.consumer === 'charge') {
        amount = 1;
        if (riggingEvent.command !== "") {
            amount = parseInt(riggingEvent.command, 10);
        }
        backend.chargeUser(riggingEvent.user.id, amount, 'rigging charge',
                () => {
            changeProgress(amount * storage.data.config.riggingValue);
        });
    }
}

function changeProgress(change) {
    storage.data.targetProgress += change;
    backend.pushStorage();
}

function showWidget(show) {
    if (show) {
        lastChangeTimestamp = new Date().getTime();
    }
    if (show && !widget.classList.contains('show')
            || !show && widget.classList.contains('show')) {
        widget.classList.toggle('show');
    }
}

function applyVisibility() {
    if (new Date().getTime() - storage.data.config.maxInactiveVisibleTime > lastChangeTimestamp) {
        showWidget(false);
    }
}

function storageChanged() {
    showWidget(true);
    $('.turbo').css('background-image', 'url(Charge_' + Math.round(storage.data.config.redeemProgressAmount / 10) + '.png)');
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/twitchRewardRedeemed', onTwitchRewardRedeemed);
    backend.subscribe('/topic/twitchBitsReceived', onTwitchBitsReceived);
    backend.subscribe('/topic/riggingRequested', onRigRequestReceived);
}

$(() => {
    widget = document.getElementById('widget');
    showWidget(true);
    storage = new ProgressStorage(storageChanged);
    backend = new Backend(onBackendConnect, storage);
    setInterval(() => {
        updateProgress();
    }, REFRESH_RATE);
    setInterval(() => {
        applyVisibility();
    }, 1000);
});