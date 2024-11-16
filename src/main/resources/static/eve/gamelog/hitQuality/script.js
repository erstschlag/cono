let hitsChart;
let inbound = false;
let dmgRegex;
let dmgMissRegex;

const hitsChartConfigDoughnut = {
    type: 'doughnut',
    data: {
        labels: ['Misses', 'Grazes', 'Glances Off', 'Hits', 'Penetrates', 'Smashes', 'Wrecks'],
        datasets: [{
            data: [],
            backgroundColor: [HIT_QUALITY_COLORS.Misses, HIT_QUALITY_COLORS.Grazes, HIT_QUALITY_COLORS["Glances Off"], HIT_QUALITY_COLORS.Hits,
            HIT_QUALITY_COLORS.Penetrates, HIT_QUALITY_COLORS.Smashes, HIT_QUALITY_COLORS.Wrecks],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '70%',
        responsive: true,
        rotation: -45,
        circumference: 180,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Chart.js Polar Area Chart'
            }
        }
    },
};
const hitsChartConfigPie = {
    type: 'pie',
    data: {
        labels: ['Misses', 'Grazes', 'Glances Off', 'Hits', 'Penetrates', 'Smashes', 'Wrecks'],
        datasets: [{
            data: [],
            backgroundColor: [HIT_QUALITY_COLORS.Misses, HIT_QUALITY_COLORS.Grazes, HIT_QUALITY_COLORS["Glances Off"], HIT_QUALITY_COLORS.Hits,
            HIT_QUALITY_COLORS.Penetrates, HIT_QUALITY_COLORS.Smashes, HIT_QUALITY_COLORS.Wrecks],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Chart.js Polar Area Chart'
            }
        }
    },
};
const hitsChartConfigPolar = {
    type: 'polarArea',
    data: {
        labels: ['Misses', 'Grazes', 'Glances Off', 'Hits', 'Penetrates', 'Smashes', 'Wrecks'],
        datasets: [{
            data: [],
            backgroundColor: [HIT_QUALITY_COLORS.Misses, HIT_QUALITY_COLORS.Grazes, HIT_QUALITY_COLORS["Glances Off"], HIT_QUALITY_COLORS.Hits,
            HIT_QUALITY_COLORS.Penetrates, HIT_QUALITY_COLORS.Smashes, HIT_QUALITY_COLORS.Wrecks],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        scales: {
            r: {
                grid: {
                    display: false // Turn off the radial grid lines
                },
                angleLines: {
                    display: false // Turn off the angle lines (those radiating from the center)
                },
                ticks: {
                    display: false // Turn off the radial axis labels (the numbers around the chart)
                }
            }
        },
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Chart.js Polar Area Chart'
            }
        }
    },
};

function extractCombatInfo(log) {
    if ((match = dmgRegex.exec(log)) !== null) {
        if (!inbound) {
            evalTargetChange(match[2]);
        }
        addHit(match[4]);
    } else if ((match = dmgMissRegex.exec(log)) !== null) {
        if (!inbound) {
            evalTargetChange(match[2]);
        }
        addHit('Misses');
    }
}

let currentTarget = null;

function evalTargetChange(name) {
    if (currentTarget !== name) {
        currentTarget = name;
        initEvents();
    }
}

let hitEvents;

function initEvents() {
    hitEvents = {
        Misses: 0,
        Grazes: 0,
        "Glances Off": 0,
        Hits: 0,
        Penetrates: 0,
        Smashes: 0,
        Wrecks: 0
    };
}

function addHit(quality) {
    hitEvents[quality]++;
    showWidget(true);
    updateHitChart();
}

function updateHitChart() {
    let newData = [
        hitEvents.Misses,
        hitEvents.Grazes,
        hitEvents["Glances Off"],
        hitEvents.Hits,
        hitEvents.Penetrates,
        hitEvents.Smashes,
        hitEvents.Wrecks];
    hitsChart.data.datasets[0].data = newData;
    hitsChart.update();
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

let chartTypeConfig = hitsChartConfigDoughnut;
function initURLParams() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('character')) {
        filterCharacter = urlParams.get('character');
    }
    if (urlParams.has('chartType')) {
        switch (urlParams.get('chartType')) {
            case 'doughnut': {
                chartTypeConfig = hitsChartConfigDoughnut;
                break;
            }
            case 'polar': {
                chartTypeConfig = hitsChartConfigPolar;
                break;
            }
            case 'pie': {
                chartTypeConfig = hitsChartConfigPie;
                break;
            }
        }
    }
    if (urlParams.has('inbound')) {
        inbound = true;
    }
}

function simulateEvents() {
    addHit("Glances Off");
}

$(() => {
    initURLParams();
    dmgRegex = inbound ? PARSE.damageTaken.regex : PARSE.damageDone.regex;
    dmgMissRegex = inbound ? PARSE.damageInMiss.regex : PARSE.damageOutMiss.regex;
    const ctx = document.getElementById('hitsChart').getContext('2d');
    hitsChart = new Chart(ctx, chartTypeConfig);
    initWidgetVisibility(10000);
    new Backend(onBackendConnect);
    initEvents();
    //setInterval(simulateEvents, 1500);
});