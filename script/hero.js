// =========================
// Hero Banner - Gestion de la vidéo automatique
// =========================

import { TMDBAPI } from './api.js';
import { CONFIG } from './config.js';

export class HeroManager {
  
  // Charger et afficher le hero banner
  static async loadHeroBanner() {
    try {
      console.log("🎬 Chargement du hero banner...");
      
      const data = await TMDBAPI.getTrendingMovies();
      if (data && data.length > 0) {
        // Prendre un film aléatoirement parmi les 5 premiers
        const randomIndex = Math.floor(Math.random() * Math.min(5, data.length));
        const movie = data[randomIndex];
        
        await this.displayHeroBanner(movie);
        await this.loadHeroVideo(movie.id);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement du hero banner:", error);
    }
  }

  // Afficher les informations du hero banner
  static async displayHeroBanner(movie) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Mettre à jour l'image de fond
    const backdropUrl = movie.backdrop_path 
      ? TMDBAPI.getImageUrl(movie.backdrop_path, 'original')
      : TMDBAPI.getImageUrl(movie.poster_path, 'original');
    
    heroSection.style.setProperty('--hero-bg', `url('${backdropUrl}')`);

    // Mettre à jour le contenu textuel si présent
    const heroTitle = document.querySelector('.hero h1');
    const heroDescription = document.querySelector('.hero p');
    const heroYear = document.querySelector('.hero-year');
    const heroRating = document.querySelector('.hero-rating');

    if (heroTitle) heroTitle.textContent = movie.title;
    if (heroDescription) heroDescription.textContent = movie.overview;
    if (heroYear) heroYear.textContent = movie.release_date ? movie.release_date.split('-')[0] : '';
    if (heroRating) heroRating.textContent = `⭐ ${movie.vote_average?.toFixed(1)}`;

    console.log("✅ Hero banner mis à jour:", movie.title);
  }

  // Charger et afficher la vidéo hero après le délai
  static async loadHeroVideo(movieId) {
    try {
      console.log("🎥 Chargement de la vidéo hero...");
      
      // Attendre le délai configuré
      setTimeout(async () => {
        const videosData = await TMDBAPI.getMovieVideos(movieId);
        
        if (videosData.results && videosData.results.length > 0) {
          // Chercher une bande-annonce ou un trailer
          const trailer = videosData.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
          ) || videosData.results[0];

          if (trailer) {
            this.insertHeroVideo(trailer.key);
          }
        }
      }, CONFIG.heroVideoDelay);
      
    } catch (error) {
      console.error("❌ Erreur lors du chargement de la vidéo:", error);
    }
  }

  // Insérer la vidéo dans le hero
  static insertHeroVideo(videoKey) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Supprimer une vidéo existante
    const existingVideo = heroSection.querySelector('.hero-background-video');
    if (existingVideo) {
      existingVideo.remove();
    }

    // Créer l'iframe de la vidéo YouTube
    const iframe = document.createElement('iframe');
    iframe.className = 'hero-background-video';
    iframe.src = TMDBAPI.getYouTubeUrl(videoKey);
    iframe.allow = 'autoplay; encrypted-media';
    iframe.setAttribute('allowfullscreen', '');
    
    // Insérer la vidéo dans le hero
    heroSection.insertBefore(iframe, heroSection.firstChild);
    
    // Ajouter la classe active pour l'animation
    setTimeout(() => {
      iframe.classList.add('active');
    }, 100);

    console.log("✅ Vidéo hero chargée:", videoKey);
  }

  // Gérer la lecture/pause de la vidéo
  static toggleHeroVideo() {
    const video = document.querySelector('.hero-background-video');
    if (!video) return;

    // Pour YouTube iframe, nous devrons utiliser l'API YouTube
    // Pour l'instant, on peut juste masquer/afficher la vidéo
    if (video.style.opacity === '0') {
      video.style.opacity = '1';
    } else {
      video.style.opacity = '0';
    }
  }

  // Masquer la vidéo hero
  static hideHeroVideo() {
    const video = document.querySelector('.hero-background-video');
    if (video) {
      video.classList.remove('active');
      setTimeout(() => video.remove(), 500);
    }
  }

  // Réinitialiser le hero avec une nouvelle vidéo
  static async reloadHeroVideo() {
    this.hideHeroVideo();
    await this.loadHeroBanner();
  }

  // Gérer le redimensionnement pour la responsivité
  static handleResize() {
    const video = document.querySelector('.hero-background-video');
    if (!video) return;

    // Ajuster la taille de la vidéo selon l'écran
    if (window.innerWidth <= 768) {
      video.style.height = '70vh';
    } else if (window.innerWidth <= 1024) {
      video.style.height = '80vh';
    } else {
      video.style.height = '100vh';
    }
  }

  // Initialiser les événements du hero
  static initHeroEvents() {
    // Gérer le redimensionnement
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Gérer les boutons de contrôle du hero s'ils existent
    const playBtn = document.querySelector('.hero-play-btn');
    const infoBtn = document.querySelector('.hero-info-btn');
    
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.toggleHeroVideo();
      });
    }
    
    if (infoBtn) {
      infoBtn.addEventListener('click', () => {
        // Ouvrir les détails du film hero
        const heroSection = document.querySelector('.hero');
        const movieId = heroSection?.dataset?.movieId;
        if (movieId) {
          // Utiliser la fonction de modal des détails
          window.dispatchEvent(new CustomEvent('showMovieDetails', { 
            detail: { id: movieId, type: 'movie' }
          }));
        }
      });
    }
  }
}