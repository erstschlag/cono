const REFRESH_RATE = 1000 / 60;
const MAX_STROKE_OFFSET = 1194;
const ONE_HUNDRED_PERCENT = 1000;
const STEP_SIZE = 2;

let targetProgress = 0;
let currentVisualProgress = 0;
let redeemProgressAmount = 10;
let bitsProgressAmount = 1;
let riggingCost = 1;
let rigProgressAmount = 10;

function updateProgress() {
    if (currentVisualProgress === targetProgress) return;
    currentVisualProgress += targetProgress < currentVisualProgress ? -STEP_SIZE : STEP_SIZE;
    if (Math.abs(targetProgress - currentVisualProgress) < STEP_SIZE) currentVisualProgress = targetProgress;
    $('circle').attr('stroke-dashoffset', Math.round(MAX_STROKE_OFFSET - MAX_STROKE_OFFSET / ONE_HUNDRED_PERCENT * currentVisualProgress));
    $('#number').html(Math.round(100 / ONE_HUNDRED_PERCENT * currentVisualProgress) + '%');
}

function onDashBoardRequest(commandObj) {
    if (commandObj.cmd === 'progress') {
        targetProgress = commandObj.progress !== undefined ? commandObj.progress : targetProgress + commandObj.progressChange;
    }
    if (commandObj.cmd === 'progressConfig') {
        updateRedeemProgressAmount(commandObj.redeemProgressAmount);
        updateBitsProgressAmount(commandObj.bitsProgressAmount);
    }
}

function updateRedeemProgressAmount(newRedeemProgressAmount) {
    redeemProgressAmount = newRedeemProgressAmount;
    $('.turbo').css('background-image','url(Charge_' + Math.round(redeemProgressAmount/10) + '.png)');
}

function updateBitsProgressAmount(newBitsProgressAmount) {
    bitsProgressAmount = newBitsProgressAmount;
}

function onTwitchRewardRedeemed(redemptionEvent) {
    if (redemptionEvent.title === 'Charge!') {
        targetProgress += redeemProgressAmount;
    }
}

function onTwitchBitsReceived(bitsEvent) {
    targetProgress+= bitsEvent.bitsUsed*bitsProgressAmount;
}

function onRigRequestReceived(riggingEvent) {
    if (riggingEvent.consumer === 'charge') {
        amount = 1;
        if (riggingEvent.command !== "") {
            amount = parseInt(riggingEvent.command, 10);
        }
        Backend.connection.chargeUser(riggingEvent.user.id, riggingCost * amount, 'rigging charge',
                () => {
            targetProgress+= amount*rigProgressAmount;
        });
    }
}

function onBackendConnect(connection) {
    connection.subscribe('/topic/object', onDashBoardRequest);
    connection.subscribe('/topic/twitchRewardRedeemed', onTwitchRewardRedeemed);
    connection.subscribe('/topic/twitchBitsReceived', onTwitchBitsReceived);
    connection.subscribe('/topic/riggingRequested', onRigRequestReceived);
}

$(function () {
    Backend.connect(onBackendConnect);
    setInterval(() => {
        updateProgress();
    }, REFRESH_RATE);
});