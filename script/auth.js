// Système d'authentification complet pour BlueFlix

class AuthSystem {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.users = this.getUsers();
    this.init();
  }

  init() {
    console.log("🔐 Initialisation AuthSystem...");
    this.setupEventListeners();
    this.updateUI();
    this.updateNavigation();
    
    // Debug : vérifier les éléments trouvés
    console.log("🔍 Debug - Éléments trouvés :");
    console.log("- Bouton login:", !!document.getElementById('btn-login'));
    console.log("- Bouton register:", !!document.getElementById('btn-register')); 
    console.log("- Modal login:", !!document.getElementById('login-modal'));
    console.log("- Modal register:", !!document.getElementById('register-modal'));
    console.log("- Form login:", !!document.getElementById('login-form'));
    console.log("- Form register:", !!document.getElementById('register-form'));
    console.log("- Lien vers register:", !!document.getElementById('show-register'));
    console.log("- Lien vers login:", !!document.getElementById('show-login'));
  }

  // Gestion des utilisateurs
  getUsers() {
    return JSON.parse(localStorage.getItem('blueflix_users') || '{}');
  }

  setUsers(users) {
    localStorage.setItem('blueflix_users', JSON.stringify(users));
    this.users = users;
  }

  getCurrentUser() {
    return localStorage.getItem('blueflix_current_user');
  }

  setCurrentUser(email) {
    localStorage.setItem('blueflix_current_user', email);
    this.currentUser = email;
    this.updateUI();
    this.updateNavigation();
    this.dispatchAuthEvent(true);
  }

  logout() {
    localStorage.removeItem('blueflix_current_user');
    this.currentUser = null;
    this.updateUI();
    this.updateNavigation();
    this.dispatchAuthEvent(false);
  }

  // Configuration des event listeners
  setupEventListeners() {
    // Boutons d'ouverture des modals - supporter plusieurs IDs
    const loginBtn = document.getElementById('login-btn') || document.getElementById('btn-login');
    const registerBtn = document.getElementById('register-btn') || document.getElementById('btn-register');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', (e) => {
        console.log('🔓 Click sur bouton login détecté');
        e.preventDefault();
        this.showLoginModal();
      });
      console.log("🔗 Event listener ajouté au bouton de connexion");
    } else {
      console.warn("⚠️ Bouton de connexion non trouvé");
    }
    if (registerBtn) {
      registerBtn.addEventListener('click', (e) => {
        console.log('📝 Click sur bouton register détecté');
        e.preventDefault();
        this.showRegisterModal();
      });
      console.log("🔗 Event listener ajouté au bouton d'inscription");
    } else {
      console.warn("⚠️ Bouton d'inscription non trouvé");
    }

    // Boutons de fermeture des modals
    const loginClose = document.getElementById('login-close');
    const registerClose = document.getElementById('register-close');
    
    if (loginClose) loginClose.addEventListener('click', () => this.hideLoginModal());
    if (registerClose) registerClose.addEventListener('click', () => this.hideRegisterModal());

    // Liens de navigation entre les modals (dans le HTML statique)
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    
    if (showRegisterLink) {
      showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideLoginModal();
        this.showRegisterModal();
      });
    }
    
    if (showLoginLink) {
      showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideRegisterModal();
        this.showLoginModal();
      });
    }

    // Formulaires
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));

    // Bouton de déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

    // Fermeture des modals en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
      const loginModal = document.getElementById('login-modal');
      const registerModal = document.getElementById('register-modal');
      
      if (e.target === loginModal) this.hideLoginModal();
      if (e.target === registerModal) this.hideRegisterModal();
    });
  }

  // Gestion des modals
  showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex'; // Force l'affichage
      this.populateLoginForm();
      console.log("🔓 Modal de connexion ouverte");
    } else {
      console.error("❌ Modal de connexion non trouvée");
    }
  }

  hideLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = ''; // Retire le style inline
    }
  }

  showRegisterModal() {
    const modal = document.getElementById('register-modal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex'; // Force l'affichage
      this.populateRegisterForm();
      console.log("📝 Modal d'inscription ouverte");
    } else {
      console.error("❌ Modal d'inscription non trouvée");
    }
  }

  hideRegisterModal() {
    const modal = document.getElementById('register-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = ''; // Retire le style inline
    }
  }

  // Population des formulaires
  populateLoginForm() {
    const form = document.getElementById('login-form');
    if (!form.innerHTML.trim()) {
      form.innerHTML = `
        <div class="form-group">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" name="email" required>
        </div>
        <div class="form-group">
          <label for="login-password">Mot de passe</label>
          <input type="password" id="login-password" name="password" required>
        </div>
        <div class="form-error" id="login-error"></div>
        <button type="submit" class="auth-btn">Se connecter</button>
        <div class="auth-switch">
          Pas de compte ? <a href="#" id="switch-to-register">S'inscrire</a>
        </div>
      `;
      
      // Ajouter l'event listener pour le lien de navigation
      const switchLink = document.getElementById('switch-to-register');
      if (switchLink) {
        switchLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.hideLoginModal();
          this.showRegisterModal();
        });
      }
    }
  }

  populateRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form.innerHTML.trim()) {
      form.innerHTML = `
        <div class="form-group">
          <label for="register-name">Nom complet</label>
          <input type="text" id="register-name" name="name" required>
        </div>
        <div class="form-group">
          <label for="register-email">Email</label>
          <input type="email" id="register-email" name="email" required>
        </div>
        <div class="form-group">
          <label for="register-password">Mot de passe</label>
          <input type="password" id="register-password" name="password" required minlength="6">
        </div>
        <div class="form-group">
          <label for="register-confirm">Confirmer le mot de passe</label>
          <input type="password" id="register-confirm" name="confirm" required>
        </div>
        <div class="form-error" id="register-error"></div>
        <button type="submit" class="auth-btn">S'inscrire</button>
        <div class="auth-switch">
          Déjà un compte ? <a href="#" id="switch-to-login">Se connecter</a>
        </div>
      `;
      
      // Ajouter l'event listener pour le lien de navigation
      const switchLink = document.getElementById('switch-to-login');
      if (switchLink) {
        switchLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.hideRegisterModal();
          this.showLoginModal();
        });
      }
    }
  }

  // Population du contenu des headers
  populateModalHeaders() {
    const loginHeader = document.querySelector('#login-modal .auth-modal-header');
    const registerHeader = document.querySelector('#register-modal .auth-modal-header');
    
    if (loginHeader && !loginHeader.innerHTML.trim()) {
      loginHeader.innerHTML = `
        <h2>Connexion</h2>
        <p>Accédez à vos listes personnalisées</p>
      `;
    }
    
    if (registerHeader && !registerHeader.innerHTML.trim()) {
      registerHeader.innerHTML = `
        <h2>Inscription</h2>
        <p>Créez votre compte BlueFlix</p>
      `;
    }
  }

  // Gestion de la connexion
  handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    
    const users = this.getUsers();
    const errorElement = document.getElementById('login-error');
    
    if (users[email] && users[email].password === password) {
      this.setCurrentUser(email);
      this.hideLoginModal();
      this.showNotification('Connexion réussie !', 'success');
      errorElement.textContent = '';
    } else {
      errorElement.textContent = 'Email ou mot de passe incorrect.';
    }
  }

  // Gestion de l'inscription
  handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    const confirm = formData.get('confirm');
    
    const users = this.getUsers();
    const errorElement = document.getElementById('register-error');
    
    // Validation
    if (!name || !email || !password) {
      errorElement.textContent = 'Tous les champs sont obligatoires.';
      return;
    }
    
    if (password !== confirm) {
      errorElement.textContent = 'Les mots de passe ne correspondent pas.';
      return;
    }
    
    if (password.length < 6) {
      errorElement.textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }
    
    if (users[email]) {
      errorElement.textContent = 'Un compte avec cet email existe déjà.';
      return;
    }
    
    // Création du compte
    users[email] = {
      name: name,
      email: email,
      password: password,
      lists: {
        favoris: [],
        aVoir: [],
        dejaVu: []
      },
      createdAt: new Date().toISOString()
    };
    
    this.setUsers(users);
    this.setCurrentUser(email);
    this.hideRegisterModal();
    this.showNotification('Compte créé avec succès !', 'success');
    errorElement.textContent = '';
  }

  // Mise à jour de l'interface utilisateur
  updateUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    
    if (this.currentUser) {
      // Utilisateur connecté
      if (authButtons) {
        authButtons.innerHTML = '';
        authButtons.style.display = 'none';
      }
      if (userProfile) {
        userProfile.style.display = 'block';
        this.updateUserProfile();
      }
    } else {
      // Utilisateur non connecté
      if (authButtons) {
        authButtons.innerHTML = `
          <button class="btn-login" id="btn-login">Connexion</button>
          <button class="btn-register" id="btn-register">Inscription</button>
        `;
        authButtons.style.display = 'flex';
        
        // Rebinder les événements
        const newLoginBtn = document.getElementById('btn-login');
        const newRegisterBtn = document.getElementById('btn-register');
        if (newLoginBtn) newLoginBtn.addEventListener('click', () => this.showLoginModal());
        if (newRegisterBtn) newRegisterBtn.addEventListener('click', () => this.showRegisterModal());
      }
      if (userProfile) {
        userProfile.style.display = 'none';
      }
    }
    
    this.populateModalHeaders();
  }

  // Mise à jour du profil utilisateur
  updateUserProfile() {
    if (!this.currentUser) return;
    
    const users = this.getUsers();
    const user = users[this.currentUser];
    
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userInitial = document.getElementById('user-initial');
    
    if (userName) userName.textContent = user.name;
    if (userEmail) userEmail.textContent = user.email;
    if (userInitial) userInitial.textContent = user.name.charAt(0).toUpperCase();
  }

  // Mise à jour de la navigation
  updateNavigation() {
    const navLinks = document.querySelectorAll('[href="html/list.html"], [href="../html/list.html"]');
    
    navLinks.forEach(link => {
      if (this.currentUser) {
        // Utilisateur connecté - accès autorisé
        link.classList.remove('protected-link');
        link.style.pointerEvents = '';
        link.onclick = null;
      } else {
        // Utilisateur non connecté - protéger le lien
        link.classList.add('protected-link');
        link.onclick = (e) => {
          e.preventDefault();
          this.showNotification('Veuillez vous connecter pour accéder à vos listes.', 'warning');
          this.showLoginModal();
        };
      }
    });
  }

  // Gestion des listes utilisateur
  getUserLists() {
    if (!this.currentUser) return { favoris: [], aVoir: [], dejaVu: [] };
    const users = this.getUsers();
    return users[this.currentUser]?.lists || { favoris: [], aVoir: [], dejaVu: [] };
  }

  updateUserLists(lists) {
    if (!this.currentUser) return;
    const users = this.getUsers();
    users[this.currentUser].lists = lists;
    this.setUsers(users);
    this.dispatchListsEvent();
  }

  toggleMovieInList(movieId, listName, movieData = null) {
    if (!this.currentUser) {
      this.showNotification('Connectez-vous pour gérer vos listes.', 'warning');
      return false;
    }
    
    const lists = this.getUserLists();
    const movieIdNum = parseInt(movieId);
    
    if (lists[listName].includes(movieIdNum)) {
      // Retirer de la liste
      lists[listName] = lists[listName].filter(id => id !== movieIdNum);
      this.updateUserLists(lists);
      this.showNotification(`Retiré de ${this.getListDisplayName(listName)}`, 'info');
      return false;
    } else {
      // Ajouter à la liste
      lists[listName].push(movieIdNum);
      this.updateUserLists(lists);
      this.showNotification(`Ajouté à ${this.getListDisplayName(listName)}`, 'success');
      return true;
    }
  }

  isMovieInList(movieId, listName) {
    const lists = this.getUserLists();
    return lists[listName].includes(parseInt(movieId));
  }

  getListDisplayName(listName) {
    const names = {
      favoris: 'Favoris',
      aVoir: 'À regarder',
      dejaVu: 'Déjà vu'
    };
    return names[listName] || listName;
  }

  // Notifications
  showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Suppression automatique
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Événements personnalisés
  dispatchAuthEvent(isLoggedIn) {
    window.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { isLoggedIn, user: this.currentUser }
    }));
  }

  dispatchListsEvent() {
    window.dispatchEvent(new CustomEvent('userListsUpdated', {
      detail: { lists: this.getUserLists() }
    }));
  }

  // Méthode publique pour réinitialiser les event listeners
  reinitEventListeners() {
    console.log("🔄 Réinitialisation des event listeners...");
    this.setupEventListeners();
    this.updateUI();
  }
  isLoggedIn() {
    return !!this.currentUser;
  }

  getUserData() {
    if (!this.currentUser) return null;
    const users = this.getUsers();
    return users[this.currentUser] || null;
  }
}

