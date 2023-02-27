let connection = null;
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
    connection.sendObject(destination, object);
}

function sendStr(destination, user) {
    connection.sendStr(destination, user);
}

function dataReceived(data) {
    if (data.user === user) {
        $("#plex").val(data.plex);
        $("#mIsk").val(data.mIsk);
    }
}

function connectedMethod(connection) {
    connection.subscribe('/topic/pg4', dataReceived);
    getData();
}

$(function () {
    var urlParams = new URLSearchParams(window.location.search);
    user = urlParams.get('user');
    connection = Backend.connect(connectedMethod);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#saveData").click(function () {
        saveData();
    });
});