let stompClient = null;

function connect() {
    stompClient = Stomp.over(new SockJS('/generic-ws'));
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
    });
};

function addWiggle(change) {
     send({
        cmd: 'wiggle',
        change:change
    });
};

function send(object) {
    stompClient.send("/app/object", {}, JSON.stringify(object));
}

$(function () {
    connect();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#addWiggle" ).click(function() { addWiggle(1); });
    $( "#removeWiggle" ).click(function() { addWiggle(-1); });
});