let backend = null;
let winnerList = null;

function initialize() {
    send({
        cmd: 'initRaffleBoard',
        shipPng: $("#shipPng").val(),
        numberOfWinners:parseInt($("#numberOfWinners").val())
    });
};

function stopRaffleEntries() {
    winnerList.innerHTML = "";
    send({
        cmd: 'stopRaffleEntries'
    });
};

function raffle() {
    send({
        cmd: 'executeRaffle'
    });
};

function revealWinner() {
    send({
        cmd: 'revealWinner'
    });
};

function redraw() {
    send({
        cmd: 'redraw'
    });
};

function pause() {
    send({
        cmd: 'pause'
    });
};

function resume() {
    send({
        cmd: 'resume'
    });
};

function addTestParticipant() {
    send({
        cmd: 'addTestParticipant',
        amount: 10
    });
};

function stopWinnerThreat() {
    send({
        cmd: 'stopWinnerThreat',
        winnerName: $("#winnerName").val()
    });
};

function send(object) {
    backend.sendObject("/app/object", object);
}


const winnerListEntryIdPrefix = "wLId_";

function onChatMessageReceived(chatMessageEvent) {
    //Eve2Twitch: @JohanB: IGN "Rubok"
    //Eve2Twitch: @Alski_: No IGN registered.

    if (chatMessageEvent.user.name === 'eve2twitch') {
        const ingameName = chatMessageEvent.message.match(/"([^"]+)"/)?.[1];
        const twitchName = chatMessageEvent.message.match(/@(\w+)/)[1].toLowerCase();
        if (ingameName) {
            let winnerListItem = document.getElementById(winnerListEntryIdPrefix + twitchName);
            if (winnerListItem) {
                winnerListItem.onclick = () => {
                    navigator.clipboard.writeText(ingameName)
                        .then(() => {
                            winnerListItem.style.color = "yellow";
                        });
                };
                winnerListItem.style.color = "blue";
            }
        }
    }
}

function onCommandReceived(commandObj) {
    if (commandObj.cmd === 'notifyWinner') {
        /*
        <ul>
            <li id='wLId_winner1Id'>winner1Name</li>
            <li id='wLId_winner2Id'>winner2Name</li>
        </ul>
        */
        const li = document.createElement("li");
        li.id = winnerListEntryIdPrefix + commandObj.name;
        li.textContent = commandObj.name;
        winnerList.appendChild(li);
    }
    if (commandObj.cmd === 'confirmWinner') {
        let winnerListItem = document.getElementById(winnerListEntryIdPrefix + commandObj.name);
        winnerListItem.style.color = "green";
    }
    if (commandObj.cmd === 'retractWinner') {
        let winnerListItem = document.getElementById(winnerListEntryIdPrefix + commandObj.name);
        winnerListItem.style.color = "red";
    }
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/object', onCommandReceived);
    backend.subscribe('/topic/chatMessageReceived', onChatMessageReceived);
}

$(() => {
    backend = new Backend(onBackendConnect);
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#initialize" ).click(function() { initialize(); });
    $( "#stopRaffleEntries" ).click(function() { stopRaffleEntries(); });
    $( "#raffle" ).click(function() { raffle(); });
    $( "#revealWinner" ).click(function() { revealWinner(); });
    $( "#addTestParticipant" ).click(function() { addTestParticipant(); });
    $( "#stopWinnerThreat" ).click(function() { stopWinnerThreat(); });
    $( "#redraw" ).click(function() { redraw(); });
    $( "#pause").click(function(){ pause(); });
    $( "#resume").click(function(){ resume(); });
    winnerList = document.getElementById("winnerList");
});