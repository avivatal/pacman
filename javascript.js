
var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var numOfGhosts;
var pinkPostion = [0, 0];
var bluePosition = [9, 9];
var greenPosition = [0, 9];
var ghostPositions = [pinkPostion, bluePosition, greenPosition];
var pinkfood = 0;
var bluefood = 0;
var greenfood = 0;
var heartfood = 0;
var candyfood = 0;
var clockfood = 0;
var ghostfood = [pinkfood, bluefood, greenfood];
var lastKeyPressed = null;
var heartPosition = [9, 0];
var candyPosition = [5, 5];
var clockPosition = [5,9];
var isHeartAlive = true;
var isCandyAlive = true;
var isClockAlive = true;
var lives = 3;
var isGameOver = true;
var users;
var welcome = true;
var signin = false;
var user;
var signupDiv;
var signinDiv;
var welcomeDiv;
var gameDiv;
var mySound;
var readyDiv;
var gameOverDiv;
var optionsDiv;
var numOfFood = 50;
var intervals = null;
var winnerDiv;
var noTimeDiv;
var totalFood;

function initialize() {
    numOfFood = totalFood;
    pinkPostion = [0, 0];
    bluePosition = [9, 9];
    greenPosition = [0, 9];
    ghostPositions = [pinkPostion, bluePosition, greenPosition];
    pinkfood = 0;
    bluefood = 0;
    greenfood = 0;
    heartfood = 0;
    candyfood = 0;
    clockfood = 0;
    ghostfood = [pinkfood, bluefood, greenfood];
    lastKeyPressed = null;
    heartPosition = [9, 0];
    candyPosition = [5, 5];
    clockPosition = [5, 9];
    isHeartAlive = true;
    isCandyAlive = true;
    lives = 3;
    isGameOver = false;
    welcome = true;
    signin = false;
    if (intervals != null) {
        for (var i = 0; i < 4; i++) {
            clearInterval(intervals[i]);
        }
    }
    winnerDiv = document.getElementById("winner")
    winnerDiv.style.visibility = 'hidden';
    noTimeDiv = document.getElementById("noTime")
    noTimeDiv.style.visibility = 'hidden';
    gameOverDiv.style.visibility = 'hidden';
}

$(document).ready(function () {
    winnerDiv = document.getElementById("winner")
    winnerDiv.style.visibility = 'hidden';
    noTimeDiv = document.getElementById("noTime")
    noTimeDiv.style.visibility = 'hidden';
    signupDiv = document.getElementById("signup")
    signupDiv.style.visibility = 'hidden';
    signinDiv = document.getElementById("signin")
    signinDiv.style.visibility = 'hidden';
    gameDiv = document.getElementById("game")
    gameDiv.style.visibility = 'hidden';
    welcomeDiv = document.getElementById("welcome");
    readyDiv = document.getElementById("ready");
    readyDiv.style.visibility = 'hidden';
    gameOverDiv = document.getElementById("gameOver");
    gameOverDiv.style.visibility = 'hidden';
    optionsDiv = document.getElementById("options");
    optionsDiv.style.visibility = 'hidden';
    users = new Array();
    time_elapsed = 0;
    users.push(["a", "a"]);
    window.addEventListener("keydown", function (e) {
        // space and arrow keys
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
    keysDown = {};
        addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        UpdatePosition();
        }, false);
        addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;

    }, false);

});

