const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;

const TILE_TYPES = {
    GRASS: { name: 'Grass', class: 'grass', yields: { food: 2, production: 0, gold: 0 } },
    FOREST: { name: 'Forest', class: 'forest', yields: { food: 1, production: 1, gold: 0 } },
    MOUNTAIN: { name: 'Mountain', class: 'mountain', yields: { food: 0, production: 2, gold: 0 } },
    WATER: { name: 'Water', class: 'water', yields: { food: 1, production: 0, gold: 1 } }, // Water can provide food and gold (fishing/trade)
    DESERT: { name: 'Desert', class: 'desert', yields: { food: 0, production: 0, gold: 1 } }
};

const RESOURCES = {
    GOLD: { name: 'Gold', class: 'resource-gold' },
    FOOD: { name: 'Food', class: 'resource-food' },
    PRODUCTION: { name: 'Production', class: 'resource-production' }
};

const IMPROVEMENTS = {
    FARM: { name: 'Farm', class: 'farm', yields: { food: 1, production: 0, gold: 0 } },
    MINE: { name: 'Mine', class: 'mine', yields: { food: 0, production: 1, gold: 0 } },
    ROAD: { name: 'Road', class: 'road', yields: { food: 0, production: 0, gold: 0 } } // Roads don't directly yield, but provide movement bonus
};

function getRandomTileType() {
    const types = Object.values(TILE_TYPES);
    return types[Math.floor(Math.random() * types.length)];
}

function getRandomResource() {
    const resources = Object.values(RESOURCES);
    // 50% chance of no resource
    if (Math.random() < 0.5) {
        return null;
    }
    return resources[Math.floor(Math.random() * resources.length)];
}

function isAdjacent(x1, y1, x2, y2) {
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    return (dx <= 1 && dy <= 1) && (dx !== 0 || dy !== 0); // Must be within 1 unit in x and y, and not the same tile
}

let selectedUnit = null;

function handleTileClick(event) {
    const clickedTile = event.currentTarget;
    const x = parseInt(clickedTile.dataset.x);
    const y = parseInt(clickedTile.dataset.y);

    if (selectedUnit) {
        const targetUnit = playerUnits.find(unit => unit.x === x && unit.y === y && unit !== selectedUnit);

        if (targetUnit && isAdjacent(selectedUnit.x, selectedUnit.y, x, y)) {
            // Prevent friendly fire: player units cannot attack other player units
            if (selectedUnit.isPlayerUnit && targetUnit.isPlayerUnit) {
                addGameMessage("Friendly fire is not allowed!");
                selectedUnit.element.classList.remove('selected');
                selectedUnit = null;
                return;
            }
            // If there's a target unit on an adjacent tile, attack it
            selectedUnit.attack(targetUnit);
        } else if (selectedUnit.moves > 0) {
            // Attempt to move the selected unit
            if (isAdjacent(selectedUnit.x, selectedUnit.y, x, y)) {
                selectedUnit.moveTo(x, y);
                selectedUnit.element.classList.remove('selected');
                selectedUnit = null;
            } else {
                addGameMessage("Invalid move: Units can only move to adjacent tiles.");
                // Keep the unit selected for another attempt
            }
        } else {
            // Unit has no moves left, deselect it
            selectedUnit.element.classList.remove('selected');
            selectedUnit = null;
        }
    } else {
        // Unit selection logic
        // Only allow selecting player units
        const unitOnTile = playerUnits.find(unit => unit.x === x && unit.y === y && unit.isPlayerUnit);
        if (unitOnTile) {
            selectedUnit = unitOnTile;
            selectedUnit.element.classList.add('selected');
        }
    }
}