// Initialiser le système d'authentification
function initAuth() {
  if (window.auth) {
    console.log("🔐 AuthSystem déjà initialisé");
    return window.auth;
  }
  
  console.log("🔐 Initialisation du système d'authentification...");
  window.auth = new AuthSystem();
  
  // Fonctions globales pour le debug
  window.testLogin = () => window.auth.showLoginModal();
  window.testRegister = () => window.auth.showRegisterModal();
  
  console.log("🧪 Fonctions de test créées : testLogin() et testRegister()");
  
  return window.auth;
}

// Initialiser immédiatement
initAuth();

// Réinitialiser si le DOM change
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (window.auth) {
        window.auth.updateUI();
        window.auth.updateNavigation();
      }
    }, 200);
  });
} else {
  // DOM déjà chargé
  setTimeout(() => {
    if (window.auth) {
      window.auth.updateUI();
      window.auth.updateNavigation();
    }
  }, 200);
}

// Styles CSS pour les notifications (à ajouter au CSS)
if (!document.getElementById('auth-notification-styles')) {
  const style = document.createElement('style');
  style.id = 'auth-notification-styles';
  style.textContent = `
    .notification {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: var(--panel);
      color: var(--text);
      padding: 1rem 1.5rem;
      border-radius: var(--radius);
      box-shadow: var(--card-shadow-hover);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 1rem;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      border-left: 4px solid var(--blue-400);
      backdrop-filter: blur(10px);
      max-width: 350px;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification-success {
      border-left-color: var(--success);
    }
    
    .notification-warning {
      border-left-color: var(--warning);
    }
    
    .notification-info {
      border-left-color: var(--blue-400);
    }
    
    .notification button {
      background: none;
      border: none;
      color: var(--muted);
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: var(--transition-fast);
    }
    
    .notification button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text);
    }
  `;
  document.head.appendChild(style);
}