function start() {
    initialize();
    context = document.getElementById("canvas").getContext("2d");
    board = new Array();
    score = 0;
    pac_color = "yellow";
    var cnt = 100;
    var food_remain = numOfFood;
    var pacman_remain = 1;
    start_time = new Date();
    document.getElementById('lblLives').innerHTML = lives;
    eatingSound = new sound("eatingSound.mp3");
    
    var numOfBlue = Math.round(numOfFood * 0.6);
    var numOfRed = Math.round(numOfFood * 0.3);
    var numberOfWhite = numOfFood - numOfBlue - numOfRed;

    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if ((i == 3 && j == 3) || (i == 3 && j == 4) || (i == 3 && j == 5) || (i == 6 && j == 1) || (i == 6 && j == 2)) {
                board[i][j] = 4;
            }
            else {
                var randomNum = Math.random();
                if (randomNum <= 1.0 * food_remain / cnt) {

                    var randomColor = Math.random();
                    if (numOfBlue > 0 && randomColor < 0.3) {
                        board[i][j] = 60;
                        numOfBlue--;
                        food_remain--;
                        cnt--;
                    }
                    else if (numOfRed > 0 && randomColor > 0.3 && randomColor < 0.6) {
                        board[i][j] = 30;
                        numOfRed--;
                        food_remain--;
                        cnt--;
                    }
                    else if (numberOfWhite > 0 && randomColor > 0.6) {
                        board[i][j] = 1;
                        numberOfWhite--;
                        food_remain--;
                        cnt--;
                    }
                    else {
                        board[i][j] = 0;
                        cnt--;
                    }
                } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                    if (!((i == 9 && (j == 0 || j == 9)) || (i == 0 && (j == 0 || j == 9)) || (i == 5 && j == 5) || (i == 5 && j == 9))) {
                        shape.i = i;
                        shape.j = j;
                        pacman_remain--;
                        board[i][j] = 2;
                        cnt--;
                    }
                } else {
                    board[i][j] = 0;
                    cnt--;
                }
            }
        }
    }
    if (board[5][9] == 1 || board[5][9] == 30 || board[5][9] == 60) {
        candyfood = board[5][9];
    }
    board[5][9] = 10; //clock
    if (board[5][5] == 1 || board[5][5] == 30 || board[5][5] == 60) {
        candyfood = board[5][5];
    }
    board[5][5] = 9; //candy
    if (board[9][0] == 1 || board[9][0] == 30 || board[9][0] == 60) {
        heartfood = board[9][0];
    }
    board[9][0] = 8 //heart
    if (board[0][0] == 1 || board[0][0] == 30 || board[0][0] == 60) {
        ghostfood[0] = board[0][0];
    }
    board[0][0] = 5; //pink
    if (numOfGhosts >= 2) {
        if (board[9][9] == 1 || board[9][9] == 30 || board[9][9] == 60) {
            ghostfood[1] = board[9][9];
        }
        board[9][9] = 6; //blue
    }
    if (numOfGhosts == 3) {
        if (board[0][9] == 1 || board[0][9] == 30 || board[0][9] == 60) {
            ghostfood[2] = board[0][9];
        }
        board[0][9] = 7; //green
    }
    while (food_remain > 0) {
        var emptyCell = findRandomEmptyCell(board);
        var randomColor = Math.random();
        if (numOfBlue > 0 && randomColor < 0.3) {
            board[emptyCell[0]][emptyCell[1]] = 60;
            numOfBlue--;
            food_remain--;
        }
        else if (numOfRed > 0 && randomColor > 0.3 && randomColor < 0.6) {
            board[emptyCell[0]][emptyCell[1]] = 30;
            numOfRed--;
            food_remain--;
        }
        else if (numberOfWhite > 0 && randomColor > 0.6) {
            board[emptyCell[0]][emptyCell[1]] = 1;
            food_remain--;
            numberOfWhite--;
        }
    }
    Draw();
    readySetGo();
    mySound = new sound("opening.mp3");
    mySound.play();
    
    setTimeout(function () {
        readyDiv.style.visibility = 'hidden';
        mySound.pause();
        eatingSound.play();
        eatingSound.loop();
        time_elapsed = 0;
        intervals = [0, 0, 0, 0 ,0];
        intervals[0] = setInterval(UpdateTimer, 250);
        intervals[1] = setInterval(moveGhosts, 450);
        intervals[2] = setInterval(moveHeart, 550);
        intervals[3] = setInterval(moveCandy, 550);
        intervals[4] = setInterval(moveClock, 550);
        
    }, 5000);

}

function readySetGo() {
    readyDiv.style.visibility = 'visible';
}


function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * 9) + 1);
    var j = Math.floor((Math.random() * 9) + 1);
    while (board[i][j] != 0) {
        i = Math.floor((Math.random() * 9) + 1);
        j = Math.floor((Math.random() * 9) + 1);
    }
    return [i, j];
}

function GetKeyPressed() {
    if (keysDown[38]) {
        lastKeyPressed = 1;
        return 1;
    }
    if (keysDown[40]) {
        lastKeyPressed = 2;
        return 2;
    }
    if (keysDown[37]) {
        lastKeyPressed = 3;
        return 3;
    }
    if (keysDown[39]) {
        lastKeyPressed = 4;
        return 4;
    }
}

