let currentWiggles = 0;
let widgetShown = false;

let audio = new Audio('wiggle.wav');
audio.loop = false;
audio.volume = 0.7;

function changeWiggles(change) {
    currentWiggles += change;
    widget = document.getElementById('back');
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

function connectionSuccessful(stompClient) {
    stompClient.subscribe('/topic/object', function (object) {
        var commandObj = JSON.parse(object.body);
        if (commandObj.cmd === 'wiggle')
            changeWiggles(commandObj.change);
    });
}

$(function () {
    Backend.connect(connectionSuccessful);
});