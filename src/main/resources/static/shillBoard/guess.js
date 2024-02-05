let boardCols = 0;
let boardRows = 0;
let boardWidth = 0;
let boardHeight = 0;
let start = 0;
let end = 0;
let winner = 0;
let plex = 100;
let run = true;

let audioWin = new Audio('WIN.wav');
audioWin.loop = false;
audioWin.volume = 0.3;
let audioLoss = new Audio('LOSS.wav');
audioLoss.loop = false;
audioLoss.volume = 0.3;

function init(cols, rows, startNum, winnerNum, priceId) {
    boardCols = cols;
    boardRows = rows;
    start = startNum;
    end = start + boardCols * boardRows - 1;
    winner = winnerNum;
    plex = 100;
    document.getElementById('plex').innerHTML = '' + plex;
    boardWidth = document.getElementById('board').offsetWidth;
    boardHeight = document.getElementById('board').offsetHeight;

    document.getElementById("board").style.backgroundImage = "url('https://image.eveonline.com/Type/" + priceId + "_1024.png')";
    $("#tileContainer").empty();
    let initNumber = startNum;
    for (currentRow = 0; currentRow < boardRows; currentRow++) {
        for (currentCol = 0; currentCol < boardCols; currentCol++) {
            $("#tileContainer").append("<div class='tile' id='t_" + initNumber + "' style='top:" + currentRow * 100 + "px;left:" + currentCol * 100 + "px'>" + initNumber + "</div>");
            initNumber++;
        }
    }
    run = true;
}

function guess(guess) {
    if (!run || guess < start || guess > end) {
        return;
    }
    if (guess === winner) {
        audioWin.play();
        revealBoard();
        run = false;
    } else {
        plex += Math.round(guess / 10);
        document.getElementById('plex').innerHTML = '' + plex;
        audioLoss.play();
        document.getElementById("t_" + guess).style.opacity = 0;
    }
}

function revealBoard() {
    let initNumber = start;
    for (currentRow = 0; currentRow < boardRows; currentRow++) {
        for (currentCol = 0; currentCol < boardCols; currentCol++) {
            document.getElementById("t_" + initNumber).style.opacity = 0;
            initNumber++;
        }
    }
    document.getElementById("t_" + guess).style.opacity = 1;
    document.getElementById("t_" + guess).style.backgroundColor = 'green';
}

function onMessageReceived(message) {
    switch (message.cmd) {
        case 'initGuess':
            init(message.cols, message.rows, message.start, message.winner, message.priceId);
            break;
        case 'guess':
            guess(message.number);
            break;
    }
}

function onTwitchBitsReceived(bitsEvent) {
    guess(bitsEvent.bitsUsed);
}

function onBackendConnect(backend) {
    backend.subscribe('/topic/object', onMessageReceived);
    backend.subscribe('/topic/twitchBitsReceived', onTwitchBitsReceived);
}

$(() => {
    new Backend(onBackendConnect);
});