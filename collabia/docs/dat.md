# Documentation d'Architecture Technique (DAT) pour Collab-IA

## ADR (Architecture Decision Records)

### Concepts applicatifs

#### ADR 01 - Choix de Streamlit pour l'interface utilisateur (concepts/ADR 01 - Choix de Streamlit.md)
- **Titre**: Choix de Streamlit pour l'interface utilisateur
- **Statut**: Accepté
- **Décision**: Utiliser Streamlit pour le développement rapide de l'interface utilisateur de l'application Collab-IA, en raison de sa simplicité et de sa capacité à créer des applications de données interactives avec peu de code.
- **Conséquences**:
    - **Positives**: Développement rapide, facilité de déploiement, bonne intégration avec les scripts Python existants.
    - **Négatives**: Moins de flexibilité pour des interfaces utilisateur complexes, dépendance à l'écosystème Python.

#### ADR 02 - Intégration des modèles Claude et Gemini (concepts/ADR 02 - Intégration des modèles.md)
- **Titre**: Intégration des modèles Claude et Gemini
- **Statut**: Accepté
- **Décision**: Intégrer les API des modèles Claude (Anthropic) et Gemini (Google) pour permettre une collaboration entre différentes IA.
- **Conséquences**:
    - **Positives**: Diversité des réponses, potentiel de réponses plus complètes et nuancées, résilience accrue en cas de défaillance d'un modèle.
    - **Négatives**: Complexité accrue de la gestion des API, coûts potentiels liés à l'utilisation de plusieurs services, nécessité de gérer les différences de comportement entre les modèles.

### Concepts techniques

#### ADR 03 - Gestion des clés API (concepts/ADR 03 - Gestion des clés API.md)
- **Titre**: Gestion sécurisée des clés API
- **Statut**: Accepté
- **Décision**: Utiliser des variables d'environnement pour stocker et accéder aux clés API des modèles Claude et Gemini, afin d'éviter de les exposer directement dans le code source.
- **Conséquences**:
    - **Positives**: Sécurité améliorée, facilité de gestion des clés en production et en développement.
    - **Négatives**: Nécessite une configuration environnementale pour chaque déploiement.

## Guides d'exploitation

### Procédures Techniques
- [Lancement de l'application Streamlit](guides/procedures-techniques.md#lancement-de-lapplication-streamlit)
- [Mise à jour des dépendances Python](guides/procedures-techniques.md#mise-à-jour-des-dépendances-python)

### Installation
- [Prérequis pour l'environnement de développement](guides/procedure-installation.md#prérequis-pour-l'environnement-de-développement)
- [Installation des bibliothèques Python](guides/procedure-installation.md#installation-des-bibliothèques-python)

### Observabilité
- [Monitoring de l'utilisation des API](guides/procedure-observabilite.md#monitoring-de-lutilisation-des-api)
- [Gestion des logs de l'application](guides/procedure-observabilite.md#gestion-des-logs-de-lapplication)

## Nouveau Arrivant

### Configuration des accès
- [Configuration des clés API](nouveau_arrivant/config_access.md#configuration-des-clés-api)

### Installation du poste
- [Installation de Python et Pip](nouveau_arrivant/install_poste.md#installation-de-python-et-pip)
- [Installation de Streamlit](nouveau_arrivant/install_poste.md#installation-de-streamlit)
- [Configuration de l'IDE (VS Code)](nouveau_arrivant/install_poste.md#configuration-de-lide-vs-code)

## Documentation de référence

### Architecture
- [Architecture Applicative](reference/architecture-applicative.md)
  - [Schéma d'Architecture Applicatif](reference/architecture-applicative.md#schéma-darchitecture-applicatif)
    - [Diagramme de déploiement de Collab-IA](reference/architecture-applicative.md#diagramme-de-déploiement-de-collab-ia)
    - [Flux de communication entre Streamlit et les API IA](reference/architecture-applicative.md#flux-de-communication-entre-streamlit-et-les-api-ia)
  - [Composants Applicatifs](reference/architecture-applicative.md#composants-applicatifs)
    - [Interface Streamlit](reference/architecture-applicative.md#interface-streamlit)
    - [Gestionnaire d'agents IA](reference/architecture-applicative.md#gestionnaire-dagents-ia)

- [Architecture Fonctionnelle](reference/architecture-fonctionnelle.md)
  - [Schéma d'Architecture Fonctionnelle](reference/architecture-fonctionnelle.md#schéma-darchitecture-fonctionnelle)
    - [Vue d'ensemble du système Collab-IA](reference/architecture-fonctionnelle.md#vue-densemble-du-système-collab-ia)
    - [Flux de données entre l'utilisateur, Streamlit et les IA](reference/architecture-fonctionnelle.md#flux-de-données-entre-lutilisateur-streamlit-et-les-ia)
  - [Composants Fonctionnels](reference/architecture-fonctionnelle.md#composants-fonctionnels)
    - [Module de chat utilisateur](reference/architecture-fonctionnelle.md#module-de-chat-utilisateur)
    - [Module de coordination IA](reference/architecture-fonctionnelle.md#module-de-coordination-ia)

- [Architecture Technique](reference/architecture-technique.md)
  - [Schéma d'Architecture Technique](reference/architecture-technique.md#schéma-darchitecture-technique)
    - [Infrastructure de déploiement (locale/cloud)](reference/architecture-technique.md#infrastructure-de-déploiement-localecloud)
    - [Réseau et sécurité des appels API](reference/architecture-technique.md#réseau-et-sécurité-des-appels-api)
  - [Composants Techniques](reference/architecture-technique.md#composants-techniques)
    - [API Anthropic (Claude)](reference/architecture-technique.md#api-anthropic-claude)
    - [API Google Generative AI (Gemini)](reference/architecture-technique.md#api-google-generative-ai-gemini)

### Exploitation
- [Observabilité](reference/observabilite.md)
  - [Monitoring des performances de l'application](reference/observabilite.md#monitoring-des-performances-de-lapplication)
  - [Logging des interactions utilisateur et IA](reference/observabilite.md#logging-des-interactions-utilisateur-et-ia)
  - [Alerting en cas d'erreurs API](reference/observabilite.md#alerting-en-cas-derreurs-api)

- [SLA](reference/sla.md)
  - [Objectifs de performance des réponses IA](reference/sla.md#objectifs-de-performance-des-réponses-ia)
  - [Disponibilité de l'application](reference/sla.md#disponibilité-de-lapplication)