let snakes = [];
let gridSize = 27;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    for (let i = 0; i < 4; i++) {
        addSnake();
    }

    window.addEventListener('keydown', function(e) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }
    }, false);

    createOverlayContent(); // Call to create and style HTML content
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = dist(0, 0, centerX, centerY);

    for (let x = 0; x <= width; x += gridSize) {
        for (let y = 0; y <= height; y += gridSize) {
            let d = dist(x, y, centerX, centerY);
            let normD = d / maxDist;

            let sw = map(normD, 0, 1, 2, 0.5);
            strokeWeight(sw);

            let c = lerpColor(color(80), color(128, 0, 128), map(normD, 0, 1, 0, 0.2));
            stroke(c);

            let adjustX = map(normD, 0, 1, 0, (centerX - x) * 0.05);
            let adjustY = map(normD, 0, 1, 0, (centerY - y) * 0.05);

            fill(0, 0); // Transparent fill
            rect(x + adjustX, y + adjustY, gridSize, gridSize);
        }
    }

    snakes.forEach(updateSnake);
    snakes.forEach(drawSnake);
}

function addSnake() {
    let snakeLength = floor(random(3, 12));
    const directions = ['right', 'down', 'left', 'up'];
    let direction = random(directions);

    let cols = floor(width / gridSize);
    let rows = floor(height / gridSize);
    let startX = floor(random(cols)) * gridSize;
    let startY = floor(random(rows)) * gridSize;

    let snake = {
        body: [],
        direction: direction,
        directionChangeCooldown: 0,
        changeProbability: 0.05
    };

    for (let i = 0; i < snakeLength; i++) {
        snake.body.push({ x: startX - i * gridSize, y: startY });
    }

    snakes.push(snake);
}

function updateSnake(snake) {
    if (snake.directionChangeCooldown <= 0 && random(1) < snake.changeProbability) {
        changeDirectionRandomly(snake);
        snake.directionChangeCooldown = floor(random(20, 60));
    } else if (snake.directionChangeCooldown > 0) {
        snake.directionChangeCooldown--;
    }

    let head = snake.body[0];
    let newHead = { x: head.x, y: head.y };

    switch (snake.direction) {
        case 'right':
            newHead.x += gridSize;
            break;
        case 'down':
            newHead.y += gridSize;
            break;
        case 'left':
            newHead.x -= gridSize;
            break;
        case 'up':
            newHead.y -= gridSize;
            break;
    }

    adjustForGridWrapping(newHead);
    snake.body.pop();
    snake.body.unshift(newHead);
}

function changeDirectionRandomly(snake) {
    const directions = ['right', 'down', 'left', 'up'];
    let newDirection = directions[(directions.indexOf(snake.direction) + floor(random(1, directions.length))) % directions.length];
    snake.direction = newDirection;
}

function adjustForGridWrapping(newHead) {
    if (newHead.x >= width) newHead.x = 0;
    if (newHead.y >= height) newHead.y = 0;
    if (newHead.x < 0) newHead.x = width - gridSize;
    if (newHead.y < 0) newHead.y = height - gridSize;
}

function drawSnake(snake) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = dist(0, 0, centerX, centerY);

    snake.body.forEach((part, index) => {
        if (index < snake.body.length - 1) {
            let nextPart = snake.body[index + 1];

            let d = dist(part.x, part.y, centerX, centerY);
            let normD = d / maxDist;

            let adjustX = map(normD, 0, 1, 0, (centerX - part.x) * 0.05);
            let adjustY = map(normD, 0, 1, 0, (centerY - part.y) * 0.05);

            let adjustedStartX = part.x + adjustX;
            let adjustedStartY = part.y + adjustY;
            let adjustedEndX = nextPart.x + adjustX;
            let adjustedEndY = nextPart.y + adjustY;

            let opacity = map(normD, 0, 1, 255, 50);
            stroke(160, 32, 240, opacity);
            strokeWeight(2);

            line(adjustedStartX, adjustedStartY, adjustedEndX, adjustedEndY);
        }
    });
}

function keyPressed() {
    if (keyCode === 32) {
        addSnake();
    } else {
        snakes.forEach(snake => {
            if (keyCode === LEFT_ARROW) {
                snake.direction = rotateDirection(snake.direction, false);
            } else if (keyCode === RIGHT_ARROW) {
                snake.direction = rotateDirection(snake.direction, true);
            }
        });
    }
}

function rotateDirection(currentDirection, clockwise) {
    const directions = ['right', 'down', 'left', 'up'];
    let index = directions.indexOf(currentDirection);
    index = clockwise ? (index + 1) % directions.length : (index + directions.length - 1) % directions.length;
    return directions[index];
}
