let numberOfWinners = 1;
let shipImage = 'Avatar.png';
let textXOffset = 90;
let textYOffset = 30;
let shipSize = 200;
let bombSize = 150;

let state = {};

var resetState = function () {
    if (state.draw) {
        state.draw.remove();
    }
    state.winners = new Map();
    state.draw = null;
    state.background = null;
    state.participants = new Map();
    state.isRunning = true;
    state.winnerRevealed = false;
    state.numberOfParticipantsText = null;
    state.numberOfParticipants = 0;
};

var init = function (shipImage_, numberOfWinners_) {
    shipImage = shipImage_;
    numberOfWinners = numberOfWinners_;
};

var launch = function () {
    resetState();
    state.draw = SVG().addTo('body').size(3840, 1080);
    state.background = state.draw.image('backgrounds/' + randomNumber(1, 31) + '.png').size(3840, 1080, 3840, 1080).move(-1920, 0);
    state.numberOfParticipantsText = state.draw.text(state.numberOfParticipants).font({
        size: 50
        , anchor: 'middle'
        , leading: '1.5em'
    }).fill('#fff').css({filter: 'drop-shadow(6px 0px 7px rgba(0, 0, 0, 0.5))'}).move(1850, 20);
};

var addParticipant = function (name) {
    if (state.isRunning && !state.participants.has(name)) {
        state.numberOfParticipants++;
        randomX = randomNumber(0, 1620);
        randomY = randomNumber(0, 780);
        participant = createParticipant(name, randomX, randomY);
        state.participants.set(name, participant);
        participant.ship.animate(6000, 0, 'now').ease('>').move(randomX, randomY);
        participant.text.animate(6000, 0, 'now').ease('>').move(randomX + textXOffset, randomY + textYOffset);
        state.numberOfParticipantsText.plain(state.numberOfParticipants);
    }
};

var createParticipant = function (name, x, y) {
    return {
        name: name,
        ship: state.draw.image('ships/' + shipImage).css({filter: 'drop-shadow(12px 0px 7px rgba(200, 200, 200, 0.5))'}).size(shipSize, shipSize).move(1920, randomY),
        text: state.draw.text(name).fill('#fff').css({filter: 'drop-shadow(6px 0px 7px rgba(0, 0, 0, 0.9))'}).move(1920 + textXOffset, randomY + textYOffset),
        bomb: state.draw.image('nuke.png').css({filter: 'drop-shadow(-12px 0px 7px rgba(200, 150, 150, 0.5))'}).size(bombSize, bombSize).move(-(randomX + bombSize), randomY + (shipSize - bombSize) / 2)
    };
};

var play = function () {
    if (!state.isRunning) {
        state.background.animate(2000, 0, 'now').ease('>').move(0, 0);
        state.participants.forEach((participant) => {
            participant.ship.animate(2000, 0, 'now').ease('>').move(participant.ship.x() + 1920, participant.ship.y());
            participant.text.animate(2000, 0, 'now').ease('>').move(participant.text.x() + 1920, participant.text.y());
        });

        for (i = 0; i < numberOfWinners; i++) {
            selectWinner();
        }

        let delay = 0;
        let animationDuration = 10000 / (state.participants.size > 100 ? state.participants.size / 100 : 1);
        state.participants.forEach((participant) => {
            participant.ship.animate(animationDuration, 2000 + delay, 'now').ease('-').move(participant.ship.x(), participant.ship.y()).after(() => ((participant) => {
                    explode(participant);
                })(participant));
            participant.bomb.animate(animationDuration, 2000 + delay, 'now').ease('-').move(participant.ship.x(), participant.bomb.y());
            participant.text.animate(animationDuration, 2000 + delay, 'now').ease('-').move(participant.ship.x() + textXOffset, participant.text.y());
            delay += randomNumber(50, 150);
        });
    }
};

var selectWinner = function () {
    currentRandomWinner = Array.from(state.participants.entries())[Math.floor(Math.random() * state.participants.size)][1];
    state.winners.set(currentRandomWinner.name, currentRandomWinner);
    state.participants.delete(currentRandomWinner.name);
};

