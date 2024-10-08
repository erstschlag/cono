function extractBountyInfo(log) {
    const iskRegex = /<color=0xff00aa00>([\d,]+) ISK<\/b>/g;
    while ((match = iskRegex.exec(log)) !== null) {
        addBounty(parseInt(match[1].replace(/,/g, '')))
    }
}

let filterCharacter = null;
function onGamelogReceived(gamelogEvent) {
    if (filterCharacter == null || filterCharacter === gamelogEvent.characterName) {
        extractBountyInfo(gamelogEvent.gamelogLine);
    }
}

let currentBounty = 0;

function addBounty(amount) {
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
            startVal: currentBounty/1000000,
            decimalPlaces: 1
        };
    }
    currentBounty += amount;
    doIt = new countUp.CountUp('bounty-text', currentBounty > 1000000 ? currentBounty/1000000:currentBounty, countUpOptions);
    doIt.start();
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/gamelogReceived', onGamelogReceived);
}

function simulateBounty() {
    addBounty(Math.random() * 300000);
}

$(() => {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('character')) {
        filterCharacter = urlParams.get('character');
    }
    new Backend(onBackendConnect);
    //setInterval(simulateBounty, 5000);
});