function handleKeyPress(event) {
    if (event.key === 'b' || event.key === 'B') {
        if (selectedUnit && selectedUnit.type === 'settler') {
            const currentTile = document.querySelector(`.tile[data-x="${selectedUnit.x}"][data-y="${selectedUnit.y}"]`);
            const existingCity = playerCities.find(city => city.x === selectedUnit.x && city.y === selectedUnit.y);
            const isGrass = currentTile.classList.contains('grass');

            if (!existingCity && isGrass) {
                const cityName = getCityName();
                const newCity = new City(selectedUnit.x, selectedUnit.y, cityName);
                playerCities.push(newCity);
                currentTile.appendChild(newCity.element);

                selectedUnit.element.remove();
                playerUnits = playerUnits.filter(unit => unit !== selectedUnit);
                selectedUnit = null;
                addGameMessage(`City '${cityName}' founded at (${newCity.x}, ${newCity.y})!`, 'important');
            } else {
                selectedUnit.element.classList.remove('selected');
                selectedUnit = null;
                addGameMessage("Cannot found city here: either not grass or city already exists.");
            }
        }
    } else if (event.key === 's' || event.key === 'S') { // 'S' for Sleep/Skip turn
        if (selectedUnit) {
            selectedUnit.moves = 0; // Mark unit as having no moves left
            selectedUnit.element.classList.add('no-moves');
            selectedUnit.element.classList.remove('selected');
            selectedUnit = null;
            addGameMessage("Unit put to sleep.");
        }
    } else if (event.key === 'd' || event.key === 'D') { // 'D' for Delete unit
        if (selectedUnit) {
            selectedUnit.element.remove();
            playerUnits = playerUnits.filter(unit => unit !== selectedUnit);
            selectedUnit = null;
            addGameMessage("Unit deleted.");
        }
    } else if (event.key === 'w' || event.key === 'W') { // 'W' for Worker action (e.g., clear forest)
        if (selectedUnit && selectedUnit.type === 'worker') {
            const currentTile = document.querySelector(`.tile[data-x="${selectedUnit.x}"][data-y="${selectedUnit.y}"]`);
            if (currentTile.classList.contains('forest')) {
                currentTile.classList.remove('forest');
                currentTile.classList.add('grass');
                // Update the tile's title to reflect the new type
                const tileType = TILE_TYPES.GRASS;
                currentTile.title = tileType.name;
                if (currentTile.classList.contains('resource-gold')) currentTile.title += `\nResource: Gold`;
                if (currentTile.classList.contains('resource-food')) currentTile.title += `\nResource: Food`;
                if (currentTile.classList.contains('resource-production')) currentTile.title += `\nResource: Production`;

                selectedUnit.moves = 0; // Action consumes all moves
                selectedUnit.element.classList.add('no-moves');
                selectedUnit.element.classList.remove('selected');
                selectedUnit = null;
                addGameMessage(`Worker cleared forest at (${currentTile.dataset.x}, ${currentTile.dataset.y})!`, 'important');
            } else {
                addGameMessage("Worker can only clear forest tiles.");
            }
        }
    } else if (event.key === 'f' || event.key === 'F') { // 'F' for Farm (worker action)
        if (selectedUnit && selectedUnit.type === 'worker') {
            const currentTile = document.querySelector(`.tile[data-x="${selectedUnit.x}"][data-y="${selectedUnit.y}"]`);
            // Check if Agriculture is researched and tile is grass and not already improved
            if (TECHNOLOGIES.Agriculture.researched && currentTile.classList.contains('grass') && !currentTile.classList.contains('farm')) {
                currentTile.classList.add('farm');
                currentTile.title += `\nImprovement: Farm (+1 Food)`; // Add farm info to tooltip
                selectedUnit.moves = 0;
                selectedUnit.element.classList.add('no-moves');
                selectedUnit.element.classList.remove('selected');
                selectedUnit = null;
                addGameMessage(`Worker built a farm at (${currentTile.dataset.x}, ${currentTile.dataset.y})!`, 'important');
            } else {
                addGameMessage("Cannot build farm here: Requires Agriculture technology, a grass tile, and no existing improvement.");
            }
        }
    } else if (event.key === 'm' || event.key === 'M') { // 'M' for Mine (worker action)
        if (selectedUnit && selectedUnit.type === 'worker') {
            const currentTile = document.querySelector(`.tile[data-x="${selectedUnit.x}"][data-y="${selectedUnit.y}"]`);
            // Check if Mining is researched and tile is mountain and not already improved
            if (TECHNOLOGIES.Mining.researched && currentTile.classList.contains('mountain') && !currentTile.classList.contains('mine')) {
                currentTile.classList.add('mine');
                currentTile.title += `\nImprovement: Mine (+1 Production)`; // Add mine info to tooltip
                selectedUnit.moves = 0;
                selectedUnit.element.classList.add('no-moves');
                selectedUnit.element.classList.remove('selected');
                selectedUnit = null;
                addGameMessage(`Worker built a mine at (${currentTile.dataset.x}, ${currentTile.dataset.y})!`, 'important');
            } else {
                addGameMessage("Cannot build mine here: Requires Mining technology, a mountain tile, and no existing improvement.");
            }
        }
    } else if (event.key === 'r' || event.key === 'R') { // 'R' for Road (worker action)
        if (selectedUnit && selectedUnit.type === 'worker') {
            const currentTile = document.querySelector(`.tile[data-x="${selectedUnit.x}"][data-y="${selectedUnit.y}"]`);
            // Roads can be built on any land tile, not on water, and not if already a road
            if (!currentTile.classList.contains('water') && !currentTile.classList.contains('road')) {
                currentTile.classList.add('road');
                currentTile.title += `\nImprovement: Road`; // Add road info to tooltip
                selectedUnit.moves = 0;
                selectedUnit.element.classList.add('no-moves');
                selectedUnit.element.classList.remove('selected');
                selectedUnit = null;
                addGameMessage(`Worker built a road at (${currentTile.dataset.x}, ${currentTile.dataset.y})!`, 'important');
            } else {
                addGameMessage("Cannot build road here: Roads cannot be built on water or existing roads.");
            }
        }
    }
}

