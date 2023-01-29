let stompClient;
let clientId;

function authorize() {
    let uri = "https://id.twitch.tv/oauth2/authorize?"
    + "client_id=" + clientId + "&"
    + "force_verify=" + $("#force_verify").val() + "&"
    + "redirect_uri=" + $("#redirect_uri").val() + "&"
    + "response_type=" + $("#response_type").val() + "&"
    + "scope=" + $("#scope").val() + "&"
    + "state=" + $("#state").val() + "&";
    window.location.replace(uri);
};

function requestClientId() {
    stompClient.send("/app/getClientId", {}, "");
};

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#auth" ).click(function() { requestClientId(); });
    connect();
});

function connect() {
    stompClient = Stomp.over(new SockJS('/generic-ws'));
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/auth', function (object) {
            clientId = object.body;
            authorize();
        });
    });
}