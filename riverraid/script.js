const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const fuelDisplay = document.getElementById('fuel');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

// Game State
let gameRunning = false;
let score = 0;
let fuel = 100;
let player;
let bullets = [];
let enemies = [];
let environment = []; // For river banks, bridges, fuel depots

// Player
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 40;
const PLAYER_SPEED = 5;
const PLAYER_BULLET_SPEED = 7;

class Player {
    constructor() {
        this.x = GAME_WIDTH / 2 - PLAYER_WIDTH / 2;
        this.y = GAME_HEIGHT - PLAYER_HEIGHT - 20;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.dx = 0;
        this.isShooting = false;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.dx;

        // Keep player within bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > GAME_WIDTH) this.x = GAME_WIDTH - this.width;

        if (this.isShooting) {
            this.shoot();
        }
    }

    shoot() {
        // Limit bullet frequency
        if (bullets.length * 20 > GAME_HEIGHT) return; // Simple rate limit

        const bullet = new Bullet(this.x + this.width / 2 - 2, this.y, PLAYER_BULLET_SPEED);
        bullets.push(bullet);
    }
}

// Bullet
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;

class Bullet {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
        this.speed = speed;
        this.toRemove = false;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y -= this.speed;
    }
}

// Enemy (placeholder for now)
const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 30;
const ENEMY_SPEED = 2;

class Enemy {
    constructor(x, y, type = 'boat') {
        this.x = x;
        this.y = y;
        this.width = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;
        this.speed = ENEMY_SPEED;
        this.type = type;
        this.toRemove = false;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

// Environment (River banks, bridges, fuel depots)
const RIVER_BANK_WIDTH = 80; // Width of each bank
const RIVER_SPEED = 2;

class RiverBank {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += RIVER_SPEED;
    }
}

class FuelDepot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.toRemove = false;
    }

    draw() {
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += RIVER_SPEED;
    }
}

class Bridge {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = 2; // Bridges can be destroyed
        this.toRemove = false;
    }

    draw() {
        ctx.fillStyle = 'brown';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += RIVER_SPEED;
    }
}


// Game Loop
function gameLoop() {
    if (!gameRunning) return;

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

function update() {
    // Update Player
    player.update();

    // Update Bullets
    bullets = bullets.filter(bullet => {
        bullet.update();
        return bullet.y > 0 && !bullet.toRemove; // Remove bullets off-screen or marked for removal
    });

    // Update Enemies
    enemies = enemies.filter(enemy => {
        enemy.update();
        return enemy.y < GAME_HEIGHT && !enemy.toRemove; // Remove enemies off-screen or marked for removal
    });

    // Update Environment
    environment = environment.filter(item => {
        item.update();
        return item.y < GAME_HEIGHT && !item.toRemove; // Remove off-screen environment items or marked for removal
    });

    // Update last generated Y positions to simulate scrolling
    lastEnvironmentY += RIVER_SPEED;
    lastEnemyY += RIVER_SPEED;

    // Generate new environment elements
    generateEnvironment();
    generateEnemies();


    // Collision Detection
    checkCollisions();

    // Fuel Consumption
    fuel -= 0.01; // Adjust consumption rate
    if (fuel <= 0) {
        fuel = 0;
        gameOver();
    }
    fuelDisplay.textContent = `Fuel: ${Math.floor(fuel)}%`;

    // Update Score
    scoreDisplay.textContent = `Score: ${score}`;
}

function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw Environment
    environment.forEach(item => item.draw());

    // Draw Player
    player.draw();

    // Draw Bullets
    bullets.forEach(bullet => bullet.draw());

    // Draw Enemies
    enemies.forEach(enemy => enemy.draw());
}

let lastEnvironmentY = 0; // Tracks the top Y-coordinate of the last generated environment segment
function generateEnvironment() {
    const segmentHeight = 50;
    // Generate new segments as long as the top of the generated environment is above the visible screen area.
    // We generate until `lastEnvironmentY` is sufficiently negative (e.g., -GAME_HEIGHT) to pre-fill the area above the screen.
    while (lastEnvironmentY > -GAME_HEIGHT) {
        const newY = lastEnvironmentY - segmentHeight; // Calculate the top Y for the new segment

        // Generate river banks
        const leftBank = new RiverBank(0, newY, RIVER_BANK_WIDTH, segmentHeight);
        const rightBank = new RiverBank(GAME_WIDTH - RIVER_BANK_WIDTH, newY, RIVER_BANK_WIDTH, segmentHeight);
        environment.push(leftBank, rightBank);

        // Randomly add bridges or fuel depots
        const random = Math.random();
        if (random < 0.1) { // 10% chance for a bridge
            const bridgeWidth = GAME_WIDTH - (RIVER_BANK_WIDTH * 2);
            const bridge = new Bridge(RIVER_BANK_WIDTH, newY + segmentHeight / 2 - 10, bridgeWidth, 20);
            environment.push(bridge);
        } else if (random < 0.2) { // 10% chance for a fuel depot
            const fuelX = RIVER_BANK_WIDTH + Math.random() * (GAME_WIDTH - RIVER_BANK_WIDTH * 2 - 20);
            const fuelDepot = new FuelDepot(fuelX, newY + segmentHeight / 2 - 10);
            environment.push(fuelDepot);
        }

        lastEnvironmentY = newY; // Update lastEnvironmentY for the next segment
    }
}

