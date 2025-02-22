const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
defaultTickSpeed=150;
let tickSpeed;
let ticker;
let immortal=false;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
gameStart();

function gameStart(){
    tickSpeed = defaultTickSpeed;
    running= true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
}

function nextTick(){
    if(running){
        ticker = setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, tickSpeed);
    }
    else{
        displayGameOver();
    }
}

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
}

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake(){
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        playEatSound();
        createFood();
        tickSpeed = tickSpeed - 2;
    }
    else{
        snake.pop();
    }     
}

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
}

function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    
    // Adding WASD keys
    const KEY_W = 87;
    const KEY_A = 65;
    const KEY_S = 83;
    const KEY_D = 68;

    // Adding Z and X keys
    const KEY_Z = 90;
    const KEY_X = 88;
 
    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case((keyPressed == LEFT || keyPressed == KEY_A) && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case((keyPressed == UP || keyPressed == KEY_W) && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case((keyPressed == RIGHT || keyPressed == KEY_D) && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case((keyPressed == DOWN || keyPressed == KEY_S) && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
        case (keyPressed == KEY_Z):
            setInterval(() => {
                tickSpeed = tickSpeed * 0.99;
                console.log(tickSpeed);
            }, 100);
         
            break;
        case (keyPressed == KEY_X):
            immortal = true;
            let setTimeoutID = setTimeout(() => {
                immortal = false;
                clearTimeout(setTimeoutID);
                running = immortal;
            }, 6000);
            break;
    }
}


function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            snake[0].x = gameWidth;
            break;
        case (snake[0].x >= gameWidth):
            snake[0].x = 0;
            break;
        case (snake[0].y < 0):
            snake[0].y = gameHeight;
            break;
        case (snake[0].y >= gameHeight):
            snake[0].y = 0;
            break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = immortal;
        }
    }
}

function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
}

function resetGame(){
    tickSpeed = defaultTickSpeed;
    clearTimeout(ticker);
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
    
}

function playEatSound() {
    const eatSound = new Audio("eat.mp3"); // Load the sound file
    eatSound.play().catch(error => console.error("Playback error:", error));
}
