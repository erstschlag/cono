let backend;
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
    backend.sendObject("/app/getClientId", {});
};

function onClientIdReceived(object) {
    clientId = object.clientId;
    authorize();
}

function onBackendConnect() {
    backend.subscribe('/topic/auth', onClientIdReceived);
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#auth" ).click(function() { requestClientId(); });
    backend = new Backend(onBackendConnect);
});