function Draw() {
    if (!isGameOver) {
        canvas.width = canvas.width; //clean board
        lblScore.innerHTML = score;
        lblTime.innerHTML = time_elapsed.toString().substring(0,time_elapsed.toString().indexOf(".")+2);
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var center = new Object();
                center.x = i * 60 + 30;
                center.y = j * 60 + 30;
                if (board[i][j] == 2) {

                    if (lastKeyPressed == null || lastKeyPressed == 4) { //right
                        context.beginPath();
                        context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                        context.lineTo(center.x, center.y);
                        context.fillStyle = pac_color; //color 
                        context.fill();
                        context.beginPath();
                        context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                        context.fillStyle = "black"; //color 
                        context.fill();
                    }
                    else if (lastKeyPressed == 2) { //down
                        context.beginPath();
                        context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI, false); // half circle
                        context.lineTo(center.x, center.y);
                        context.fillStyle = pac_color; //color 
                        context.fill();
                        context.beginPath();
                        context.arc(center.x - 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
                        context.fillStyle = "black"; //color 
                        context.fill();
                    }
                    else if (lastKeyPressed == 3) { //left
                        context.beginPath();
                        context.arc(center.x, center.y, 30, 1.15 * Math.PI, 0.85 * Math.PI, false); // half circle
                        context.lineTo(center.x, center.y);
                        context.fillStyle = pac_color; //color 
                        context.fill();
                        context.beginPath();
                        context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                        context.fillStyle = "black"; //color 
                        context.fill();
                    }
                    else if (lastKeyPressed == 1) { //up
                        context.beginPath();
                        context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI, false); // half circle
                        context.lineTo(center.x, center.y);
                        context.fillStyle = pac_color; //color 
                        context.fill();
                        context.beginPath();
                        context.arc(center.x - 15, center.y - 5, 5, 0, 2 * Math.PI); // circle
                        context.fillStyle = "black"; //color 
                        context.fill();
                    }
                } else if (board[i][j] == 1) {
                    context.beginPath();
                    context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
                    context.fillStyle = "white"; //color 
                    context.fill();
                }
                else if (board[i][j] == 30) {
                    context.beginPath();
                    context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
                    context.fillStyle = "red"; //color 
                    context.fill();
                }
                else if (board[i][j] == 60) {
                    context.beginPath();
                    context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
                    context.fillStyle = "blue"; //color 
                    context.fill();
                }
                else if (board[i][j] == 4) {
                    context.beginPath();
                    context.rect(center.x - 30, center.y - 30, 60, 60);
                    context.fillStyle = 'rgb(32, 72, 232)'; //color 
                    context.fill();
                }
                else if (board[i][j] == 5) {
                    var pinkGhost = new Image();
                    pinkGhost.src = "pink_ghost.png";
                    pinkGhost.onload = function () {
                        var x = ghostPositions[0][0] * 60;
                        var y = ghostPositions[0][1] * 60;
                        context.drawImage(pinkGhost, x, y, 60, 60);
                    }
                }
                else if (board[i][j] == 6) {
                    var blueGhost = new Image();
                    blueGhost.src = "blue_ghost.png";
                    blueGhost.onload = function () {
                        var x = ghostPositions[1][0] * 60;
                        var y = ghostPositions[1][1] * 60;
                        context.drawImage(blueGhost, x, y, 60, 60);
                    }
                }
                else if (board[i][j] == 7) {
                    var greenGhost = new Image();
                    greenGhost.src = "green_ghost.png";
                    greenGhost.onload = function () {
                        var x = ghostPositions[2][0] * 60;
                        var y = ghostPositions[2][1] * 60;
                        context.drawImage(greenGhost, x, y, 60, 60);
                    }
                }
                else if (isHeartAlive && board[i][j] == 8) {
                    var heart = new Image();
                    heart.src = "heart.png";
                    heart.onload = function () {
                        var x = heartPosition[0] * 60;
                        var y = heartPosition[1] * 60;
                        context.drawImage(heart, x, y, 60, 60);
                    }
                }
                else if (isCandyAlive && board[i][j] == 9) {
                    var candy = new Image();
                    candy.src = "candy.png";
                    candy.onload = function () {
                        var x = candyPosition[0] * 60;
                        var y = candyPosition[1] * 60;
                        context.drawImage(candy, x, y, 60, 60);
                    }
                }
                else if (isClockAlive && board[i][j] == 10) {
                    var clock = new Image();
                    clock.src = "clock.png";
                    clock.onload = function () {
                        var x = clockPosition[0] * 60;
                        var y = clockPosition[1] * 60;
                        context.drawImage(clock, x, y, 60, 60);
                    }
                }
            }
        }

    }
}

