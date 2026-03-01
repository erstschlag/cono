let table;
let whoSpoke = new Map();

function onChatMessageReceived(chatMessageEvent) {
    if (whoSpoke.has(chatMessageEvent.user.name)) {
        return;
    }
    whoSpoke.set(chatMessageEvent.user.name, chatMessageEvent.message);
    tr = table.insertRow(-1);
    let nameCell = document.createElement("th");
    nameCell.className = "";
    nameCell.innerHTML = chatMessageEvent.user.name;
    tr.appendChild(nameCell);
    let textCell = document.createElement("td");
    textCell.innerHTML = chatMessageEvent.message;
    tr.appendChild(textCell);
}

function onEventReceived(event) {
    //do nothing
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/chatMessageReceived', onChatMessageReceived);
    backend.subscribe('/topic/twitchRewardRedeemed', onEventReceived);
    backend.subscribe('/topic/twitchBitsReceived', onEventReceived);
    backend.subscribe('/topic/riggingRequested', onEventReceived);
    backend.subscribe('/topic/raffleEntered', onEventReceived);
    backend.subscribe('/topic/purchaseReceived', onEventReceived);
    backend.subscribe('/topic/twitchSubReceived', onEventReceived);
    backend.subscribe('/topic/twitchSubGiftsReceived', onEventReceived);
    backend.subscribe('/topic/gamelogReceived', onEventReceived);
}

$(() => {
    new Backend(onBackendConnect);
    table = document.getElementById("chatterTable");
});