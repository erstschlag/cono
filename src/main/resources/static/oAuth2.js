function init() {
    let searchParams = new URLSearchParams(window.location.search);
    $("#code").val(searchParams.get('code'));
};

function authorize() {
    stompClient.send("/app/auth", {}, $("#code").val());
}

function connect() {
    stompClient = Stomp.over(new SockJS('/generic-ws'));
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/auth', function (object) {
            alert(object.body);
        });
    });
}

$(function () {
    connect();
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#initialize" ).click(function() { authorize(); });
});