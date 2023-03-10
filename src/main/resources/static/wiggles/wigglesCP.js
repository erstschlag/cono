let connection = null;

function addWiggle(change) {
     send({
        cmd: 'wiggle',
        change:change
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
    $( "#addWiggle" ).click(function() { addWiggle(1); });
    $( "#removeWiggle" ).click(function() { addWiggle(-1); });
});