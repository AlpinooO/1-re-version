// =========================
// Search - Gestion de la recherche
// =========================

import { TMDBAPI } from './api.js';
import { UIManager } from './ui.js';
import { CONFIG } from './config.js';

export class SearchManager {
  
  constructor() {
    this.isSearching = false;
    this.searchTimeout = null;
    this.currentResults = [];
  }

  // Initialiser la recherche
  init() {
    this.setupSearchEvents();
    this.setupModalSearch();
  }

  // Configurer les événements de recherche
  setupSearchEvents() {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-btn");
    
    if (searchInput && searchButton) {
      // Recherche en temps réel avec debounce
      searchInput.addEventListener("input", (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          if (e.target.value.trim().length >= 2) {
            this.performSearch(e.target.value.trim());
          }
        }, 300);
      });

      // Recherche au clic
      searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
          this.performSearch(query);
        }
      });

      // Recherche à l'appui sur Entrée
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = searchInput.value.trim();
          if (query) {
            this.performSearch(query);
          }
        }
      });
    }
  }

  // Configurer la recherche dans les modals
  setupModalSearch() {
    const modalSearchInput = document.getElementById("modal-search-input");
    const modalSearchButton = document.getElementById("modal-search-btn");
    
    if (modalSearchInput && modalSearchButton) {
      modalSearchInput.addEventListener("input", (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          if (e.target.value.trim().length >= 2) {
            this.performModalSearch(e.target.value.trim());
          }
        }, 300);
      });

      modalSearchButton.addEventListener("click", () => {
        const query = modalSearchInput.value.trim();
        if (query) {
          this.performModalSearch(query);
        }
      });

      modalSearchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = modalSearchInput.value.trim();
          if (query) {
            this.performModalSearch(query);
          }
        }
      });
    }
  }

  // Effectuer une recherche standard
  async performSearch(query) {
    if (this.isSearching) return;
    
    this.isSearching = true;
    console.log("🔍 Recherche:", query);

    try {
      // Afficher le modal de recherche s'il n'est pas ouvert
      this.showSearchModal();
      
      // Afficher l'état de chargement
      this.showSearchLoading();
      
      // Effectuer la recherche
      const data = await TMDBAPI.searchMulti(query);
      this.currentResults = data.results || [];
      
      // Afficher les résultats
      this.displaySearchResults(this.currentResults, query);
      
    } catch (error) {
      console.error("❌ Erreur de recherche:", error);
      this.showSearchError();
    } finally {
      this.isSearching = false;
    }
  }

  // Effectuer une recherche dans le modal
  async performModalSearch(query) {
    if (this.isSearching) return;
    
    this.isSearching = true;
    console.log("🔍 Recherche modale:", query);

    try {
      this.showModalSearchLoading();
      
      const data = await TMDBAPI.searchMulti(query);
      this.currentResults = data.results || [];
      
      this.displayModalSearchResults(this.currentResults, query);
      
    } catch (error) {
      console.error("❌ Erreur de recherche modale:", error);
      this.showModalSearchError();
    } finally {
      this.isSearching = false;
    }
  }

  // Afficher le modal de recherche
  showSearchModal() {
    const modal = document.getElementById("search-modal") || this.createSearchModal();
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  // Créer le modal de recherche s'il n'existe pas
  createSearchModal() {
    const modal = document.createElement("div");
    modal.id = "search-modal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="modal-close">&times;</span>
        <div class="modal-search-container">
          <div class="search-container">
            <input type="text" id="modal-search-input" placeholder="Rechercher des films et séries...">
            <button id="modal-search-btn">🔍</button>
          </div>
        </div>
        <div class="modal-body" id="search-results-container">
          <!-- Résultats de recherche -->
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Gérer la fermeture du modal
    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => this.closeSearchModal());
    
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeSearchModal();
      }
    });

    // Configurer la recherche dans ce nouveau modal
    this.setupModalSearch();
    
    return modal;
  }

  // Fermer le modal de recherche
  closeSearchModal() {
    const modal = document.getElementById("search-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  }

  // Afficher l'état de chargement
  showSearchLoading() {
    const container = document.getElementById("search-results-container");
    if (container) {
      container.innerHTML = `
        <div class="search-loading">
          <div class="loading-spinner"></div>
          <p>Recherche en cours...</p>
        </div>
      `;
    }
  }

  showModalSearchLoading() {
    this.showSearchLoading();
  }

  // Afficher les résultats de recherche
  displaySearchResults(results, query) {
    const container = document.getElementById("search-results-container");
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-empty">
          <h3>Aucun résultat</h3>
          <p>Aucun résultat trouvé pour "${query}"</p>
          <p>Essayez avec d'autres mots-clés.</p>
        </div>
      `;
      return;
    }

    // Créer l'en-tête des résultats
    const header = `
      <div class="search-results-header">
        <h3>Résultats pour "${query}"</h3>
        <span class="results-count">${results.length} résultat${results.length > 1 ? 's' : ''}</span>
      </div>
    `;

    // Créer la grille des résultats
    const resultsGrid = results.map(item => this.createSearchResultCard(item)).join('');
    
    container.innerHTML = header + `<div class="search-results-grid">${resultsGrid}</div>`;
  }

  displayModalSearchResults(results, query) {
    this.displaySearchResults(results, query);
  }

  // Créer une carte de résultat de recherche
  createSearchResultCard(item) {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? date.split('-')[0] : '';
    const imageUrl = item.poster_path 
      ? TMDBAPI.getImageUrl(item.poster_path) 
      : 'https://via.placeholder.com/300x450/333/fff?text=Pas+d\'image';

    return `
      <div class="search-result-card card" onclick="showDetailModal(${item.id}, '${type}')">
        <img src="${imageUrl}" alt="${title}">
        <div class="card-info">
          <h4>${title}</h4>
          <p>${year}</p>
          <span class="media-type">${type === 'movie' ? '🎬' : '📺'}</span>
        </div>
      </div>
    `;
  }

  // Afficher les erreurs
  showSearchError() {
    const container = document.getElementById("search-results-container");
    if (container) {
      container.innerHTML = `
        <div class="search-error">
          <h3>⚠️ Erreur</h3>
          <p>Une erreur est survenue lors de la recherche.</p>
          <button onclick="location.reload()" class="retry-btn">Réessayer</button>
        </div>
      `;
    }
  }

  showModalSearchError() {
    this.showSearchError();
  }

  // Vider les résultats de recherche
  clearResults() {
    const container = document.getElementById("search-results-container");
    if (container) {
      container.innerHTML = '';
    }
    this.currentResults = [];
  }

  // Filtrer les résultats par type
  filterResults(type) {
    if (type === 'all') {
      this.displaySearchResults(this.currentResults);
    } else {
      const filtered = this.currentResults.filter(item => 
        item.media_type === type || (type === 'movie' && item.title) || (type === 'tv' && item.name)
      );
      this.displaySearchResults(filtered);
    }
  }
}