// ====================================
//    APP.JS PRINCIPAL - MODULAIRE
// ====================================

// Importation des modules
import { CONFIG } from './config.js';
import { TMDBAPI } from './api.js';
import { UIManager } from './ui.js';
import { HeroManager } from './hero.js';
import { SearchManager } from './search.js';
import { ListsManager } from './lists.js';
import './auth.js'; // Système d'authentification

// =========================
// Variables globales
// =========================
let searchManager;
let listsManager;

// =========================
// Fonctions principales de chargement
// =========================

// Charger la page d'accueil
async function loadHome() {
  console.log("🎬 Chargement de la page d'accueil...");

  // Charger le hero banner dynamique
  await HeroManager.loadHeroBanner();

  const filmsRow = document.querySelector(".films-row");
  const seriesRow = document.querySelector(".series-row");

  console.log("📍 Films row found:", !!filmsRow);
  console.log("📍 Series row found:", !!seriesRow);

  if (filmsRow) {
    console.log("🎬 Chargement des films...");
    await loadMovieRow(filmsRow, 'popular');
  }

  if (seriesRow) {
    console.log("📺 Chargement des séries...");
    await loadSeriesRow(seriesRow);
  }

  // Charger les autres sections si elles existent
  await loadAdditionalSections();
}

// Charger une rangée de films
async function loadMovieRow(container, type = 'popular') {
  // Si container est déjà la row, l'utiliser directement, sinon chercher .row à l'intérieur
  const row = container.classList?.contains('row') ? container : container.querySelector(".row");
  if (!row) {
    console.error("❌ Aucun conteneur .row trouvé dans:", container);
    return;
  }

  console.log("🎯 Chargement dans:", row.className);
  UIManager.showLoading(row, "Chargement des films...");

  try {
    let data;
    switch(type) {
      case 'popular':
        data = await TMDBAPI.getPopularMovies();
        break;
      case 'top_rated':
        data = await TMDBAPI.getTopRatedMovies();
        break;
      case 'trending':
        data = await TMDBAPI.getTrendingMovies();
        break;
      default:
        data = await TMDBAPI.getPopularMovies();
    }

    UIManager.clearContainer(row);

    if (data && data.length > 0) {
      data.forEach(movie => {
        const card = UIManager.createCard(movie, "movie");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log("✅ Films chargés:", data.length);
    } else {
      console.warn("⚠️ Aucun film reçu de l'API");
      UIManager.showMessage(row, "Aucun film disponible");
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des films:", error);
    UIManager.showError(row, "Erreur de chargement des films");
  }
}

// Charger une rangée de séries
async function loadSeriesRow(container, type = 'popular') {
  // Si container est déjà la row, l'utiliser directement, sinon chercher .row à l'intérieur
  const row = container.classList?.contains('row') ? container : container.querySelector(".row");
  if (!row) {
    console.error("❌ Aucun conteneur .row trouvé dans:", container);
    return;
  }

  console.log("🎯 Chargement séries dans:", row.className);
  UIManager.showLoading(row, "Chargement des séries...");

  try {
    let data;
    switch(type) {
      case 'popular':
        data = await TMDBAPI.getPopularSeries();
        break;
      case 'top_rated':
        data = await TMDBAPI.getTopRatedSeries();
        break;
      case 'trending':
        data = await TMDBAPI.getTrendingSeries();
        break;
      case 'airing_today':
        data = await TMDBAPI.getAiringTodaySeries();
        break;
      case 'on_the_air':
        data = await TMDBAPI.getOnTheAirSeries();
        break;
      default:
        console.warn(`⚠️ Type de série inconnu: ${type}, utilisation de 'popular'`);
        data = await TMDBAPI.getPopularSeries();
    }

    UIManager.clearContainer(row);

    if (data && data.length > 0) {
      data.forEach(series => {
        const card = UIManager.createCard(series, "tv");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log("✅ Séries chargées:", data.length, `(${type})`);
    } else {
      console.warn("⚠️ Aucune série reçue de l'API");
      UIManager.showMessage(row, "Aucune série disponible");
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des séries:", error);
    UIManager.showError(row, "Erreur de chargement des séries");
  }
}

// Charger des films par genre
async function loadMovieRowByGenre(container, genreKey) {
  const row = container.classList?.contains('row') ? container : container.querySelector(".row");
  if (!row) {
    console.error("❌ Aucun conteneur .row trouvé dans:", container);
    return;
  }

  console.log("🎯 Chargement films par genre:", genreKey);
  UIManager.showLoading(row, "Chargement des films...");

  try {
    const genreId = CONFIG.movieGenres[genreKey];
    if (!genreId) {
      console.warn(`⚠️ Genre inconnu: ${genreKey}`);
      const data = await TMDBAPI.getPopularMovies();
      UIManager.clearContainer(row);
      if (data && data.length > 0) {
        data.forEach(movie => {
          const card = UIManager.createCard(movie, "movie");
          if (card) {
            UIManager.appendToContainer(row, card);
          }
        });
      }
      return;
    }

    const data = await TMDBAPI.getMoviesByGenre(genreId);
    UIManager.clearContainer(row);

    if (data && data.length > 0) {
      data.forEach(movie => {
        const card = UIManager.createCard(movie, "movie");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log(`✅ Films ${genreKey} chargés:`, data.length);
    } else {
      console.warn("⚠️ Aucun film reçu pour le genre:", genreKey);
      UIManager.showMessage(row, "Aucun film disponible");
    }

  } catch (error) {
    console.error("❌ Erreur lors du chargement des films par genre:", error);
    UIManager.showError(row, "Erreur de chargement");
  }
}

// Charger des séries par genre
async function loadSeriesRowByGenre(container, genreKey) {
  const row = container.classList?.contains('row') ? container : container.querySelector(".row");
  if (!row) {
    console.error("❌ Aucun conteneur .row trouvé dans:", container);
    return;
  }

  console.log("🎯 Chargement séries par genre:", genreKey);
  UIManager.showLoading(row, "Chargement des séries...");

  try {
    const genreId = CONFIG.seriesGenres[genreKey];
    if (!genreId) {
      console.warn(`⚠️ Genre inconnu: ${genreKey}`);
      const data = await TMDBAPI.getPopularSeries();
      UIManager.clearContainer(row);
      if (data && data.length > 0) {
        data.forEach(series => {
          const card = UIManager.createCard(series, "tv");
          if (card) {
            UIManager.appendToContainer(row, card);
          }
        });
      }
      return;
    }

    const data = await TMDBAPI.getSeriesByGenre(genreId);
    UIManager.clearContainer(row);

    if (data && data.length > 0) {
      data.forEach(series => {
        const card = UIManager.createCard(series, "tv");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log(`✅ Séries ${genreKey} chargées:`, data.length);
    } else {
      console.warn("⚠️ Aucune série reçue pour le genre:", genreKey);
      UIManager.showMessage(row, "Aucune série disponible");
    }

  } catch (error) {
    console.error("❌ Erreur lors du chargement des séries par genre:", error);
    UIManager.showError(row, "Erreur de chargement");
  }
}

// Charger les sections additionnelles
async function loadAdditionalSections() {
  // Charger les films les mieux notés
  const topRatedSection = document.querySelector(".top-rated-row");
  if (topRatedSection) {
    await loadMovieRow(topRatedSection, 'top_rated');
  }

  // Charger les tendances
  const trendingSection = document.querySelector(".trending-row");
  if (trendingSection) {
    await loadMovieRow(trendingSection, 'trending');
  }
}

// Charger la page des films
async function loadMovies() {
  console.log("🎬 Chargement de la page des films...");
  
  const movieStrips = document.querySelectorAll(".movies-page .strip");
  
  for (const strip of movieStrips) {
    const rowContainer = strip.querySelector('.row');
    if (rowContainer) {
      const type = strip.dataset.type;
      const genre = strip.dataset.genre;
      
      if (type) {
        // Utiliser l'API par type (popular, top_rated, etc.)
        await loadMovieRow(rowContainer, type);
      } else if (genre) {
        // Utiliser l'API par genre
        await loadMovieRowByGenre(rowContainer, genre);
      } else {
        // Par défaut, charger populaire
        await loadMovieRow(rowContainer, 'popular');
      }
    }
  }
}

// Charger la page des séries
async function loadSeries() {
  console.log("📺 Chargement de la page des séries...");
  
  const seriesStrips = document.querySelectorAll(".series-page .strip");
  
  for (const strip of seriesStrips) {
    const rowContainer = strip.querySelector('.row');
    if (rowContainer) {
      const type = strip.dataset.type;
      const genre = strip.dataset.genre;
      
      if (type) {
        // Utiliser l'API par type (popular, top_rated, etc.)
        await loadSeriesRow(rowContainer, type);
      } else if (genre) {
        // Utiliser l'API par genre
        await loadSeriesRowByGenre(rowContainer, genre);
      } else {
        // Par défaut, charger populaire
        await loadSeriesRow(rowContainer, 'popular');
      }
    }
  }
}

// =========================
// Modal de détails (placeholder - sera étendue)
// =========================
function showDetailModal(id, type) {
  console.log(`🎬 Opening detail modal for ${type} ${id}`);
  // Cette fonction sera étendue ou remplacée par un module modal dédié
  UIManager.showNotification(`Ouverture des détails du ${type === 'movie' ? 'film' : 'série'} ${id}`, 'info');
}

// =========================
// Navigation et détection de page
// =========================
function detectPageAndLoad() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  
  console.log("🔍 Page détectée:", page);
  
  switch(page) {
    case 'index.html':
    case '':
      loadHome();
      break;
    case 'movies.html':
      loadMovies();
      break;
    case 'series.html':
      loadSeries();
      break;
    case 'list.html':
      // Les listes sont gérées par ListsManager
      break;
    default:
      console.log("📄 Page inconnue, chargement par défaut");
      loadHome();
  }
}

// =========================
// Fonctions utilitaires globales (pour la compatibilité)
// =========================
window.showDetailModal = showDetailModal;
window.showMovieDetail = showDetailModal;

// Fonction pour la page des listes
window.showMovieDetail = function(movieId) {
  showDetailModal(movieId, 'movie');
};

// =========================
// Initialisation de l'application
// =========================
function initApp() {
  console.log("🚀 Initialisation de BlueFlix...");
  
  // Initialiser les gestionnaires
  UIManager.initHamburgerMenu();
  UIManager.initScrollEffects();
  UIManager.initScrollButtons();
  
  // Initialiser la recherche
  searchManager = new SearchManager();
  searchManager.init();
  
  // Initialiser les listes (si on est sur la page des listes)
  if (window.location.pathname.includes('list.html')) {
    listsManager = new ListsManager();
    listsManager.init();
    window.listsManager = listsManager; // Pour l'accès global
  }
  
  // Initialiser les événements du hero
  HeroManager.initHeroEvents();
  
  // Initialiser l'authentification - maintenant importé directement
  if (window.auth) {
    console.log("🔐 Système d'authentification détecté");
    // Réinitialiser l'auth si nécessaire
    window.auth.reinitEventListeners();
  } else {
    console.warn("⚠️ Système d'authentification non trouvé - tentative de réinitialisation...");
    // Essayer de réinitialiser après un court délai
    setTimeout(() => {
      if (window.auth) {
        console.log("🔐 Système d'authentification trouvé en différé");
        window.auth.reinitEventListeners();
      } else {
        console.error("❌ Impossible d'initialiser l'authentification");
      }
    }, 500);
  }
  
  // Détecter et charger le contenu de la page
  detectPageAndLoad();
  
  // Exposer les fonctions principales pour accès global (debug/compatibilité)
  window.loadHome = loadHome;
  window.loadMovies = loadMovies;
  window.loadSeries = loadSeries;
  window.loadMovieRow = loadMovieRow;
  window.loadSeriesRow = loadSeriesRow;
  window.CONFIG = CONFIG;
  window.TMDBAPI = TMDBAPI;
  // showDetailModal déjà assigné dans la fonction
  
  console.log("✅ BlueFlix initialisé avec succès!");
}

// =========================
// Gestionnaire d'événements DOMContentLoaded
// =========================
document.addEventListener("DOMContentLoaded", initApp);

// Export pour la compatibilité avec les autres modules
export { 
  loadHome, 
  loadMovies, 
  loadSeries, 
  showDetailModal,
  searchManager,
  listsManager 
};