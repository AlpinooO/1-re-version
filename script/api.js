// =========================
// API TMDB - Gestion des appels
// =========================

import { API_KEY, BASE_URL, CONFIG } from './config.js';

export class TMDBAPI {
  
  // Fetch générique avec gestion d'erreurs
  static async fetchData(url) {
    try {
      console.log("🌐 Fetching:", url);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log("✅ Data received:", data.results?.length || 0, "items");
      return data;
    } catch (error) {
      console.error("❌ Fetch error:", error);
      return { results: [] };
    }
  }

  // Films populaires
  static async getPopularMovies() {
    const url = `${BASE_URL}${CONFIG.endpoints.popularMovies}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }

  // Séries populaires
  static async getPopularSeries() {
    const url = `${BASE_URL}${CONFIG.endpoints.popularSeries}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }

  // Films les mieux notés
  static async getTopRatedMovies() {
    const url = `${BASE_URL}${CONFIG.endpoints.topRated}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }

  // Tendances de la semaine
  static async getTrendingMovies() {
    const url = `${BASE_URL}${CONFIG.endpoints.trending}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }

  // Recherche multi-média
  static async searchMulti(query) {
    const url = `${BASE_URL}${CONFIG.endpoints.search}?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`;
    return this.fetchData(url);
  }

  // Détails d'un film
  static async getMovieDetails(id) {
    const url = `${BASE_URL}${CONFIG.endpoints.movieDetails}${id}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }

  // Détails d'une série
  static async getSeriesDetails(id) {
    const url = `${BASE_URL}${CONFIG.endpoints.seriesDetails}${id}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }

  // Casting d'un film
  static async getMovieCredits(id) {
    const url = `${BASE_URL}${CONFIG.endpoints.movieCredits.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }

  // Vidéos/bandes-annonces d'un film
  static async getMovieVideos(id) {
    const url = `${BASE_URL}${CONFIG.endpoints.movieVideos.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }

  // Fonction utilitaire pour construire l'URL d'image
  static getImageUrl(path, size = 'w500') {
    if (!path) return 'https://via.placeholder.com/300x450/333/fff?text=Pas+d\'image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  // Fonction utilitaire pour obtenir l'URL de la vidéo YouTube
  static getYouTubeUrl(key) {
    return `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=1&showinfo=0`;
  }
}