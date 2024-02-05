let backend = null;

function init() {
    let searchParams = new URLSearchParams(window.location.search);
    $("#code").val(searchParams.get('code'));
};

function authorize() {
    backend.sendStr("/app/auth", $("#code").val());
}

function onAuthResultReceived(result) {
    alert(result.state);
}

function onBackendConnect() {
    backend.subscribe('/topic/auth', onAuthResultReceived);
}

$(function () {
    backend = new Backend(onBackendConnect);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#initialize" ).click(function() { authorize(); });
});