let lastEnemyY = 0; // Tracks the top Y-coordinate of the last generated enemy
function generateEnemies() {
    const spawnInterval = 100; // Spacing between enemy generation attempts
    // Generate new enemies as long as the top of the generated enemies is above the visible screen area.
    // We generate until `lastEnemyY` is sufficiently negative (e.g., -GAME_HEIGHT) to pre-fill the area above the screen.
    while (lastEnemyY > -GAME_HEIGHT) { // Generate until we have enough enemies above the screen
        const newY = lastEnemyY - spawnInterval;

        if (Math.random() < 0.3) { // 30% chance to spawn an enemy
            const enemyX = RIVER_BANK_WIDTH + Math.random() * (GAME_WIDTH - RIVER_BANK_WIDTH * 2 - ENEMY_WIDTH);
            const enemy = new Enemy(enemyX, newY - ENEMY_HEIGHT); // Place enemy at the top of the new spawn area
            enemies.push(enemy);
        }
        lastEnemyY = newY; // Update lastEnemyY for the next attempt
    }
}


function checkCollisions() {
    // Player-Environment collisions
    environment.forEach(item => {
        if (
            player.x < item.x + item.width &&
            player.x + player.width > item.x &&
            player.y < item.y + item.height &&
            player.y + player.height > item.y
        ) {
            if (item instanceof RiverBank || item instanceof Bridge) {
                gameOver(); // Crash into banks or bridges
            } else if (item instanceof FuelDepot) {
                fuel = Math.min(100, fuel + 20); // Refuel
                item.toRemove = true; // Mark fuel depot for removal
            }
        }
    });

    // Player-Enemy collisions
    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            gameOver(); // Crash into enemy
        }
    });

    // Bullet-Enemy collisions
    // Create a new array for bullets that survive
    const survivingBullets = [];
    bullets.forEach(bullet => {
        let hitEnemy = false;
        enemies.forEach(enemy => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y &&
                !enemy.toRemove // Only hit enemies not already marked for removal
            ) {
                enemy.toRemove = true; // Mark enemy for removal
                score += 10; // Increase score
                hitEnemy = true; // Bullet hit an enemy, so it should be removed
            }
        });
        if (!hitEnemy) {
            survivingBullets.push(bullet); // Keep bullet if it didn't hit an enemy
        }
    });
    bullets = survivingBullets; // Update bullets array

    // Bullet-Bridge collisions
    // Create a new array for environment items that survive
    const survivingEnvironment = [];
    environment.forEach(item => {
        if (item instanceof Bridge) {
            let hitBridge = false;
            // Check if any surviving bullet hits this bridge
            bullets.forEach(bullet => { // Iterate over the already filtered bullets
                if (
                    bullet.x < item.x + item.width &&
                    bullet.x + bullet.width > item.x &&
                    bullet.y < item.y + item.height &&
                    bullet.y + bullet.height > item.y &&
                    !bullet.toRemove // Only hit bullets not already marked for removal
                ) {
                    item.health--;
                    bullet.toRemove = true; // Mark bullet for removal
                    hitBridge = true;
                    if (item.health <= 0) {
                        item.toRemove = true; // Mark bridge for removal
                        score += 50;
                    }
                }
            });
            if (!item.toRemove) { // Keep bridge if it wasn't destroyed
                survivingEnvironment.push(item);
            }
        } else {
            // Keep other environment items if not marked for removal (e.g., fuel depots)
            if (!item.toRemove) {
                survivingEnvironment.push(item);
            }
        }
    });
    environment = survivingEnvironment; // Update environment array

    // Final filtering for enemies and bullets (bullets might have been marked for removal by bridges)
    enemies = enemies.filter(enemy => !enemy.toRemove);
    bullets = bullets.filter(bullet => !bullet.toRemove);
}


function startGame() {
    gameRunning = true;
    score = 0;
    fuel = 100;
    player = new Player();
    bullets = [];
    enemies = [];
    environment = [];
    lastEnvironmentY = -100; // Initialize to generate elements above the screen
    lastEnemyY = -200; // Initialize to generate enemies above the screen

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    gameLoop();
}

function gameOver() {
    gameRunning = false;
    finalScoreDisplay.textContent = `Final Score: ${score}`;
    gameOverScreen.classList.remove('hidden');
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        player.dx = -PLAYER_SPEED;
    } else if (e.code === 'ArrowRight') {
        player.dx = PLAYER_SPEED;
    } else if (e.code === 'Space') {
        if (!gameRunning) {
            startGame();
        }
        player.isShooting = true;
    }
    // Prevent default behavior for spacebar to avoid scrolling
    if (e.code === 'Space') {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        player.dx = 0;
    } else if (e.code === 'Space') {
        player.isShooting = false;
    }
});

// Initial setup
player = new Player(); // Initialize player for the start screen
draw(); // Draw initial state