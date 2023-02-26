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
    connection.getStompClient().send(destination, {}, JSON.stringify(object));
}

function sendStr(destination, user) {
    connection.getStompClient().send(destination, {}, user);
}

function connectionSuccessful(stompClient) {
    stompClient.subscribe('/topic/pg4', function (object) {
        var object = JSON.parse(object.body);
        if (object.user === user) {
            $("#plex").val(object.plex);
            $("#mIsk").val(object.mIsk);
        }
    });
    getData();
}

$(function () {
    var urlParams = new URLSearchParams(window.location.search);
    user = urlParams.get('user');
    connection = Backend.connect(connectionSuccessful);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#saveData").click(function () {
        saveData();
    });
});