const REFRESH_RATE = 1000 / 60;
const MAX_STROKE_OFFSET = 1194;
const ONE_HUNDRED_PERCENT = 1000;
const STEP_SIZE = 2;

let targetProgress = 0;
let currentVisualProgress = 0;

function updateProgress() {
    if (currentVisualProgress === targetProgress) return;
    currentVisualProgress += targetProgress < currentVisualProgress ? -STEP_SIZE : STEP_SIZE;
    if (Math.abs(targetProgress - currentVisualProgress) < STEP_SIZE) currentVisualProgress = targetProgress;
    $('circle').attr('stroke-dashoffset', Math.round(MAX_STROKE_OFFSET - MAX_STROKE_OFFSET / ONE_HUNDRED_PERCENT * currentVisualProgress));
    $('#number').html(Math.round(100 / ONE_HUNDRED_PERCENT * currentVisualProgress) + '%');
}

function connectionSuccessful(stompClient) {
    stompClient.subscribe('/topic/object', function (object) {
        let commandObj = JSON.parse(object.body);
        if (commandObj.cmd === 'progress') {
            targetProgress = commandObj.progress !== undefined ? commandObj.progress : targetProgress + commandObj.progressChange;
        }
    });
    stompClient.subscribe('/topic/twitchRewardRedemptions', function (object) {
        let redemptionEvent = JSON.parse(object.body);
        if(redemptionEvent.title === 'Charge!') {
            targetProgress+= 10;
        }
    });
    stompClient.subscribe('/topic/twitchBitsReceived', function (object) {
        let bitsEvent = JSON.parse(object.body);
        targetProgress+= bitsEvent.bitsUsed;
    });
}

$(function () {
    Backend.connect(connectionSuccessful);
    setInterval(() => {
        updateProgress();
    }, REFRESH_RATE);
});