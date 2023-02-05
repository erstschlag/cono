let connection = null;

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
    connection.getStompClient().send("/app/object", {}, JSON.stringify(object));
}

$(function () {
    connection = Backend.connect();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#setProgress" ).click(function() { setProgress(); });
    $( "#changeProgress" ).click(function() { changeProgress(); });
});