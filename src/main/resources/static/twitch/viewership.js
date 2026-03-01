function onChannelViewershipReceived(channelViewershipEvent) {
    $("#chatterCount").text(channelViewershipEvent.chatterCount);
    $("#viewerCount").text(channelViewershipEvent.viewerCount);
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/channelViewershipReceived', onChannelViewershipReceived);
}

$(() => {
    backend = new Backend(onBackendConnect);
});