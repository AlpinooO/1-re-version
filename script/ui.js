// Utilitaires UI génériques (notifications, cartes, effets)
import { TMDBAPI } from './api.js';
import { CONFIG } from './config.js';

export class UIManager { // Méthodes statiques d'UI
  static initUserDropdown() { // Dropdown utilisateur accessible
    const profile = document.getElementById('user-profile');
    if (!profile) return;
    const avatar = profile.querySelector('.user-avatar');
    const dropdown = profile.querySelector('.user-dropdown');
    if (!avatar || !dropdown) return;

    // Retirer logique pure hover si besoin (CSS :hover reste un fallback visuel desktop)
    avatar.setAttribute('role', 'button');
    avatar.setAttribute('tabindex', '0');
    avatar.setAttribute('aria-haspopup', 'true');
    avatar.setAttribute('aria-expanded', 'false');
    dropdown.setAttribute('aria-hidden', 'true');

    const open = () => {
      dropdown.classList.add('open');
      avatar.setAttribute('aria-expanded', 'true');
      dropdown.setAttribute('aria-hidden', 'false');
      const firstFocusable = dropdown.querySelector('a, button');
      if (firstFocusable) firstFocusable.focus({ preventScroll: true });
      document.addEventListener('keydown', handleKey, true);
      document.addEventListener('click', handleOutside, true);
    };

    const close = () => {
      dropdown.classList.remove('open');
      avatar.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-hidden', 'true');
      avatar.focus({ preventScroll: true });
      document.removeEventListener('keydown', handleKey, true);
      document.removeEventListener('click', handleOutside, true);
    };

    const toggle = () => {
      dropdown.classList.contains('open') ? close() : open();
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowDown' && dropdown.classList.contains('open')) {
        const items = [...dropdown.querySelectorAll('a, button')];
        if (items.length) items[0].focus();
      } else if (e.key === 'Tab' && dropdown.classList.contains('open')) {
        const focusables = [...dropdown.querySelectorAll('a, button')];
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const handleOutside = (e) => {
      if (!profile.contains(e.target)) {
        close();
      }
    };

    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });
    avatar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  }
  
  static initHamburgerMenu() { // Menu mobile hamburger
    const hamburger = document.getElementById("hamburger");
    const mobileNav = document.getElementById("mobile-nav");

    if (hamburger && mobileNav) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        mobileNav.classList.toggle("open");
      });

      mobileNav.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          hamburger.classList.remove("active");
          mobileNav.classList.remove("open");
        }
      });

      document.addEventListener("click", (e) => {
        if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
          hamburger.classList.remove("active");
          mobileNav.classList.remove("open");
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
          hamburger.classList.remove("active");
          mobileNav.classList.remove("open");
        }
      });
    }
  }

  static createCard(item, type = "movie") { // Crée carte affiche
    
    
    if (!item.poster_path) {
      
      return null;
    }
    
    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";
    card.dataset.id = item.id;
    card.dataset.type = type;
    
    const imageUrl = TMDBAPI.getImageUrl(item.poster_path);
    
    
    const label = type === 'movie' ? (item.title || 'Film') : (item.name || 'Série');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Voir les détails de ${label}`);
    card.innerHTML = `<img src="${imageUrl}" alt="${label}">`;

    const openDetails = () => {
      
      if (window.showDetailModal) {
        window.showDetailModal(item.id, type);
      } else {
        
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

  static showLoading(container, message = "Chargement...") { // Placeholder chargement
    if (container) {
      container.innerHTML = `<div class="loading">${message}</div>`;
    }
  }

  static hideLoading(container) { // Supprime loader
    const loading = container?.querySelector('.loading');
    if (loading) {
      loading.remove();
    }
  }

  static showNotification(message, type = 'info', duration = CONFIG.notificationDuration) { // Popup notification
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  static initScrollEffects() { // Effet barre scroll
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

  static initScrollButtons() { // Boutons scroll horizontal
    const rowContainers = document.querySelectorAll('.row-container');
    
    rowContainers.forEach(container => {
      const row = container.querySelector('.row');
      if (!row) return;

      const leftBtn = document.createElement('button');
      leftBtn.className = 'scroll-btn left';
      leftBtn.innerHTML = '❮';
      
      const rightBtn = document.createElement('button');
      rightBtn.className = 'scroll-btn right';
      rightBtn.innerHTML = '❯';

      container.appendChild(leftBtn);
      container.appendChild(rightBtn);

      leftBtn.addEventListener('click', () => {
        row.scrollBy({ left: -300, behavior: 'smooth' });
      });

      rightBtn.addEventListener('click', () => {
        row.scrollBy({ left: 300, behavior: 'smooth' });
      });

      const updateButtons = () => {
        const { scrollLeft, scrollWidth, clientWidth } = row;
        leftBtn.style.opacity = scrollLeft > 0 ? '1' : '0';
        rightBtn.style.opacity = scrollLeft < scrollWidth - clientWidth - 1 ? '1' : '0';
      };

      row.addEventListener('scroll', updateButtons);
      window.addEventListener('resize', updateButtons);
      updateButtons();
    });
  }
  static addClass(element, className) { // Ajoute classe
    if (element) element.classList.add(className);
  }

  static removeClass(element, className) { // Retire classe
    if (element) element.classList.remove(className);
  }

  static toggleClass(element, className) { // Bascule classe
    if (element) element.classList.toggle(className);
  }

  static clearContainer(container) { // Vide container
    if (container) container.innerHTML = '';
  }

  static appendToContainer(container, element) { // Ajoute élément
    if (container && element) container.appendChild(element);
  }

  static showMessage(container, message) { // Message informatif
    if (container) {
      container.innerHTML = `
        <div class="info-message">
          <h3>ℹ️ Information</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }

  static showError(container, message = CONFIG.messages.fetchError) { // Message d'erreur réessayable
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