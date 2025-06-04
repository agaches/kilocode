# Documentation d'Architecture Technique (DAT) - CivWeb

## ADR (Architecture Decision Records)

### Concepts applicatifs

#### ADR 01 - Gestion de l'état du jeu côté client
- **Titre**: Gestion de l'état du jeu côté client
- **Statut**: Accepté
- **Décision**: L'intégralité de l'état du jeu (carte, unités, villes, technologies, tour actuel) est gérée côté client via JavaScript. Aucune persistance côté serveur ou base de données n'est utilisée.
- **Conséquences**:
    - **Positives**: Simplification de l'architecture (pas de backend, pas de base de données), déploiement facile (simple fichier HTML/CSS/JS), faible coût d'infrastructure.
    - **Négatives**: Pas de sauvegarde de partie, pas de multijoueur, dépendance à la performance du navigateur client, difficulté à gérer des états de jeu très complexes ou de très grandes cartes.

#### ADR 02 - Représentation de la carte par une grille HTML/CSS
- **Titre**: Représentation de la carte par une grille HTML/CSS
- **Statut**: Accepté
- **Décision**: La carte du jeu est rendue en utilisant une grille CSS (`display: grid`) où chaque tuile est un élément `div` avec des classes CSS pour son type (herbe, forêt, etc.) et ses améliorations.
- **Conséquences**:
    - **Positives**: Rendu visuel simple et direct, facilité de stylisation via CSS, bonne performance pour des cartes de taille modérée.
    - **Négatives**: Moins flexible pour des animations complexes ou des interactions graphiques avancées par rapport à un canvas, potentiellement moins performant pour de très grandes cartes avec de nombreux éléments DOM.

### Concepts techniques

#### ADR 03 - Utilisation de classes JavaScript pour les entités de jeu
- **Titre**: Utilisation de classes JavaScript pour les entités de jeu
- **Statut**: Accepté
- **Décision**: Les entités du jeu comme `Unit` et `City` sont implémentées comme des classes JavaScript, encapsulant leurs propriétés (position, santé, type, etc.) et leurs comportements (déplacement, attaque, production).
- **Conséquences**:
    - **Positives**: Code plus organisé et modulaire, meilleure lisibilité et maintenabilité, réutilisation du code facilitée.
    - **Négatives**: Peut introduire une légère complexité pour les développeurs moins familiers avec la programmation orientée objet en JavaScript.

#### ADR 04 - Gestion des interactions utilisateur via écouteurs d'événements DOM
- **Titre**: Gestion des interactions utilisateur via écouteurs d'événements DOM
- **Statut**: Accepté
- **Décision**: Toutes les interactions utilisateur (clics sur les tuiles, clics sur les boutons, raccourcis clavier) sont gérées par des écouteurs d'événements JavaScript attachés aux éléments DOM pertinents.
- **Conséquences**:
    - **Positives**: Approche standard et bien comprise pour les applications web, intégration naturelle avec le rendu HTML.
    - **Négatives**: Peut devenir complexe à gérer pour un grand nombre d'interactions ou des interactions très dynamiques sans l'aide d'un framework.

## Guides d'exploitation

### Procédures Techniques
- Aucune procédure technique spécifique n'est requise pour l'exploitation de CivWeb, car il s'agit d'une application front-end statique.

### Installation
- **Lancement de l'application**: Ouvrez le fichier `civweb/index.html` dans un navigateur web moderne.

### Observabilité
- **Messages du jeu**: Le panneau `#game-messages` affiche les événements importants du jeu.
- **Console du navigateur**: Les erreurs JavaScript et les messages de débogage sont affichés dans la console du navigateur.

## Nouveau Arrivant

### Configuration des accès
- Aucun accès spécifique n'est requis. Le projet est entièrement local et ne dépend d'aucun service externe.

### Installation du poste
- **Prérequis**: Un navigateur web moderne (Chrome, Firefox, Edge, Safari).
- **SDK et outils**: Aucun SDK ou outil spécifique n'est nécessaire pour exécuter l'application. Un éditeur de texte est suffisant pour modifier le code.
- **Configuration IDE**: Aucune configuration IDE particulière n'est requise.

## Documentation de référence

### Architecture

