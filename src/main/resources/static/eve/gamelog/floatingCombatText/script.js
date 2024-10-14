const hitTypeConfigs = {
    "Misses": {
        fontSize: 20
    },
    "Grazes":
    {
        fontSize: 25
    },
    "Glances Off":
    {
        fontSize: 25
    },
    "Hits":
    {
        fontSize: 30
    },
    "Penetrates":
    {
        fontSize: 30
    },
    "Smashes":
    {
        fontSize: 35
    },
    "Wrecks":
    {
        fontSize: 40
    }
}

let inbound = false;

function extractCombatInfo(log) {
    let match;
    if (!inbound && (match = PARSE.damageDone.regex.exec(log)) !== null) {
        const damage = match[1];
        const hitQual = match[4];
        createCombatText(damage, hitQual);
    } else if (!inbound && (match = PARSE.damageOutMiss.regex.exec(log)) !== null) {
        createCombatText('', 'Misses');
    } else if (inbound && (match = PARSE.damageTaken.regex.exec(log)) !== null) {
        const damage = match[1];
        const hitQual = match[4];
        createCombatText(damage, hitQual);
    }
}

function createCombatText(damage, type) {
    const text = type == 'Misses' ? '(Miss)' : ((inbound ? '-' : '') + damage);

    const combatText = document.createElement('div');
    combatText.classList.add(inbound ? 'combat-text-in' : 'combat-text-out');
    combatText.style.color = HIT_QUALITY_COLORS[type];
    combatText.style.fontSize = hitTypeConfigs[type].fontSize + 'px';
    combatText.innerText = text;

    randomX = Math.random() * 50 + 50;
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