var revealWinner = function () {
    if (state.winners.size > 0) {
        state.participants.forEach((participant) => {
            participant.ship.remove();
            participant.bomb.remove();
        });

        let verticalSpaceBetweenShips = 1080 / (state.winners.size + 1);
        let winnerIndex = 1;
        state.winners.forEach((winner) => {
            winner.ship.move(3500, verticalSpaceBetweenShips * winnerIndex - shipSize / 2);
            winner.text.move(3500 + textXOffset, verticalSpaceBetweenShips * winnerIndex - shipSize / 2 + textYOffset);

            state.background.animate(2000, 0, 'now').ease('>').move(-1920, 0);
            winner.ship.animate(2000, 0, 'now').ease('>').move(winner.ship.x() - 1920, winner.ship.y());
            winner.text.animate(2000, 0, 'now').ease('>').move(winner.text.x() - 1920, winner.text.y()).after(() => {
                winnerRevealed = true;
                winner.bomb.move(-bombSize, winner.ship.y() + (shipSize - bombSize) / 2);
                winner.bomb.animate(60000, 3000, 'now').ease('-').move(winner.ship.x(), winner.bomb.y()).after(() => ((winner) => {
                        explode(winner);
                    })(winner));
            });
            winnerIndex++;
        });
    }
};

var redraw = function () {
    state.winners.clear();
    state.numberOfParticipants++;
    state.numberOfParticipantsText.plain(state.numberOfParticipants);
    selectWinner();
    state.winners.forEach((winner) => {
        state.winners.set(winner.name, createParticipant(winner.name, 0, 0));
    });
    revealWinner();
};

var stopWinnerThreat = function (winner) {
    let laser = state.draw.image('laser.png').css({filter: 'drop-shadow(12px 0px 7px rgba(200, 100, 50, 0.5))'}).size(150, 150).move(winner.ship.x(), winner.ship.y() + (shipSize - bombSize) / 2);
    let audioLaser = new Audio('laser.mp3');
    audioLaser.loop = false;
    audioLaser.volume = 0.1;
    audioLaser.play();
    laser.animate(700, 0, 'now').ease('-').move(winner.bomb.x(), winner.bomb.y()).after(() => {
        winner.bomb.timeline().pause();
        winner.bomb.css({filter: 'none'}).load('giphy.gif?i=' + uuidv4());
        let audioBoom = new Audio('boom.mp3');
        audioBoom.loop = false;
        audioBoom.volume = 0.1;
        audioBoom.play();
        laser.remove();
        state.winners.delete(winner.name);
    });
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0,
                        v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
}

var explode = function (participant) {
    let audioBoom = new Audio('boom.mp3');
    audioBoom.loop = false;
    audioBoom.volume = 0.1;
    audioBoom.play();
    participant.ship.css({filter: 'none'}).load('giphy.gif?i=' + uuidv4());
    participant.bomb.css({filter: 'none'}).load('giphy.gif?i=' + uuidv4());
    participant.text.remove();
    state.numberOfParticipants--;
    state.numberOfParticipantsText.plain(state.numberOfParticipants);
    setTimeout(() => {
        participant.ship.remove();
        participant.bomb.remove();
    }, 1500);
};

var randomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
};

function onCommandReceived(commandObj) {
    if (commandObj.cmd === 'initRaffleBoard') {
        init(commandObj.shipPng, commandObj.numberOfWinners);
    }
    if (commandObj.cmd === 'launchRaffle') {
        launch();
    }
    if (commandObj.cmd === 'stopRaffleEntries') {
        state.isRunning = false;
    }
    if (commandObj.cmd === 'executeRaffle') {
        play();
    }
    if (commandObj.cmd === 'revealWinner') {
        revealWinner();
    }
    if (commandObj.cmd === 'redraw') {
        redraw();
    }
    if (commandObj.cmd === 'stopWinnerThreat') {
        if (state.winners.has(commandObj.winnerName)) {
            stopWinnerThreat(state.winners.get(commandObj.winnerName));
        }
    }
    if (commandObj.cmd === 'addTestParticipant') {
        for (i = 0; i < commandObj.amount; i++) {
            addParticipant('Viewer' + randomNumber(1, 5000));
        }
    }
}

function onRaffleEntered(raffleEvent) {
    addParticipant(raffleEvent.user.name);
}

function onChatMessageReceived(chatMessageEvent) {
    if (!winnerRevealed) {
        return;
    }
    state.winners.forEach((winner) => {
        if (chatMessageEvent.user.name === winner.name) {
            stopWinnerThreat(winner);
        }
    });
}

function onBackendConnect(connection) {
    connection.subscribe('/topic/object', onCommandReceived);
    connection.subscribe('/topic/raffleEntered', onRaffleEntered);
    connection.subscribe('/topic/chatMessageReceived', onChatMessageReceived);
}

$(function () {
    Backend.connect(onBackendConnect);
});