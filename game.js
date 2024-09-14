// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Constants
const TILE_SIZE = 32;
let ROWS = 31; // Initial maze size (must be odd for maze generation)
let COLS = 41; // Initial maze size (must be odd for maze generation)
canvas.width = COLS * TILE_SIZE;
canvas.height = ROWS * TILE_SIZE + 50; // Extra space for level title

// Game variables
let level = 1;

// Directions for maze generation and movement
const DIRECTIONS = [
  { x: 0, y: -1 }, // Up
  { x: 1, y: 0 }, // Right
  { x: 0, y: 1 }, // Down
  { x: -1, y: 0 }, // Left
];

// Maze array initialization
let maze = [];

// Initialize the maze with walls
function initMaze() {
  maze = [];
  for (let y = 0; y < ROWS; y++) {
    maze[y] = [];
    for (let x = 0; x < COLS; x++) {
      maze[y][x] = 1; // 1 represents a wall
    }
  }
}

// Recursive Backtracking Maze Generation
function generateMaze(x, y) {
  maze[y][x] = 0; // 0 represents a path

  // Shuffle directions to ensure randomness
  const shuffledDirections = DIRECTIONS.sort(() => Math.random() - 0.5);

  for (let dir of shuffledDirections) {
    const nx = x + dir.x * 2;
    const ny = y + dir.y * 2;

    if (
      ny > 0 &&
      ny < ROWS - 1 &&
      nx > 0 &&
      nx < COLS - 1 &&
      maze[ny][nx] === 1
    ) {
      maze[y + dir.y][x + dir.x] = 0; // Remove wall between cells
      generateMaze(nx, ny);
    }
  }
}

// Player object
const player = {
  x: 1, // Starting X position (column)
  y: 1, // Starting Y position (row)
  color: "#FFD700", // Player color (gold)
  moveInterval: 0, // For speed potion effect
  defaultMoveInterval: 0,
  moveCooldown: 0,
  visibilityRadius: 5, // For extended vision potion effect
  defaultVisibilityRadius: 5,
  move(x, y) {
    if (this.moveCooldown > 0) return; // Prevent movement until cooldown ends
    if (maze[this.y + y][this.x + x] !== 1) {
      this.x += x;
      this.y += y;
      this.moveCooldown = this.moveInterval;
    }
  },
  update() {
    if (this.moveCooldown > 0) {
      this.moveCooldown--;
    }
  },
};

// Enemy (Creature) object
const enemy = {
  x: COLS - 2, // Starting position near the exit
  y: ROWS - 2,
  color: "#AA0000", // Enemy color
  moveTimer: 0,
  moveInterval: 30, // Initial speed (higher value = slower movement)
  wandering: true,
  path: [],
  update() {
    this.moveTimer++;
    if (this.moveTimer >= this.moveInterval) {
      this.moveTimer = 0;

      const distanceToPlayer = Math.hypot(this.x - player.x, this.y - player.y);

      if (distanceToPlayer < 6 + level) {
        // Proximity radius increases with level
        this.wandering = false;
        this.findPathToPlayer();
      } else {
        this.wandering = true;
        this.randomWalk();
      }
    }
  },
  randomWalk() {
    // Randomly choose a direction to move
    const possibleDirections = DIRECTIONS.filter((dir) => {
      const nx = this.x + dir.x;
      const ny = this.y + dir.y;
      return ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && maze[ny][nx] === 0;
    });

    if (possibleDirections.length > 0) {
      const dir =
        possibleDirections[
          Math.floor(Math.random() * possibleDirections.length)
        ];
      this.x += dir.x;
      this.y += dir.y;
    }
  },
  findPathToPlayer() {
    // Simple BFS pathfinding
    const queue = [];
    const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    queue.push({ x: this.x, y: this.y, path: [] });
    visited[this.y][this.x] = true;

    while (queue.length > 0) {
      const current = queue.shift();
      if (current.x === player.x && current.y === player.y) {
        this.path = current.path;
        break;
      }

      for (let dir of DIRECTIONS) {
        const nx = current.x + dir.x;
        const ny = current.y + dir.y;

        if (
          ny >= 0 &&
          ny < ROWS &&
          nx >= 0 &&
          nx < COLS &&
          maze[ny][nx] !== 1 &&
          !visited[ny][nx]
        ) {
          visited[ny][nx] = true;
          queue.push({
            x: nx,
            y: ny,
            path: [...current.path, { x: nx, y: ny }],
          });
        }
      }
    }

    // Move towards the player if a path exists
    if (this.path && this.path.length > 0) {
      const nextStep = this.path.shift();
      this.x = nextStep.x;
      this.y = nextStep.y;
    }
  },
};

