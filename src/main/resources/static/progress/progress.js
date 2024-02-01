const REFRESH_RATE = 1000 / 60;
const MAX_STROKE_OFFSET = 1194;
const ONE_HUNDRED_PERCENT = 1000;
const STEP_SIZE = 2;

const PROGRESS_STORAGE_UUID = "7875924a-7b6d-4e24-a09b-993b70d85b87";

let state = {
    config: {
        bitsProgressAmount:1,
        redeemProgressAmount: 10,
        riggingValue: 30,
        maxInactiveVisibleTime:20000
    },
    targetProgress: 0
};

let currentVisualProgress = 0;
let lastChangeTimestamp = 0;

function updateProgress() {
    if (currentVisualProgress === state.targetProgress) return;
    currentVisualProgress += state.targetProgress < currentVisualProgress ? -STEP_SIZE : STEP_SIZE;
    if (Math.abs(state.targetProgress - currentVisualProgress) < STEP_SIZE) currentVisualProgress = state.targetProgress;
    $('circle').attr('stroke-dashoffset', Math.round(MAX_STROKE_OFFSET - MAX_STROKE_OFFSET / ONE_HUNDRED_PERCENT * currentVisualProgress));
    $('#number').html(Math.round(100 / ONE_HUNDRED_PERCENT * currentVisualProgress) + '%');
}

function onDashBoardRequest(commandObj) {
    if (commandObj.cmd === 'progress') {
        if(commandObj.progress !== undefined) {
            showWidget(true);
            state.targetProgress = commandObj.progress;
        }else{
            changeProgress(commandObj.progressChange);
        }
    }
    if (commandObj.cmd === 'progressConfig') {
        showWidget(true);
        updateRedeemProgressAmount(commandObj.redeemProgressAmount);
        updateBitsProgressAmount(commandObj.bitsProgressAmount);
    }
}

function updateRedeemProgressAmount(newRedeemProgressAmount) {
    state.config.redeemProgressAmount = newRedeemProgressAmount;
    $('.turbo').css('background-image','url(Charge_' + Math.round(state.config.redeemProgressAmount/10) + '.png)');
}

function updateBitsProgressAmount(newBitsProgressAmount) {
    state.config.bitsProgressAmount = newBitsProgressAmount;
}

function onTwitchRewardRedeemed(redemptionEvent) {
    if (redemptionEvent.title === 'Charge!') {
        changeProgress(state.config.redeemProgressAmount);
    }
}

function onTwitchBitsReceived(bitsEvent) {
    changeProgress(bitsEvent.bitsUsed*state.config.bitsProgressAmount);
}

function onRigRequestReceived(riggingEvent) {
    if (riggingEvent.consumer === 'charge') {
        amount = 1;
        if (riggingEvent.command !== "") {
            amount = parseInt(riggingEvent.command, 10);
        }
        Backend.connection.chargeUser(riggingEvent.user.id, amount, 'rigging charge',
                () => {
            changeProgress(amount*state.config.riggingValue);
        });
    }
}

function changeProgress(change) {
    showWidget(true);
    state.targetProgress += change;
}

function showWidget(show) {
    if(show) {
        lastChangeTimestamp = new Date().getTime();
    }
    if (show && !widget.classList.contains('show')
            || !show && widget.classList.contains('show')) {
        widget.classList.toggle('show');
    }
}

function applyVisibility() {
    if (new Date().getTime() - state.config.maxInactiveVisibleTime > lastChangeTimestamp) {
        showWidget(false);
    }
}

function onBackendConnect(connection) {
    connection.subscribe('/topic/object', onDashBoardRequest);
    connection.subscribe('/topic/twitchRewardRedeemed', onTwitchRewardRedeemed);
    connection.subscribe('/topic/twitchBitsReceived', onTwitchBitsReceived);
    connection.subscribe('/topic/riggingRequested', onRigRequestReceived);
}

$(function () {
    widget = document.getElementById('widget');
    showWidget(true);
    Backend.connect(onBackendConnect);
    setInterval(() => {
        updateProgress();
    }, REFRESH_RATE);
    setInterval(() => {
        applyVisibility();
    }, 1000);
});