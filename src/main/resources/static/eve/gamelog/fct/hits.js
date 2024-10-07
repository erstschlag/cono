const hitTypeConfigs = {
    "Misses": {
        hitQuality: "(Miss)",
        fontSize: 20,
        outColor: "#9d9d9d"
    },
    "Glances Off":
    {
        hitQuality: "(Glance)",
        fontSize: 25,
        outColor: "#bfbfbf"
    },
    "Grazes":
    {
        hitQuality: "(Graze)",
        fontSize: 25,
        outColor: "#bfbfbf"
    },
    "Hits":
    {
        hitQuality: "(Hit)",
        fontSize: 30,
        outColor: "#ffffff"
    },
    "Penetrates":
    {
        hitQuality: "(Penetrate)",
        fontSize: 30,
        outColor: "#fff370"
    },
    "Smashes":
    {
        hitQuality: "(Smash)",
        fontSize: 35,
        outColor: "#fff370"
    },
    "Wrecks":
    {
        hitQuality: "(Wreck)",
        fontSize: 40,
        outColor: "#ffa200"
    }
}

let inbound = false;

function extractCombatInfo(log) {
    const dmgOut = /<b>(\d+)<\/b> <color=.*>to<\/font> <b><color=.*>(.*?)<\/b><font size=\d+>.*? - (.*?) - (Hits|Grazes|Glances Off|Smashes|Penetrates|Wrecks)/g;
    const dmgOutMiss = /Your (.*?) misses (.*?) completely - (.*?)/g;
    const dmgIn = /<b>(\d+)<\/b>.*?<font size=10>from<\/font>.*?<b><color=.*?>(.*?)<\/b><font size=10>.*?(?: - (.*?))? - (Penetrates|Hits|Glances Off|Smashes|Wrecks|Grazes)/g;

    let match;

    if (!inbound && (match = dmgOut.exec(log)) !== null) {
        const damage = match[1];
        const hitQual = match[4];
        createCombatText(damage, hitQual);
    } else if (!inbound && (match = dmgOutMiss.exec(log)) !== null) {
        createCombatText('', 'Misses');
    } else if (inbound && (match = dmgIn.exec(log)) !== null) {
        const damage = match[1];
        const hitQual = match[4];
        createCombatText(damage, hitQual);
    }
}

function createCombatText(damage, type) {
    const text = type == 'Misses' ? '(Miss)' : ((inbound ? '-' : '') + damage);

    const combatText = document.createElement('div');
    combatText.classList.add(inbound ? 'combat-text-in' : 'combat-text-out');
    combatText.style.color = hitTypeConfigs[type].outColor;
    combatText.style.fontSize = hitTypeConfigs[type].fontSize + 'px';
    combatText.innerText = text;

    randomX = Math.random() * 50 + 45;
    randomY = Math.random() * 50;
    if (inbound) {
        randomX = Math.random() * 70;
        randomY = Math.random() * 20;
    }

    combatText.style.left = `calc(50% + ${randomX}px)`;
    combatText.style.top = `calc(50% + ${randomY - 25}px)`;

    document.getElementById('combatTextContainer').appendChild(combatText);

    combatText.addEventListener('animationend', () => {
        combatText.remove();
    });
}

function simulateHit() {
    const hitQualities = ['Misses', 'Glances Off', 'Grazes', 'Hits', 'Penetrates', 'Smashes', 'Wrecks'];
    const randomQuality = hitQualities[Math.floor(Math.random() * hitQualities.length)];
    createCombatText('100', randomQuality);
}

let filterCharacter = null;
function onGamelogReceived(gamelogEvent) {
    if (filterCharacter == null || filterCharacter === gamelogEvent.characterName) {
        extractCombatInfo(gamelogEvent.gamelogLine);
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
    if (urlParams.has('inbound')) {
        inbound = true;
    }
    new Backend(onBackendConnect);
    //setInterval(simulateHit, 1500);
});