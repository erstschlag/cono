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

function messageReceived(message) {
    if (message.cmd === 'wiggle')
            changeWiggles(message.change);
}

function connectedMethod(connection) {
    connection.subscribe('/topic/object', messageReceived);
}

$(function () {
    Backend.connect(connectedMethod);
});