function generateMap() {
    const gameMap = document.getElementById('game-map');
    gameMap.style.gridTemplateColumns = `repeat(${MAP_WIDTH}, 1fr)`;
    gameMap.style.gridTemplateRows = `repeat(${MAP_HEIGHT}, 1fr)`;

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tileType = getRandomTileType();
            const resource = getRandomResource();

            const tileDiv = document.createElement('div');
            tileDiv.classList.add('tile', tileType.class);
            tileDiv.dataset.x = x;
            tileDiv.dataset.y = y;
            tileDiv.title = tileType.name; // Tooltip for tile type
            tileDiv.addEventListener('click', handleTileClick); // Add click listener

            if (resource) {
                tileDiv.classList.add(resource.class);
                tileDiv.title += `\nResource: ${resource.name}`; // Add resource to tooltip
            }
            gameMap.appendChild(tileDiv);
        }
    }
}

class Unit {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // e.g., 'settler', 'warrior', 'barbarian'
        this.moves = 1; // Units start with 1 move per turn
        this.strength = (type === 'warrior') ? 10 : (type === 'barbarian' ? 8 : 0); // Warrior and Barbarian have strength
        this.health = 100; // All units start with 100 health
        this.isPlayerUnit = (type === 'settler' || type === 'warrior' || type === 'worker'); // Flag to distinguish player units
        this.element = this.createUnitElement();
        this.updateTooltip();
    }

    createUnitElement() {
        const unitDiv = document.createElement('div');
        unitDiv.classList.add('unit', `unit-${this.type}`);
        unitDiv.dataset.x = this.x;
        unitDiv.dataset.y = this.y;

        const hpSpan = document.createElement('span');
        hpSpan.classList.add('unit-hp');
        unitDiv.appendChild(hpSpan);

        return unitDiv;
    }

    updateTooltip() {
        this.element.title = `Unit: ${this.type}\nHealth: ${this.health}\nStrength: ${this.strength}\nMoves: ${this.moves}`;
        const hpSpan = this.element.querySelector('.unit-hp');
        if (hpSpan) {
            hpSpan.textContent = `${this.health}`;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
        this.updateTooltip();
    }

    die() {
        this.element.remove();
        playerUnits = playerUnits.filter(unit => unit !== this);
        if (selectedUnit === this) {
            selectedUnit = null; // Deselect if the dying unit was selected
        }
        addGameMessage(`${this.type} at (${this.x}, ${this.y}) was destroyed!`, 'important');
    }

    attack(targetUnit) {
        if (this.moves > 0) {
            addGameMessage(`${this.type} at (${this.x}, ${this.y}) attacks ${targetUnit.type} at (${targetUnit.x}, ${targetUnit.y})!`);
            targetUnit.takeDamage(this.strength);
            this.moves = 0; // Attacking consumes all moves
            this.element.classList.add('no-moves');
            this.element.classList.remove('selected');
            selectedUnit = null;
        } else {
            addGameMessage(`${this.type} has no moves left to attack.`);
        }
    }

    moveTo(newX, newY) {
        if (this.moves > 0) {
            this.x = newX;
            this.y = newY;
            this.element.dataset.x = newX;
            this.element.dataset.y = newY;
            const targetTile = document.querySelector(`.tile[data-x="${newX}"][data-y="${newY}"]`);
            if (targetTile) {
                targetTile.appendChild(this.element);
            }
            this.moves--; // Decrement moves after successful movement
            if (this.moves === 0) {
                this.element.classList.add('no-moves'); // Add class for visual feedback
            }
            this.updateTooltip();
        }
    }
}

