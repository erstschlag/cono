const REFRESH_RATE = 1000 / 10;

let durationMs = 1080000;
let nextResetIndex = 0;
let times = [
    Date.now(),
    Date.now() - 180000,
    Date.now() - 360000,
    Date.now() - 720000,
    Date.now() - 900000
];

function resetCooldown() {
    times[nextResetIndex] = Date.now();
    nextResetIndex++;
    if (nextResetIndex === times.length) {
        nextResetIndex = 0;
    }
}

function startProgressUpdate() {
    setInterval(() => {
        for (i = 0; i < times.length; i++) {
            remainingTimeMs = durationMs - (Date.now() - times[i]);
            progress = 100 / durationMs * remainingTimeMs;
            $('#c' + (i + 1)).attr('x2', 300 - (200 - progress * 2));

            remainingTimeS = Math.round(remainingTimeMs / 1000);
            const minutes = Math.floor(remainingTimeS / 60);
            const seconds = remainingTimeS % 60;
            if (i === nextResetIndex) {
                $('#t' + (i + 1)).html(`<span style='color:#BBF'>${padTo2Digits(minutes)}:${padTo2Digits(seconds)}</span>`);
            } else {
                $('#t' + (i + 1)).html(`${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`);
            }
        }
    }, REFRESH_RATE);
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function connect() {
    stompClient = Stomp.over(new SockJS('/generic-ws'));
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/object', function (object) {
            var commandObj = JSON.parse(object.body);
            if (commandObj.cmd === 'resetCooldown') {
                resetCooldown();
            }
        });
    });
}

$(function () {
    connect();
    startProgressUpdate();
});