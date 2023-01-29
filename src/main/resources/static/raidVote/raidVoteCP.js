function connect() {
    stompClient = Stomp.over(SockJS('/generic-ws'));
    stompClient.connect();
};

function initialize() {
    send({
        cmd: 'initRaidVote', 
        maxEntries: parseInt($("#maxEntries").val()) ,
        blockedDestinations: $("#blockedDestinations").val()
    });
};

function addTestEntry() {
    send({
        cmd: 'raidVote', 
        channelName: $("#channelName").val(),
        amount: parseInt($("#amount").val())
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
    $( "#initialize" ).click(function() { initialize(); });
    $( "#addTestEntry" ).click(function() { addTestEntry(); });
});