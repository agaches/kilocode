# CivWeb - Guide Utilisateur

CivWeb est une application web qui permet de jouer à un jeu de stratégie au tour par tour simplifié, inspiré de Civilization.

## Table des Matières
1.  [Introduction](#introduction)
2.  [Démarrage Rapide](#démarrage-rapide)
3.  [Interface Utilisateur](#interface-utilisateur)
    *   [Vue d'ensemble](#vue-d'ensemble)
    *   [Éléments principaux](#éléments-principaux)
4.  [Fonctionnalités Principales](#fonctionnalités-principales)
    *   [Contrôles et Raccourcis Clavier](#contrôles-et-raccourcis-clavier)
    *   [Unités](#unités)
    *   [Villes](#villes)
    *   [Technologies](#technologies)
    *   [Messages du Jeu](#messages-du-jeu)
5.  [Conditions de Victoire et de Défaite](#conditions-de-victoire-et-de-défaite)
6.  [Dépannage et FAQ](#dépannage-et-faq)
7.  [Support](#support)

---

## Introduction

Ce guide vous aidera à comprendre et à utiliser CivWeb. Il couvre les bases du démarrage, les fonctionnalités clés et des conseils pour tirer le meilleur parti du jeu.

## Démarrage Rapide

Pour commencer avec CivWeb, suivez ces étapes simples :

1.  **Accès**: Ouvrez le fichier `civweb/index.html` dans votre navigateur web préféré.
2.  **Première Utilisation**: Une carte aléatoire est générée et vous commencez avec une unité **Colon** placée sur une tuile d'herbe.

## Interface Utilisateur

### Vue d'ensemble

L'interface de CivWeb est composée de la carte de jeu au centre, de panneaux d'information et de contrôle sur les côtés, et d'un journal de messages en bas.

### Éléments principaux

*   **Carte de Jeu (`#game-map`)**: Affiche les tuiles, les unités et les villes. C'est l'élément principal d'interaction.
*   **Panneau d'Information du Jeu (`#game-info`)**: Affiche le tour actuel et contient le bouton "Next Turn" pour avancer le jeu.
*   **Panneau d'Information de la Ville (`#city-info-panel`)**: S'affiche lorsque vous sélectionnez une ville. Il montre les statistiques de la ville et les options de production.
*   **Panneau Technologique (`#tech-panel`)**: S'affiche lorsque vous cliquez sur le bouton "Tech Tree". Il permet de visualiser et de lancer la recherche de technologies.
*   **Messages du Jeu (`#game-messages`)**: Un journal affichant les événements importants du jeu (fondation de villes, combats, etc.).
*   **Écran de Victoire/Défaite (`#victory-screen`, `#defeat-screen`)**: S'affiche à la fin de la partie.

## Fonctionnalités Principales

### Contrôles et Raccourcis Clavier

*   **Sélectionner une unité**: Cliquez sur une unité du joueur sur la carte. L'unité sélectionnée aura une bordure bleue.
*   **Déplacer une unité**: Une fois une unité sélectionnée, cliquez sur une tuile adjacente pour la déplacer. Les unités ont 1 point de mouvement par tour.
*   **Attaquer une unité**: Si une unité ennemie (barbare) est adjacente à votre unité sélectionnée, cliquez sur l'unité ennemie pour l'attaquer. L'attaque consomme tous les points de mouvement.
*   **Passer le tour**: Cliquez sur le bouton "Next Turn" pour avancer au tour suivant. Toutes les unités et villes effectuent leurs actions.

**Raccourcis Clavier (avec une unité sélectionnée)**:
*   **`B`**: **Fonder une ville**. Si votre unité sélectionnée est un **Colon** et qu'elle se trouve sur une tuile d'herbe sans ville existante, vous pouvez fonder une nouvelle ville. Le colon disparaîtra après avoir fondé la ville.
*   **`S`**: **Mettre en veille/Passer le tour de l'unité**. L'unité sélectionnée ne fera plus rien pour le reste du tour.
*   **`D`**: **Supprimer l'unité**. Supprime l'unité sélectionnée du jeu.
*   **`W`**: **Dégager une forêt**. Si votre unité sélectionnée est un **Ouvrier** et qu'elle se trouve sur une tuile de forêt, elle peut dégager la forêt pour la transformer en herbe.
*   **`F`**: **Construire une ferme**. Si votre unité sélectionnée est un **Ouvrier** et qu'elle se trouve sur une tuile d'herbe, elle peut construire une ferme pour augmenter la production de nourriture. Nécessite la technologie "Agriculture".
*   **`M`**: **Construire une mine**. Si votre unité sélectionnée est un **Ouvrier** et qu'elle se trouve sur une tuile de montagne, elle peut construire une mine pour augmenter la production. Nécessite la technologie "Mining".
*   **`R`**: **Construire une route**. Si votre unité sélectionnée est un **Ouvrier** et qu'elle se trouve sur une tuile terrestre.

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

## Conditions de Victoire et de Défaite

*   **Victoire**: Vous gagnez la partie lorsque vous avez fondé un nombre suffisant de villes (par défaut, 3).
*   **Défaite**: Vous perdez la partie si toutes vos unités et villes sont détruites.

## Dépannage et FAQ

*   **Le jeu ne se charge pas**: Assurez-vous que le fichier `index.html` est ouvert directement dans un navigateur web moderne. Vérifiez la console du navigateur pour d'éventuelles erreurs JavaScript.
*   **Les unités ne bougent pas**: Vérifiez si l'unité est sélectionnée (bordure bleue) et si elle a des points de mouvement restants pour le tour.
*   **Impossible de fonder une ville**: Assurez-vous d'avoir un colon sélectionné et que la tuile cible est une tuile d'herbe vide (sans autre ville).

## Support

Si vous rencontrez des problèmes ou avez des questions qui ne sont pas couvertes par ce guide, veuillez consulter le fichier `README.md` principal du projet ou les issues GitHub.