# River Raid - Guide Utilisateur

River Raid est une recréation web du célèbre jeu vidéo classique "River Raid" sorti sur Atari 2600. Ce guide vous aidera à comprendre et à utiliser l'application, couvrant les bases du démarrage, les fonctionnalités clés et des conseils pour tirer le meilleur parti du jeu.

## Table des Matières
1.  [Introduction](#introduction)
2.  [Démarrage Rapide](#démarrage-rapide)
3.  [Interface Utilisateur](#interface-utilisateur)
    *   [Vue d'ensemble](#vue-d'ensemble)
    *   [Éléments principaux](#éléments-principaux)
4.  [Fonctionnalités Principales](#fonctionnalités-principales)
    *   [Contrôles du Joueur](#contrôles-du-joueur)
    *   [Gestion du Carburant](#gestion-du-carburant)
    *   [Ennemis et Obstacles](#ennemis-et-obstacles)
    *   [Score](#score)
5.  [Dépannage et FAQ](#dépannage-et-faq)
6.  [Support](#support)

---

## Introduction

Ce guide vous aidera à comprendre et à utiliser River Raid. Il couvre les bases du démarrage, les fonctionnalités clés et des conseils pour tirer le meilleur parti de l'application.

## Démarrage Rapide

Pour commencer avec River Raid, suivez ces étapes simples :

1.  **Accès**: Ouvrez le fichier `index.html` situé dans le dossier `riverraid` de votre dépôt cloné, directement dans votre navigateur web.
2.  **Première Utilisation**: Une fois la page chargée, le jeu devrait afficher un écran de titre. Appuyez sur la touche `Entrée` ou `Espace` pour commencer une nouvelle partie.

## Interface Utilisateur

### Vue d'ensemble

L'interface utilisateur de River Raid est simple et se compose principalement de la zone de jeu (le canvas) et d'un affichage des informations essentielles.

![Capture d'écran de l'interface utilisateur de River Raid](river_raid_atari2600.PNG)

### Éléments principaux

*   **Zone de Jeu (Canvas)**: C'est là que l'action se déroule. Votre avion, les ennemis, les ponts et les dépôts de carburant y sont affichés.
*   **Score**: Généralement affiché en haut de l'écran, il indique votre score actuel.
*   **Jauge de Carburant**: Indique le niveau de carburant restant de votre avion. Une fois vide, la partie est terminée.
*   **Messages**: Des messages comme "Game Over" ou "Appuyez sur Entrée pour commencer" apparaissent à l'écran selon l'état du jeu.

## Fonctionnalités Principales

### Contrôles du Joueur

Le jeu se contrôle entièrement au clavier :

*   **Flèche Gauche (`←`)**: Déplace l'avion vers la gauche.
*   **Flèche Droite (`→`)**: Déplace l'avion vers la droite.
*   **Espace (` `) ou Entrée (`↵`)**: Tire des projectiles. Maintenez la touche enfoncée pour un tir continu.

### Gestion du Carburant

Votre avion consomme du carburant en permanence. Pour éviter la panne sèche :

*   **Collecte de Dépôts**: Volez au-dessus des dépôts de carburant (représentés par des icônes de bidons) pour recharger votre jauge.

### Ennemis et Obstacles

Vous rencontrerez divers éléments sur la rivière :

*   **Bateaux, Hélicoptères, Avions**: Ces ennemis peuvent être détruits par vos tirs. Évitez les collisions avec eux.
*   **Ponts**: Les ponts sont des obstacles fixes qui doivent être détruits par vos tirs pour passer. Si vous entrez en collision avec un pont, la partie est terminée.
*   **Bords de la Rivière**: Évitez de toucher les bords de la rivière, cela entraînera un "Game Over".

### Score

Votre score augmente en fonction des ennemis et des ponts que vous détruisez. Essayez d'obtenir le meilleur score possible !

## Dépannage et FAQ

*   **Problème**: Le jeu ne se lance pas après l'ouverture de `index.html`.
    *   **Solution**: Assurez-vous que votre navigateur est à jour. Vérifiez la console développeur (F12) pour d'éventuelles erreurs JavaScript.
*   **Question**: Comment recommencer une partie ?
    *   **Réponse**: Après un "Game Over", appuyez sur la touche `Entrée` ou `Espace` pour relancer une nouvelle partie.

## Support

Si vous rencontrez des problèmes ou avez des questions qui ne sont pas couvertes par ce guide, veuillez consulter la section "Contact" du [README.md](README.md) principal du projet pour les options de support.