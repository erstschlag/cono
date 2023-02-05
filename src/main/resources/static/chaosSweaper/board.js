let boardCols = 0;
let boardRows = 0;
let playerCol = 0;
let playerRow = 0;
let playerWidth = 0;
let playerHeight = 0;
let boardWidth = 0;
let boardHeight = 0;
let winCol = 0;
let winRow = 0;
let numberOfVotesForAction = 1;
let currentNumberOfVotes = 0;
let votes = [0,0,0,0,0];
let actionsPerformed = 0;
let run = true;
let actionPreviewImage = ['UP.png','DOWN.png','LEFT.png','RIGHT.png','OPEN.png'];
let voteUpIndex = 0;
let voteDownIndex = 1;
let voteLeftIndex = 2;
let voteRightIndex = 3;
let voteOpenIndex = 4;
let maxDistance = 0;

let autoMoveDelayMs = 10000;

let moves = [
    ()=>{reposition(0, -1);}, 
    ()=>{reposition(0, 1);}, 
    ()=>{reposition(-1, 0);}, 
    ()=>{reposition(1, 0);}, 
    ()=>{open();}];

function getNewPlayerPosition(playerCurrentPosition, playerMaxPosition, positionModification) {
    newPosition = playerCurrentPosition + positionModification;
    while (newPosition < 0) {
        newPosition += playerMaxPosition;
    }
    while (newPosition >= playerMaxPosition) {
        newPosition -= playerMaxPosition;
    }
    return newPosition;
};

function reposition(colDelta, rowDelta) {
    playerCol = getNewPlayerPosition(playerCol, boardCols, colDelta);
    playerRow = getNewPlayerPosition(playerRow, boardRows, rowDelta);
    document.getElementById('player').style.left = (boardWidth / boardCols * playerCol);
    document.getElementById('player').style.top = (boardHeight / boardRows * playerRow);
};

let audioWin = new Audio('WIN.wav');
audioWin.loop = false;
audioWin.volume = 0.3;
let audioLoss = new Audio('LOSS.wav');
audioLoss.loop = false;
audioLoss.volume = 0.3;
function open() {
    if(winCol === playerCol && winRow === playerRow) {
        run = false;
        audioWin.play();
        document.getElementById("t_" + playerCol + "_" + playerRow).style.backgroundColor = 'yellow';
    }else {
        audioLoss.play();
        distance = Math.round(Math.sqrt((Math.pow(winCol-playerCol,2) + Math.pow(winRow-playerRow,2))));
        redValue = Math.round(255/maxDistance * distance);
        greenValue = 255 - redValue;
        document.getElementById("t_" + playerCol + "_" + playerRow).style.backgroundColor = 'rgb(' + redValue + ',' + greenValue + ',0)';
    }
};

function init(cols,rows,winnerCol,winnerRow,priceId,numVotesForAction, autoMoveDelay) {
    boardCols = cols;
    boardRows = rows;
    maxDistance = Math.round(Math.sqrt((Math.pow(boardCols-1,2) + Math.pow(boardRows-1,2))));
    winCol = winnerCol;
    winRow = winnerRow;
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
    $( "#board" ).empty();
    for(currentRow = 0;currentRow<rows;currentRow++) {
        for(currentCol = 0;currentCol<cols;currentCol++) {
            $( "#board" ).append("<div class='tile' id='t_" + currentCol + "_" + currentRow + "' style='top:" + currentRow * 100 + "px;left:" + currentCol * 100 + "px'></div>");
        }
    }
    playerCol = 0;
    playerRow = 0;
    actionsPerformed = 0;
    run = true;
    reposition(0,0);
};

function evaluateWinningMove() {
    winningAction = 0;
    numberOfVotesForMostVotedAction = 0;
    for(i=0;i<votes.length;i++) {
        if(votes[i] > numberOfVotesForMostVotedAction) {
            numberOfVotesForMostVotedAction = votes[i];
            winningAction = i;
        }
    }
    return winningAction;
};

function executeMove(winningMove) {
    clearCooldown();
    document.getElementById('player').style.backgroundImage = "none";
    actionsPerformed++;
    document.getElementById('numberOfActions').innerHTML = '' + actionsPerformed;
    moves[winningMove]();
    currentNumberOfVotes = 0;
    votes = [0,0,0,0,0];
};

function evaluateAction() {
    winningMove = evaluateWinningMove();
    document.getElementById('player').style.backgroundImage = "url('" + actionPreviewImage[winningMove] + "')";
    if (currentNumberOfVotes >= numberOfVotesForAction) {
        executeMove(winningMove);
    }
};

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
    if(time < 0) {
      executeMove(evaluateWinningMove());
    }
  }, UPDATE_INTERVAL_MS);
};

function vote(actionIndex) {
    if(currentNumberOfVotes === 0){
        activateCooldown();
    }
    votes[actionIndex]++;
    currentNumberOfVotes++;
    evaluateAction();
};

function voteForAction(action) {
    if (!run) {
        return;
    }
    switch (action) {
        case "UP":
            vote(voteUpIndex);
            break;
        case "DOWN":
            vote(voteDownIndex);
            break;
        case "LEFT":
            vote(voteLeftIndex);
            break;
        case "RIGHT":
            vote(voteRightIndex);
            break;
        case "OPEN":
            vote(voteOpenIndex);
            break;
    }
};

function connectionSuccessful(stompClient) {
    stompClient.subscribe('/topic/object', function (object) {
        var commandObj = JSON.parse(object.body);
        if (commandObj.cmd === 'initChaosBoard') {
            init(commandObj.cols, commandObj.rows, commandObj.winnerCol, commandObj.winnerRow, commandObj.priceId, commandObj.numVotesForAction, commandObj.autoMoveDelayMs);
        }
        if (commandObj.cmd === 'chaosBoardAction') {
            voteForAction(commandObj.action);
        }
    });
}

$(function () {
    Backend.connect(connectionSuccessful);
});