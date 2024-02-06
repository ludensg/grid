let snakes = [];
let gridSize = 30;
let frameCountSinceLastSpawn = 0; // To prevent immediate spawns
let fps = 23;
let sphereFactor = .94;
let AGENCY_TIME = 2500; // e.g., 2000 milliseconds of controlled movement

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(fps);
  for (let i = 0; i < 15; i++) {
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

let lastFrameTime = 0;

function draw() {
  let currentTime = millis();
  let deltaTime = currentTime - lastFrameTime;
  lastFrameTime = currentTime;

  // Use deltaTime to adjust the snake's control time left


  background(0);
  for (let i = 1; i <= 2; i ++) {
    strokeVar = i * 5;
   drawGrid(strokeVar);
  }

  drawPerspectiveGrid();

  snakes.forEach((snake, index) => {
    if (snake.isControlled) {
      snake.controlTimeLeft -= deltaTime;
      if (snake.controlTimeLeft <= 0) {
        snake.isControlled = false; // Exit controlled movement mode
        // Optionally, immediately change direction to simulate resuming random movement
        updateSnakeDirection(snake);
      }
    } else {
      // Update direction randomly only if not in controlled movement
      updateSnakeDirection(snake);
    }

    updateSnake(snake);
    drawSnake(snake);
  });
}

function drawGrid(strokeVar) {
  for (let x = 0; x <= width + strokeVar; x += gridSize + strokeVar) {
    for (let y = 0; y <= height + strokeVar; y += gridSize) {
      let d = dist(x, y, width / 2, height / 2); // Distance from center
      let maxDist = dist(0, 0, width / 2, height / 2);
      let sw = map(d, 0, maxDist, 4, 1); // Larger stroke weight closer to center
      strokeWeight(sw);
      stroke(strokeVar * .8);
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
  let directions = ['right', 'down', 'left', 'up']; // Array of possible directions
  // Generate a random index to select a direction
  let directionIndex = Math.floor(Math.random() * directions.length);

  let snakeLength = Math.floor(Math.random() * (40 - 8 + 1)) + 8; // Length in edges
  let generalOpacity = Math.floor(Math.random() * (255 - 50 + 1)) + 50;
  let snake = {
    body: [],
    direction: directions[directionIndex],
    nextDirection: directions[directionIndex],
    length: snakeLength,
    opacity: generalOpacity,
    isControlled: false,
    controlTimeLeft: 0, // Time left in controlled movement mode
  };

  // Randomize starting position within the canvas
  let startX = Math.floor(Math.random() * (width / gridSize)) * gridSize;
  let startY = Math.floor(Math.random() * (height / gridSize)) * gridSize;

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
      let opacity = map(i, 0, totalLength, 255, 50) * (snake.opacity / 255); // Adjust opacity based on snake's general opacity
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

function updateSnakeDirection(snake) {
  if (snake.isControlled) return;

  // Decide randomly if the direction should change
  // This is a simplistic approach; consider more complex conditions for fun behaviors
  if (Math.random() < 0.3) { // 30% chance to change direction
    let possibleDirections = ['right', 'down', 'left', 'up'];
    let currentIndex = possibleDirections.indexOf(snake.direction);
    let nextIndex = (currentIndex + Math.floor(Math.random() * 2) + 1) % 4; // Avoid the immediate reversal
    snake.nextDirection = possibleDirections[nextIndex];
  }
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
    // Direct control for the first snake and multiples of 3
    // Tank controls for the rest of the snakes
    for (let i = 0; i < snakes.length; i++) {
      let snake = snakes[i];
      if(i == 0 || i % 3 == 0)
      {
        if (keyCode === RIGHT_ARROW && snake.direction !== 'left') { snake.nextDirection = 'right'; handleAgency(snake); }
        if (keyCode === DOWN_ARROW && snake.direction !== 'up') { snake.nextDirection = 'down'; handleAgency(snake); }
        if (keyCode === LEFT_ARROW && snake.direction !== 'right') { snake.nextDirection = 'left'; handleAgency(snake); }
        if (keyCode === UP_ARROW && snake.direction !== 'down') { snake.nextDirection = 'up'; handleAgency(snake); }
      }
      else {
        if (keyCode === 32) { // Space bar for a new snake, handled globally
          continue; // Skip to the next iteration to avoid affecting direction logic
        } else {
          // Rotate the snake based on its current direction
          rotateSnake(snake, keyCode);
        }
      }
    }
  
    if (keyCode === 32 && frameCount - frameCountSinceLastSpawn > 10) { // Space bar
      addSnake();
      frameCountSinceLastSpawn = frameCount;
    }
  }

function handleAgency(snake) {
  snake.isControlled = true;
  snake.controlTimeLeft = AGENCY_TIME;
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