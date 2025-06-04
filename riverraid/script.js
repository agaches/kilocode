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

// Sprites (will be loaded)
const playerSprite = new Image();
const shipSprite = new Image();
const planeSprite = new Image();
const helicopterSprite = new Image();
const fuelDepotSprite = new Image();
const bridgeSprite = new Image();
const houseSprite = new Image();

function loadSprites() {
    playerSprite.src = 'assets/player.png'; // Placeholder paths
    shipSprite.src = 'assets/ship.png';
    planeSprite.src = 'assets/plane.png';
    helicopterSprite.src = 'assets/helicopter.png';
    fuelDepotSprite.src = 'assets/fuel_depot.png';
    bridgeSprite.src = 'assets/bridge.png';
    houseSprite.src = 'assets/house.png';
}

// Call loadSprites at the beginning
loadSprites();

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
        if (playerSprite.complete && playerSprite.naturalHeight !== 0) {
            ctx.drawImage(playerSprite, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
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

// Enemy
const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 30;
const ENEMY_SPEED = 2;

class Enemy {
    constructor(x, y, type = 'ship') {
        this.x = x;
        this.y = y;
        this.width = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;
        this.speed = ENEMY_SPEED;
        this.type = type;
        this.toRemove = false;
        this.dx = 0; // Horizontal movement for patrolling
        this.patrolDirection = Math.random() < 0.5 ? 1 : -1; // 1 for right, -1 for left
        this.patrolSpeed = 1; // Speed for patrolling
    }

    draw() {
        let spriteToDraw = null;
        let defaultColor = 'red';

        switch (this.type) {
            case 'ship':
                spriteToDraw = shipSprite;
                defaultColor = 'darkred';
                break;
            case 'plane':
                spriteToDraw = planeSprite;
                defaultColor = 'purple';
                break;
            case 'helicopter':
                spriteToDraw = helicopterSprite;
                defaultColor = 'orange';
                break;
            case 'house':
                spriteToDraw = houseSprite;
                defaultColor = 'gray';
                break;
        }

        if (spriteToDraw && spriteToDraw.complete && spriteToDraw.naturalHeight !== 0) {
            ctx.drawImage(spriteToDraw, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = defaultColor;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update() {
        this.y += this.speed;

        // Patrolling behavior for ships and helicopters
        if (this.type === 'ship' || this.type === 'helicopter') {
            this.x += this.patrolDirection * this.patrolSpeed;

            // Reverse direction if hitting river banks (simplified)
            const riverLeftBank = riverGenerator.currentLeftBankWidth;
            const riverRightBank = GAME_WIDTH - riverGenerator.currentRightBankWidth;

            if (this.x < riverLeftBank) {
                this.x = riverLeftBank;
                this.patrolDirection *= -1;
            } else if (this.x + this.width > riverRightBank) {
                this.x = riverRightBank - this.width;
                this.patrolDirection *= -1;
            }
        } else if (this.type === 'plane') {
            // Planes move consistently in one direction
            this.x += this.patrolDirection * this.patrolSpeed * 1.5; // Planes move a bit faster

            // Wrap around screen if hitting edges
            if (this.patrolDirection === 1 && this.x > GAME_WIDTH) {
                this.x = -this.width;
            } else if (this.patrolDirection === -1 && this.x + this.width < 0) {
                this.x = GAME_WIDTH;
            }
        }
    }
}

// Environment (River banks, bridges, fuel depots)
const RIVER_SPEED = 2; // Speed at which the river scrolls
const RIVER_SEGMENT_HEIGHT = 32; // Each block is 32 lines high
const RIVER_MIN_WIDTH = 100; // Minimum width of the navigable river
const RIVER_MAX_WIDTH = GAME_WIDTH - (2 * 20); // Max width considering some bank space

// River Generation Constants (simplified from assembly for web)
const RIVER_SHAPES = [
    { type: 'straight', minBank: 80, maxBank: 80 },
    { type: 'narrow_left', minBank: 60, maxBank: 100 },
    { type: 'narrow_right', minBank: 100, maxBank: 60 },
    { type: 'curve_left', minBank: 80, maxBank: 120 },
    { type: 'curve_right', minBank: 120, maxBank: 80 },
    { type: 'island_left', minBank: 80, maxBank: 80, island: 'left' },
    { type: 'island_right', minBank: 80, maxBank: 80, island: 'right' },
];

class RiverBank {
    constructor(x, y, width, height, color = 'green') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += RIVER_SPEED;
    }
}

class RiverGenerator {
    constructor() {
        this.currentLeftBankWidth = 80;
        this.currentRightBankWidth = 80;
        this.currentRiverShapeIndex = 0;
        this.segmentCounter = 0;
        this.segmentsPerShape = 16; // Each section is divided into 16 blocks
        this.islandActive = false;
        this.islandSide = null; // 'left' or 'right'
        this.islandWidth = 0;
        this.islandStartSegment = 0;
    }

    generateSegment(y) {
        const segmentElements = [];
        let leftBankWidth = this.currentLeftBankWidth;
        let rightBankWidth = this.currentRightBankWidth;

        // Apply current river shape
        const shape = RIVER_SHAPES[this.currentRiverShapeIndex];

        // Smooth transition between shapes
        if (this.segmentCounter < this.segmentsPerShape / 2) {
            // Transitioning towards new shape
            leftBankWidth = lerp(this.currentLeftBankWidth, shape.minBank, this.segmentCounter / (this.segmentsPerShape / 2));
            rightBankWidth = lerp(this.currentRightBankWidth, shape.maxBank, this.segmentCounter / (this.segmentsPerShape / 2));
        } else {
            // Holding the shape
            leftBankWidth = shape.minBank;
            rightBankWidth = shape.maxBank;
        }

        // Handle islands
        if (shape.island) {
            if (!this.islandActive) {
                this.islandActive = true;
                this.islandSide = shape.island;
                this.islandWidth = 30 + Math.random() * 30; // Random island width
                this.islandStartSegment = this.segmentCounter;
            }
            // Draw island
            if (this.islandSide === 'left') {
                segmentElements.push(new RiverBank(leftBankWidth, y, this.islandWidth, RIVER_SEGMENT_HEIGHT, 'darkgreen'));
                leftBankWidth += this.islandWidth; // Adjust left bank for island
            } else {
                segmentElements.push(new RiverBank(GAME_WIDTH - rightBankWidth - this.islandWidth, y, this.islandWidth, RIVER_SEGMENT_HEIGHT, 'darkgreen'));
                rightBankWidth += this.islandWidth; // Adjust right bank for island
            }
        } else if (this.islandActive && this.segmentCounter > this.islandStartSegment + 5) { // Island fades after 5 segments
            this.islandActive = false;
            this.islandSide = null;
        }


        segmentElements.push(new RiverBank(0, y, leftBankWidth, RIVER_SEGMENT_HEIGHT));
        segmentElements.push(new RiverBank(GAME_WIDTH - rightBankWidth, y, rightBankWidth, RIVER_SEGMENT_HEIGHT));

        this.currentLeftBankWidth = leftBankWidth;
        this.currentRightBankWidth = rightBankWidth;

        this.segmentCounter++;
        if (this.segmentCounter >= this.segmentsPerShape) {
            this.segmentCounter = 0;
            this.currentRiverShapeIndex = Math.floor(Math.random() * RIVER_SHAPES.length);
        }

        return segmentElements;
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
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
        if (fuelDepotSprite.complete && fuelDepotSprite.naturalHeight !== 0) {
            ctx.drawImage(fuelDepotSprite, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'orange';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
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
        if (bridgeSprite.complete && bridgeSprite.naturalHeight !== 0) {
            // Draw the bridge by repeating the segment sprite
            const segmentWidth = bridgeSprite.width;
            for (let i = 0; i < this.width; i += segmentWidth) {
                ctx.drawImage(bridgeSprite, this.x + i, this.y, Math.min(segmentWidth, this.width - i), this.height);
            }
        } else {
            ctx.fillStyle = 'brown';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
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

let riverGenerator; // Instance of RiverGenerator
let lastEnvironmentY = 0; // Tracks the top Y-coordinate of the last generated environment segment
function generateEnvironment() {
    // Generate new segments as long as the top of the generated environment is above the visible screen area.
    while (lastEnvironmentY > -GAME_HEIGHT - RIVER_SEGMENT_HEIGHT) { // Generate slightly beyond the top
        const newY = lastEnvironmentY - RIVER_SEGMENT_HEIGHT; // Calculate the top Y for the new segment

        const segmentElements = riverGenerator.generateSegment(newY);
        environment.push(...segmentElements);

        // Randomly add bridges or fuel depots (only in the navigable river area)
        const currentRiverWidth = GAME_WIDTH - riverGenerator.currentLeftBankWidth - riverGenerator.currentRightBankWidth;
        const riverStartX = riverGenerator.currentLeftBankWidth;

        const random = Math.random();
        if (random < 0.05) { // 5% chance for a bridge
            const bridgeWidth = currentRiverWidth; // Bridge spans full river width
            const bridgeX = riverStartX;
            const bridge = new Bridge(bridgeX, newY + RIVER_SEGMENT_HEIGHT / 2 - 10, bridgeWidth, 20);
            environment.push(bridge);
        } else if (random < 0.1) { // 5% chance for a fuel depot
            const fuelX = riverStartX + Math.random() * (currentRiverWidth - 20);
            const fuelDepot = new FuelDepot(fuelX, newY + RIVER_SEGMENT_HEIGHT / 2 - 10);
            environment.push(fuelDepot);
        }

        lastEnvironmentY = newY; // Update lastEnvironmentY for the next segment
    }
}

let lastEnemyY = 0; // Tracks the top Y-coordinate of the last generated enemy
function generateEnemies() {
    const spawnInterval = RIVER_SEGMENT_HEIGHT * 2; // Spawn an enemy every two river segments
    // Generate new enemies as long as the top of the generated enemies is above the visible screen area.
    while (lastEnemyY > -GAME_HEIGHT - ENEMY_HEIGHT) {
        const newY = lastEnemyY - spawnInterval;

        // Only generate if there's enough space in the river
        const currentRiverWidth = GAME_WIDTH - riverGenerator.currentLeftBankWidth - riverGenerator.currentRightBankWidth;
        const riverStartX = riverGenerator.currentLeftBankWidth;

        if (currentRiverWidth > ENEMY_WIDTH + 20) { // Ensure enough space for enemy + padding
            const random = Math.random();
            let enemyType = null;

            if (random < 0.4) { // 40% chance for a ship
                enemyType = 'ship';
            } else if (random < 0.6) { // 20% chance for a helicopter
                enemyType = 'helicopter';
            } else if (random < 0.7) { // 10% chance for a plane
                enemyType = 'plane';
            } else if (random < 0.8) { // 10% chance for a house (static environment object)
                enemyType = 'house';
            }

            if (enemyType) {
                const enemyX = riverStartX + Math.random() * (currentRiverWidth - ENEMY_WIDTH);
                const enemy = new Enemy(enemyX, newY - ENEMY_HEIGHT, enemyType);
                enemies.push(enemy);
            }
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
    riverGenerator = new RiverGenerator(); // Initialize the river generator
    lastEnvironmentY = 0; // Start generation from the current screen bottom
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