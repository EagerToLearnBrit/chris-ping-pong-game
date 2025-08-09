const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 12, paddleHeight = 100;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
const ballSize = 14;
let ballX = canvas.width / 2 - ballSize / 2, ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 5, ballSpeedY = 3;
let playerScore = 0, aiScore = 0;

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  ballSpeedX = (Math.random() > 0.5 ? 5 : -5);
  ballSpeedY = (Math.random() > 0.5 ? 3 : -3);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Center line
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
  // Paddles
  drawRect(0, playerY, paddleWidth, paddleHeight, "#0ff");
  drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, "#ff0");
  // Ball
  drawCircle(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, "#fff");
}

function update() {
  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  // Top/bottom collision
  if (ballY < 0 || ballY + ballSize > canvas.height) ballSpeedY = -ballSpeedY;
  // Left paddle collision
  if (
    ballX < paddleWidth &&
    ballY + ballSize > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = paddleWidth;
  }
  // Right paddle collision
  if (
    ballX + ballSize > canvas.width - paddleWidth &&
    ballY + ballSize > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width - paddleWidth - ballSize;
  }
  // Score check
  if (ballX < 0) {
    aiScore++;
    document.getElementById('aiScore').textContent = aiScore;
    resetBall();
  }
  if (ballX + ballSize > canvas.width) {
    playerScore++;
    document.getElementById('playerScore').textContent = playerScore;
    resetBall();
  }
  // AI paddle follows ball
  let aiCenter = aiY + paddleHeight / 2;
  if (aiCenter < ballY + ballSize / 2) aiY += 4;
  else if (aiCenter > ballY + ballSize / 2) aiY -= 4;
  aiY = Math.max(Math.min(aiY, canvas.height - paddleHeight), 0);
}

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - paddleHeight / 2;
  playerY = Math.max(Math.min(playerY, canvas.height - paddleHeight), 0);
});

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

resetBall();
gameLoop();
