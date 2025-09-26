// =========================
// UI - Gestion de l'interface utilisateur
// =========================

import { TMDBAPI } from './api.js';
import { CONFIG } from './config.js';

export class UIManager {
  
  // Initialiser le menu hamburger
  static initHamburgerMenu() {
    const hamburger = document.getElementById("hamburger");
    const mobileNav = document.getElementById("mobile-nav");

    if (hamburger && mobileNav) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        mobileNav.classList.toggle("open");
      });

      // Fermer le menu quand on clique sur un lien
      mobileNav.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          hamburger.classList.remove("active");
          mobileNav.classList.remove("open");
        }
      });

      // Fermer le menu quand on clique à côté
      document.addEventListener("click", (e) => {
        if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
          hamburger.classList.remove("active");
          mobileNav.classList.remove("open");
        }
      });

      // Fermer le menu lors du redimensionnement de l'écran
      window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
          hamburger.classList.remove("active");
          mobileNav.classList.remove("open");
        }
      });
    }
  }

  // Créer une carte de film/série
  static createCard(item, type = "movie") {
    console.log("🎨 Création carte pour:", item.title || item.name, "- Type:", type);
    
    if (!item.poster_path) {
      console.log("⚠️ Skipping item without poster:", item.title || item.name);
      return null;
    }
    
    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";
    card.dataset.id = item.id;
    card.dataset.type = type;
    
    const imageUrl = TMDBAPI.getImageUrl(item.poster_path);
    console.log("🖼️ Image URL:", imageUrl);
    
    const label = type === 'movie' ? (item.title || 'Film') : (item.name || 'Série');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Voir les détails de ${label}`);
    card.innerHTML = `<img src="${imageUrl}" alt="${label}">`;

    // Ajouter l'événement de clic pour ouvrir la popup
    const openDetails = () => {
      console.log(`🎬 Card clicked: ${type} ${item.id}`);
      if (window.showDetailModal) {
        window.showDetailModal(item.id, type);
      } else {
        console.error("❌ showDetailModal not available, showing notification fallback");
        UIManager.showNotification(`Détails ${type === 'movie' ? 'du film' : 'de la série'}: ${item.title || item.name}`, 'info');
      }
    };

    card.addEventListener("click", openDetails);
    card.addEventListener("keypress", (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetails();
      }
    });

    return card;
  }

  // Afficher/masquer les éléments de chargement
  static showLoading(container, message = "Chargement...") {
    if (container) {
      container.innerHTML = `<div class="loading">${message}</div>`;
    }
  }

  static hideLoading(container) {
    const loading = container?.querySelector('.loading');
    if (loading) {
      loading.remove();
    }
  }

  // Afficher une notification
  static showNotification(message, type = 'info', duration = CONFIG.notificationDuration) {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Ajouter au DOM
    document.body.appendChild(notification);

    // Afficher avec animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Masquer et supprimer automatiquement
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  // Gérer la topbar au scroll
  static initScrollEffects() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        topbar.classList.add('scrolled');
      } else {
        topbar.classList.remove('scrolled');
      }
      
      lastScrollY = scrollY;
    });
  }

  // Initialiser les boutons de défilement horizontal
  static initScrollButtons() {
    const rowContainers = document.querySelectorAll('.row-container');
    
    rowContainers.forEach(container => {
      const row = container.querySelector('.row');
      if (!row) return;

      // Créer les boutons
      const leftBtn = document.createElement('button');
      leftBtn.className = 'scroll-btn left';
      leftBtn.innerHTML = '❮';
      
      const rightBtn = document.createElement('button');
      rightBtn.className = 'scroll-btn right';
      rightBtn.innerHTML = '❯';

      // Ajouter les boutons au container
      container.appendChild(leftBtn);
      container.appendChild(rightBtn);

      // Event listeners
      leftBtn.addEventListener('click', () => {
        row.scrollBy({ left: -300, behavior: 'smooth' });
      });

      rightBtn.addEventListener('click', () => {
        row.scrollBy({ left: 300, behavior: 'smooth' });
      });

      // Masquer/afficher les boutons selon le scroll
      const updateButtons = () => {
        const { scrollLeft, scrollWidth, clientWidth } = row;
        leftBtn.style.opacity = scrollLeft > 0 ? '1' : '0';
        rightBtn.style.opacity = scrollLeft < scrollWidth - clientWidth - 1 ? '1' : '0';
      };

      row.addEventListener('scroll', updateButtons);
      window.addEventListener('resize', updateButtons);
      updateButtons(); // Initial check
    });
  }

  // Removed duplicate showDetailModal method - now called directly from card click events

  // Utilitaires pour manipuler les classes CSS
  static addClass(element, className) {
    if (element) element.classList.add(className);
  }

  static removeClass(element, className) {
    if (element) element.classList.remove(className);
  }

  static toggleClass(element, className) {
    if (element) element.classList.toggle(className);
  }

  // Utilitaire pour vider et remplir un container
  static clearContainer(container) {
    if (container) container.innerHTML = '';
  }

  static appendToContainer(container, element) {
    if (container && element) container.appendChild(element);
  }

  // Gestion des messages informatifs
  static showMessage(container, message) {
    if (container) {
      container.innerHTML = `
        <div class="info-message">
          <h3>ℹ️ Information</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }

  // Gestion des états d'erreur
  static showError(container, message = CONFIG.messages.fetchError) {
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h3>⚠️ Erreur</h3>
          <p>${message}</p>
          <button onclick="location.reload()" class="retry-btn">Réessayer</button>
        </div>
      `;
    }
  }
}