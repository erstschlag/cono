let filterCharacter = null;
let currentBounty = 0;
let currentHomefrontValue_mISK = null;

const HOMEFRONTS = {
    StabilizeRift: {
        RegEx: /Destabilizing Array/g,
        ValueMIsk: 33.075
    },
    TrafficStop: {
        RegEx: /(Fan Bus|Trader|Postal|Repatriation)/g,
        ValueMIsk: 33.075
    },
    DreadAssault: {
        RegEx: /(Legatus Bane|Verndari Valravn|Peacekeeper Hubris|Arbiter Karura)/g,
        ValueMIsk: 77.43205
    },
    MetaliminalMining: {
        RegEx: /(Amperum|Conflagrati|Peregrinus|Solis|Tenebraet) Mutanite/g,
        ValueMIsk: 89
    },
    ArtifactRecovery: {
        RegEx: /Admixti Mutanite/g,
        ValueMIsk: 350
    },
    EmergencyAid: {
        RegEx: /(Clan Commons|Master Controller|Charon Repatriator|Holy Mission)/g,
        ValueMIsk: 77.43205
    },
    SuspiciousSignal: {
        RegEx: /(Longshot Relay|Quantum-Override Broadcaster|Sacred Exploiter)/g,//TODO: this may work for Amarr Caldari and Minmatar only, other factions may have a different name for the target
        ValueMIsk: 81
    },
    Raid: {
        RegEx: /Offertory Sigil|Plunder Wreathe|Nereus Mule/g,//TODO: this may work for Amarr/Minmatar/Gallente only, other factions may have a different name for the target
        ValueMIsk: 78.43205
    },
    DeathlessResearchOutpost: {
        RegEx: /Wormhole Research Outpost/g,
        ValueMIsk: 100
    },
    LancerCounterOffensive: {
        RegEx: /(Response Bane|Response Karura|Response Hubris|Response Valravn)/g,
        ValueMIsk: 108
    },
    FieldRescue: {
        RegEx: /Battle Wreckage/g,
        ValueMIsk: 48
    }
};

const HOMEFRONT_END_REGEX = /Following (.*?) in warp/g;
const HOMEFRONT_COMPLETION_COOLDOWN_MS = 20000;
let lastHomefrontCompletion = Date.now();

function extractBountyInfo(log) {
    if ((match = PARSE.bounty.regex.exec(log)) !== null) {
        addBounty(parseInt(match[1].replace(/[’']/g, "")));
    } else {
        Object.keys(HOMEFRONTS).forEach(key => {
            if ((match = HOMEFRONTS[key].RegEx.exec(log)) !== null && lastHomefrontCompletion < Date.now() - HOMEFRONT_COMPLETION_COOLDOWN_MS) {
                currentHomefrontValue_mISK = HOMEFRONTS[key].ValueMIsk;
            }
        });
        if ((match = HOMEFRONT_END_REGEX.exec(log)) !== null) {
            if (currentHomefrontValue_mISK !== null) {
                addBounty(1000000 * currentHomefrontValue_mISK);
                currentHomefrontValue_mISK = null;
                lastHomefrontCompletion = Date.now();
            }
        }
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
        addBounty(1000000 * parseInt(commandObj.amount));
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