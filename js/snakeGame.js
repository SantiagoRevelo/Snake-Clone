var updateRatio = 1000 / 5;

var pixelSize = 20;
var fieldSize = 25;

var canvas = document.getElementById('gameCanvas');
canvas.width = pixelSize * fieldSize;
canvas.height = pixelSize * fieldSize;

var ctx = canvas.getContext('2d');

var snake;
var totalLength;
var currentLength;
var direction;
var food;
var points;

var gameOver;

var gameLoop;

function Initialize() {
    if (!direction) {
        direction = "right";
    }

    if (typeof gameLoop != "undefined") {
        clearInterval(gameLoop);
    }

    gameLoop = setInterval(updateGame, updateRatio);

    addEventListener('keydown', keyDownHandler, false);
    points = 0;
    gameOver = false;
    createSnake();
    createFood();
}

function createSnake() {
    snake = [];
    totalLength = 5;
    currentLength = 1;
    // The snake will be created at the center of the canvas
    var startPoint = {
        x: Math.floor(fieldSize * 0.5),
        y: Math.floor(fieldSize * 0.5)
    };

    // using in the last known direction
    for (var i = currentLength - 1; i >= 0; i--) {
        switch (direction) {
            case "up":
                snake.push({
                    x: startPoint.x,
                    y: startPoint.y - i
                });
                break;
            case "right":
                snake.push({
                    x: startPoint.x + i,
                    y: startPoint.y
                });
                break;
            case "down":
                snake.push({
                    x: startPoint.x,
                    y: startPoint.y + i
                });
                break;
            case "left":
                snake.push({
                    x: startPoint.x - i,
                    y: startPoint.y
                });
        }

    }
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * fieldSize),
        y: Math.floor(Math.random() * fieldSize)
    }; 
}

// Main game loop
function updateGame() {
    if (!gameOver) {
        update();
        paint();
    }
}

function update() {
    updateSnake();
}

// the player can play with arrow keys or A, W, D, S
function keyDownHandler(event) {
    if (event) {
        if (!gameOver) {
            // for each key, check for not back on opposite direction
            if ((event.key == "w" || event.key == "ArrowUp") && direction != "down") {
                direction = "up";
            } else if ((event.key == "d" || event.key == "ArrowRight") && direction != "left") {
                direction = "right";
            } else if ((event.key == "s" || event.key == "ArrowDown") && direction != "up") {
                direction = "down";
            } else if ((event.key == "a" || event.key == "ArrowLeft") && direction != "right") {
                direction = "left";
            }
        } else {
            Initialize();
        }
    }
}

function updateSnake() {
    var nextHeadX = snake[0].x;
    var nextHeadY = snake[0].y;

    // the next head of the snake depends on the current direction
    switch (direction) {
        case "up":
            nextHeadY--;
            break;
        case "right":
            nextHeadX++;
            break;
        case "down":
            nextHeadY++;
            break;
        case "left":
            nextHeadX--;
    }

    // Is Game Over if the snake touches a wall or if collides with itself
    if (nextHeadX < 0 || nextHeadY < 0 || nextHeadX > fieldSize - 1 || nextHeadY > fieldSize - 1 || checkCollision(nextHeadX, nextHeadY, snake)) {
        gameOver = true;
    }

    if (!gameOver) {
        var tail;
        // Check if there is a piece of food in the next position
        if (nextHeadX == food.x && nextHeadY == food.y) {
            tail = {x: nextHeadX, y: nextHeadY };
            points += 10;
            createFood();
        }
        else {
            tail = snake.pop();
            tail.x = nextHeadX;
            tail.y = nextHeadY;
        }
        
        // make the snake grows on each frame untill reaches its length
        if (currentLength < totalLength) {
            snake.push({
                x: tail.x,
                y: tail.y
            });            
        }
        
        snake.unshift(tail);
        currentLength = snake.length;
    }
}

// check if a cell is "touching" any other cell of an array
function checkCollision(x, y, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].x == x && array[i].y == y) {
            return true;
        }
    }
    return false;
}

function paint() {
    drawBg();
    drawSnake();
    paintFood();
    drawPoints();
    if (gameOver) {
        printGameOver();
    }
}

function drawBg() {
    ctx.fillStyle = "#a9b6a9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#3a4f41";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    for (var i = 0; i < snake.length; i++) {
        var c = snake[i];
        paintCell(c.x, c.y, i == 0 ? "#1f5b1f" : "#526052");        
    }
}

function paintFood() {
    paintCell(food.x, food.y, "#a63a3a");
}

function paintCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    ctx.strokeStyle = "#a9b6a9";
    ctx.lineWidth = 1;
    ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

// Print the curren points
function drawPoints() {
    drawText("Score: " + points, 1, fieldSize -1, "9pt", "#526052", "start");
}

// Shows the Game Over message to the player
function printGameOver() {
    // fade off the canvas a little
    ctx.fillStyle = "rgba( 0, 0, 0, 0.7 )";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawText("Score:" + points, Math.floor(fieldSize * 0.5), Math.floor(fieldSize * 0.5) - 1, "36pt", "#a9b6a9");
    drawText("- Press any key to restart -", Math.floor(fieldSize * 0.5), Math.floor(fieldSize * 0.5) + 2, "9pt", "#a9b6a9");
}

// Function for print text on canvas
function drawText(text, x, y, fontSize, color, align) {
    if (typeof(align) == "undefined") {
        align = "center";
    }
    ctx.font = fontSize + " 'Press Start 2P'";
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.fillText(text, x * pixelSize, y * pixelSize, fieldSize * pixelSize);
}

Initialize();
