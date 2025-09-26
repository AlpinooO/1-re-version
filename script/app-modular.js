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
  const row = container.querySelector(".row");
  if (!row) return;

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

    if (data.results && data.results.length > 0) {
      data.results.forEach(movie => {
        const card = UIManager.createCard(movie, "movie");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log("✅ Films chargés:", data.results.length);
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des films:", error);
    UIManager.showError(row);
  }
}

// Charger une rangée de séries
async function loadSeriesRow(container) {
  const row = container.querySelector(".row");
  if (!row) return;

  UIManager.showLoading(row, "Chargement des séries...");

  try {
    const data = await TMDBAPI.getPopularSeries();
    UIManager.clearContainer(row);

    if (data.results && data.results.length > 0) {
      data.results.forEach(series => {
        const card = UIManager.createCard(series, "tv");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log("✅ Séries chargées:", data.results.length);
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des séries:", error);
    UIManager.showError(row);
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
  
  const movieRows = document.querySelectorAll(".movies-page .strip");
  
  for (const row of movieRows) {
    const type = row.dataset.type || 'popular';
    await loadMovieRow(row, type);
  }
}

// Charger la page des séries
async function loadSeries() {
  console.log("📺 Chargement de la page des séries...");
  
  const seriesRows = document.querySelectorAll(".series-page .strip");
  
  for (const row of seriesRows) {
    await loadSeriesRow(row);
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
  
  // Détecter et charger le contenu de la page
  detectPageAndLoad();
  
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