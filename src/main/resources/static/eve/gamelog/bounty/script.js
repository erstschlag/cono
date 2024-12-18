let filterCharacter = null;
let currentBounty = 0;

function extractBountyInfo(log) {
    while ((match = PARSE.bounty.regex.exec(log)) !== null) {
        addBounty(parseInt(match[1].replace(/,/g, '')))
    }
}

function onGamelogReceived(gamelogEvent) {
    if (filterCharacter == null || filterCharacter === gamelogEvent.characterName) {
        extractBountyInfo(gamelogEvent.gamelogLine);
    }
}

function addBounty(amount) {
    showWidget(true);
    let countUpOptions = {
        useGrouping: true,
        suffix: ' ISK',
        startVal: currentBounty,
        decimalPlaces: 0
    };
    if (currentBounty + amount > 1000000) {
        countUpOptions = {
            useGrouping: true,
            suffix: ' mISK',
            startVal: currentBounty / 1000000,
            decimalPlaces: 1
        };
    }
    currentBounty += amount;
    doIt = new countUp.CountUp('bounty-text', currentBounty > 1000000 ? currentBounty / 1000000 : currentBounty, countUpOptions);
    doIt.start();
}

function onCommandReceived(commandObj) {
    if (commandObj.cmd === 'add') {
        addBounty(1000000*parseInt(commandObj.amount));
    }
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/gamelogReceived', onGamelogReceived);
    backend.subscribe('/topic/object', onCommandReceived);
}

function simulateBounty() {
    addBounty(Math.random() * 300000);
}

$(() => {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('character')) {
        filterCharacter = urlParams.get('character');
    }
    widget = document.getElementById('widget');
    initWidgetVisibility(60000);
    new Backend(onBackendConnect);
    //setInterval(simulateBounty, 5000);
});