let stompClient = null;

function connect() {
    stompClient = Stomp.over(new SockJS('/generic-ws'));
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
    });
}

function resetCooldown() {
    send({
        cmd: 'resetCooldown'
    });
}

function send(object) {
    stompClient.send("/app/object", {}, JSON.stringify(object));
}

$(function () {
    connect();
    $("#resetCooldown").click(function () {
        resetCooldown();
    });
});