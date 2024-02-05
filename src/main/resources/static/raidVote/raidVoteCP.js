let backend = null;

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
    backend.sendObject("/app/object", object);
}

$(() => {
    backend = new Backend();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#initialize" ).click(function() { initialize(); });
    $( "#addTestEntry" ).click(function() { addTestEntry(); });
});