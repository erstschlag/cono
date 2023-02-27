let connection = null;

function init() {
    let searchParams = new URLSearchParams(window.location.search);
    $("#code").val(searchParams.get('code'));
};

function authorize() {
    connection.sendStr("/app/auth", $("#code").val());
}

function onAuthResultReceived(result) {
    alert(result.state);
}

function onBackendConnect() {
    connection.subscribe('/topic/auth', onAuthResultReceived);
}

$(function () {
    connection = Backend.connect(onBackendConnect);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#initialize" ).click(function() { authorize(); });
});