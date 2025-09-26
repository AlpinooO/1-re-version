# 🎬 BlueFlix


## 🎯 À propos

**BlueFlix** est une interface de streaming moderne développée dans le cadre du cours de **Conception Frontend** à l'EFREI Paris. Cette plateforme propose une expérience utilisateur inspirée des services de streaming contemporains, avec un design élégant utilisant un thème sombre et des accents bleus.

### Contexte académique
- **École** : EFREI Paris
- **Niveau** : 3ème année
- **Semestre** : 1er Semestre 2025
- **Cours** : Conception Frontend
- **Version** : 1.0





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


## MALGONNE Léo B3 DEV 3 🎓