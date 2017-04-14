/*
This solution will only work if your ball- and paddle objects have these
variable-, property- and method names and that they have the
functionality as my objects. For that reason
I'm pasting those as well,
for reference,
below.
*/

var canvas = document.getElementById("stage");
var ctx = canvas.getContext('2d');

var scoreHolder = document.getElementById("score");
var livesHolder = document.getElementById("lives");
var resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetGame);

var score = 0;
var lives = 3;
livesHolder.innerHTML = lives;

var numLines = 10;
var numBricks = 10;

var ID;

// *******************************
//  Audio
//***************************** 
var paddleAudio = new Audio();
paddleAudio.src = "paddle.mp3";

var brickAudio = new Audio();
brickAudio.src = "brick.mp3"; 


// *******************************
//  control the paddle with mouse
//*****************************
canvas.addEventListener("mousemove", function move(event) {
    mouseX = event.clientX - this.offsetLeft;
    paddle.move(mouseX);
});

// ************************
//  paddle collision test
//**********************
function paddleHit() {
    // all these variables are just to make the if statement easier to understand
    var ballBottom = ball.y + ball.h;
    var ballCenterX = ball.x + ball.w/2;
    var paddleTop = paddle.y;
    var paddleCenterX = paddle.x + paddle.w/2;
    var centerDistance = Math.abs(ballCenterX - paddleCenterX); // might be negative. Math.abs() will fix that
    var touchDistance = ball.w/2 + paddle.w/2;

    if (ballBottom >= paddleTop && centerDistance <= touchDistance) {
        // collision detected!
        paddleAudio.play();
        ball.y = paddle.y - ball.h; // rescue ball that hit paddle on the side. put it back on top of paddle
        
        var paddleCenter = (paddle.x + paddle.w / 2);
        var ballCenter = (ball.x + ball.w / 2);
        var newDx = (paddleCenter - ballCenter) / (paddle.w / 2) * 100;
        newDx = Math.round(newDx);
        newDx = newDx / 100;
        console.log(newDx);

        ball.dx < 0 ? ball.dx = -2-newDx: ball.dx = 2-newDx;
        console.log(ball.dx, ball.dy);
        ball.dy *= -1;
    }
}
// To understand my collision test, play around with this codepen: http://codepen.io/jkohlin/pen/RpzWXv?editors=1010


// *****************************
//  This function assumes you have a ball object called 'ball'.
//  It also assumes you call this function by passing in a 'brick object' to test collision with
//*****************************
function brickHit(brick, line, pos) {
    var ballCenterX = ball.x + ball.w/2;
    var ballCenterY = ball.y + ball.h/2;
    var brickCenterX = brick.x + brick.w/2;
    var brickCenterY = brick.y + brick.h/2;
    var touchDistanceX = ball.w/2 + brick.w/2; // if center of ball and center of brick is closer than this, its a collision
    var touchDistanceY = ball.h/2 + brick.h/2;
    var centerDistanceX = Math.abs(ballCenterX - brickCenterX); // Math.abs() returns an absolute number i.e. negative numbers become positive
    var centerDistanceY = Math.abs(ballCenterY - brickCenterY);

    if (centerDistanceX <= touchDistanceX && centerDistanceY <= touchDistanceY){
        /*
        if, we reached this line,
        we got a hit on one side with one brick.
        Now it's up to you to decide what should
        happen (other than changing dx and/or dy).
        Destroying bricks and playing sound is your problem.
        */

        brickAudio.play();
        bricks[line].splice(pos, 1);
        score += 10
        scoreHolder.innerHTML = score;

        /*
        The following rows will decide if it was a
        vertical hit or a horizontal hit and act acordingly.
        */
        if (centerDistanceY < centerDistanceX) { // vertical hit. Bounce left or right.
            ball.dy *= -1;
        }
        if (centerDistanceX < centerDistanceY ) {// horizontal hit. Bounce up or down.
            ball.dx *= -1;
        }
        if (centerDistanceX === centerDistanceY) { //hitting a corner
            ball.dx *= -1;
            ball.dy *= -1;
        }
    }
}


