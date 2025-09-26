// Point d'entrée modulaire simplifié (anciennes pages)
import { CONFIG } from './config.js';
import { TMDBAPI } from './api.js';
import { UIManager } from './ui.js';
import { HeroManager } from './hero.js';
import { SearchManager } from './search.js';
import { ListsManager } from './lists.js';

let searchManager;
let listsManager;

async function loadHome() { // Charge page d'accueil

  // Charger le hero banner dynamique
  await HeroManager.loadHeroBanner();

  const filmsRow = document.querySelector(".films-row");
  const seriesRow = document.querySelector(".series-row");

  

  if (filmsRow) {
    await loadMovieRow(filmsRow, 'popular');
  }

  if (seriesRow) {
    await loadSeriesRow(seriesRow);
  }

  // Charger les autres sections si elles existent
  await loadAdditionalSections();
}

async function loadMovieRow(container, type = 'popular') { // Charge une rangée de films
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
      
    }
  } catch (error) {
    // erreur lors du chargement des films
    UIManager.showError(row);
  }
}

async function loadSeriesRow(container) { // Charge une rangée de séries
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
      
    }
  } catch (error) {
    // erreur lors du chargement des séries
    UIManager.showError(row);
  }
}

async function loadAdditionalSections() { // Sections complémentaires
  const topRatedSection = document.querySelector(".top-rated-row");
  if (topRatedSection) {
    await loadMovieRow(topRatedSection, 'top_rated');
  }

  const trendingSection = document.querySelector(".trending-row");
  if (trendingSection) {
    await loadMovieRow(trendingSection, 'trending');
  }
}

async function loadMovies() { // Page films
  
  const movieRows = document.querySelectorAll(".movies-page .strip");
  
  for (const row of movieRows) {
    const type = row.dataset.type || 'popular';
    await loadMovieRow(row, type);
  }
}

async function loadSeries() { // Page séries
  
  const seriesRows = document.querySelectorAll(".series-page .strip");
  
  for (const row of seriesRows) {
    await loadSeriesRow(row);
  }
}

function showDetailModal(id, type) { // Ouvre modale détail (placeholder)
  UIManager.showNotification(`Ouverture des détails du ${type === 'movie' ? 'film' : 'série'} ${id}`, 'info');
}

function detectPageAndLoad() { // Détection page courante
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  
  
  
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
      
      loadHome();
  }
}

window.showDetailModal = showDetailModal;
window.showMovieDetail = showDetailModal;

window.showMovieDetail = function(movieId) {
  showDetailModal(movieId, 'movie');
};

function initApp() {
  
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