let playerUnits = [];

class City {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.population = 1;
        this.food = 0;
        this.production = 0; // Accumulated production for the turn
        this.gold = 0;
        this.currentProductionItem = null; // e.g., { type: 'unit', name: 'warrior', cost: 50 }
        this.productionProgress = 0;
        this.element = this.createCityElement();
        this.updateTooltip();
    }

    createCityElement() {
        const cityDiv = document.createElement('div');
        cityDiv.classList.add('city');
        cityDiv.dataset.x = this.x;
        cityDiv.dataset.y = this.y;
        cityDiv.textContent = this.name.substring(0, 1); // Display first letter of city name
        cityDiv.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent tile click from firing
            showCityInfo(this);
        });
        return cityDiv;
    }

    updateTooltip() {
        let tooltip = `City: ${this.name}\nPopulation: ${this.population}\nFood: ${this.food}\nProduction: ${this.production}\nGold: ${this.gold}`;
        if (this.currentProductionItem) {
            tooltip += `\nBuilding: ${this.currentProductionItem.name} (${this.productionProgress}/${this.currentProductionItem.cost})`;
        }
        this.element.title = tooltip;
    }

    produce() {
        let totalFood = 0;
        let totalProduction = 0;
        let totalGold = 0;

        // City works its own tile and adjacent tiles (3x3 area)
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const tileX = this.x + dx;
                const tileY = this.y + dy;

                // Check if tile is within map bounds
                if (tileX >= 0 && tileX < MAP_WIDTH && tileY >= 0 && tileY < MAP_HEIGHT) {
                    const yields = this.getTileYields(tileX, tileY);
                    totalFood += yields.food;
                    totalProduction += yields.production;
                    totalGold += yields.gold;
                }
            }
        }

        this.food += totalFood;
        this.gold += totalGold; // Gold is accumulated directly

        // Production logic
        if (this.currentProductionItem) {
            this.productionProgress += totalProduction; // Add current turn's production to progress
            addGameMessage(`${this.name} is building ${this.currentProductionItem.name}. Progress: ${this.productionProgress}/${this.currentProductionItem.cost}`);

            if (this.productionProgress >= this.currentProductionItem.cost) {
                addGameMessage(`${this.name} finished building a ${this.currentProductionItem.name}!`, 'important');
                this.completeProduction();
            }
        } else {
            this.production += totalProduction; // If nothing is being built, accumulate production
        }

        // Population growth logic
        if (this.food >= 10) { // Needs 10 food to grow population
            this.population++;
            this.food = 0; // Reset food after growth
            addGameMessage(`${this.name} population grew to ${this.population}!`);
        }
        this.updateTooltip();
    }

    getTileYields(tileX, tileY) {
        const tileDiv = document.querySelector(`.tile[data-x="${tileX}"][data-y="${tileY}"]`);
        if (!tileDiv) return { food: 0, production: 0, gold: 0 };

        const tileTypeClass = Array.from(tileDiv.classList).find(cls => Object.values(TILE_TYPES).some(type => type.class === cls));
        const tileType = Object.values(TILE_TYPES).find(type => type.class === tileTypeClass);

        let food = tileType.yields.food || 0;
        let production = tileType.yields.production || 0;
        let gold = tileType.yields.gold || 0;

        // Apply improvement yields
        if (tileDiv.classList.contains('farm')) {
            food += IMPROVEMENTS.FARM.yields.food;
            production += IMPROVEMENTS.FARM.yields.production;
            gold += IMPROVEMENTS.FARM.yields.gold;
        }
        if (tileDiv.classList.contains('mine')) {
            food += IMPROVEMENTS.MINE.yields.food;
            production += IMPROVEMENTS.MINE.yields.production;
            gold += IMPROVEMENTS.MINE.yields.gold;
        }
        // Roads don't add yields directly, but could affect movement cost later
        // if (tileDiv.classList.contains('road')) { /* future movement logic */ }

        return { food, production, gold };
    }

    completeProduction() {
        if (!this.currentProductionItem) return;

        const { type, name } = this.currentProductionItem;
        const cityTile = document.querySelector(`.tile[data-x="${this.x}"][data-y="${this.y}"]`);

        if (type === 'unit') {
            let newUnit;
            if (name === 'warrior') {
                newUnit = new Unit(this.x, this.y, 'warrior');
            } else if (name === 'settler') {
                newUnit = new Unit(this.x, this.y, 'settler');
            } else if (name === 'worker') {
                newUnit = new Unit(this.x, this.y, 'worker');
            }

            if (newUnit) {
                playerUnits.push(newUnit);
                if (cityTile) {
                    cityTile.appendChild(newUnit.element);
                }
            }
        }
        // Carry over excess production
        const excessProduction = this.productionProgress - this.currentProductionItem.cost;
        this.production += excessProduction; // Add excess to general production pool

        // Reset production queue
        this.currentProductionItem = null;
        this.productionProgress = 0;
        this.updateTooltip();
        showCityInfo(this); // Refresh city info panel
    }
}

