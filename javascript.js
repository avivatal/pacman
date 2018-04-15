var context = document.getElementById("canvas").getContext("2d");
var shape=new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;    
var interval;
var pinkPostion = [0,0];
var bluePosition = [9,9];
var greenPosition = [0,9];
var ghostPositions = [pinkPostion, bluePosition, greenPosition];
var pinkfood = false;
var bluefood = false;
var greenfood = false;
var ghostfood = [pinkfood, bluefood, greenfood];

Start();

function Start() {
    board = new Array();
    score = 0;
    pac_color="yellow";
    var cnt = 100;
    var food_remain = 50;
    var pacman_remain = 1;
    start_time= new Date();
   
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < 10; j++) {
            if((i==3 && j==3)||(i==3 && j==4)||(i==3 && j==5)||(i==6 && j==1)||(i==6 && j==2))
            {
                board[i][j] = 4;
            }
            else{
            var randomNum = Math.random();
            if (randomNum <= 1.0 * food_remain / cnt) {
                food_remain--;
                board[i][j] = 1;
            } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                shape.i=i;
                shape.j=j;
                pacman_remain--;
                board[i][j] = 2;
            } else {
                board[i][j] = 0;
            }
            cnt--;
            }
            }
    }
    board[0][0] = 5; //pink
    board[9][9] = 6; //blue
    board[0][9] = 7; //green
    while(food_remain>0){
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 1;
        food_remain--;
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        
    UpdatePosition();
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
        
    }, false);
    //interval=setInterval(UpdatePosition, 250);
    interval=setInterval(UpdateTimer, 250);
    setInterval(moveGhosts, 250);
}


 function findRandomEmptyCell(board){
     var i = Math.floor((Math.random() * 9) + 1);
     var j = Math.floor((Math.random() * 9) + 1);
    while(board[i][j]!=0)
    {
         i = Math.floor((Math.random() * 9) + 1);
         j = Math.floor((Math.random() * 9) + 1);
    }
    return [i,j];             
 }

function GetKeyPressed() {
    if (keysDown[38]) {
        return 1;
    }
    if (keysDown[40]) { 
        return 2;
    }
    if (keysDown[37]) { 
        return 3;
    }
    if (keysDown[39]) { 
        return 4;
    }
}

function Draw() {
    canvas.width=canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] == 2) {
                var lastKeyPressed = GetKeyPressed();
                if(lastKeyPressed == null || lastKeyPressed == 4){ //right
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
                else if(lastKeyPressed == 2){ //down
                    context.beginPath();
                    context.arc(center.x, center.y, 30,  0.65 * Math.PI, 0.35 * Math.PI, false); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color 
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 15, center.y + 5, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color 
                    context.fill();
                }
                else if(lastKeyPressed == 3){ //left
                    context.beginPath();
                    context.arc(center.x, center.y, 30,  1.15 * Math.PI, 0.85 * Math.PI, false); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color 
                    context.fill();
                    context.beginPath();
                    context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color 
                    context.fill();
                }
                else if(lastKeyPressed == 1){ //up
                    context.beginPath();
                    context.arc(center.x, center.y, 30,  1.65 * Math.PI, 1.35 * Math.PI, false); // half circle
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
            else if (board[i][j] == 4) {
                context.beginPath();
                context.rect(center.x-30, center.y-30, 60, 60);
                context.fillStyle = "grey"; //color 
                context.fill();
            }
            else if(board[i][j]==5){
            var pinkGhost = new Image();
            pinkGhost.src = "pink_ghost.png";
            pinkGhost.onload = function(){
                var x = ghostPositions[0][0] * 60;
                var y = ghostPositions[0][1] * 60;
                context.drawImage(pinkGhost,x, y,60,60);
            }
            }
            else if(board[i][j]==6){
            var blueGhost = new Image();
            blueGhost.src = "blue_ghost.png";
            blueGhost.onload = function(){
             // context.drawImage(blueGhost,bluePostion[0]*60, bluePostion[1]*60,60,60);
             var x = ghostPositions[1][0] * 60;
             var y = ghostPositions[1][1] * 60;
             context.drawImage(blueGhost,x, y,60,60);
            }
            }
            else if(board[i][j]==7){
                var greenGhost = new Image();
                greenGhost.src = "green_ghost.png";
                greenGhost.onload = function(){
                 // context.drawImage(blueGhost,bluePostion[0]*60, bluePostion[1]*60,60,60);
                 var x = ghostPositions[2][0] * 60;
                 var y = ghostPositions[2][1] * 60;
                 context.drawImage(greenGhost,x, y,60,60);
                }
                }
        }
    }
    
   
}

