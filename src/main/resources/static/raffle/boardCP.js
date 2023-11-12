let connection = null;

function initialize() {
    send({
        cmd: 'initRaffleBoard',
        shipPng: $("#shipPng").val(),
        numberOfWinners:parseInt($("#numberOfWinners").val())
    });
};

function launch() {
    send({
        cmd: 'launchRaffle'
    });
};

function stopRaffleEntries() {
    send({
        cmd: 'stopRaffleEntries'
    });
};

function raffle() {
    send({
        cmd: 'executeRaffle'
    });
};

function revealWinner() {
    send({
        cmd: 'revealWinner'
    });
};

function addTestParticipant() {
    send({
        cmd: 'addTestParticipant',
        amount: 10
    });
};

function stopWinnerThreat() {
    send({
        cmd: 'stopWinnerThreat',
        winnerName: $("#winnerName").val()
    });
};

function send(object) {
    connection.sendObject("/app/object", object);
}

$(function () {
    connection = Backend.connect();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#initialize" ).click(function() { initialize(); });
    $( "#launch" ).click(function() { launch(); });
    $( "#stopRaffleEntries" ).click(function() { stopRaffleEntries(); });
    $( "#raffle" ).click(function() { raffle(); });
    $( "#revealWinner" ).click(function() { revealWinner(); });
    $( "#addTestParticipant" ).click(function() { addTestParticipant(); });
    $( "#stopWinnerThreat" ).click(function() { stopWinnerThreat(); });
    
});