let backend = null;

var isLPCollectionEnabled;

function retrieveLPCollectionStatus() {
    backend.sendObject("/app/users/isLPCollectionEnabled", "");
}

function enableLPCollection(enable) {
    backend.sendObject("/app/users/enableLPCollection", enable);
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/isLPCollectionEnabled', function (object) {
        isLPCollectionEnabled = object;
        var enableButton = document.getElementById('enableLPCollection');
        if (isLPCollectionEnabled) {
            enableButton.className = "btn btn-success";
            enableButton.textContent = 'disable';
        } else {
            enableButton.className = "btn btn-danger";
            enableButton.textContent = 'enable';
        }
    });
    retrieveLPCollectionStatus();
}

$(() => {
    backend = new Backend(onBackendConnect);
    $("#enableLPCollection").click(function () {
        enableLPCollection(!isLPCollectionEnabled);
    });
});