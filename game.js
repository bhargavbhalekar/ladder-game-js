const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let keys = {};
let score = 0;
let isGameOver = false;

// Player setup
const player = {
  x: 72,
  y: 656,
  width: 30,
  height: 40,
  speed: 7,
  vx: 0,
  vy: 0,
  jumping: false,
  force: 8
};

// Platforms
const platforms = [
  { x: 0, y: 736, w: 325, h: 30 },
  { x: 317, y: 656, w: 231, h: 30 },
  { x: 181, y: 581, w: 115, h: 30 },
  { x: 47, y: 501, w: 115, h: 30 },
  { x: 218, y: 397, w: 310, h: 30 },
  { x: 35, y: 300, w: 127, h: 30 },
  { x: 275, y: 142, w: 199, h: 30 },
  { x: 0, y: 67, w: 169, h: 30 },
  { x: 558, y: 581, w: 84, h: 30 }
];

// Coins
let coins = [];
function createCoins() {
  const coinPositions = [
    [275, 98], [317, 98], [360, 98], [401, 98],
    [39, 262], [81, 262], [124, 262],
    [217, 361], [259, 361], [302, 361], [343, 361],
    [448, 361], [489, 361], [417, 361], [384, 361],
    [330, 623], [480, 623], [445, 623], [412, 623], [371, 623], [517, 623],
    [52, 470], [94, 470], [137, 470],
    [201, 550], [244, 550]
  ];
  coins = coinPositions.map(([x, y]) => ({ x, y, size: 25, visible: true }));
}

// Enemies
let enemyOne = { x: 471, y: 361, w: 30, h: 40, speed: -3 };
let enemyTwo = { x: 360, y: 623, w: 30, h: 40, speed: 3 };

// Door
const door = { x: 2, y: 12, w: 42, h: 58 };

// Game loop
function updateGame() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply gravity and jumping
  if (player.jumping) {
    player.vy = -8;
    player.force--;
    if (player.force < 0) player.jumping = false;
  } else {
    player.vy = 10;
  }

  // Horizontal movement
  if (keys["ArrowLeft"]) player.vx = -player.speed;
  else if (keys["ArrowRight"]) player.vx = player.speed;
  else player.vx = 0;

  player.x += player.vx;
  player.y += player.vy;

  // Platform collisions
  platforms.forEach(p => {
    if (
      player.x < p.x + p.w &&
      player.x + player.width > p.x &&
      player.y + player.height < p.y + p.h &&
      player.y + player.height + player.vy >= p.y
    ) {
      player.y = p.y - player.height;
      player.vy = 0;
      player.jumping = false;
      player.force = 8;
    }
  });

  // Coin collection
  coins.forEach(coin => {
    if (coin.visible && collide(player, coin)) {
      coin.visible = false;
      score++;
    }
  });

  // Enemy movement
  enemyOne.x += enemyOne.speed;
  if (enemyOne.x < 218 || enemyOne.x + enemyOne.w > 218 + 310) {
    enemyOne.speed *= -1;
  }

  enemyTwo.x += enemyTwo.speed;
  if (enemyTwo.x < 317 || enemyTwo.x + enemyTwo.w > 317 + 231) {
    enemyTwo.speed *= -1;
  }

  // Enemy collision
  if (collide(player, enemyOne) || collide(player, enemyTwo)) {
    isGameOver = true;
    drawText(`You were killed! Score: ${score}`);
    return;
  }

  // Fall check
  if (player.y > canvas.height) {
    isGameOver = true;
    drawText(`You fell! Score: ${score}`);
    return;
  }

  // Door win check
  if (score === 26 && collide(player, door)) {
    isGameOver = true;
    drawText(`You Win! Score: ${score}`);
    return;
  }

  // Draw objects
  drawPlayer();
  drawPlatforms();
  drawCoins();
  drawEnemies();
  drawDoor();
  drawScore();

  requestAnimationFrame(updateGame);
}

// Utilities
function collide(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.width > b.x &&
    a.y < b.y + b.size &&
    a.y + a.height > b.y
  );
}

function drawPlayer() {
  ctx.fillStyle = "darkblue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = "maroon";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));
}

function drawCoins() {
  ctx.fillStyle = "yellow";
  coins.forEach(c => {
    if (c.visible) ctx.fillRect(c.x, c.y, c.size, c.size);
  });
}

function drawEnemies() {
  ctx.fillStyle = "purple";
  ctx.fillRect(enemyOne.x, enemyOne.y, enemyOne.w, enemyOne.h);
  ctx.fillRect(enemyTwo.x, enemyTwo.y, enemyTwo.w, enemyTwo.h);
}

function drawDoor() {
  ctx.fillStyle = "darkgreen";
  ctx.fillRect(door.x, door.y, door.w, door.h);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Consolas";
  ctx.fillText(`Score: ${score}`, 500, 30);
}

function drawText(text) {
  ctx.fillStyle = "black";
  ctx.font = "30px Consolas";
  ctx.fillText(text, 100, 350);
}

// Controls
document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === " " && !player.jumping) {
    player.jumping = true;
    player.force = 8;
  }
  if (e.key === "Enter" && isGameOver) restartGame();
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

// Restart
function restartGame() {
  player.x = 72;
  player.y = 656;
  player.jumping = false;
  player.force = 8;
  score = 0;
  isGameOver = false;
  createCoins();
  requestAnimationFrame(updateGame);
}

// Start
createCoins();
requestAnimationFrame(updateGame);
