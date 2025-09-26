# 🎬 BlueFlix

> Plateforme de streaming moderne avec interface élégante et thème sombre

[![Version](https://img.shields.io/badge/version-1.0-blue.svg)]()
[![License](https://img.shields.io/badge/license-Academic-green.svg)]()
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [API](#-api)
- [Captures d'écran](#-captures-décran)
- [Auteur](#-auteur)

## 🎯 À propos

**BlueFlix** est une interface de streaming moderne développée dans le cadre du cours de **Conception Frontend** à l'EFREI Paris. Cette plateforme propose une expérience utilisateur inspirée des services de streaming contemporains, avec un design élégant utilisant un thème sombre et des accents bleus.

### Contexte académique
- **École** : EFREI Paris
- **Niveau** : 3ème année
- **Semestre** : 1er Semestre 2025
- **Cours** : Conception Frontend
- **Version** : 1.0

## ✨ Fonctionnalités

### 🎬 Navigation de contenu
- **Catalogue de films** avec différents genres (Animation, Comédie, Crime, Documentaire, Drame, Famille, Fantastique, Horreur)
- **Catalogue de séries** avec catégories spécialisées
- **Système de recherche** avancé
- **Carrousels de défilement** horizontal pour une navigation intuitive

### 👤 Gestion utilisateur
- **Système d'authentification** complet (Connexion/Inscription)
- **Profils utilisateur** personnalisés
- **Listes personnalisées** :
  - ❤️ Favoris
  - 📋 À regarder
  - ✅ Déjà vu

### 📱 Interface responsive
- **Design adaptatif** pour desktop et mobile
- **Navigation mobile** optimisée avec menu hamburger
- **Interface utilisateur moderne** avec thème sombre
- **Animations fluides** et transitions élégantes

### 🔍 Fonctionnalités avancées
- **Recherche en temps réel** de films et séries
- **Modales détaillées** pour chaque contenu
- **Système de notation** et informations complètes
- **Intégration API TMDB** pour données actualisées

## 🛠 Technologies

### Frontend
- **HTML5** - Structure sémantique moderne
- **CSS3** - Styles avancés avec Flexbox/Grid
- **JavaScript ES6+** - Logique interactive et modules

### Architecture
- **Modularité CSS** - Composants organisés
- **Modules JavaScript** - Architecture ES6 modules
- **Design responsive** - Mobile-first approach
- **API REST** - Intégration TMDB

### Outils de développement
- **Architecture modulaire** pour la maintenabilité
- **Code sémantique** et accessible
- **Optimisation performance** 

## 🚀 Installation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur local (optionnel pour développement)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone [url-du-repo]
   cd blueflix
   ```

2. **Ouvrir le projet**
   - Ouvrir `index.html` directement dans le navigateur
   - Ou utiliser un serveur local :
   ```bash
   # Avec Python
   python -m http.server 8000
   
   # Avec Node.js
   npx serve .
   
   # Avec PHP
   php -S localhost:8000
   ```

3. **Accéder à l'application**
   - URL directe : `file:///chemin/vers/index.html`
   - Serveur local : `http://localhost:8000`

## 💻 Utilisation

### Navigation principale
1. **Accueil** - Page d'accueil avec contenus populaires
2. **Films** - Catalogue complet des films par genre
3. **Séries** - Collection de séries organisées
4. **Mes Listes** - Gestion des listes personnelles
5. **À propos** - Informations sur le projet

### Fonctionnalités utilisateur
- **Recherche** : Utilisez la barre de recherche pour trouver du contenu
- **Authentification** : Créez un compte ou connectez-vous
- **Listes** : Ajoutez du contenu à vos listes personnalisées
- **Navigation** : Utilisez les carrousels pour découvrir du contenu

## 📁 Structure du projet

```
blueflix/
├── 📄 index.html              # Page d'accueil
├── 📁 html/                   # Pages HTML
│   ├── movies.html            # Catalogue films
│   ├── series.html            # Catalogue séries  
│   ├── list.html              # Listes utilisateur
│   └── about.html             # À propos
├── 📁 css/                    # Styles
│   ├── styles.css             # Styles principaux
│   └── 📁 components/         # Composants CSS
│       ├── sections.css       # Sections layout
│       ├── buttons.css        # Styles boutons
│       ├── dropdown.css       # Menus déroulants
│       ├── cards.css          # Cartes contenu
│       ├── search.css         # Recherche
│       ├── footer.css         # Pied de page
│       ├── animations.css     # Animations
│       ├── cast.css           # Casting
│       ├── lists-extra.css    # Listes étendues
│       └── modal-extra.css    # Modales étendues
├── 📁 script/                 # JavaScript
│   ├── app.js                 # Point d'entrée
│   ├── config.js              # Configuration
│   ├── api.js                 # Gestion API
│   ├── ui.js                  # Interface utilisateur
│   ├── auth.js                # Authentification
│   ├── hero.js                # Section héro
│   ├── search.js              # Fonctionnalités recherche
│   └── lists.js               # Gestion listes
└── 📄 README.md               # Documentation
```

## 🔌 API

### TMDB Integration
Le projet utilise l'API **The Movie Database (TMDB)** pour récupérer :
- Informations sur les films et séries
- Images et posters haute qualité
- Données de casting et équipe
- Évaluations et critiques

### Configuration API
```javascript
// config.js
const API_CONFIG = {
  baseURL: 'https://api.themoviedb.org/3',
  apiKey: 'your-tmdb-api-key',
  imageBaseURL: 'https://image.tmdb.org/t/p/w500'
};
```

## 📸 Captures d'écran

### 🏠 Page d'accueil
- Interface moderne avec carrousels de contenu
- Navigation intuitive et recherche intégrée
- Thème sombre avec accents bleus

### 🎬 Catalogue films
- Organisation par genres
- Carrousels de défilement horizontal
- Fiches détaillées pour chaque film

### 👤 Gestion utilisateur
- Système d'authentification sécurisé
- Listes personnalisées (Favoris, À voir, Déjà vu)
- Profil utilisateur personnalisé

## 🎓 Objectifs pédagogiques

Ce projet démontre la maîtrise de :
- **Développement Frontend moderne**
- **Architecture modulaire** et maintenable
- **Design responsive** et accessible
- **Intégration d'API** REST
- **Gestion d'état** en JavaScript vanilla
- **Bonnes pratiques** de développement web

## 🚧 Améliorations futures

- [ ] **PWA** - Transformer en Progressive Web App
- [ ] **Offline** - Mode hors ligne avec cache
- [ ] **Performances** - Optimisation du chargement
- [ ] **Accessibilité** - Améliorer l'accessibilité WCAG
- [ ] **Tests** - Ajouter des tests unitaires
- [ ] **Backend** - API personnalisée avec base de données

## 👨‍💻 Auteur

**MALGONNE Léo**  
🎓 Étudiant en 3ème année à l'EFREI Paris  
📧 Email : [votre-email]  
🔗 LinkedIn : [votre-linkedin]  
🐙 GitHub : [votre-github]  

---

<div align="center">

**Développé avec ❤️ dans le cadre du cours de Conception Frontend**

*EFREI Paris - 1er Semestre 2025*

![BlueFlix Logo](https://img.shields.io/badge/BlueFlix-Streaming%20Platform-blue?style=for-the-badge)

</div>