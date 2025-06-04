# Documentation d'Architecture Technique (DAT) : River Raid (Web)

## I. Objectif de la DAT

Ce document décrit l'architecture technique du projet River Raid, une recréation web du jeu classique Atari 2600. Il vise à fournir une vue d'ensemble des choix techniques, des composants clés et des considérations d'implémentation.

## II. Architecture Générale

River Raid est une application web front-end autonome. Elle est conçue pour fonctionner entièrement côté client, sans nécessiter de serveur backend, de base de données ou d'API externes.

```mermaid
graph TD
    A[Navigateur Web] --> B(index.html)
    B --> C(style.css)
    B --> D(script.js)
    D --> E[Assets du Jeu (Images)]
```

*   **`index.html`**: Le point d'entrée de l'application. Il contient la structure HTML de base, y compris l'élément `<canvas>` où le jeu est rendu, et les éléments d'interface utilisateur (score, carburant, messages).
*   **`style.css`**: Gère la présentation visuelle de l'application, y compris la mise en page du canvas et des éléments UI.
*   **`script.js`**: Contient toute la logique du jeu. C'est le moteur du jeu qui gère :
    *   La boucle de jeu principale (`requestAnimationFrame`).
    *   La gestion des entités (joueur, ennemis, projectiles, dépôts de carburant, ponts).
    *   La détection des collisions.
    *   Le système de score et de carburant.
    *   La gestion des entrées utilisateur (clavier).
    *   Le rendu graphique sur le canvas.
*   **`assets/`**: Dossier contenant toutes les ressources graphiques (images des sprites) utilisées dans le jeu.

## III. Décisions d'Architecture (ADR)

Étant donné la simplicité et la portée du projet (une recréation client-side d'un jeu rétro), les décisions d'architecture sont principalement axées sur la minimisation des dépendances et la facilité de déploiement.

### Concepts techniques

#### ADR 001 - Choix d'une architecture purement client-side

*   **Titre**: Architecture purement client-side pour River Raid
*   **Statut**: Accepté
*   **Décision**: Le projet River Raid sera implémenté comme une application web purement client-side, utilisant HTML, CSS et JavaScript vanille. Aucun framework front-end (comme React, Vue, Angular) ni backend (Node.js, Python, etc.) ne sera utilisé.
*   **Conséquences**:
    *   **Positives**:
        *   **Simplicité de déploiement**: Le jeu peut être hébergé sur n'importe quel serveur web statique ou même ouvert directement via un fichier local.
        *   **Faible complexité**: Réduit la courbe d'apprentissage et la maintenance.
        *   **Performance**: Pas de latence réseau pour la logique de jeu.
    *   **Négatives**:
        *   **Pas de persistance de données**: Les scores ne sont pas sauvegardés entre les sessions.
        *   **Évolutivité limitée**: Moins adapté pour des jeux complexes nécessitant une logique serveur ou des fonctionnalités multijoueurs.
        *   **Gestion des assets**: Les assets sont chargés directement par le navigateur, sans système de bundling avancé.

## IV. Composants Techniques Clés

1.  **Moteur de Jeu (`script.js`)**:
    *   **Boucle de Jeu**: Gérée par `requestAnimationFrame` pour une animation fluide.
    *   **Gestion des Entités**: Chaque type d'objet (joueur, balle, ennemi, carburant, pont) est représenté par un objet JavaScript avec ses propriétés (position, taille, vitesse, image) et ses méthodes (mise à jour, dessin).
    *   **Détection de Collisions**: Implémentation de fonctions de détection de collision (ex: AABB - Axis-Aligned Bounding Box) pour gérer les interactions entre les entités.
    *   **Gestion des Entrées**: Utilisation des écouteurs d'événements clavier (`keydown`, `keyup`) pour contrôler le joueur.

2.  **Rendu Graphique (Canvas API)**:
    *   Le jeu est entièrement dessiné sur un élément `<canvas>` HTML5.
    *   Utilisation du contexte 2D du canvas (`CanvasRenderingContext2D`) pour dessiner les images (sprites), les formes et le texte.

3.  **Gestion des Assets**:
    *   Les images des sprites sont préchargées au début du jeu pour éviter les saccades.
    *   Les chemins des images sont relatifs au fichier `index.html`.

## V. Guides d'Exploitation / Installation

### Installation du poste de développement

1.  **Prérequis**:
    *   Un éditeur de texte (ex: VS Code).
    *   Un navigateur web moderne (Chrome, Firefox, Edge, Safari).

2.  **Démarrage du projet**:
    *   Cloner le dépôt GitHub : `git clone https://github.com/votre-utilisateur/kilocode.git`
    *   Naviguer vers le dossier du projet : `cd kilocode/riverraid`
    *   Ouvrir le fichier `index.html` dans votre navigateur web.

## VI. Documentation de Référence

### Architecture Technique

*   **Schéma d'Architecture Technique**: Voir la section II de ce document pour un diagramme Mermaid simplifié.
*   **Composants Techniques**: Détails dans la section IV.

### Observabilité

Pour un projet client-side simple comme River Raid, l'observabilité est limitée aux outils de développement du navigateur :

*   **Console du Navigateur**: Pour les messages de log (`console.log`), les erreurs JavaScript et les avertissements.
*   **Outils de Performance du Navigateur**: Pour analyser les performances du rendu (FPS, utilisation CPU/GPU) et l'utilisation de la mémoire.