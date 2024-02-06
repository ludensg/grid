let snakes = [];
let gridSize = 30;

function setup() {
    createCanvas(windowWidth, windowHeight); // Use the entire window for the canvas
    frameRate(10);
    addSnake();
    addSnake();
    addSnake();
    addSnake();

    // Prevent scrolling with arrow keys
    window.addEventListener('keydown', function(e) {
        if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        }
    }, false);    
}  

function draw() {
  background(0);
  drawGrid();
  snakes.forEach((snake, index) => {
    updateSnake(snake);
    drawSnake(snake);
  });
}

function drawGrid() {
  stroke(128); // Grey edges
  for (let x = 0; x <= width; x += gridSize) {
    for (let y = 0; y <= height; y += gridSize) {
      fill(0); // Black squares
      rect(x, y, gridSize, gridSize);
    }
  }
}

function addSnake() {
    // Random length between 10 and 20
    let snakeLength = floor(random(10, 21)); // p5.js function to get a random integer
  
    // Random direction
    const directions = ['right', 'down', 'left', 'up'];
    let direction = random(directions); // Select a random direction
  
    // Starting at a random grid position
    let cols = floor(width / gridSize);
    let rows = floor(height / gridSize);
    let startX = floor(random(cols)) * gridSize;
    let startY = floor(random(rows)) * gridSize;
  
    // Initialize the snake object
    let snake = {
      body: [],
      direction: direction,
    };
  
    // Depending on the direction, adjust the initial body placement
    for (let i = 0; i < snakeLength; i++) {
      switch(direction) {
        case 'right':
          snake.body.push({x: startX - i * gridSize, y: startY});
          break;
        case 'down':
          snake.body.push({x: startX, y: startY - i * gridSize});
          break;
        case 'left':
          snake.body.push({x: startX + i * gridSize, y: startY});
          break;
        case 'up':
          snake.body.push({x: startX, y: startY + i * gridSize});
          break;
      }
    }
  
    // Add the new snake to the snakes array
    snakes.push(snake);
  }
  

function updateSnake(snake) {
  let head = snake.body[0];
  let newHead = {x: head.x, y: head.y};

  switch(snake.direction) {
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

  // Adjusting for grid wrapping
  if (newHead.x >= width + 1) newHead.x = 0;
  if (newHead.y >= height + 1) newHead.y = 0;
  if (newHead.x < 0) newHead.x = width - gridSize;
  if (newHead.y < 0) newHead.y = height - gridSize;

  snake.body.pop();
  snake.body.unshift(newHead);
}

function drawSnake(snake) {
  for (let i = 0; i < snake.body.length - 1; i++) {
    let part = snake.body[i];
    let nextPart = snake.body[i + 1];

    let dx = abs(part.x - nextPart.x);
    let dy = abs(part.y - nextPart.y);

    if (dx === gridSize || dy === gridSize) {
      let opacity = map(i, 0, snake.body.length - 1, 255, 0);
      stroke(160, 32, 240, opacity);
      strokeWeight(2);

      if (!(dx === width || dy === height)) {
        line(part.x, part.y, nextPart.x, nextPart.y);
      }
    }
  }
}

function keyPressed() {
  if (keyCode === 32) { // Spacebar
    addSnake();
  } else {
    snakes.forEach(snake => {
        if (keyCode === LEFT_ARROW) {
            // Rotate left
            snake.direction = rotateDirection(snake.direction, false);
          } else if (keyCode === RIGHT_ARROW) {
            // Rotate right
            snake.direction = rotateDirection(snake.direction, true);
          }
    });
  }
}

function rotateDirection(currentDirection, clockwise) {
    const directions = ['right', 'down', 'left', 'up'];
    let index = directions.indexOf(currentDirection);
    if (clockwise) {
      // Move to the next direction clockwise
      index = (index + 1) % directions.length;
    } else {
      // Move to the previous direction counter-clockwise
      index = (index - 1 + directions.length) % directions.length;
    }
    return directions[index];
  }
