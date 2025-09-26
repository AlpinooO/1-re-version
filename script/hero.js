import { TMDBAPI } from './api.js';
import { CONFIG } from './config.js';

export class HeroManager {
  static async loadHeroBanner() {
    try {
      console.log("🎬 Chargement du hero banner...");
      
      const data = await TMDBAPI.getTrendingMovies();
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(5, data.length));
        const movie = data[randomIndex];
        
        await this.displayHeroBanner(movie);
        await this.loadHeroVideo(movie.id);
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement du hero banner:", error);
    }
  }
  static async displayHeroBanner(movie) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const backdropUrl = movie.backdrop_path 
      ? TMDBAPI.getImageUrl(movie.backdrop_path, 'original')
      : TMDBAPI.getImageUrl(movie.poster_path, 'original');
    
    heroSection.style.setProperty('--hero-bg', `url('${backdropUrl}')`);

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

  static async loadHeroVideo(movieId) {
    try {
      console.log("🎥 Chargement de la vidéo hero...");
      
      setTimeout(async () => {
        const videosData = await TMDBAPI.getMovieVideos(movieId);
        
        if (videosData.results && videosData.results.length > 0) {
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
  static insertHeroVideo(videoKey) {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const existingVideo = heroSection.querySelector('.hero-background-video');
    if (existingVideo) {
      existingVideo.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.className = 'hero-background-video';
    iframe.src = TMDBAPI.getYouTubeUrl(videoKey);
    iframe.allow = 'autoplay; encrypted-media';
    iframe.setAttribute('allowfullscreen', '');
    
    heroSection.insertBefore(iframe, heroSection.firstChild);
    
    setTimeout(() => {
      iframe.classList.add('active');
    }, 100);

    console.log("✅ Vidéo hero chargée:", videoKey);
  }
  static toggleHeroVideo() {
    const video = document.querySelector('.hero-background-video');
    if (!video) return;
    if (video.style.opacity === '0') {
      video.style.opacity = '1';
    } else {
      video.style.opacity = '0';
    }
  }
  static hideHeroVideo() {
    const video = document.querySelector('.hero-background-video');
    if (video) {
      video.classList.remove('active');
      setTimeout(() => video.remove(), 500);
    }
  }
  static async reloadHeroVideo() {
    this.hideHeroVideo();
    await this.loadHeroBanner();
  }
  static handleResize() {
    const video = document.querySelector('.hero-background-video');
    if (!video) return;
    if (window.innerWidth <= 768) {
      video.style.height = '70vh';
    } else if (window.innerWidth <= 1024) {
      video.style.height = '80vh';
    } else {
      video.style.height = '100vh';
    }
  }
  static initHeroEvents() {
    window.addEventListener('resize', this.handleResize.bind(this));
    
    const playBtn = document.querySelector('.hero-play-btn');
    const infoBtn = document.querySelector('.hero-info-btn');
    
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.toggleHeroVideo();
      });
    }
    
    if (infoBtn) {
      infoBtn.addEventListener('click', () => {
        const heroSection = document.querySelector('.hero');
        const movieId = heroSection?.dataset?.movieId;
        if (movieId) {
          window.dispatchEvent(new CustomEvent('showMovieDetails', { 
            detail: { id: movieId, type: 'movie' }
          }));
        }
      });
    }
  }
}