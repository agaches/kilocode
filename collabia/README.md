# Collab-IA

![Logo de Collab-IA](screenshots/collabia_logo.png)

## Table des Matières
1.  [Introduction](#introduction)
2.  [Fonctionnalités](#fonctionnalités)
3.  [Démarrage Rapide](#démarrage-rapide)
4.  [Documentation Complète](#documentation-complète)
    *   [Documentation d'Architecture Technique (DAT)](#documentation-darchitecture-technique-dat)
    *   [Guide Utilisateur](#guide-utilisateur)
    *   [Plan de Développement](#plan-de-développement)
5.  [Configuration du Dépôt](#configuration-du-dépôt)
6.  [Contribution](#contribution)
7.  [Licence](#licence)
8.  [Contact](#contact)

---

## Introduction

Collab-IA est une application de chat innovante qui utilise Streamlit pour orchestrer une conversation collaborative entre un couple d'agents d'intelligence artificielle, Claude et Gemini. L'objectif principal est de permettre une interrogation avancée où les deux agents discutent, analysent et parviennent à la meilleure réponse collégiale possible.

Ce projet vise à fournir une plateforme où la synergie entre différents modèles d'IA peut être exploitée pour des réponses plus nuancées et complètes, dépassant les capacités d'un agent unique.

## Fonctionnalités

*   **Chat Collaboratif IA**: Interrogez simultanément les agents Claude et Gemini.
*   **Analyse et Discussion**: Les agents échangent et affinent leurs réponses pour une meilleure qualité.
*   **Réponses Collégiales**: Obtention de réponses synthétisées et optimisées issues de la collaboration des deux IA.
*   **Interface Utilisateur Intuitive**: Grâce à Streamlit, l'application offre une expérience utilisateur simple et interactive.

## Démarrage Rapide

Suivez ces étapes pour lancer Collab-IA rapidement :

1.  **Cloner le dépôt**:
    ```bash
    git clone https://github.com/votre-utilisateur/collabia.git
    cd collabia
    ```
2.  **Installation des dépendances**:
    ```bash
    pip install -r requirements.txt
    ```
    (Note: Un fichier `requirements.txt` est supposé exister ou devra être créé avec les dépendances nécessaires comme `streamlit`, `anthropic`, `google-generativeai`.)
3.  **Lancer l'application**:
    ```bash
    streamlit run app.py
    ```

## Documentation Complète

Pour une compréhension approfondie du projet, veuillez consulter les documents suivants :

### Documentation d'Architecture Technique (DAT)
Ce document détaille l'architecture technique de l'application, les décisions de conception clés (ADR), et les schémas d'architecture.
[Lien vers la DAT (`docs/dat.md`)]

### Guide Utilisateur
Ce guide fournit des instructions détaillées sur l'utilisation de l'application, ses fonctionnalités et des conseils de dépannage.
[Lien vers le Guide Utilisateur (`docs/guide_utilisateur.md`)]

### Plan de Développement
Ce document décrit les objectifs du projet, les composants clés et les étapes d'implémentation.
[Lien vers le Plan de Développement (`docs/plan_developpement.md`)]

## Configuration du Dépôt

Ce dépôt inclut un fichier `.gitignore` pour exclure les fichiers et dossiers non pertinents du contrôle de version.

## Contribution

Nous accueillons les contributions ! Veuillez consulter notre [Guide de Contribution](CONTRIBUTING.md) pour plus de détails.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENCE.md](LICENCE.md) pour plus de détails.

## Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter :
*   **Email**: contact@collabia.com
*   **GitHub Issues**: [Lien vers les issues GitHub du projet]