let connection = null;
let user = "ALL";

function getData() {
    sendStr("/app/p4gRetrieve", user);
}

function send(destination, object) {
    connection.sendObject(destination, object);
}

function sendStr(destination, user) {
    connection.sendStr(destination, user);
}

function dataReceived(data) {
    if (data.user === user) {
        widget = document.getElementById('plex').innerHTML = data.plex;
        widget = document.getElementById('mIsk').innerHTML = data.mIsk;
    }
}

function connectedMethod(connection) {
    connection.subscribe('/topic/pg4', dataReceived);
    getData();
}

$(function () {
    connection = Backend.connect(connectedMethod);
});