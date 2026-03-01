const NUMBER_OF_SITES_PER_SYSTEM = 5;
const SITE_RESPAWN_TIME_SECONDS = 1800;
let currentSystemName = null;

const solarSystems = {
};

function systemChanged(systemName) {
    if (!solarSystems.hasOwnProperty(systemName)) {
        solarSystems[systemName] = { timers: [0, 0, 0, 0, 0] };
        addSystemUI(systemName);
    }
    this.currentSystemName = systemName;
    console.info(`System name changed to "${systemName}" !`);
}

function hackCompleted() {
    if (this.currentSystemName === null) {
        return;
    }
    //REFACTOR: maybe just shift arround array values
    let minValue = Math.min(...solarSystems[this.currentSystemName].timers);
    let timerIndex = solarSystems[this.currentSystemName].timers.indexOf(minValue);
    solarSystems[this.currentSystemName].timers[timerIndex] = SITE_RESPAWN_TIME_SECONDS;
    console.info("Hack completed!");
}

function extractCombatInfo(log) {
    if ((match = /Jumping from (.*)\s+to\s+(.*)/g.exec(log)) !== null) {
        systemChanged(match[2]);
    }
}

function updateTimers() {
    Object.keys(solarSystems).forEach(key => {
        solarSystems[key].timers.forEach((timer, index) => {
            if (solarSystems[key].timers[index] > 0) {
                solarSystems[key].timers[index] -= 1;
            }
        });
    });
}

function cleanSystemName(systemName) {
    return systemName.replace(" ", "-");
}

function addSystemUI(systemName) {
    const $systemDiv = $(`<div id='sol_${cleanSystemName(systemName)}' class='sol'><div>`);
    const $circleWrapDiv = $(`<div class="wrap-circles"></div>`);
    const $systemNameSpan = $(`<span class="systemName">${systemName}</span>`);
    $circleWrapDiv.append($systemNameSpan);

    for (i = 0; i < NUMBER_OF_SITES_PER_SYSTEM; i++) {
        let $timerCircle = $(`<div class="circle"></div>`);
        let $timerText = $(`<div class="inner">?</div>`);
        //$timerCircle.append($timerText);
        $circleWrapDiv.append($timerCircle);
        $circleWrapDiv.append($timerText);
    }
    $systemDiv.append($circleWrapDiv);
    $systemDiv.append($(`<button id="removeSolButton_${cleanSystemName(systemName)}">Remove</button>`));
    $('#widget').append($systemDiv);
    $(`#removeSolButton_${cleanSystemName(systemName)}`).click(function () {
        removeSystem(systemName);
    });
}

function removeSystem(systemName) {
    if (solarSystems.hasOwnProperty(systemName)) {
        delete solarSystems[systemName];
        removeSystemUI(systemName);
    }
}

function removeSystemUI(systemName) {
    $(`#sol_${cleanSystemName(systemName)}`).remove();
}

function updateUI() {
    Object.keys(solarSystems).forEach(key => {
        solarSystems[key].timers.forEach((timer, index) => {
            $(`#sol_${cleanSystemName(key)} .circle:eq(${index})`).css('background-image', `conic-gradient(transparent ${calcPercentage(timer)}%,${percentageToColor(calcPercentage(timer))} 0)`);
            $(`#sol_${cleanSystemName(key)} .inner:eq(${index})`).text(formatTime(timer));
        });
    });


}

function percentageToColor(p) {
    // Ensure p is between 0 and 100
    p = Math.max(0, Math.min(100, p));

    if(p === 0) {
        return 'rgb(0, 132, 255)';
    }

    if (p < 20) {
        offsetP = 100 / (20 - p);
        var r = Math.floor(255 - (255 * (offsetP / 100)));
        var g = Math.floor(255 * (offsetP / 100));
        var b = 0;

        return 'rgb(' + r + ',' + g + ',' + b + ')';
    } else {
        return 'rgb(0,255,0)';
    }


}

function formatTime(totalSeconds) {
    // Calculate whole minutes
    const minutes = Math.floor(totalSeconds / 60);
    // Calculate remaining seconds
    const seconds = totalSeconds % 60;

    // Format the output as "M:SS" (e.g., "2:05" for 125 seconds)
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    return `${minutes}:${formattedSeconds}`;
}

function calcPercentage(currentTimerValue) {
    return 100 / SITE_RESPAWN_TIME_SECONDS * currentTimerValue;
}

function onGamelogReceived(gamelogEvent) {
    extractCombatInfo(gamelogEvent.gamelogLine);
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/gamelogReceived', onGamelogReceived);
}

$(() => {
    new Backend(onBackendConnect);
    setInterval(updateTimers, 1000);
    setInterval(updateUI, 500);
    $('#signatureRemovedButton').click(function () {
        hackCompleted();
    });
    $('#jumpedToButton').click(function () {
        systemChanged($('#jumpToSystemInput').val());
    });
});