let snakes = [];
let gridSize = 27;



function setup() {
    createCanvas(windowWidth, windowHeight); // Use the entire window for the canvas
    frameRate(25);
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
  

function draw() {
    background(0);
  
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = dist(0, 0, centerX, centerY); // Maximum distance from center to corner
  
    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        // Calculate distance from center
        let d = dist(x, y, centerX, centerY);
        let normD = d / maxDist; // Normalize distance
  
        // Adjust stroke weight based on distance
        let sw = map(normD, 0, 1, 2, 0.5);
        strokeWeight(sw);
  
        // Darken color based on distance
        let c = map(normD, 0, 1, 255, 50);
        stroke(c);
  
        // Calculate adjusted position for the illusion of curvature
        let adjustX = map(normD, 0, 1, 0, (centerX - x) * 0.05);
        let adjustY = map(normD, 0, 1, 0, (centerY - y) * 0.05);
  
        // Draw grid with adjusted positions and color
        fill(0, 0); // Transparent fill
        rect(x + adjustX, y + adjustY, gridSize, gridSize);
      }
    }

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
    let snakeLength = floor(random(3, 12)); // p5.js function to get a random integer
  
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
      directionChangeCooldown: 0, // No initial cooldown
      changeProbability: 0.05 // Chance to change direction each frame
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
  // Random direction change based on individual snake's probability and cooldown
  if (snake.directionChangeCooldown <= 0 && random(1) < snake.changeProbability) {
    changeDirectionRandomly(snake);
    snake.directionChangeCooldown = floor(random(20, 60)); // Random cooldown between direction changes
  } else if (snake.directionChangeCooldown > 0) {
    snake.directionChangeCooldown--; // Decrease cooldown
  }

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

  // Adjusting for grid wrapping and updating the snake
  adjustForGridWrapping(newHead);
  snake.body.pop();
  snake.body.unshift(newHead);
}

function changeDirectionRandomly(snake) {
    const directions = ['right', 'down', 'left', 'up'];
    let currentDirectionIndex = directions.indexOf(snake.direction);
    let newDirectionIndex;
    do {
      newDirectionIndex = floor(random(4));
    } while (newDirectionIndex === currentDirectionIndex); // Ensure new direction is different
  
    snake.direction = directions[newDirectionIndex];
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
    const maxDist = dist(0, 0, centerX, centerY); // Maximum distance from center to corner
  
    for (let i = 0; i < snake.body.length - 1; i++) {
      let part = snake.body[i];
      let nextPart = snake.body[i + 1];
  
      // Calculate normalized distance for current segment
      let d = dist(part.x, part.y, centerX, centerY);
      let normD = d / maxDist;
  
      // Adjust position for curvature illusion
      let adjustX = map(normD, 0, 1, 0, (centerX - part.x) * 0.05);
      let adjustY = map(normD, 0, 1, 0, (centerY - part.y) * 0.05);
  
      let adjustedStartX = part.x + adjustX;
      let adjustedStartY = part.y + adjustY;
      let adjustedEndX = nextPart.x + adjustX;
      let adjustedEndY = nextPart.y + adjustY;
  
      // Check for warp
      if (abs(part.x - nextPart.x) < width + 2 - gridSize && abs(part.y - nextPart.y) < height + 2 - gridSize) {
        // Darken color based on distance
        let opacity = map(normD, 0, 1, 255, 50);
        stroke(160, 32, 240, opacity); // Adjust color and opacity based on distance
        strokeWeight(2); 
  
        // Draw line segment with adjusted positions
        line(adjustedStartX, adjustedStartY, adjustedEndX, adjustedEndY);
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

