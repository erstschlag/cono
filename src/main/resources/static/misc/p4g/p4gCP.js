let backend = null;
let user;

function getData() {
    sendStr("/app/p4gRetrieve", user);
}

function saveData() {
    send("/app/p4gRegister",
            {
                user: user,
                plex: parseInt($("#plex").val()),
                mIsk: parseInt($("#mIsk").val())
            });
}

function send(destination, object) {
    backend.sendObject(destination, object);
}

function sendStr(destination, user) {
    backend.sendStr(destination, user);
}

function onDataReceived(data) {
    if (data.user === user) {
        $("#plex").val(data.plex);
        $("#mIsk").val(data.mIsk);
    }
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/pg4', onDataReceived);
    getData();
}

$(() => {
    var urlParams = new URLSearchParams(window.location.search);
    user = urlParams.get('user');
    backend = new Backend(onBackendConnect);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#saveData").click(function () {
        saveData();
    });
});