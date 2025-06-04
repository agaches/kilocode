# CivWeb - Un Clone Simple de Civilization

CivWeb est une implémentation simplifiée d'un jeu de stratégie au tour par tour inspiré de la série Civilization, développé en HTML, CSS et JavaScript pur. Le jeu se déroule sur une carte générée aléatoirement où le joueur peut fonder des villes, produire des unités, explorer et rechercher des technologies.

## Table des Matières
1.  [Configuration du Dépôt](#configuration-du-dépôt)
2.  [Démarrage Rapide](#démarrage-rapide)
3.  [Architecture Technique](#architecture-technique)
    *   [Structure des Fichiers](#structure-des-fichiers)
    *   [HTML (index.html)](#html-indexhtml)
    *   [CSS (style.css)](#css-stylecss)
    *   [JavaScript (script.js)](#javascript-scriptjs)
        *   [Génération de la Carte](#génération-de-la-carte)
        *   [Classes de Jeu](#classes-de-jeu)
        *   [Logique de Jeu](#logique-de-jeu)
        *   [Interaction Utilisateur](#interaction-utilisateur)
4.  [Manuel Utilisateur](#manuel-utilisateur)
    *   [Objectif du Jeu](#objectif-du-jeu)
    *   [Démarrage](#démarrage)
    *   [Contrôles](#contrôles)
    *   [Unités](#unités)
    *   [Villes](#villes)
    *   [Technologies](#technologies)
    *   [Messages du Jeu](#messages-du-jeu)
    *   [Conditions de Victoire](#conditions-de-victoire)
    *   [Conditions de Défaite](#conditions-de-défaite)

---

## Configuration du Dépôt

Ce dépôt inclut un fichier `.gitignore` pour exclure les fichiers et dossiers non pertinents du contrôle de version, tels que les dépendances de modules (si un gestionnaire de paquets comme npm ou yarn était utilisé) et les fichiers spécifiques au système d'exploitation.

## Démarrage Rapide

Pour lancer le jeu, ouvrez simplement le fichier `civweb/index.html` dans votre navigateur web préféré. Aucune installation de serveur ou de dépendance n'est requise.

---

## Architecture Technique

CivWeb est une application web front-end autonome, ne nécessitant aucun serveur ou base de données. Tout le jeu est géré côté client.

### Structure des Fichiers

Le projet est organisé de manière simple :
*   `index.html`: La structure principale de la page web et l'interface utilisateur.
*   `style.css`: Les styles visuels pour la carte, les unités, les panneaux d'information, etc.
*   `script.js`: La logique du jeu, la gestion des interactions, la génération de la carte, et les règles du jeu.

### HTML (index.html)

Le fichier `index.html` est le squelette de l'application. Il contient :
*   Un conteneur `#game-map` où les tuiles de la carte sont dynamiquement insérées par JavaScript.
*   Un panneau `#game-info` affichant le tour actuel et un bouton "Next Turn".
*   Un panneau `#city-info-panel` (initialement caché) qui s'affiche lors de la sélection d'une ville pour afficher ses statistiques et les options de production.
*   Un panneau `#tech-panel` (initialement caché) pour afficher et gérer l'arbre technologique.
*   Un conteneur `#game-messages` pour afficher les notifications et les événements du jeu.
*   Un écran de victoire `#victory-screen` (initialement caché).
*   Les liens vers `style.css` et `script.js`.

### CSS (style.css)

Le fichier `style.css` définit l'apparence du jeu :
*   **Disposition générale**: Utilise Flexbox pour centrer le contenu et Grid pour la carte de jeu.
*   **Tuiles de la carte**: Styles pour les différentes classes de tuiles (`.grass`, `.forest`, `.mountain`, `.water`, `.desert`) et les améliorations (`.farm`, `.mine`).
*   **Unités**: Styles pour les unités (`.unit`, `.unit-settler`, `.unit-warrior`, `.unit-barbarian`, `.unit-worker`), y compris les icônes emoji et l'affichage de la santé.
*   **Villes**: Styles pour les marqueurs de ville (`.city`).
*   **Panneaux d'information**: Styles pour les panneaux de ville et de technologie, y compris les états `hidden`.
*   **Messages du jeu**: Styles pour les différents types de messages (`.game-message`, `.important`, `.victory`, `.defeat`).

### JavaScript (script.js)

Le cœur du jeu est dans `script.js`. Il gère toute la logique du jeu, de la génération de la carte aux interactions des unités et à la progression des tours.

#### Constantes et Configurations
*   `MAP_WIDTH`, `MAP_HEIGHT`: Dimensions de la carte.
*   `TILE_TYPES`: Objets définissant les types de tuiles (herbe, forêt, montagne, eau, désert) avec leurs classes CSS et leurs rendements (nourriture, production, or).
*   `RESOURCES`: Types de ressources (or, nourriture, production).
*   `IMPROVEMENTS`: Types d'améliorations de tuiles (ferme, mine, route) et leurs rendements.
*   `VICTORY_CITIES_REQUIRED`: Nombre de villes nécessaires pour gagner.
*   `TECHNOLOGIES`: Arbre technologique avec les coûts, les prérequis, les déblocages et les descriptions.
*   Coûts de production des unités (`WARRIOR_PRODUCTION_COST`, etc.).

#### Génération de la Carte
*   `getRandomTileType()`: Sélectionne un type de tuile aléatoire.
*   `getRandomResource()`: Sélectionne une ressource aléatoire (avec 50% de chance de ne pas en avoir).
*   `generateMap()`: Crée la grille de tuiles HTML, assigne des types et des ressources aléatoires, et ajoute des écouteurs d'événements.

#### Classes de Jeu
*   **`Unit`**:
    *   `constructor(x, y, type)`: Initialise une unité avec sa position, son type (colon, guerrier, barbare, ouvrier), ses points de mouvement, sa force et sa santé.
    *   `createUnitElement()`: Crée l'élément DOM de l'unité.
    *   `updateTooltip()`: Met à jour l'infobulle et l'affichage de la santé.
    *   `takeDamage(amount)`: Réduit la santé de l'unité et la fait mourir si la santé est à zéro.
    *   `die()`: Supprime l'unité du jeu.
    *   `attack(targetUnit)`: Gère le combat entre unités.
    *   `moveTo(newX, newY)`: Déplace l'unité vers une nouvelle tuile.
*   **`City`**:
    *   `constructor(x, y, name)`: Initialise une ville avec sa position, son nom, sa population, ses ressources accumulées (nourriture, production, or) et son élément de production actuel.
    *   `createCityElement()`: Crée l'élément DOM de la ville.
    *   `updateTooltip()`: Met à jour l'infobulle de la ville.
    *   `produce()`: Calcule les rendements des tuiles adjacentes, gère la croissance de la population et la progression de la production.
    *   `getTileYields(tileX, tileY)`: Calcule les rendements d'une tuile spécifique, en tenant compte des améliorations.
    *   `completeProduction()`: Termine la production de l'élément en cours (crée une unité, etc.).

#### Logique de Jeu
*   `playerUnits`: Tableau global des unités du joueur.
*   `playerCities`: Tableau global des villes du joueur.
*   `currentTurn`: Compteur de tours.
*   `currentResearch`, `researchProgress`: Variables pour la recherche technologique.
*   `nextTurn()`: Fonction principale appelée à chaque nouveau tour. Elle :
    *   Incrémente le compteur de tours.
    *   Avance la recherche technologique.
    *   Appelle la méthode `produce()` pour chaque ville.
    *   Traite les actions des unités (mouvement, attaque, guérison).
    *   Fait apparaître des barbares occasionnellement.
    *   Vérifie les conditions de fin de partie.
*   `checkGameEndConditions()`: Vérifie si le joueur a gagné (assez de villes) ou perdu (plus d'unités ni de villes).
*   `showVictoryScreen()`, `restartGame()`: Fonctions pour gérer l'écran de victoire et le redémarrage.

#### Interaction Utilisateur
*   `handleTileClick(event)`: Gère les clics sur les tuiles pour la sélection et le mouvement des unités, ainsi que les attaques.
*   `handleKeyPress(event)`: Gère les raccourcis clavier pour les actions des unités :
    *   `B`: Fonder une ville (avec un colon sur une tuile d'herbe sans ville existante).
    *   `S`: Mettre l'unité sélectionnée en "veille" (termine ses mouvements pour le tour).
    *   `D`: Supprimer l'unité sélectionnée.
    *   `W`: Dégager une forêt (avec un ouvrier sur une tuile de forêt).
    *   `F`: Construire une ferme (avec un ouvrier sur une tuile d'herbe, nécessite la technologie Agriculture).
    *   `M`: Construire une mine (avec un ouvrier sur une tuile de montagne, nécessite la technologie Mining).
    *   `R`: Construire une route (avec un ouvrier sur une tuile terrestre).
*   `showCityInfo(city)`, `hideCityInfo()`: Affiche/masque le panneau d'information de la ville.
*   `buildWarrior()`, `buildSettler()`, `buildWorker()`: Fonctions pour mettre en file d'attente la production d'unités dans la ville sélectionnée.
*   `addGameMessage(message, type)`: Ajoute des messages au journal du jeu.
*   `updateTechPanel()`, `startResearch(techName)`, `showTechPanel()`, `hideTechPanel()`: Fonctions pour gérer l'arbre technologique.
*   `DOMContentLoaded` listener: Initialise le jeu au chargement de la page (génère la carte, place les unités initiales, configure les écouteurs d'événements).

---

## Manuel Utilisateur

Bienvenue dans CivWeb, un jeu de stratégie au tour par tour simplifié !

### Objectif du Jeu

L'objectif principal est de fonder un certain nombre de villes (par défaut, 3) pour atteindre la victoire. Vous devrez gérer vos unités, développer vos villes et rechercher des technologies pour y parvenir.

### Démarrage

Au début du jeu, une carte aléatoire est générée et vous commencez avec une unité **Colon** placée sur une tuile d'herbe.

### Contrôles

*   **Sélectionner une unité**: Cliquez sur une unité du joueur sur la carte. L'unité sélectionnée aura une bordure bleue.
*   **Déplacer une unité**: Une fois une unité sélectionnée, cliquez sur une tuile adjacente pour la déplacer. Les unités ont 1 point de mouvement par tour.
*   **Attaquer une unité**: Si une unité ennemie (barbare) est adjacente à votre unité sélectionnée, cliquez sur l'unité ennemie pour l'attaquer. L'attaque consomme tous les points de mouvement.
*   **Passer le tour**: Cliquez sur le bouton "Next Turn" pour avancer au tour suivant. Toutes les unités et villes effectuent leurs actions.

### Raccourcis Clavier (avec une unité sélectionnée)

*   **`B`**: **Fonder une ville**. Si votre unité sélectionnée est un **Colon** et qu'elle se trouve sur une tuile d'herbe vide, vous pouvez fonder une nouvelle ville. Le colon disparaîtra après avoir fondé la ville.
*   **`S`**: **Mettre en veille/Passer le tour de l'unité**. L'unité sélectionnée ne fera plus rien pour le reste du tour.
*   **`D`**: **Supprimer l'unité**. Supprime l'unité sélectionnée du jeu.
*   **`W`**: **Dégager une forêt**. Si votre unité sélectionnée est un **Ouvrier** et qu'elle se trouve sur une tuile de forêt, elle peut dégager la forêt pour la transformer en herbe.
*   **`F`**: **Construire une ferme**. Si votre unité sélectionnée est un **Ouvrier** et qu'elle se trouve sur une tuile d'herbe, elle peut construire une ferme pour augmenter la production de nourriture. Nécessite la technologie "Agriculture".
*   **`M`**: **Construire une mine**. Si votre unité sélectionnée est un **Ouvrier** et qu'elle se trouve sur une tuile de montagne, elle peut construire une mine pour augmenter la production. Nécessite la technologie "Mining".
*   **`R`**: **Construire une route**. Si votre unité sélectionnée est un **Ouvrier** et qu'elle se trouve sur une tuile terrestre, elle peut construire une route.

### Unités

*   **Colon (🚶)**: Peut fonder de nouvelles villes.
*   **Guerrier (⚔️)**: Unité de combat.
*   **Ouvrier (👷)**: Peut construire des améliorations de tuiles (fermes, mines, routes) et dégager des forêts.
*   **Barbare (👹)**: Unités ennemies qui apparaissent aléatoirement et attaquent vos unités et villes.

### Villes

*   **Fonder une ville**: Utilisez un colon sur une tuile d'herbe.
*   **Panneau d'information de la ville**: Cliquez sur une ville pour ouvrir son panneau d'information. Vous y verrez sa population, ses ressources et sa file de production.
*   **Production**: Les villes produisent de la nourriture, de la production et de l'or à partir des tuiles adjacentes (zone 3x3).
    *   **Nourriture**: Nécessaire pour la croissance de la population.
    *   **Production**: Utilisée pour construire des unités.
    *   **Or**: Accumulé directement.
*   **Construire des unités**: Dans le panneau d'information de la ville, vous pouvez choisir de construire un Guerrier, un Colon ou un Ouvrier. La production s'accumule à chaque tour jusqu'à ce que le coût de l'unité soit atteint.

### Technologies

*   **Arbre Technologique**: Cliquez sur le bouton "Tech Tree" pour ouvrir le panneau des technologies.
*   **Rechercher**: Sélectionnez une technologie à rechercher. La recherche progresse à chaque tour en utilisant la production totale de vos villes.
*   **Prérequis**: Certaines technologies nécessitent que d'autres technologies soient déjà recherchées.
*   **Déblocages**: La recherche de technologies débloque de nouvelles capacités (par exemple, la construction de fermes ou de mines).

### Messages du Jeu

Le panneau "Game Messages" affiche les événements importants du jeu, tels que la fondation de villes, les combats, la croissance de la population et la recherche de technologies.

### Conditions de Victoire

Vous gagnez la partie lorsque vous avez fondé un nombre suffisant de villes (par défaut, 3).

### Conditions de Défaite

Vous perdez la partie si toutes vos unités et villes sont détruites.