function moveGhosts(){
    
    for(var i=0; i<3; i++){
    var x = ghostPositions[i][0];
    var y = ghostPositions[i][1];
    var manhatten=1000; 
    var newPos=[0,0];
    //up
    if(y>0 && board[x][y-1] < 4 ){
        manhatten = Math.abs(shape.i - x) + Math.abs(shape.j - y-1);
        newPos = [x, y-1];
    }
    //down
    if(y+1<10 && board[x][y+1] < 4){
        if(manhatten > Math.abs(shape.i - x) + Math.abs(shape.j - y+1)){
        newPos = [x, y+1];
        manhatten =  Math.abs(shape.i - x) + Math.abs(shape.j - y+1);
        }
    }
    //right
    if(x+1<10 && board[x+1][y] < 4){
        if(manhatten > (Math.abs(shape.i - x+1) + Math.abs(shape.j - y))){
        newPos = [x+1, y];
        manhatten =  Math.abs(shape.i - x+1) + Math.abs(shape.j - y);
        }
    }
    //left
    if(x>0 && board[x-1][y] < 4){
        if(manhatten > (Math.abs(shape.i - x-1) + Math.abs(shape.j - y))){
        newPos = [x-1, y];
        manhatten =  Math.abs(shape.i - x-1) + Math.abs(shape.j - y);
        }
    }
    if(ghostfood[i] == true){
        board[ghostPositions[i][0]][ghostPositions[i][1]] = 1;
    }
    else{
        board[ghostPositions[i][0]][ghostPositions[i][1]] = 0;
    }
    ghostPositions[i][0] = newPos[0];
    ghostPositions[i][1] = newPos[1];
    if(board[ghostPositions[i][0]][ghostPositions[i][1]] == 1){
        ghostfood[i] = true;
    }
    else{
        ghostfood[i] = false;
    }
    board[ghostPositions[i][0]][ghostPositions[i][1]] = i+5;
}
Draw();
}

function UpdatePosition() {
    board[shape.i][shape.j]=0;
    var x = GetKeyPressed()
    if(x==1)
    {
        if(shape.j>0 && board[shape.i][shape.j-1]!=4)
        {
            shape.j--;
        }
    }
    if(x==2)
    {
        if(shape.j<9 && board[shape.i][shape.j+1]!=4)
        {
            shape.j++;
        }
    }
    if(x==3)
    {
        if(shape.i>0 && board[shape.i-1][shape.j]!=4)
        {
            shape.i--;
        }
    }
    if(x==4)
    {
        if(shape.i<9 && board[shape.i+1][shape.j]!=4)
        {
            shape.i++;
        }
    }
    if(board[shape.i][shape.j]==1)
    {
        score++;
    }
    board[shape.i][shape.j]=2;
  //  var currentTime=new Date();
   // time_elapsed=(currentTime-start_time)/1000;
    if(score>=20&&time_elapsed<=10)
    {
        pac_color="green";
    }
    if(score==50)
    {
        window.clearInterval(interval);
        window.alert("Game completed");
    }
    else
    {
        Draw();
    }
}

function UpdateTimer(){
    var currentTime=new Date();
    time_elapsed=(currentTime-start_time)/1000;
    lblTime.value = time_elapsed;
}