let myChart;
let channelVotes;
let maxEntries = 5;

function addChannelVotes(channelName, amount) {
    currentChannelVotes = channelVotes.get(channelName);
    if (currentChannelVotes === undefined) {
        channelRgbColorValues = generateColorRgbValues(false);
        channelVotes.set(channelName,
                {
                    channelName: channelName,
                    numberOfVotes: amount,
                    backgroundColor: applyOpacity(channelRgbColorValues, 0.3),
                    borderColor: applyOpacity(channelRgbColorValues, 1),
                    fontColor: applyOpacity(channelRgbColorValues, 1)
                }
        );
    } else {
        currentChannelVotes.numberOfVotes += amount;
        channelVotes.set(channelName, currentChannelVotes);
    }
    update();
}

function generateColorRgbValues(dark) {
    return [
        Math.floor((!dark + Math.random()) * 256 / 2),
        Math.floor((!dark + Math.random()) * 256 / 2),
        Math.floor((!dark + Math.random()) * 256 / 2)
    ];
}

function applyOpacity(rgbValues, opacity) {
    return "rgba(" + rgbValues[0] + ", " + rgbValues[1] + ", " + rgbValues[2] + ", " + opacity + ")";
}

function sortDescAndSliceMap(map, limit) {
    return new Map([...map].sort((a, b) => b[1].numberOfVotes - a[1].numberOfVotes).slice(0,limit));
}

function update() {
    votingData = Array.from(sortDescAndSliceMap(channelVotes, maxEntries).values());
    myChart.data.labels = votingData.map(row => ' ' + row.channelName + '(' + row.numberOfVotes + ')');
    myChart.data.datasets[0].data = votingData.map(row => row.numberOfVotes);
    myChart.data.datasets[0].backgroundColor = votingData.map(row => row.backgroundColor);
    myChart.data.datasets[0].borderColor = votingData.map(row => row.borderColor);
    myChart.options.scales.yAxis.ticks.color = votingData.map(row => row.fontColor);
    myChart.update();
}

function init(maxEntries_) {
    maxEntries = maxEntries_;
    channelVotes = new Map();
    if (myChart !== undefined) {
        myChart.destroy();
    }
    myChart = new Chart(
            document.getElementById('barChart'),
            {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [
                        {
                            xAxisID: 'xAxis',
                            yAxisID: 'yAxis',
                            label: 'Raid target',
                            data: [],
                            backgroundColor: [],
                            borderColor: [],
                            borderWidth: 5
                        }
                    ]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    indexAxis: 'y',
                    scales: {
                        xAxis: {
                            display: false
                        },
                        yAxis: {
                            grid: {
                                display: false
                            },
                            border: {
                                display: false
                            },
                            ticks: {
                                mirror: true,
                                font: {
                                    family: "Eve Sans Neue",
                                    size: 55
                                },
                                color: []
                            }
                        }
                    }
                }
            }
    );
}

function connect() {
    stompClient = Stomp.over(new SockJS('/generic-ws'));
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/object', function (object) {
            var commandObj = JSON.parse(object.body);
            switch (commandObj.cmd) {
                case 'raidVote':
                    addChannelVotes(commandObj.channelName, commandObj.amount);
                    break;
                case 'initRaidVote':
                    init(commandObj.maxEntries);
                    break;
            }
        });
    });
}

$(function () {
    connect();
});