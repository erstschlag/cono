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

function applyConfiguration() {
    send({
        cmd: 'progressConfig', 
        redeemProgressAmount: parseInt($("#redeemProgressAmount").val()), 
        bitsProgressAmount: parseInt($("#bitsProgressAmount").val())  
    });
}

function send(object) {
    connection.sendObject("/app/object", object);
}

$(function () {
    connection = Backend.connect();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#setProgress" ).click(function() { setProgress(); });
    $( "#changeProgress" ).click(function() { changeProgress(); });
    $( "#applyConfiguration" ).click(function() { applyConfiguration(); });
});