let playerCities = [];

function getCityName() {
    const cityNames = ["Rome", "Babylon", "Thebes", "Athens", "Carthage", "Persia", "Byzantium", "Alexandria", "Sparta", "Jerusalem"];
    return cityNames[Math.floor(Math.random() * cityNames.length)];
}

function placeInitialUnits() {
    // Place a settler unit at a random grass tile
    const grassTiles = document.querySelectorAll('.tile.grass');
    if (grassTiles.length > 0) {
        const randomGrassTile = grassTiles[Math.floor(Math.random() * grassTiles.length)];
        const x = parseInt(randomGrassTile.dataset.x);
        const y = parseInt(randomGrassTile.dataset.y);
        const settler = new Unit(x, y, 'settler');
        playerUnits.push(settler);
        randomGrassTile.appendChild(settler.element);
        selectedUnit = settler; // Automatically select the settler
        settler.element.classList.add('selected');
    }
}

let currentTurn = 1;
const VICTORY_CITIES_REQUIRED = 3; // Number of cities required for victory

const TECHNOLOGIES = {
    "Agriculture": {
        cost: 20,
        researched: false,
        unlocks: ["Pottery"],
        description: "Unlocks ability to improve food production."
    },
    "Pottery": {
        cost: 30,
        researched: false,
        prerequisites: ["Agriculture"],
        unlocks: [],
        description: "Unlocks ability to build Granary in cities."
    },
    "Mining": {
        cost: 25,
        researched: false,
        unlocks: [],
        description: "Unlocks ability to improve production on hills."
    }
    // Add more technologies here
};

let currentResearch = null;
let researchProgress = 0;

function updateTurnDisplay() {
    document.getElementById('turn-counter').textContent = currentTurn;
}

