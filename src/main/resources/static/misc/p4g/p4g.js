let backend = null;
let user = "ALL";

function getData() {
    sendStr("/app/p4gRetrieve", user);
}

function send(destination, object) {
    backend.sendObject(destination, object);
}

function sendStr(destination, user) {
    backend.sendStr(destination, user);
}

function onDataReceived(data) {
    if (data.user === user) {
        widget = document.getElementById('plex').innerHTML = data.plex;
        widget = document.getElementById('mIsk').innerHTML = data.mIsk;
    }
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/pg4', onDataReceived);
    getData();
}

$(() => {
    backend = new Backend(onBackendConnect);
});