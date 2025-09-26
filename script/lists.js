// =========================
// Lists - Gestion des listes utilisateur
// =========================

import { TMDBAPI } from './api.js';
import { UIManager } from './ui.js';

export class ListsManager {
  
  constructor() {
    this.currentUser = null;
  }

  // Initialiser les listes
  init() {
    this.currentUser = this.getCurrentUser();
    this.checkAuthStatus();
    this.initTabs();
    this.setupEventListeners();
    
    if (this.currentUser) {
      this.loadUserLists();
    }
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    return localStorage.getItem('blueflix_current_user');
  }

  // Obtenir tous les utilisateurs
  getUsers() {
    return JSON.parse(localStorage.getItem('blueflix_users') || '{}');
  }

  // Sauvegarder les utilisateurs
  setUsers(users) {
    localStorage.setItem('blueflix_users', JSON.stringify(users));
  }

  // Vérifier le statut d'authentification
  checkAuthStatus() {
    const loginRequired = document.getElementById('login-required');
    const listsContainer = document.getElementById('lists-container');
    
    if (this.currentUser) {
      if (loginRequired) loginRequired.style.display = 'none';
      if (listsContainer) listsContainer.style.display = 'block';
    } else {
      if (loginRequired) loginRequired.style.display = 'flex';
      if (listsContainer) listsContainer.style.display = 'none';
    }
  }

