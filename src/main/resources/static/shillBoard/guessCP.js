let connection = null;

function initialize() {
    let cols = parseInt($("#cols").val());
    let rows = parseInt($("#rows").val());
    let min = parseInt($("#start").val());
    let winner = Math.floor(Math.random() * (cols * rows + 1) + min);
    $("#winner").val(winner);
    send({
        cmd: 'initGuess', 
        cols, 
        rows, 
        start: min, 
        winner, 
        priceId: parseInt($("#priceId").val()) 
    });
};

function takeGuess() {
    send({
        cmd:'guess',
        number: parseInt($("#guess").val()) 
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
    $( "#initialize" ).click(function() { initialize(); });
    $( "#takeGuess" ).click(function() { takeGuess(); });
});