// *****************************
//  This function reset the ball on top of the paddle if it falls outside the canvas
//*****************************
function resetBall() {
    var currentTime = new Date().getTime();
    var time = 1000;
    while (currentTime + time >= new Date().getTime()) {
        ball.x = paddle.x + (paddle.w / 2) - (ball.w / 2);
        ball.y = paddle.y - ball.h;
        ball.dy = -1;
    }
}


// *****************************
//  This function stop the code execution.
//  http://stackoverflow.com/a/16624104
//*****************************
function sleep(miliseconds) {
   var currentTime = new Date().getTime();
   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

// ****************
//  Paddle object
//**************
var paddle = {
    defaultX: canvas.width / 2 - 40,
    defaultY: canvas.height - 40,

    w: 80,
    h: 20,
    x: canvas.width / 2 - 40,
    y: canvas.height - 40,
    draw: function() {
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h); 
    },
    move: function(mouseX) {
        this.x = mouseX - this.w / 2;
    },
    reset: function() {
        this.x = this.defaultX;
        this.y = this.defaultY;
    },
}



// **************
//  ball object
//************
var ball = {
    defaultX: canvas.width / 2 - 5,
    defaultY: canvas.height - 50,
    defaultDx: 1,
    defaultDy: -1,

    w: 10,
    h: 10,
    x: canvas.width / 2 - 5,
    y: canvas.height - 50,
    dx: 2,
    dy: -2,
    speed: 1.5,
    wallBounce: function() {
        if (ball.x >= canvas.width - ball.w) {
            this.dx *= -1;
        } else if (ball.x <= 0) {
            this.dx *= -1;
        } else if (ball.y >= canvas.height - ball.h) {
            this.dy *= -1;
            lives -= 1;
            livesHolder.innerHTML = lives;
            resetBall();
        } else if (ball.y <= 0) {
            this.dy *= -1;
        }
    },
    move: function() {
        this.wallBounce()
        this.x += this.speed * this.dx;
        this.y += this.speed * this.dy;
    },
    draw: function() {
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h); 
    },
    reset: function() {
        this.x = this.defaultX;
        this.y = this.defaultY;
        this.dx = this.defaultDx;
        this.dy = this.defaultDy;
    },
}


// **************
//  brick object
//************
function Brick(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle= "black";
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.strokeRect(this.x, this.y, this.w, this.h); 
        ctx.fill();
    }

    this.clear = function() {
        ctx.clearRect(this.x, this.y, this.w, this.h);
    }
}

function randomColor() {
    var values = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++ ) {
            color += values[Math.floor(Math.random() * 16)];
        }
    return color;
}

var bricks = [];

function createBricks() {
    for (var i = 0; i < numLines; i++) {
        var line = [];
        for (var j = 0; j < numBricks; j++) {
            line.push(new Brick(j * 60, i * 10 + 20, 60, 10, randomColor()));
        }
        bricks.push(line);
    }
}
createBricks();

function drawBricks() {
    bricks.forEach(function(row) {
        row.forEach(function(brick) {
            brick.draw();
        });
    });
}


// **************
//  This function uses brickHit() to chech ball collision to each of the bricks
//************
function checkCollision() {
    bricks.forEach(function(row, index) {
        row.forEach(function(brick, pos) {
            brickHit(brick, index, pos);
        });
    });
}


// **************
//  This function checks remaining bricks
//************
function remainingBricks() {
    var count = 0;
    bricks.forEach(function(row, index) {
        row.forEach(function(brick, pos) {
            count++;
        });
    });
    return count;
}


// **************
//  This function draws a message on the canvas
//************
function drawMessage(message, color) {
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    var textWidth  = ctx.measureText(message).width;
    var textHeight  = ctx.measureText(message).height;
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);    
    ctx.strokeText(message, canvas.width / 2, canvas.height / 2); 
}


// **************
//  This function resets the game
//************
function resetGame() {
    location.reload();
}


// **************
//  This function updates the game
//************
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.move();
    paddleHit();
    checkCollision();
    ball.draw();
    paddle.draw();
    drawBricks();
    if (lives <= 0) {
        drawMessage("Game Over", "grey");
        return;
    } else if (!remainingBricks()) {
        drawMessage("You Win!", "green");
        return;
    } else {
        ID = requestAnimationFrame(update);
    }
    
}

ID = requestAnimationFrame(update);