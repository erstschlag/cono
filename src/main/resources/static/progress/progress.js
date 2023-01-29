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

function connect() {
    let stompClient = Stomp.over(new SockJS('/generic-ws'));
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/object', function (object) {
            let commandObj = JSON.parse(object.body);
            if (commandObj.cmd === 'progress') {
                targetProgress = commandObj.progress !== undefined ? commandObj.progress : targetProgress + commandObj.progressChange;
            }
        });
    });
}

$(function () {
    connect();
    setInterval(() => {
        updateProgress();
    }, REFRESH_RATE);
});