function moveGhosts() {
    if (!isGameOver) {
        for (var i = 0; i < numOfGhosts; i++) {
            var x = ghostPositions[i][0];
            var y = ghostPositions[i][1];
            var manhatten = 10000;
            var newPos = [0, 0];
            //up
            if (y - 1 >= 0 && (board[x][y - 1] < 4 || board[x][y - 1]==30 || board[x][y - 1]==60)) {
                manhatten = (Math.abs(shape.i - x) + Math.abs(shape.j - (y - 1)));
                newPos = [x, y - 1];
            }
            //down
            if (y + 1 <= 9 && (board[x][y + 1] < 4 || board[x][y + 1]==30 || board[x][y + 1]==60)) {
                if (manhatten > (Math.abs(shape.i - x) + Math.abs(shape.j - (y + 1)))) {
                    newPos = [x, y + 1];
                    manhatten = Math.abs(shape.i - x) + Math.abs(shape.j - (y + 1));
                }
            }
            //right
            if (x + 1 <= 9 && (board[x + 1][y] < 4 ||board[x + 1][y]==30 || board[x + 1][y]==60 )) {
                if (manhatten > (Math.abs(shape.i - (x + 1)) + Math.abs(shape.j - y))) {
                    newPos = [x + 1, y];
                    manhatten = Math.abs(shape.i - (x + 1)) + Math.abs(shape.j - y);
                }
            }
            //left
            if (x - 1 >= 0 && (board[x - 1][y] < 4 || board[x - 1][y]==30 || board[x - 1][y]==60)) {
                if (manhatten > (Math.abs(shape.i - (x - 1)) + Math.abs(shape.j - y))) {
                    newPos = [x - 1, y];
                    manhatten = Math.abs(shape.i - (x - 1)) + Math.abs(shape.j - y);
                }
            }
            board[ghostPositions[i][0]][ghostPositions[i][1]] = ghostfood[i];
            ghostPositions[i][0] = newPos[0];
            ghostPositions[i][1] = newPos[1];
            ghostfood[i] = board[ghostPositions[i][0]][ghostPositions[i][1]];
            board[ghostPositions[i][0]][ghostPositions[i][1]] = i + 5;
        }
        didGhostEatPacman();
        if (!isGameOver) {
            Draw();
        }
    }
}

function UpdatePosition() {
    if (!isGameOver) {
        board[shape.i][shape.j] = 0;
        var x = GetKeyPressed()
        if (x == 1) {
            if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
                shape.j--;
            }
        }
        if (x == 2) {
            if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
                shape.j++;
            }
        }
        if (x == 3) {
            if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
                shape.i--;
            }
        }
        if (x == 4) {
            if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
                shape.i++;
            }
        }
        if (board[shape.i][shape.j] == 1) {
            score += 25;
            numOfFood--;
           

        } else if (board[shape.i][shape.j] == 30) {
            score += 15;
            numOfFood--;
        }
        else if (board[shape.i][shape.j] == 60) {
            score += 5;
            numOfFood--;
        }
        board[shape.i][shape.j] = 2;
        if (score >= 20 && time_elapsed <= 10) {
            pac_color = "green";
        }
        if (numOfFood == 0) {
            isGameOver = true;
            for (var i = 0; i < 4; i++) {
                window.clearInterval(intervals[i]);
            }
            window.alert("Game completed");
            mySound.pause();
        }
        else {
            didEatHeart();
            didEatCandy();
            didEatClock();
            didGhostEatPacman();
            if (!isGameOver) {
                Draw();
            }
        }
    }
}

function moveHeart() {
    if (!isGameOver && isHeartAlive) {
        var x = heartPosition[0];
        var y = heartPosition[1];
        var positions = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
        var random = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        var newPos = positions[random];
        var isGoodPosition = false;
        while (!isGoodPosition) {
            if (newPos[0] < board.length && newPos[1] < board.length && newPos[0] >= 0 && newPos[1] >= 0 &&
                (board[newPos[0]][newPos[1]] < 4 || board[newPos[0]][newPos[1]]==30 || board[newPos[0]][newPos[1]]==60) && board[newPos[0]][newPos[1]] != 2) {
                isGoodPosition = true;
            }
            else {
                random = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
                newPos = positions[random];
            }
        }
        board[heartPosition[0]][heartPosition[1]] = heartfood;
        heartPosition = [newPos[0], newPos[1]];
        heartfood = board[newPos[0]][newPos[1]];
        board[newPos[0]][newPos[1]] = 8;
    }

}

