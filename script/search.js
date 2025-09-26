// Gestion des recherches et modale associée
import { TMDBAPI } from './api.js';
import { UIManager } from './ui.js';
import { CONFIG } from './config.js';

export class SearchManager { // Orchestrateur recherche UI
  
  constructor() { // État interne recherche
    this.isSearching = false;
    this.searchTimeout = null;
    this.currentResults = [];
  }
  init() { // Initialise écouteurs
    this.setupSearchEvents();
    this.setupModalSearch();
  }
  setupSearchEvents() { // Barre de recherche principale
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-btn");
    
    if (searchInput && searchButton) {
      searchInput.addEventListener("input", (e) => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          if (e.target.value.trim().length >= 2) {
            this.performSearch(e.target.value.trim());
          }
        }, 300);
      });
      searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
          this.performSearch(query);
        }
      });
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
  setupModalSearch() { // Recherche dans la modale
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
  async performSearch(query) { // Lance une recherche principale
    if (this.isSearching) return;
    
    this.isSearching = true;
    

    try {
      this.showSearchModal();
      
      this.showSearchLoading();
      
      const data = await TMDBAPI.searchMulti(query);
      this.currentResults = data.results || [];
      
      this.displaySearchResults(this.currentResults, query);
      
    } catch (error) {
      
      this.showSearchError();
    } finally {
      this.isSearching = false;
    }
  }
  async performModalSearch(query) { // Recherche via champ modale
    if (this.isSearching) return;
    
    this.isSearching = true;
    

    try {
      this.showModalSearchLoading();
      
      const data = await TMDBAPI.searchMulti(query);
      this.currentResults = data.results || [];
      
      this.displayModalSearchResults(this.currentResults, query);
      
    } catch (error) {
      
      this.showModalSearchError();
    } finally {
      this.isSearching = false;
    }
  }

  showSearchModal() { // Affiche/instancie la modale
    const modal = document.getElementById("search-modal") || this.createSearchModal();
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
  createSearchModal() { // Construit DOM modale recherche
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

    const closeBtn = modal.querySelector(".modal-close");
    closeBtn.addEventListener("click", () => this.closeSearchModal());
    
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeSearchModal();
      }
    });

    this.setupModalSearch();
    
    return modal;
  }
  closeSearchModal() { // Ferme la modale
    const modal = document.getElementById("search-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  }
  showSearchLoading() { // Placeholder chargement
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

  showModalSearchLoading() { // Alias modale
    this.showSearchLoading();
  }

  displaySearchResults(results, query) { // Injection résultats
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

    const header = `
      <div class="search-results-header">
        <h3>Résultats pour "${query}"</h3>
        <span class="results-count">${results.length} résultat${results.length > 1 ? 's' : ''}</span>
      </div>
    `;

    const resultsGrid = results.map(item => this.createSearchResultCard(item)).join('');
    
    container.innerHTML = header + `<div class="search-results-grid">${resultsGrid}</div>`;
  }

  displayModalSearchResults(results, query) { // Alias modale
    this.displaySearchResults(results, query);
  }

  createSearchResultCard(item) { // Carte résultat unique
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

  showSearchError() { // Affiche erreur recherche
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

  showModalSearchError() { // Alias modale
    this.showSearchError();
  }

  clearResults() { // Vide résultats
    const container = document.getElementById("search-results-container");
    if (container) {
      container.innerHTML = '';
    }
    this.currentResults = [];
  }
  filterResults(type) { // Filtre client
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