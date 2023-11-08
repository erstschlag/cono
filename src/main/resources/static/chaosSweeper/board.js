let boardCols = 0;
let boardRows = 0;
let playerWidth = 0;
let playerHeight = 0;
let boardWidth = 0;
let boardHeight = 0;
let numberOfVotesForAction = 1;
let actionsPerformed = 0;
let run = true;
let maxDistance = 0;
let riggingCost = 2;

let autoMoveDelayMs = 10000;

let movesMap = new Map();
movesMap.set("UP", {image: 'UP.png', numberOfVotes:0, execute: () => {reposition(0, -1);}});
movesMap.set("DOWN", {image: 'DOWN.png', numberOfVotes:0, execute: () => {reposition(0, 1);}});
movesMap.set("LEFT", {image: 'LEFT.png', numberOfVotes:0, execute: () => {reposition(-1, 0);}});
movesMap.set("RIGHT", {image: 'RIGHT.png', numberOfVotes:0, execute: () => {reposition(1, 0);}});
movesMap.set("OPEN", {image: 'OPEN.png', numberOfVotes:0, execute: () => {open();}});

let player = {col: 0, row: 0};
let winner = {col: 0, row: 0};

function updatePlayerPosition(colDelta, rowDelta) {
    player.col = calculateWrappedPosition(player.col + colDelta, boardCols);
    player.row = calculateWrappedPosition(player.row + rowDelta, boardRows);
}

function calculateWrappedPosition(position, maxPosition) {
    while (position < 0) {
        position += maxPosition;
    }
    while (position >= maxPosition) {
        position -= maxPosition;
    }
    return position;
}

function reposition(colDelta, rowDelta) {
    updatePlayerPosition(colDelta, rowDelta);
    document.getElementById('player').style.left = (boardWidth / boardCols * player.col);
    document.getElementById('player').style.top = (boardHeight / boardRows * player.row);
}

let audioWin = new Audio('WIN.wav');
audioWin.loop = false;
audioWin.volume = 0.3;
let audioLoss = new Audio('LOSS.wav');
audioLoss.loop = false;
audioLoss.volume = 0.3;

function open() {
    _open(player.col, player.row);
}

function _open(openCol, openRow) {
    if (isWinner(openCol, openRow)) {
        run = false;
        audioWin.play();
        openHtmlTile(openCol, openRow, "yellow");
    } else {
        audioLoss.play();
        distance = Math.round(Math.sqrt((Math.pow(winner.col - openCol, 2) + Math.pow(winner.row - openRow, 2))));
        redValue = Math.round(255 / maxDistance * distance);
        greenValue = 255 - redValue;
        openHtmlTile(openCol, openRow, "rgb(" + redValue + "," + greenValue + ",0)");
    }
}

function openHtmlTile(openCol, openRow, colorStr) {
    element = document.getElementById("t_" + openCol + "_" + openRow);
    element.style.backgroundColor = colorStr;
    element.dataset.opened = true;
}

function isWinner(checkCol, checkRow) {
    return winner.col === checkCol && winner.row === checkRow;
}

function init(cols, rows, winnerCol, winnerRow, priceId, numVotesForAction, autoMoveDelay) {
    boardCols = cols;
    boardRows = rows;
    maxDistance = Math.round(Math.sqrt((Math.pow(boardCols - 1, 2) + Math.pow(boardRows - 1, 2))));
    winner.col = winnerCol;
    winner.row = winnerRow;
    numberOfVotesForAction = numVotesForAction;
    autoMoveDelayMs = autoMoveDelay;
    playerStyle = getComputedStyle(document.getElementById('player'));
    playerMarginWidth = parseInt(playerStyle.marginLeft) + parseInt(playerStyle.marginRight);
    playerMarginHeight = parseInt(playerStyle.marginTop) + parseInt(playerStyle.marginBottom);
    playerWidth = document.getElementById('player').offsetWidth + playerMarginWidth;
    playerHeight = document.getElementById('player').offsetHeight + playerMarginHeight;
    boardWidth = document.getElementById('board').offsetWidth;
    boardHeight = document.getElementById('board').offsetHeight;

    document.getElementById("board").style.backgroundImage = "url('https://image.eveonline.com/Type/" + priceId + "_1024.png')";
    $("#board").empty();
    letterArray = "ABCDEFG".split("");
    for (currentRow = 0; currentRow < rows; currentRow++) {
        for (currentCol = 0; currentCol < cols; currentCol++) {
            $("#board").append("<div data-opened='false' class='tile' id='t_" + currentCol + "_" + currentRow +
                    "' style='top:" + currentRow * 100 + "px;left:" + currentCol * 100 + "px'>" +
                    letterArray[currentCol] + (currentRow + 1) + "</div>");
        }
    }
    actionsPerformed = 0;
    document.getElementById('numberOfActions').innerHTML = '' + actionsPerformed;
    run = true;
    reposition(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows));
}

