import { CONFIG } from './config.js';
import { TMDBAPI } from './api.js';
import { UIManager } from './ui.js';
import { HeroManager } from './hero.js';
import { SearchManager } from './search.js';
import { ListsManager } from './lists.js';

let searchManager;
let listsManager;

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

async function loadAdditionalSections() {
  const topRatedSection = document.querySelector(".top-rated-row");
  if (topRatedSection) {
    await loadMovieRow(topRatedSection, 'top_rated');
  }

  const trendingSection = document.querySelector(".trending-row");
  if (trendingSection) {
    await loadMovieRow(trendingSection, 'trending');
  }
}

async function loadMovies() {
  console.log("🎬 Chargement de la page des films...");
  
  const movieRows = document.querySelectorAll(".movies-page .strip");
  
  for (const row of movieRows) {
    const type = row.dataset.type || 'popular';
    await loadMovieRow(row, type);
  }
}

async function loadSeries() {
  console.log("📺 Chargement de la page des séries...");
  
  const seriesRows = document.querySelectorAll(".series-page .strip");
  
  for (const row of seriesRows) {
    await loadSeriesRow(row);
  }
}

function showDetailModal(id, type) {
  console.log(`🎬 Opening detail modal for ${type} ${id}`);
  UIManager.showNotification(`Ouverture des détails du ${type === 'movie' ? 'film' : 'série'} ${id}`, 'info');
}

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

window.showDetailModal = showDetailModal;
window.showMovieDetail = showDetailModal;

window.showMovieDetail = function(movieId) {
  showDetailModal(movieId, 'movie');
};

function initApp() {
  console.log("🚀 Initialisation de BlueFlix...");
  
  UIManager.initHamburgerMenu();
  UIManager.initScrollEffects();
  UIManager.initScrollButtons();
  
  searchManager = new SearchManager();
  searchManager.init();
  
  if (window.location.pathname.includes('list.html')) {
    listsManager = new ListsManager();
    listsManager.init();
    window.listsManager = listsManager; // Pour l'accès global
  }
  
  HeroManager.initHeroEvents();
  
  detectPageAndLoad();
  
  console.log("✅ BlueFlix initialisé avec succès!");
}

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