function moveCandy() {
    if (!isGameOver && isCandyAlive) {
        var x = candyPosition[0];
        var y = candyPosition[1];
        var positions = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
        var random = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        var newPos = positions[random];
        var isGoodPosition = false;
        while (!isGoodPosition) {
            if (newPos[0] < board.length && newPos[1] < board.length && newPos[0] >= 0 && newPos[1] >= 0 &&
                (board[newPos[0]][newPos[1]] < 4 || board[newPos[0]][newPos[1]]==30 || board[newPos[0]][newPos[1]]==60) && board[newPos[0]][newPos[1]] != 2) {
                isGoodPosition = true;
            }
            else {
                random = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
                newPos = positions[random];
            }
        }
        board[candyPosition[0]][candyPosition[1]] = candyfood;
        candyPosition = [newPos[0], newPos[1]];
        candyfood = board[newPos[0]][newPos[1]];
        board[newPos[0]][newPos[1]] = 9;
    }
}

function moveClock() {
    if (!isGameOver && isClockAlive) {
        var x = clockPosition[0];
        var y = clockPosition[1];
        var positions = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
        var random = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        var newPos = positions[random];
        var isGoodPosition = false;
        while (!isGoodPosition) {
            if (newPos[0] < board.length && newPos[1] < board.length && newPos[0] >= 0 && newPos[1] >= 0 &&
                (board[newPos[0]][newPos[1]] < 4 || board[newPos[0]][newPos[1]]==30 || board[newPos[0]][newPos[1]]==60) && board[newPos[0]][newPos[1]] != 2) {
                isGoodPosition = true;
            }
            else {
                random = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
                newPos = positions[random];
            }
        }
        board[clockPosition[0]][clockPosition[1]] = clockfood;
        clockPosition = [newPos[0], newPos[1]];
        clockfood = board[newPos[0]][newPos[1]];
        board[newPos[0]][newPos[1]] = 10;
    }
}

function UpdateTimer() {
    if (!isGameOver) {
        var currentTime = new Date();
        time_elapsed = (currentTime - start_time) / 1000; 
        if(!isClockAlive){
            time_elapsed += 10;
        }
        lblTime.innerHTML = time_elapsed.toString().substring(0,time_elapsed.toString().indexOf(".")+2);
        if (time_elapsed >= timeLimit) {
            isGameOver = true;
            overSound = new sound("gameOver.mp3");
            overSound.play();
            if(score < 150)
            noTimeDiv.style.visibility = 'visible';
            else {
                winner.style.visibility = 'visible';
            }
        }
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.loop = function () {
        this.sound.loop = true;
    }
    this.pause = function () {
        this.sound.pause();
    }
}

function didEatHeart() {
    if (!isGameOver) {
        if (isHeartAlive && shape.i == heartPosition[0] && shape.j == heartPosition[1]) {
            lives++;
            document.getElementById('lblLives').innerHTML = lives;
            isHeartAlive = false;
            board[shape.i][shape.j] = 2;
        }
    }
}

function didEatCandy() {
    if (!isGameOver) {
        if (isCandyAlive && shape.i == candyPosition[0] && shape.j == candyPosition[1]) {
            score = score + 50;
            lblScore.innerHTML = score;
            isCandyAlive = false;
            board[shape.i][shape.j] = 2;
        }
    }
}

function didEatClock() {
    if (!isGameOver) {
        if (isClockAlive && shape.i == clockPosition[0] && shape.j == clockPosition[1]) {
            isClockAlive = false;
            board[shape.i][shape.j] = 2;
        }
    }
}

function didGhostEatPacman() {
    if (!isGameOver) {
        for (var i = 0; i < numOfGhosts; i++) {
            if (shape.i == ghostPositions[i][0] && shape.j == ghostPositions[i][1]) {
                lives--;
                document.getElementById('lblLives').innerHTML = lives;
                if (lives > 0) {
                    restartGame();
                }
                else {

                    mySound.pause();
                    isGameOver = true;
                    overSound = new sound("gameOver.mp3");
                    overSound.play();
                    gameOverDiv.style.visibility = 'visible';

                }
                break;
            }
        }
    }
}

function restartGame() {
    if (!isGameOver) {
        for (var i = 0; i <numOfGhosts; i++){
            board[ghostPositions[i][0]][ghostPositions[i][1]] = ghostfood[i];
        }
        ghostPositions = [[0,0], [9,9], [0,9]];
        for (var i = 0; i <numOfGhosts; i++){
            if(board[ghostPositions[i][0]][ghostPositions[i][1]]==1 || board[ghostPositions[i][0]][ghostPositions[i][1]]==30 || board[ghostPositions[i][0]][ghostPositions[i][1]]==60){
                ghostfood[i] = board[ghostPositions[i][0]][ghostPositions[i][1]];
            }
            board[ghostPositions[i][0]][ghostPositions[i][1]] = i+5;
        }
        board[shape.i][shape.j] = 0;
        var newPacmanPos = findRandomEmptyCell(board);
        shape.i = newPacmanPos[0];
        shape.j = newPacmanPos[1];
        board[newPacmanPos[0]][newPacmanPos[1]] = 2;
        Draw();
    }
}

function signup() {
    var username = document.getElementById("username").value
    var usernameTaken = false;
    if (username == "") {
        window.alert("Please fill in all the fields");
    }
    else {
        for (var i = 0; i < users.length; i++) {
            if (users[i][0] == username) {
                usernameTaken = true;
                break;
            }
        }
        if (usernameTaken) {
            window.alert("The selected username is already taken");
        }
        else {
            var firstName = $('#firstname').val(),
                lastname = $('#lastname').val(),
                password = $('#password').val(),
                email = $('#email').val(),
                dob = $('#dob').val();
            if (firstName == "" || lastname == "" || password == "" || email == "" || dob == "") {
                window.alert("Please fill in all the fields");
            }
            else if (password.match(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,}$/) == false) {
                window.alert("Password length must be at least 8, and should contain at least one digit and one letter, and no special characters");
            }
            else if (/\d/.test(firstName) || /\d/.test(lastname)) {
                window.alert("First name and last name should not contain digits.")
            }
            else if (email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) == false) {
                window.alert("Please enter a valid e-mail address.")
            }
            else {
                users.push([username, password]);
                window.alert("You have signed in successfuly!");
                signupDiv.style.visibility = 'hidden';
                signinDiv.style.visibility = 'visible';
            }
        }
    }
}

