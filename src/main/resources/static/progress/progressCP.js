let stompClient = null;

function connect() {
    stompClient = Stomp.over(new SockJS('/generic-ws'));
    stompClient.connect();
};

function setProgress() {
    send({
        cmd: 'progress', 
        progress: parseInt($("#progressValue").val()) 
    });
};

function changeProgress() {
    send({
        cmd: 'progress', 
        progressChange: parseInt($("#progressValue").val()) 
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
    $( "#setProgress" ).click(function() { setProgress(); });
    $( "#changeProgress" ).click(function() { changeProgress(); });
});