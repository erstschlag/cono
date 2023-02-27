let connection = null;

function initialize() {
    send({
        cmd: 'initRaidVote',
        maxEntries: parseInt($("#maxEntries").val()),
        blockedDestinations: $("#blockedDestinations").val()
    });
}

function addTestEntry() {
    send({
        cmd: 'raidVote',
        channelName: $("#channelName").val(),
        amount: parseInt($("#amount").val())
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
    $( "#initialize" ).click(function() { initialize(); });
    $( "#addTestEntry" ).click(function() { addTestEntry(); });
});