function signinfunc() {
    var username = $('#usernameSignIn').val();
    var password = $('#passwordSignIn').val();
    var found = false;
    for (var i = 0; i < users.length; i++) {
        if (users[i][0] == username) {
            found = true;
            if (users[i][1] == password) {
                user = users[i];
                window.alert("You have signed in successfuly");
                signinDiv.style.visibility = 'hidden';
                optionsDiv.style.visibility = 'visible';

            }
            else {
                window.alert("Incorrect Password");
            }
            break;
        }
    }
    if (!found) {
        window.alert("Invalid username");
    }
    else {
        document.getElementById("user").innerHTML = "Welcome " + username + "!";

    }
}

function options() {
    numOfFood = document.getElementById("pacdots").value;
    totalFood = numOfFood;
    numOfGhosts = document.getElementById("numOfGhosts").value;
    timeLimit = document.getElementById("timelimit").value;
    if (numOfFood < 50 || numOfFood > 90) {
        window.alert("Number of Pac-Dots must be between 50 to 90");
    }
    else if (numOfGhosts < 1 || numOfGhosts > 3) {
        window.alert("Number of ghosts must be between 1 to 3");
    }
    else if (timeLimit < 60) {
        window.alert("Time limit must be at least 60 seconds");
    }
    else {
        optionsDiv.style.visibility = 'hidden';
        gameDiv.style.visibility = 'visible';
        start();
    }
}

function displaySignUp() {
    welcomeDiv.style.visibility = 'hidden';
    signinDiv.style.visibility = 'hidden';
    gameDiv.style.visibility = 'hidden';
    readyDiv.style.visibility = 'hidden';
    gameOverDiv.style.visibility = 'hidden';
    signupDiv.style.visibility = 'visible';
    noTimeDiv.style.visibility = 'hidden';
    winnerDiv.style.visibility = 'hidden';
}

function displaySignIn() {
    welcomeDiv.style.visibility = 'hidden';
    signupDiv.style.visibility = 'hidden';
    gameDiv.style.visibility = 'hidden';
    readyDiv.style.visibility = 'hidden';
    gameOverDiv.style.visibility = 'hidden';
    signinDiv.style.visibility = 'visible';
    noTimeDiv.style.visibility = 'hidden';
    winnerDiv.style.visibility = 'hidden';
}

function about(){
    document.getElementById("about").showModal();
    // When the user clicks on <span> (x), close the modal
    var span = document.getElementById("span");
    span.onclick = function() {
        document.getElementById("about").close();  
    }
}