- [Architecture Applicative](reference/architecture-applicative.md)
  - [Schéma d'Architecture Applicatif](reference/architecture-applicative.md#schéma-darchitecture-applicatif)
    - [Diagramme de déploiement](reference/architecture-applicative.md#diagramme-de-déploiement)
      - CivWeb est une application web front-end autonome. Le déploiement consiste à servir les fichiers `index.html`, `style.css`, et `script.js` via un serveur web statique ou directement depuis le système de fichiers local de l'utilisateur.
    - [Flux de communication entre services](reference/architecture-applicative.md#flux-de-communication-entre-services)
      - Il n'y a pas de communication entre services, car l'application est entièrement côté client.

  - [Composants Applicatifs](reference/architecture-applicative.md#composants-applicatifs)
    - **Module de Génération de Carte**: Responsable de la création de la grille de tuiles et de l'assignation des types de terrain et ressources.
    - **Module de Gestion des Entités (Unités et Villes)**: Gère la création, la mise à jour et la suppression des unités et villes, ainsi que leurs logiques spécifiques (mouvement, combat, production).
    - **Module d'Interface Utilisateur**: Gère l'affichage des panneaux d'information (ville, technologie, messages), les interactions utilisateur (clics, raccourcis clavier) et la mise à jour du DOM.
    - **Module de Logique de Jeu**: Orchestre le déroulement des tours, la progression technologique, l'apparition des barbares et la vérification des conditions de fin de partie.

- [Architecture Fonctionnelle](reference/architecture-fonctionnelle.md)
  - [Schéma d'Architecture Fonctionnelle](reference/architecture-fonctionnelle.md#schéma-darchitecture-fonctionnelle)
    - [Vue d'ensemble du système](reference/architecture-fonctionnelle.md#vue-densemble-du-système)
      - Le système permet à un joueur unique de gérer une civilisation sur une carte générée aléatoirement, en fondant des villes, produisant des unités, explorant et recherchant des technologies pour atteindre la victoire.
    - [Flux de données entre composants](reference/architecture-fonctionnelle.md#flux-de-données-entre-composants)
      - Les données de jeu (état de la carte, positions des unités/villes, progression technologique) sont stockées dans des variables JavaScript globales ou des propriétés d'objets et sont mises à jour directement par les fonctions de logique de jeu et les gestionnaires d'événements. Le DOM est mis à jour en conséquence pour refléter l'état visuel.

  - [Composants Fonctionnels](reference/architecture-fonctionnelle.md#composants-fonctionnels)
    - **Exploration et Mouvement**: Permet aux unités de se déplacer sur la carte et de révéler de nouvelles zones.
    - **Fondation et Gestion de Villes**: Permet aux colons de fonder des villes et aux joueurs de gérer la production et la croissance des villes.
    - **Combat**: Gère les interactions de combat entre les unités du joueur et les barbares.
    - **Recherche Technologique**: Permet aux joueurs de progresser dans un arbre technologique pour débloquer de nouvelles capacités.
    - **Affichage et Interaction**: Fournit l'interface graphique pour visualiser le jeu et interagir avec les éléments.

- [Architecture Technique](reference/architecture-technique.md)
  - [Schéma d'Architecture Technique](reference/architecture-technique.md#schéma-darchitecture-technique)
    - [Infrastructure](reference/architecture-technique.md#infrastructure)
      - L'infrastructure est minimale : un navigateur web côté client.
    - [Réseau et sécurité](reference/architecture-technique.md#réseau-et-sécurité)
      - Aucune communication réseau n'est impliquée. La sécurité est gérée par les mécanismes de sécurité inhérents au navigateur web pour les applications JavaScript côté client.

  - [Composants Techniques](reference/architecture-technique.md#composants-techniques)
    - **HTML (index.html)**: Structure de l'interface utilisateur.
    - **CSS (style.css)**: Styles visuels et disposition.
    - **JavaScript (script.js)**: Logique métier, gestion de l'état, interactions DOM.

### Exploitation
- [FinOps (si applicable)](reference/finops.md)
  - Non applicable, car il n'y a pas de coûts d'infrastructure liés à l'exécution de cette application front-end statique.

- [Observabilité](reference/observabilite.md)
  - [Monitoring](reference/observabilite.md#monitoring)
    - Le monitoring se limite à l'observation des messages du jeu et de la console du navigateur pour les erreurs.
  - [Logging](reference/observabilite.md#logging)
    - Les messages importants du jeu sont affichés dans le panneau `#game-messages`. Des messages de débogage peuvent être ajoutés via `console.log()` dans `script.js`.
  - [Alerting](reference/observabilite.md#alerting)
    - Non applicable.

- [SLA](reference/sla.md)
  - Non applicable, car il s'agit d'une application locale sans service en ligne.