function updateTechPanel() {
    const techList = document.getElementById('tech-list');
    techList.innerHTML = ''; // Clear existing list

    for (const techName in TECHNOLOGIES) {
        const tech = TECHNOLOGIES[techName];
        const li = document.createElement('li');
        li.textContent = `${techName} (Cost: ${tech.cost} Production)`;

        if (tech.researched) {
            li.classList.add('researched');
            li.textContent += ' - Researched';
        } else if (currentResearch === techName) {
            li.classList.add('researching');
            li.textContent += ` - Researching (${researchProgress}/${tech.cost})`;
        } else {
            const researchBtn = document.createElement('button');
            researchBtn.textContent = 'Research';
            researchBtn.onclick = () => startResearch(techName);

            // Check prerequisites
            const canResearch = tech.prerequisites ? tech.prerequisites.every(pre => TECHNOLOGIES[pre].researched) : true;
            if (!canResearch) {
                researchBtn.disabled = true;
                researchBtn.title = `Requires: ${tech.prerequisites.join(', ')}`;
            }
            if (currentResearch) { // Cannot research if already researching something
                researchBtn.disabled = true;
            }
            li.appendChild(researchBtn);
        }
        techList.appendChild(li);
    }
}

function startResearch(techName) {
    if (currentResearch) {
        addGameMessage(`Already researching ${currentResearch}.`, 'important');
        return;
    }
    const tech = TECHNOLOGIES[techName];
    const canResearch = tech.prerequisites ? tech.prerequisites.every(pre => TECHNOLOGIES[pre].researched) : true;

    if (!tech.researched && canResearch) {
        currentResearch = techName;
        researchProgress = 0;
        addGameMessage(`Started researching ${techName}.`, 'important');
        updateTechPanel();
    } else if (tech.researched) {
        addGameMessage(`${techName} already researched.`, 'important');
    } else {
        addGameMessage(`Cannot research ${techName}. Missing prerequisites: ${tech.prerequisites.filter(pre => !TECHNOLOGIES[pre].researched).join(', ')}.`, 'important');
    }
}

function showTechPanel() {
    updateTechPanel();
    document.getElementById('tech-panel').classList.remove('hidden');
}

function hideTechPanel() {
    document.getElementById('tech-panel').classList.add('hidden');
}

function checkGameEndConditions() {
    // Victory condition: Player has enough cities
    if (playerCities.length >= VICTORY_CITIES_REQUIRED) {
        showVictoryScreen(`You have founded ${VICTORY_CITIES_REQUIRED} cities!`);
        return true;
    }

    // Defeat condition: No player units and no player cities
    if (playerUnits.filter(unit => unit.isPlayerUnit).length === 0 && playerCities.length === 0) {
        addGameMessage("Defeat! All your units and cities have been destroyed.", 'defeat');
        // Optionally, disable further game interaction
        document.getElementById('next-turn-btn').disabled = true;
        document.removeEventListener('keydown', handleKeyPress);
        return true;
    }
    return false;
}