// Bonuses
const bonuses = {
  extendedVision: null,
  speedPotion: null,
  spawnInterval: 60000, // 1 minute in milliseconds
  lastSpawnTime: 0,
  bonusDuration: 15000, // 15 seconds effect duration
  spawnBonus() {
    const now = Date.now();
    if (now - this.lastSpawnTime >= this.spawnInterval) {
      this.lastSpawnTime = now;

      // Spawn Extended Vision Potion
      this.extendedVision = this.getRandomPosition();
      // Spawn Speed Potion
      this.speedPotion = this.getRandomPosition();
    }
  },
  getRandomPosition() {
    let x, y;
    do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
    } while (maze[y][x] !== 0 || (x === player.x && y === player.y));
    return { x, y };
  },
  drawBonuses() {
    // Draw Extended Vision Potion
    if (this.extendedVision) {
      ctx.fillStyle = "#00FF00"; // Green color
      ctx.fillRect(
        this.extendedVision.x * TILE_SIZE,
        this.extendedVision.y * TILE_SIZE + 50,
        TILE_SIZE,
        TILE_SIZE
      );
    }

    // Draw Speed Potion
    if (this.speedPotion) {
      ctx.fillStyle = "#0000FF"; // Blue color
      ctx.fillRect(
        this.speedPotion.x * TILE_SIZE,
        this.speedPotion.y * TILE_SIZE + 50,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  },
  checkPickup() {
    // Check for Extended Vision Potion
    if (
      this.extendedVision &&
      player.x === this.extendedVision.x &&
      player.y === this.extendedVision.y
    ) {
      this.extendedVision = null;
      player.visibilityRadius = 10; // Increase visibility radius
      setTimeout(() => {
        player.visibilityRadius = player.defaultVisibilityRadius;
      }, this.bonusDuration);
      playSound("bonus.mp3");
    }

    // Check for Speed Potion
    if (
      this.speedPotion &&
      player.x === this.speedPotion.x &&
      player.y === this.speedPotion.y
    ) {
      this.speedPotion = null;
      player.moveInterval = player.defaultMoveInterval - 1; // Decrease move cooldown
      if (player.moveInterval < 0) player.moveInterval = 0;
      setTimeout(() => {
        player.moveInterval = player.defaultMoveInterval;
      }, this.bonusDuration);
      playSound("bonus.mp3");
    }
  },
};

// Function to play sounds
function playSound(src) {
  const sound = new Audio(src);
  sound.play();
}

// Event listener for player movement
document.addEventListener("keydown", (event) => {
  event.preventDefault(); // Prevent arrow keys from scrolling the page

  switch (event.key) {
    case "ArrowUp":
      player.move(0, -1);
      break;
    case "ArrowDown":
      player.move(0, 1);
      break;
    case "ArrowLeft":
      player.move(-1, 0);
      break;
    case "ArrowRight":
      player.move(1, 0);
      break;
  }

  // Check for exit
  if (maze[player.y][player.x] === 2) {
    alert(`You have escaped Level ${level}!`);
    levelUp();
  }
});

// Function to check collisions between player and enemy
function checkCollisions() {
  if (enemy.x === player.x && enemy.y === player.y) {
    alert("You were caught by the creature!");
    resetGame();
  }
}

// Function to draw the maze with limited visibility
function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw Level Title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "24px Arial";
  ctx.fillText(`Level ${level}`, 10, 30);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      // Calculate the distance from the player
      const dx = x - player.x;
      const dy = y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < player.visibilityRadius) {
        // Visibility radius
        switch (maze[y][x]) {
          case 0: // Path
            ctx.fillStyle = "#111";
            break;
          case 1: // Wall
            ctx.fillStyle = "#555";
            break;
          case 2: // Exit
            ctx.fillStyle = "#FF0000";
            break;
        }
      } else {
        ctx.fillStyle = "#000"; // Darkness
      }

      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE + 50, TILE_SIZE, TILE_SIZE);
    }
  }
}

// Function to draw the player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x * TILE_SIZE,
    player.y * TILE_SIZE + 50,
    TILE_SIZE,
    TILE_SIZE
  );
}

// Function to draw the enemy
function drawEnemy() {
  ctx.fillStyle = enemy.color;
  ctx.fillRect(
    enemy.x * TILE_SIZE,
    enemy.y * TILE_SIZE + 50,
    TILE_SIZE,
    TILE_SIZE
  );
}

// Function to reset the game
function resetGame() {
  level = 1;
  initializeGame();
}

// Function to increase the level
function levelUp() {
  level++;
  initializeGame();
}

// Function to initialize or reinitialize the game
function initializeGame() {
  // Increase maze size with each level
  ROWS = 31 + level * 2; // Increase rows (must be odd)
  COLS = 41 + level * 2; // Increase columns (must be odd)

  if (ROWS % 2 === 0) ROWS += 1;
  if (COLS % 2 === 0) COLS += 1;

  canvas.width = COLS * TILE_SIZE;
  canvas.height = ROWS * TILE_SIZE + 50; // Adjust canvas size

  initMaze();
  generateMaze(1, 1);
  placeExit();
  player.x = 1;
  player.y = 1;
  player.visibilityRadius = player.defaultVisibilityRadius;
  player.moveInterval = player.defaultMoveInterval;
  player.moveCooldown = 0;

  enemy.x = COLS - 2;
  enemy.y = ROWS - 2;
  enemy.wandering = true;
  enemy.path = [];

  // Adjust enemy speed and intelligence with each level
  enemy.moveInterval = Math.max(30 - level * 2, 15); // Decrease moveInterval to make enemy faster, minimum 15

  // Reset bonuses
  bonuses.extendedVision = null;
  bonuses.speedPotion = null;
  bonuses.lastSpawnTime = Date.now();
}

// Function to place the exit
function placeExit() {
  maze[ROWS - 2][COLS - 2] = 2; // 2 represents the exit
}

// Game loop
function gameLoop() {
  player.update();
  enemy.update();
  bonuses.spawnBonus();
  drawMaze();
  bonuses.drawBonuses();
  drawPlayer();
  drawEnemy();
  bonuses.checkPickup();
  checkCollisions();
  requestAnimationFrame(gameLoop);
}

// Start the game
initializeGame();
gameLoop();
