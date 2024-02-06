let snakes = [];
let gridSize = 30;
let frameCountSinceLastSpawn = 0; // To prevent immediate spawns
let fps = 40;
let sphereFactor = .97;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  addSnake(); // Initially add one snake
}

function draw() {
  background(0);
  // drawGrid();
  drawPerspectiveGrid();
  snakes.forEach((snake, index) => {
    updateSnake(snake);
    drawSnake(snake);
  });
}

function drawGrid() {
  for (let x = 0; x <= width; x += gridSize) {
    for (let y = 0; y <= height; y += gridSize) {
      let d = dist(x, y, width / 2, height / 2); // Distance from center
      let maxDist = dist(0, 0, width / 2, height / 2);
      let sw = map(d, 0, maxDist, 4, 1); // Larger stroke weight closer to center
      strokeWeight(sw);
      stroke(80);
      line(x, y, x + gridSize, y);
      line(x, y, x, y + gridSize);
    }
  }
}

function drawPerspectiveGrid() {
    let centerX = width / 2;
    let centerY = height / 2;
    let maxDist = dist(0, 0, centerX, centerY);
  
    for (let x = 0; x <= width; x += gridSize) {
      for (let y = 0; y <= height; y += gridSize) {
        let d = dist(x, y, centerX, centerY);
        let perspectiveFactor = map(d, 0, maxDist, 1, sphereFactor); // Adjust for desired effect
        
        // Calculate adjusted positions and sizes
        let adjustedX = lerp(centerX, x, perspectiveFactor);
        let adjustedY = lerp(centerY, y, perspectiveFactor);
        let nextAdjustedX = lerp(centerX, x + gridSize, perspectiveFactor);
        let nextAdjustedY = lerp(centerY, y + gridSize, perspectiveFactor);
  
        // Adjust stroke weight and color based on distance
        strokeWeight(map(d, 0, maxDist, 2, 0.5));
        stroke(255, map(d, 0, maxDist, 255, 50)); // Darker and more transparent with distance
  
        line(adjustedX, adjustedY, nextAdjustedX, adjustedY); // Top edge
        line(adjustedX, adjustedY, adjustedX, nextAdjustedY); // Left edge
      }
    }
}  

function addSnake() {
  let snakeLength = 10; // Length in edges
  let snake = {
    body: [],
    direction: 'right',
    nextDirection: 'right',
    length: snakeLength
  };

  // Starting position in the middle of the canvas
  let startX = round(width / 2 / gridSize) * gridSize;
  let startY = round(height / 2 / gridSize) * gridSize;

  // Populate initial snake body
  for (let i = 0; i < snakeLength; i++) {
    snake.body.push({x: startX - i * gridSize, y: startY});
  }

  snakes.push(snake);
}

function updateSnake(snake) {
    let head = snake.body[0];
    snake.direction = snake.nextDirection;
  
    // Use getDirectionOffset to simplify direction handling
    let offset = getDirectionOffset(snake.direction);
    let newHead = { x: (head.x + offset.x + width) % width, y: (head.y + offset.y + height) % height };
  
    // Add new head and remove the last segment to maintain length
    snake.body.unshift(newHead);
    if (snake.body.length > snake.length) snake.body.pop();
}  

function drawSnake(snake) {
    // Pre-calculate values to be used in loop to improve performance
    const totalLength = snake.body.length - 1;
    for (let i = 0; i < totalLength; i++) {
      let part = snake.body[i];
      let nextPart = snake.body[i + 1];
  
      // Calculate opacity outside the conditional to simplify the drawing command
      let opacity = map(i, 0, totalLength, 255, 50);
      stroke(160, 32, 240, opacity);
      strokeWeight(3);
  
      // Draw line if parts are adjacent (considering grid wrapping)
      if (arePartsAdjacent(part, nextPart)) {
        line(part.x, part.y, nextPart.x, nextPart.y);
      }
    }
}
  
function arePartsAdjacent(part, nextPart) {
    // Check if parts are adjacent, considering wrapping
    return abs(part.x - nextPart.x) < gridSize * 1.5 && abs(part.y - nextPart.y) < gridSize * 1.5;
}
  

function getDirectionOffset(direction) {
    const offsets = {
      'right': {x: gridSize, y: 0},
      'down': {x: 0, y: gridSize},
      'left': {x: -gridSize, y: 0},
      'up': {x: 0, y: -gridSize}
    };
    return offsets[direction] || {x: 0, y: 0};
}  

function keyPressed() {
    // Direct control for the first snake
    if (snakes.length > 0) {
      let snake = snakes[0];
      if (keyCode === RIGHT_ARROW && snake.direction !== 'left') snake.nextDirection = 'right';
      if (keyCode === DOWN_ARROW && snake.direction !== 'up') snake.nextDirection = 'down';
      if (keyCode === LEFT_ARROW && snake.direction !== 'right') snake.nextDirection = 'left';
      if (keyCode === UP_ARROW && snake.direction !== 'down') snake.nextDirection = 'up';
    }
  
    // Tank controls for the rest of the snakes
    for (let i = 1; i < snakes.length; i++) {
      let snake = snakes[i];
      if (keyCode === 32) { // Space bar for a new snake, handled globally
        continue; // Skip to the next iteration to avoid affecting direction logic
      } else {
        // Rotate the snake based on its current direction
        rotateSnake(snake, keyCode);
      }
    }
  
    if (keyCode === 32 && frameCount - frameCountSinceLastSpawn > 10) { // Space bar
      addSnake();
      frameCountSinceLastSpawn = frameCount;
    }
  }
  
  function rotateSnake(snake, key) {
    const directions = ['right', 'down', 'left', 'up'];
    let currentDirectionIndex = directions.indexOf(snake.direction);
    if (key === RIGHT_ARROW) {
      // Rotate right
      snake.nextDirection = directions[(currentDirectionIndex + 1) % directions.length];
    } else if (key === LEFT_ARROW) {
      // Rotate left
      snake.nextDirection = directions[(currentDirectionIndex - 1 + directions.length) % directions.length];
    }
}