let filterCharacter = null;
let numOfCrits = 0;
let numOfUnits = 0;

function onGamelogReceived(gamelogEvent) {
    if (filterCharacter == null || filterCharacter === gamelogEvent.characterName) {
        if ((match = PARSE.oreMinedCrit.regex.exec(gamelogEvent.gamelogLine)) !== null) {
            numOfCrits++;
            numOfUnits+= parseInt(match[1], 10);
            document.getElementById('numOfCrits').innerHTML = '' + numOfCrits;
            document.getElementById('numOfUnits').innerHTML = '' + numOfUnits;
            document.getElementById('lastCritOre').innerHTML = '' + match[2];
            showWidget(true);
        }
    }
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/gamelogReceived', onGamelogReceived);
}

$(() => {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('character')) {
        filterCharacter = urlParams.get('character');
    }
    widget = document.getElementById('widget');
    initWidgetVisibility(120000);
    new Backend(onBackendConnect);
});