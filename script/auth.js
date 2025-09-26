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

  setupEventListeners() {
    const loginBtn = document.getElementById('login-btn') || document.getElementById('btn-login');
    const registerBtn = document.getElementById('register-btn') || document.getElementById('btn-register');
    const mobileLoginBtn = document.getElementById('mobile-btn-login');
    const mobileRegisterBtn = document.getElementById('mobile-btn-register');
    
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
    
    if (mobileLoginBtn) {
      mobileLoginBtn.addEventListener('click', (e) => {
        console.log('🔓 Click sur bouton mobile login détecté');
        e.preventDefault();
        this.showLoginModal();
      });
      console.log("🔗 Event listener ajouté au bouton mobile de connexion");
    }
    if (mobileRegisterBtn) {
      mobileRegisterBtn.addEventListener('click', (e) => {
        console.log('📝 Click sur bouton mobile register détecté');
        e.preventDefault();
        this.showRegisterModal();
      });
      console.log("🔗 Event listener ajouté au bouton mobile d'inscription");
    }

    const loginClose = document.getElementById('login-close');
    const registerClose = document.getElementById('register-close');
    
    if (loginClose) loginClose.addEventListener('click', () => this.hideLoginModal());
    if (registerClose) registerClose.addEventListener('click', () => this.hideRegisterModal());

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

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));

    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', () => this.logout());

    window.addEventListener('click', (e) => {
      const loginModal = document.getElementById('login-modal');
      const registerModal = document.getElementById('register-modal');
      
      if (e.target === loginModal) this.hideLoginModal();
      if (e.target === registerModal) this.hideRegisterModal();
    });
  }

  showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex';
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
      modal.style.display = 'flex';
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

  handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    const confirm = formData.get('confirm');
    
    const users = this.getUsers();
    const errorElement = document.getElementById('register-error');
    
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

  updateUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    
    const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
    const mobileUserProfile = document.getElementById('mobile-user-profile');
    
    if (this.currentUser) {
      if (authButtons) {
        authButtons.innerHTML = '';
        authButtons.style.display = 'none';
      }
      if (userProfile) {
        userProfile.style.display = 'block';
        this.updateUserProfile();
      }
      
      if (mobileAuthButtons) {
        mobileAuthButtons.style.display = 'none';
      }
      if (mobileUserProfile) {
        mobileUserProfile.style.display = 'block';
        this.updateMobileUserProfile();
      }
    } else {
      if (authButtons) {
        authButtons.innerHTML = `
          <button class="btn-login" id="btn-login">Connexion</button>
          <button class="btn-register" id="btn-register">Inscription</button>
        `;
        authButtons.style.display = 'flex';
        
        const newLoginBtn = document.getElementById('btn-login');
        const newRegisterBtn = document.getElementById('btn-register');
        if (newLoginBtn) newLoginBtn.addEventListener('click', () => this.showLoginModal());
        if (newRegisterBtn) newRegisterBtn.addEventListener('click', () => this.showRegisterModal());
      }
      if (userProfile) {
        userProfile.style.display = 'none';
      }
      
      if (mobileAuthButtons) {
        mobileAuthButtons.innerHTML = `
          <button class="btn-login mobile" id="mobile-btn-login">🔑 Connexion</button>
          <button class="btn-register mobile" id="mobile-btn-register">📝 Inscription</button>
        `;
        mobileAuthButtons.style.display = 'block';
        
        const newMobileLoginBtn = document.getElementById('mobile-btn-login');
        const newMobileRegisterBtn = document.getElementById('mobile-btn-register');
        if (newMobileLoginBtn) newMobileLoginBtn.addEventListener('click', () => this.showLoginModal());
        if (newMobileRegisterBtn) newMobileRegisterBtn.addEventListener('click', () => this.showRegisterModal());
      }
      if (mobileUserProfile) {
        mobileUserProfile.style.display = 'none';
      }
    }
    
    this.populateModalHeaders();
  }

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

  updateMobileUserProfile() {
    if (!this.currentUser) return;
    
    const users = this.getUsers();
    const user = users[this.currentUser];
    
    const mobileUserName = document.getElementById('mobile-user-name');
    const mobileUserEmail = document.getElementById('mobile-user-email');
    const mobileUserInitial = document.getElementById('mobile-user-initial');
    
    if (mobileUserName) mobileUserName.textContent = user.name;
    if (mobileUserEmail) mobileUserEmail.textContent = user.email;
    if (mobileUserInitial) mobileUserInitial.textContent = user.name.charAt(0).toUpperCase();
  }

  updateNavigation() {
    const navLinks = document.querySelectorAll('[href="html/list.html"], [href="../html/list.html"]');
    
    navLinks.forEach(link => {
      if (this.currentUser) {
        link.classList.remove('protected-link');
        link.style.pointerEvents = '';
        link.onclick = null;
      } else {
        link.classList.add('protected-link');
        link.onclick = (e) => {
          e.preventDefault();
          this.showNotification('Veuillez vous connecter pour accéder à vos listes.', 'warning');
          this.showLoginModal();
        };
      }
    });
  }

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
      lists[listName] = lists[listName].filter(id => id !== movieIdNum);
      this.updateUserLists(lists);
      this.showNotification(`Retiré de ${this.getListDisplayName(listName)}`, 'info');
      return false;
    } else {
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

  showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

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

function initAuth() {
  if (window.auth) {
    console.log("🔐 AuthSystem déjà initialisé");
    return window.auth;
  }
  
  console.log("🔐 Initialisation du système d'authentification...");
  window.auth = new AuthSystem();
  
  window.testLogin = () => window.auth.showLoginModal();
  window.testRegister = () => window.auth.showRegisterModal();
  window.testAuth = () => {
    console.log("🧪 Test du système d'authentification:");
    console.log("- Utilisateur actuel:", window.auth.currentUser);
    console.log("- Utilisateurs stockés:", Object.keys(window.auth.getUsers()));
    console.log("- Connecté:", window.auth.isLoggedIn());
  };
  
  console.log("🧪 Fonctions de test créées : testLogin(), testRegister(), testAuth()");
  
  return window.auth;
}

initAuth();

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
  setTimeout(() => {
    if (window.auth) {
      window.auth.updateUI();
      window.auth.updateNavigation();
    }
  }, 200);
}

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

// Export pour la compatibilité ES6
export { AuthSystem, initAuth };