function evaluateWinningMove() {
    winningMove = movesMap.get("OPEN");
    movesMap.forEach((move, key) => {
        if (move.numberOfVotes > winningMove.numberOfVotes) {
            winningMove = move;
        }
    });
    return winningMove;
}

function executeMove(winningMove) {
    clearCooldown();
    document.getElementById('player').style.backgroundImage = "none";
    actionsPerformed++;
    document.getElementById('numberOfActions').innerHTML = '' + actionsPerformed;
    winningMove.execute();
    clearVotes();
}

function clearVotes() {
    movesMap.forEach((move, key) => {
        move.numberOfVotes = 0;
    });
}

function getCurrentNumberOfVotes() {
    totalCurrentNumberOfVotes = 0;
    movesMap.forEach((move, key) => {
        totalCurrentNumberOfVotes += move.numberOfVotes;
    });
    return totalCurrentNumberOfVotes;
}

function evaluateAction() {
    winningMove = evaluateWinningMove();
    document.getElementById('player').style.backgroundImage = "url('" + winningMove.image + "')";
    if (getCurrentNumberOfVotes() >= numberOfVotesForAction) {
        executeMove(winningMove);
    }
}

const UPDATE_INTERVAL_MS = 1000 / 60; // Update 60 times per second (60 FPS)

let intervalID;
let playerCooldown;

function clearCooldown() {
    playerCooldown.style = '';
    clearInterval(intervalID);
}

function activateCooldown() {
    playerCooldown = document.getElementById('playerCooldown');
    playerCooldown.style = '--time-left: 100%';
    let time = autoMoveDelayMs - UPDATE_INTERVAL_MS;
    // Update remaining cooldown
    intervalID = setInterval(() => {
        // Pass remaining time in percentage to CSS
        const passedTime = time / autoMoveDelayMs * 100;
        playerCooldown.style = `--time-left: ${passedTime}%`;
        time -= UPDATE_INTERVAL_MS;
        // Stop timer when there is no time left
        if (time < 0) {
            executeMove(evaluateWinningMove());
        }
    }, UPDATE_INTERVAL_MS);
}

function vote(move) {
    if (getCurrentNumberOfVotes() === 0) {
        activateCooldown();
    }
    move.numberOfVotes++;
    evaluateAction();
}

function voteForAction(action) {
    if (!run) {
        return;
    }
    move = movesMap.get(action);
    if (move !== undefined) {
        vote(move);
    }
}

function onCommandReceived(commandObj) {
    if (commandObj.cmd === 'initChaosBoard') {
        init(commandObj.cols, commandObj.rows, commandObj.winnerCol, commandObj.winnerRow, commandObj.priceId, commandObj.numVotesForAction, commandObj.autoMoveDelayMs);
    }
    if (commandObj.cmd === 'chaosBoardAction') {
        voteForAction(commandObj.action);
    }
}

function onTwitchRewardRedeemed(redemptionEvent) {
    voteForAction(redemptionEvent.title);
}

function isOpened(checkCol, checkRow) {
    return 'true' === document.getElementById("t_" + checkCol + "_" + checkRow).dataset.opened;
}

function revealRandomField() {
    randomFieldFound = false;
    while (!randomFieldFound && run) {
        //TODO: will loop indefinitely if only the winner is unopened and this method is called. 
        randomCol = Math.floor(Math.random() * boardCols);
        randomRow = Math.floor(Math.random() * boardRows);
        if (!isWinner(randomCol, randomRow) && !isOpened(randomCol, randomRow)) {
            randomFieldFound = true;
            _open(randomCol, randomRow);
        }
    }
}

function onRigRequestReceived(riggingEvent) {
    if (riggingEvent.consumer === 'sweeper') {
        if (!run) {
            return;
        }
        Backend.connection.chargeUser(riggingEvent.user.id, riggingCost, 'rigging ChaosSweeper',
                () => {
            revealRandomField();
        });
    }
}

function onBackendConnect(connection) {
    connection.subscribe('/topic/object', onCommandReceived);
    connection.subscribe('/topic/twitchRewardRedeemed', onTwitchRewardRedeemed);
    connection.subscribe('/topic/riggingRequested', onRigRequestReceived);
}

$(function () {
    Backend.connect(onBackendConnect);
});