function nextTurn() {
    currentTurn++;
    updateTurnDisplay();

    // Advance research
    if (currentResearch) {
        // Sum production from all cities for research
        const totalResearchProduction = playerCities.reduce((sum, city) => sum + city.production, 0);
        researchProgress += totalResearchProduction;
        addGameMessage(`Researching ${currentResearch}: +${totalResearchProduction} production. Progress: ${researchProgress}/${TECHNOLOGIES[currentResearch].cost}`);

        if (researchProgress >= TECHNOLOGIES[currentResearch].cost) {
            TECHNOLOGIES[currentResearch].researched = true;
            addGameMessage(`Technology "${currentResearch}" researched!`, 'victory');
            // Apply unlocks here (e.g., enable new unit builds, tile improvements)
            currentResearch = null;
            researchProgress = 0;
        }
    }

    // Process cities
    playerCities.forEach(city => {
        city.produce();
    });

    // Process units (player and AI)
    playerUnits.forEach(unit => {
        if (unit.moves > 0) {
            let attacked = false;
            // Check for adjacent enemy units to attack
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const targetX = unit.x + dx;
                    const targetY = unit.y + dy;

                    const targetUnit = playerUnits.find(otherUnit => otherUnit.x === targetX && otherUnit.y === targetY && otherUnit !== unit);
                    if (targetUnit) {
                        // Player unit attacks barbarian, or barbarian attacks player unit
                        if ((unit.isPlayerUnit && !targetUnit.isPlayerUnit) || (!unit.isPlayerUnit && targetUnit.isPlayerUnit)) {
                            unit.attack(targetUnit);
                            attacked = true;
                            break; // Attacked a unit, stop searching for targets
                        }
                    }
                }
                if (attacked) break;
            }

            if (!attacked && !unit.isPlayerUnit) { // Only barbarians attack cities if no units are nearby
                // If no units to attack, check for adjacent player cities
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const targetX = unit.x + dx;
                        const targetY = unit.y + dy;

                        const targetCity = playerCities.find(city => city.x === targetX && city.y === targetY);
                        if (targetCity) {
                            // Barbarian attacks city
                            addGameMessage(`Barbarian at (${unit.x}, ${unit.y}) attacks ${targetCity.name} at (${targetCity.x}, ${targetCity.y})!`, 'important');
                            targetCity.population -= unit.strength / 10; // Reduce city population based on barbarian strength
                            if (targetCity.population <= 0) {
                                addGameMessage(`${targetCity.name} was destroyed by barbarians!`, 'important');
                                targetCity.element.remove();
                                playerCities = playerCities.filter(city => city !== targetCity);
                            }
                            targetCity.updateTooltip();
                            unit.moves = 0; // Attacking consumes all moves
                            unit.element.classList.add('no-moves');
                            attacked = true;
                            break; // Attacked a city, stop searching for targets
                        }
                    }
                    if (attacked) break;
                }
            }

            if (!attacked && !unit.isPlayerUnit) { // Simple random movement for barbarians if no attack target
                const possibleMoves = [];
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const newX = unit.x + dx;
                        const newY = unit.y + dy;
                        if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT) {
                            const unitOnTargetTile = playerUnits.find(otherUnit => otherUnit.x === newX && otherUnit.y === newY);
                            const cityOnTargetTile = playerCities.find(city => city.x === newX && city.y === newY);
                            if (!unitOnTargetTile && !cityOnTargetTile) { // Avoid moving onto any unit or city
                                possibleMoves.push({ x: newX, y: newY });
                            }
                        }
                    }
                }
                if (possibleMoves.length > 0) {
                    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                    unit.moveTo(randomMove.x, randomMove.y);
                }
            }
        }

        // Healing logic: units heal if they didn't move or attack this turn
        if (unit.moves === 1 && unit.health < 100) { // If unit still has full moves (didn't move or attack) and is not full health
            const healAmount = 10; // Heal 10 HP per turn
            unit.health = Math.min(100, unit.health + healAmount);
            unit.updateTooltip();
            addGameMessage(`${unit.type} at (${unit.x}, ${unit.y}) healed ${healAmount} HP. Current HP: ${unit.health}`);
        }

        // Reset unit moves for the new turn
        unit.moves = 1; // Reset to 1 move per turn
        unit.element.classList.remove('no-moves'); // Remove visual feedback
    });

    // Spawn a new barbarian unit occasionally
    if (currentTurn % 10 === 0) { // Every 10 turns
        const emptyTiles = [];
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const unitOnTile = playerUnits.find(unit => unit.x === x && unit.y === y);
                const cityOnTile = playerCities.find(city => city.x === x && city.y === y);
                if (!unitOnTile && !cityOnTile) {
                    emptyTiles.push({ x, y });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const spawnTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            const barbarian = new Unit(spawnTile.x, spawnTile.y, 'barbarian');
            playerUnits.push(barbarian);
            const targetTile = document.querySelector(`.tile[data-x="${spawnTile.x}"][data-y="${spawnTile.y}"]`);
            if (targetTile) {
                targetTile.appendChild(barbarian.element);
            }
            addGameMessage(`Barbarian spawned at (${spawnTile.x}, ${spawnTile.y})!`, 'important');
        }
    }

    addGameMessage(`Turn ${currentTurn} begins.`);

    // Check for game end conditions after all turn processing
    checkGameEndConditions();
}

let currentCity = null; // To store the city currently displayed in the info panel

function showCityInfo(city) {
    currentCity = city;
    const panel = document.getElementById('city-info-panel');
    document.getElementById('city-info-name').textContent = city.name;
    document.getElementById('city-info-population').textContent = city.population;
    document.getElementById('city-info-food').textContent = city.food;
    document.getElementById('city-info-production').textContent = city.production;
    document.getElementById('city-info-gold').textContent = city.gold;
    panel.classList.remove('hidden');
}

