let connection = null;
let user = "ALL";

function getData() {
    sendStr("/app/p4gRetrieve", user);
}

function send(destination, object) {
    connection.getStompClient().send(destination, {}, JSON.stringify(object));
}

function sendStr(destination, user) {
    connection.getStompClient().send(destination, {}, user);
}

function connectionSuccessful(stompClient) {
    stompClient.subscribe('/topic/pg4', function (object) {
        var object = JSON.parse(object.body);
        if (object.user === user) {
            widget = document.getElementById('plex').innerHTML = object.plex;
            widget = document.getElementById('mIsk').innerHTML = object.mIsk;
        }
    });
    getData();
}

$(function () {
    connection = Backend.connect(connectionSuccessful);
});