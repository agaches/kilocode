# Collab-IA - Guide Utilisateur

Collab-IA est une application web interactive développée avec Streamlit qui permet une interrogation avancée de modèles d'intelligence artificielle (Claude et Gemini) en mode collaboratif.

## Table des Matières
1.  [Introduction](#introduction)
2.  [Démarrage Rapide](#démarrage-rapide)
3.  [Interface Utilisateur](#interface-utilisateur)
    *   [Vue d'ensemble](#vue-d'ensemble)
    *   [Éléments principaux](#éléments-principaux)
4.  [Fonctionnalités Principales](#fonctionnalités-principales)
    *   [Chat Collaboratif IA](#chat-collaboratif-ia)
    *   [Gestion des Paramètres IA](#gestion-des-paramètres-ia)
5.  [Paramètres et Personnalisation](#paramètres-et-personnalisation)
6.  [Dépannage et FAQ](#dépannage-et-faq)
7.  [Support](#support)

---

## Introduction

Ce guide vous aidera à comprendre et à utiliser Collab-IA. Il couvre les bases du démarrage, les fonctionnalités clés et des conseils pour tirer le meilleur parti de l'application, en se concentrant sur l'interaction collaborative entre les agents IA.

## Démarrage Rapide

Pour commencer avec Collab-IA, suivez ces étapes simples :

1.  **Installation/Accès**: Assurez-vous d'avoir Python et Streamlit installés. Clonez le dépôt Collab-IA et installez les dépendances (voir le `README.md` pour les instructions détaillées).
2.  **Lancement de l'application**: Exécutez `streamlit run app.py` dans le répertoire du projet. L'application s'ouvrira automatiquement dans votre navigateur web.
3.  **Première Utilisation**: Une fois l'application lancée, vous verrez une interface de chat. Vous pouvez commencer à taper vos questions ou requêtes dans la zone de texte prévue à cet effet.

## Interface Utilisateur

### Vue d'ensemble

L'interface utilisateur de Collab-IA est conçue pour être simple et intuitive, centrée autour d'une fenêtre de chat. Sur le côté gauche, une barre latérale permet d'accéder aux paramètres et configurations.

### Éléments principaux

*   **Zone de saisie de texte**: Située en bas de l'interface principale, c'est là que vous tapez vos questions ou requêtes pour les agents IA.
*   **Zone d'affichage des messages**: Au-dessus de la zone de saisie, cette zone affiche l'historique de la conversation, y compris vos requêtes et les réponses collaboratives des IA.
*   **Barre latérale (Sidebar)**: Accessible sur le côté gauche, elle contient des options pour configurer les modèles d'IA, les clés API, et d'autres paramètres.

## Fonctionnalités Principales

### Chat Collaboratif IA

Cette fonctionnalité est le cœur de Collab-IA. Elle permet aux utilisateurs de poser des questions et de recevoir des réponses élaborées par la collaboration des agents Claude et Gemini.

**Comment l'utiliser**:
1.  Tapez votre question ou votre instruction dans la zone de saisie de texte.
2.  Appuyez sur `Entrée` ou cliquez sur le bouton d'envoi (si présent).
3.  Les agents Claude et Gemini traiteront votre requête, discuteront entre eux, et généreront une réponse collégiale qui sera affichée dans la zone d'affichage des messages.

### Gestion des Paramètres IA

La barre latérale vous permet de configurer les paramètres des modèles d'IA.

**Comment l'utiliser**:
1.  Ouvrez la barre latérale en cliquant sur l'icône correspondante (généralement un hamburger menu ou une flèche).
2.  Vous y trouverez des champs pour entrer vos clés API pour Claude et Gemini. **Il est crucial de configurer ces clés pour que l'application fonctionne.**
3.  D'autres paramètres, tels que la température des modèles ou le nombre maximal de tokens, pourraient être disponibles pour affiner le comportement des IA. Modifiez-les selon vos besoins.

## Paramètres et Personnalisation

Accédez à la barre latérale pour :
*   Entrer et gérer vos clés API pour Anthropic (Claude) et Google Generative AI (Gemini).
*   Ajuster les paramètres des modèles (ex: `temperature`, `max_tokens`) pour influencer la créativité et la longueur des réponses.

## Dépannage et FAQ

*   **Problème**: L'application ne se lance pas ou affiche une erreur de connexion API.
    *   **Solution**: Vérifiez que vos clés API sont correctement configurées dans la barre latérale et que vous avez une connexion internet active. Assurez-vous également que toutes les dépendances Python sont installées.
*   **Question**: Pourquoi les réponses des IA sont-elles parfois lentes ?
    *   **Réponse**: La latence peut dépendre de la complexité de la requête, de la charge sur les serveurs des API d'IA, et de votre connexion internet. La collaboration entre deux IA peut également ajouter un léger délai.

## Support

Si vous rencontrez des problèmes ou avez des questions qui ne sont pas couvertes par ce guide, veuillez consulter le `README.md` du projet ou ouvrir une issue sur le dépôt GitHub.