  // Initialiser les onglets
  initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });
  }

  // Changer d'onglet
  switchTab(tabName) {
    // Mettre à jour les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Mettre à jour le contenu
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    const activeContent = document.getElementById(`${tabName}-content`);
    if (activeContent) activeContent.classList.add('active');
  }

  // Charger les listes de l'utilisateur
  loadUserLists() {
    if (!this.currentUser) return;
    
    const users = this.getUsers();
    const userLists = users[this.currentUser]?.lists || {};
    
    // Charger chaque liste
    Object.keys(userLists).forEach(listName => {
      this.loadList(listName, userLists[listName]);
      this.updateListCount(listName, userLists[listName].length);
    });
  }

  // Charger une liste spécifique
  async loadList(listName, movieIds) {
    const container = document.getElementById(`${listName}-grid`);
    if (!container) return;
    
    if (movieIds.length === 0) {
      this.showEmptyList(container, listName);
      return;
    }
    
    UIManager.showLoading(container, 'Chargement de la liste...');
    
    try {
      const movies = await Promise.all(
        movieIds.map(async (id) => {
          const movie = await TMDBAPI.getMovieDetails(id);
          return movie.id ? movie : null;
        })
      );
      
      const validMovies = movies.filter(movie => movie !== null);
      this.renderMoviesList(container, validMovies, listName);
      
    } catch (error) {
      console.error('Erreur lors du chargement de la liste:', error);
      UIManager.showError(container, 'Erreur lors du chargement de la liste.');
    }
  }

  // Afficher les films dans une liste
  renderMoviesList(container, movies, listName) {
    if (movies.length === 0) {
      this.showEmptyList(container, listName);
      return;
    }
    
    const moviesHTML = movies.map(movie => `
      <div class="movie-item" onclick="showMovieDetail(${movie.id})">
        <img src="${movie.poster_path ? TMDBAPI.getImageUrl(movie.poster_path) : 'https://via.placeholder.com/300x450/333/fff?text=Pas+d\'image'}" 
             alt="${movie.title}" 
             class="movie-poster">
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-meta">
            <span class="movie-year">${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
            <span class="movie-rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
          </div>
          <div class="movie-actions">
            <button class="action-btn" onclick="event.stopPropagation(); showMovieDetail(${movie.id})" title="Voir les détails">
              👁️
            </button>
            <button class="action-btn remove-btn" onclick="event.stopPropagation(); listsManager.removeFromList(${movie.id}, '${listName}')" title="Retirer de la liste">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = moviesHTML;
  }

  // Afficher un message pour une liste vide
  showEmptyList(container, listName) {
    const messages = {
      favoris: {
        icon: '❤️',
        title: 'Aucun favori pour le moment',
        text: 'Ajoutez des films à vos favoris en naviguant dans notre catalogue.'
      },
      aVoir: {
        icon: '📋',
        title: 'Votre liste est vide',
        text: 'Ajoutez des films que vous souhaitez regarder plus tard.'
      },
      dejaVu: {
        icon: '✅',
        title: 'Aucun film marqué comme vu',
        text: 'Marquez les films que vous avez regardés pour les retrouver facilement.'
      }
    };
    
    const msg = messages[listName] || messages.favoris;
    
    container.innerHTML = `
      <div class="empty-list">
        <i>${msg.icon}</i>
        <h3>${msg.title}</h3>
        <p>${msg.text}</p>
        <a href="../index.html" class="browse-btn">Parcourir le catalogue</a>
      </div>
    `;
  }

  // Mettre à jour le compteur d'une liste
  updateListCount(listName, count) {
    const countElement = document.getElementById(`${listName}-count`);
    if (countElement) {
      countElement.textContent = count;
    }
  }

  // Ajouter un film à une liste
  addToList(movieId, listName) {
    if (!this.currentUser) {
      UIManager.showNotification('Vous devez être connecté pour ajouter des films à vos listes.', 'warning');
      return false;
    }
    
    const users = this.getUsers();
    if (!users[this.currentUser]) {
      users[this.currentUser] = { lists: { favoris: [], aVoir: [], dejaVu: [] } };
    }
    
    const userLists = users[this.currentUser].lists;
    if (!userLists[listName]) {
      userLists[listName] = [];
    }
    
    // Vérifier si le film n'est pas déjà dans la liste
    if (userLists[listName].includes(movieId)) {
      UIManager.showNotification('Ce film est déjà dans votre liste.', 'info');
      return false;
    }
    
    // Ajouter le film
    userLists[listName].push(movieId);
    
    // Sauvegarder
    this.setUsers(users);
    
    // Notification
    UIManager.showNotification(`Film ajouté à "${this.getListDisplayName(listName)}"`, 'success');
    
    // Émettre un événement
    this.dispatchListUpdate();
    
    return true;
  }

  // Retirer un film d'une liste
  removeFromList(movieId, listName) {
    if (!confirm('Êtes-vous sûr de vouloir retirer ce film de votre liste ?')) {
      return;
    }
    
    if (!this.currentUser) return;
    
    const users = this.getUsers();
    const userLists = users[this.currentUser]?.lists;
    if (!userLists) return;
    
    // Retirer le film de la liste
    userLists[listName] = userLists[listName].filter(id => id !== movieId);
    
    // Sauvegarder
    this.setUsers(users);
    
    // Recharger la liste
    this.loadList(listName, userLists[listName]);
    this.updateListCount(listName, userLists[listName].length);
    
    // Notification
    UIManager.showNotification(`Film retiré de votre liste "${this.getListDisplayName(listName)}"`, 'success');
    
    // Émettre un événement
    this.dispatchListUpdate();
  }

  // Vérifier si un film est dans une liste
  isInList(movieId, listName) {
    if (!this.currentUser) return false;
    
    const users = this.getUsers();
    const userLists = users[this.currentUser]?.lists;
    if (!userLists || !userLists[listName]) return false;
    
    return userLists[listName].includes(movieId);
  }

  // Obtenir le nom d'affichage d'une liste
  getListDisplayName(listName) {
    const names = {
      favoris: 'Favoris',
      aVoir: 'À regarder',
      dejaVu: 'Déjà vu'
    };
    return names[listName] || listName;
  }

  // Configurer les événements
  setupEventListeners() {
    // Event listener pour les mises à jour en temps réel
    window.addEventListener('userListsUpdated', () => {
      this.loadUserLists();
    });
    
    // Event listener pour la connexion/déconnexion
    window.addEventListener('authStateChanged', (e) => {
      this.currentUser = this.getCurrentUser();
      this.checkAuthStatus();
      if (e.detail?.isLoggedIn) {
        this.loadUserLists();
      }
    });
  }

  // Émettre un événement de mise à jour des listes
  dispatchListUpdate() {
    window.dispatchEvent(new CustomEvent('userListsUpdated'));
  }

  // Obtenir les statistiques des listes
  getListStats() {
    if (!this.currentUser) return null;
    
    const users = this.getUsers();
    const userLists = users[this.currentUser]?.lists;
    if (!userLists) return null;
    
    return {
      favoris: userLists.favoris?.length || 0,
      aVoir: userLists.aVoir?.length || 0,
      dejaVu: userLists.dejaVu?.length || 0,
      total: (userLists.favoris?.length || 0) + (userLists.aVoir?.length || 0) + (userLists.dejaVu?.length || 0)
    };
  }
}