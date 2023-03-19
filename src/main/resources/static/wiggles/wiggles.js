let currentWiggles = 0;
let widgetShown = false;
let riggingAmount = 1;

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

function onMessageReceived(message) {
    if (message.cmd === 'wiggle')
            changeWiggles(message.change);
}

function onRigRequestReceived(riggingEvent) {
    if (riggingEvent.consumer === 'wiggle') {
        Backend.connection.chargeUser(riggingEvent.user.id, riggingAmount, 'rigging wiggles',
                () => {
                    changeWiggles(1);
                });
    }
}

function onTwitchRewardRedeemed(redemptionEvent) {
    if (redemptionEvent.title === 'Wiggle your back') {
        changeWiggles(1);
    }
}

function onBackendConnect(connection) {
    connection.subscribe('/topic/object', onMessageReceived);
    connection.subscribe('/topic/twitchRewardRedeemed', onTwitchRewardRedeemed);
    connection.subscribe('/topic/riggingRequested', onRigRequestReceived);
}

$(function () {
    Backend.connect(onBackendConnect);
});