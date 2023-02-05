let connection = null;

function executeAction(action) {
    send({
        cmd: 'chaosBoardAction',
        action:action
    });
};

function initialize() {
    var cols = parseInt($("#cols").val());
    var rows = parseInt($("#rows").val());
    var winnerCol = Math.floor(Math.random() * cols);
    var winnerRow = Math.floor(Math.random() * rows);
    $("#winnerCol").val(winnerCol);
    $("#winnerRow").val(winnerRow);
    send({
        cmd: 'initChaosBoard', 
        cols: 7,
        rows: 6,
        winnerCol,
        winnerRow,
        priceId: parseInt($("#priceId").val()),
        numVotesForAction: parseInt($("#numVotesForAction").val()),
        autoMoveDelayMs: parseInt($("#autoMoveDelayMs").val()) 
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
    
    $( "#up" ).click(function() { executeAction('UP'); });
    $( "#down" ).click(function() { executeAction('DOWN'); });
    $( "#left" ).click(function() { executeAction('LEFT'); });
    $( "#right" ).click(function() { executeAction('RIGHT'); });
    $( "#open" ).click(function() { executeAction('OPEN'); });
    $( "#initialize" ).click(function() { initialize(); });
});