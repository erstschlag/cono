let backend = null;

function initialize() {
    send({
        cmd: 'initRaffleBoard',
        shipPng: $("#shipPng").val(),
        numberOfWinners:parseInt($("#numberOfWinners").val())
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

function redraw() {
    send({
        cmd: 'redraw'
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
    backend.sendObject("/app/object", object);
}

$(() => {
    backend = new Backend();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#initialize" ).click(function() { initialize(); });
    $( "#stopRaffleEntries" ).click(function() { stopRaffleEntries(); });
    $( "#raffle" ).click(function() { raffle(); });
    $( "#revealWinner" ).click(function() { revealWinner(); });
    $( "#addTestParticipant" ).click(function() { addTestParticipant(); });
    $( "#stopWinnerThreat" ).click(function() { stopWinnerThreat(); });
    $( "#redraw" ).click(function() { redraw(); });
    
});