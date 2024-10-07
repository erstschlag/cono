const dataSets = {
    damageTaken: {
        label: '-HPS', events: [], displayValue: 0, color: 'rgba(255, 51, 0, 1)',
        regex: /<b>(\d+)<\/b>.*?<font size=10>from<\/font>.*?<b><color=.*?>(.*?)<\/b><font size=10>.*?(?: - (.*?))? - (Penetrates|Hits|Glances Off|Smashes|Wrecks|Grazes)/g
    },
    damageDone: {
        label: 'DPS', events: [], displayValue: 0, color: 'rgba(0, 183, 255, 1)',
        regex: /<b>(\d+)<\/b> <color=.*>to<\/font> <b><color=.*>(.*?)<\/b><font size=\d+>.*? - (.*?) - (Hits|Grazes|Glances Off|Smashes|Penetrates|Wrecks)/g
    },
    capOut: {
        label: 'CapOut', events: [], displayValue: 0, color: 'rgba(210, 52, 235, 1)',
        regex: /<b>(\d+)<\/b><color=0x77ffffff><font size=10> remote capacitor transmitted to/g
    },
    neutIn: {
        label: 'NeutIn', events: [], displayValue: 0, color: 'rgba(255, 255, 255, 1)',
        regex: /<b>(\d+)\sGJ<\/b><color=0x77ffffff><font size=10> energy neutralized /g
    },
    repOut: {
        label: 'RepOut', events: [], displayValue: 0, color: 'rgba(232, 217, 23, 1)',
        regex: /<b>(\d+)<\/b><color=0x77ffffff><font size=10> remote (?:armor|shield) repaired to/g
    }
};

function extractCombatInfo(log) {
    Object.keys(dataSets).forEach(key => {
        if ((match = dataSets[key].regex.exec(log)) !== null) {
            addEvent(dataSets[key].events, parseInt(match[1]));
        }
    });
};

function simulateEvents() {
    Object.keys(dataSets).forEach(key => {
        addEvent(dataSets[key].events, Math.random() * 1000);
    });
}

const timeWindowMS = 10000;
function addEvent(events, amount) {
    const timestamp = Date.now();
    const someTimeAgo = timestamp - timeWindowMS;
    events.push({ amount, timestamp });
    events = events.filter(event => event.timestamp >= someTimeAgo);
    showWidget(true);
};

let dpsChart;

function updateChart() {
    removeOldData = dpsChart.data.labels.length > 200;
    if (removeOldData) {
        dpsChart.data.labels.shift(); // Remove the oldest time
    }
    dpsChart.data.labels.push('');
    chartIndex = 0;
    Object.keys(dataSets).forEach(key => {
        dataSets[key].displayValue = interpolateL(dataSets[key].displayValue, calculate(dataSets[key].events), 0.1);
        if (removeOldData) {
            dpsChart.data.datasets[chartIndex].data.shift();
        }
        dpsChart.data.datasets[chartIndex].data.push(dataSets[key].displayValue.toFixed(0));
        chartIndex++;
    });
    dpsChart.update();
    applyVisibility();
}

function interpolateL(start, end, t) {
    return start + (end - start) * t;
}

function calculate(events) {
    const someTimeAgo = Date.now() - timeWindowMS;
    const recentEvents = events.filter(event => event.timestamp >= someTimeAgo);
    const totalAmount = recentEvents.reduce((sum, event) => sum + event.amount, 0);
    return totalAmount / (timeWindowMS / 1000);
}

let lastChangeTimestamp = 0;
function applyVisibility() {
    if (new Date().getTime() - timeWindowMS > lastChangeTimestamp) {
        showWidget(false);
    }
};

function showWidget(show) {
    if (show) {
        lastChangeTimestamp = new Date().getTime();
    }
    if (show ^ widget.classList.contains('show')) {
        widget.classList.toggle('show');
    }
};

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
    const ctx = document.getElementById('dpsChart').getContext('2d');
    dpsChartConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: false
                    },
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 1)',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 0
            },
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    };
    Object.keys(dataSets).forEach(key => {
        $("#legend").append($("<span></span>")
            .text(dataSets[key].label)
            .css({
                "color": dataSets[key].color,
                "padding-left": "13px"
            }));
        dpsChartConfig.data.datasets.push({
            label: dataSets[key].label,
            data: [],
            borderColor: dataSets[key].color,
            backgroundColor: dataSets[key].color,
            pointRadius: 1,
            fill: false,
            tension: 0.2,
        });
    });

    dpsChart = new Chart(ctx, dpsChartConfig);
    widget = document.getElementById('widget');
    new Backend(onBackendConnect);
    setInterval(() => {
        updateChart();
    }, 50);
    //setInterval(simulateEvents, 1500);
});