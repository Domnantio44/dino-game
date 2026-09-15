// Game variables
const gameContainer = document.getElementById('gameContainer');
const dinosaur = document.getElementById('dinosaur');
const score = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');

let isJumping = false;
let gameActive = true;
let gameScore = 0;
let gameSpeed = 6;
let obstacles = [];

// Dinosaur jump
document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'ArrowUp') && !isJumping && gameActive) {
        e.preventDefault();
        jump();
    }
});

// Mobile touch support
document.addEventListener('touchstart', () => {
    if (!isJumping && gameActive) {
        jump();
    }
});

function jump() {
    isJumping = true;
    dinosaur.classList.add('jump');
    setTimeout(() => {
        dinosaur.classList.remove('jump');
        isJumping = false;
    }, 600);
}

// Spawn obstacles (trees)
function spawnObstacle() {
    if (!gameActive) return;

    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.innerHTML = `
        <div class="tree">
            <div class="tree-stem"></div>
        </div>
    `;

    obstacle.style.left = gameContainer.offsetWidth + 'px';
    gameContainer.appendChild(obstacle);

    obstacles.push({
        element: obstacle,
        x: gameContainer.offsetWidth
    });
}

// Create clouds
function createClouds() {
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = (40 + Math.random() * 40) + 'px';
        cloud.style.height = '30px';
        cloud.style.left = Math.random() * gameContainer.offsetWidth + 'px';
        cloud.style.top = (30 + Math.random() * 80) + 'px';
        gameContainer.appendChild(cloud);
    }
}

// Check collision
function checkCollision(obstacleRect, dinoRect) {
    return !(obstacleRect.right < dinoRect.left ||
        obstacleRect.left > dinoRect.right ||
        obstacleRect.bottom < dinoRect.top ||
        obstacleRect.top > dinoRect.bottom);
}

// Game loop
function gameLoop() {
    if (!gameActive) return;

    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        obstacles[i].element.style.left = obstacles[i].x + 'px';

        // Collision detection
        const obstacleRect = obstacles[i].element.getBoundingClientRect();
        const dinoRect = dinosaur.getBoundingClientRect();

        if (checkCollision(obstacleRect, dinoRect)) {
            endGame();
            return;
        }

        // Remove obstacle if it's off-screen and add score
        if (obstacles[i].x < -100) {
            obstacles[i].element.remove();
            obstacles.splice(i, 1);
            gameScore += 10;
            score.textContent = 'Score: ' + gameScore;
        }
    }

    // Increase difficulty
    if (gameScore % 100 === 0 && gameScore !== 0) {
        gameSpeed = Math.min(gameSpeed + 0.5, 12);
    }

    requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
    gameActive = false;
    gameOverScreen.style.display = 'block';
    finalScore.textContent = 'Score: ' + gameScore;
}

// Spawn obstacles at intervals
function startSpawning() {
    let spawnRate = 2000;
    const spawnInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(spawnInterval);
        } else {
            spawnObstacle();
            // Increase spawn rate over time
            spawnRate = Math.max(spawnRate - 10, 1000);
        }
    }, spawnRate);
}

// Initialize game
window.addEventListener('load', () => {
    createClouds();
    startSpawning();
    gameLoop();
});