function hideCityInfo() {
    currentCity = null;
    document.getElementById('city-info-panel').classList.add('hidden');
}

const WARRIOR_PRODUCTION_COST = 50; // Define cost for building a warrior
const SETTLER_PRODUCTION_COST = 100; // Define cost for building a settler
const WORKER_PRODUCTION_COST = 30; // Define cost for building a worker

function buildWarrior() {
    if (currentCity) {
        if (currentCity.currentProductionItem) {
            addGameMessage(`${currentCity.name} is already building a ${currentCity.currentProductionItem.name}.`);
            return;
        }
        currentCity.currentProductionItem = { type: 'unit', name: 'warrior', cost: WARRIOR_PRODUCTION_COST };
        currentCity.productionProgress = 0; // Reset progress for new item
        addGameMessage(`${currentCity.name} started building a Warrior.`, 'important');
        currentCity.updateTooltip();
        showCityInfo(currentCity);
    }
}

function buildSettler() {
    if (currentCity) {
        if (currentCity.currentProductionItem) {
            addGameMessage(`${currentCity.name} is already building a ${currentCity.currentProductionItem.name}.`);
            return;
        }
        currentCity.currentProductionItem = { type: 'unit', name: 'settler', cost: SETTLER_PRODUCTION_COST };
        currentCity.productionProgress = 0; // Reset progress for new item
        addGameMessage(`${currentCity.name} started building a Settler.`, 'important');
        currentCity.updateTooltip();
        showCityInfo(currentCity);
    }
}

function buildWorker() {
    if (currentCity) {
        if (currentCity.currentProductionItem) {
            addGameMessage(`${currentCity.name} is already building a ${currentCity.currentProductionItem.name}.`);
            return;
        }
        currentCity.currentProductionItem = { type: 'unit', name: 'worker', cost: WORKER_PRODUCTION_COST };
        currentCity.productionProgress = 0; // Reset progress for new item
        addGameMessage(`${currentCity.name} started building a Worker.`, 'important');
        currentCity.updateTooltip();
        showCityInfo(currentCity);
    }
}

function addGameMessage(message, type = '') {
    const messagesDiv = document.getElementById('game-messages');
    const p = document.createElement('p');
    p.classList.add('game-message');
    if (type) {
        p.classList.add(type);
    }
    p.textContent = message;
    messagesDiv.prepend(p); // Add new messages at the top
    // Limit the number of messages to avoid clutter
    while (messagesDiv.children.length > 10) {
        messagesDiv.removeChild(messagesDiv.lastChild);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateMap();
    placeInitialUnits();
    updateTurnDisplay(); // Initialize turn display
    document.getElementById('next-turn-btn').addEventListener('click', nextTurn);
    document.getElementById('close-city-info').addEventListener('click', hideCityInfo);
    document.getElementById('build-warrior-btn').addEventListener('click', buildWarrior);
    document.getElementById('build-settler-btn').addEventListener('click', buildSettler);
    document.getElementById('build-worker-btn').addEventListener('click', buildWorker);
    document.getElementById('close-tech-panel').addEventListener('click', hideTechPanel);
    document.getElementById('restart-game-btn').addEventListener('click', restartGame);

    // Add a button to open the tech panel (e.g., in game-info or a new button)
    const techButton = document.createElement('button');
    techButton.textContent = 'Tech Tree';
    techButton.onclick = showTechPanel;
    document.getElementById('game-info').appendChild(techButton);

    addGameMessage("Game started! Found a city with your settler (select settler, press 'B').", 'important');
    updateTechPanel(); // Initialize tech panel display
});

function showVictoryScreen(message) {
    document.getElementById('victory-message').textContent = message;
    document.getElementById('victory-screen').classList.remove('hidden');
    document.getElementById('next-turn-btn').disabled = true;
    document.removeEventListener('keydown', handleKeyPress);
}

function restartGame() {
    location.reload(); // Simple reload for now
}

document.addEventListener('keydown', handleKeyPress);