// Accès centralisé à l'API TMDB
import { API_KEY, BASE_URL, CONFIG } from './config.js';

export class TMDBAPI { // Méthodes utilitaires pour requêtes TMDB
  static async fetchData(url) { // Requête générique liste/collection
    try {
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      
      return data;
    } catch (error) {
      
      return { results: [] };
    }
  }
  static async fetchDetailsData(url) { // Requête pour détails uniques
    try {
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      
      return data;
    } catch (error) {
      
      return null;
    }
  }
  static async getPopularMovies() { // Films populaires
    const url = `${BASE_URL}${CONFIG.endpoints.popularMovies}?api_key=${API_KEY}&language=fr-FR`;
    
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getPopularSeries() { // Séries populaires
    const url = `${BASE_URL}${CONFIG.endpoints.popularSeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getTopRatedMovies() { // Films mieux notés
    const url = `${BASE_URL}${CONFIG.endpoints.topRated}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getTrendingMovies() { // Films tendance
    const url = `${BASE_URL}${CONFIG.endpoints.trendingMovies}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async searchMulti(query) { // Recherche multi-ressources
    const url = `${BASE_URL}${CONFIG.endpoints.search}?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`;
    return this.fetchData(url);
  }
  static async getMovieDetails(id) { // Détails film
    const url = `${BASE_URL}${CONFIG.endpoints.movieDetails}${id}?api_key=${API_KEY}&language=fr-FR`;
    
    return this.fetchDetailsData(url);
  }
  static async getSeriesDetails(id) { // Détails série
    const url = `${BASE_URL}${CONFIG.endpoints.seriesDetails}${id}?api_key=${API_KEY}&language=fr-FR`;
    
    return this.fetchDetailsData(url);
  }
  static async getMovieCredits(id) { // Casting film
    const url = `${BASE_URL}${CONFIG.endpoints.movieCredits.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }
  static async getMovieVideos(id) { // Vidéos film
    const url = `${BASE_URL}${CONFIG.endpoints.movieVideos.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }
  static async getSeriesCredits(id) { // Casting série
    if (!CONFIG.endpoints.seriesCredits) {
      const url = `${BASE_URL}tv/${id}/credits?api_key=${API_KEY}&language=fr-FR`;
      return this.fetchData(url);
    }
    const url = `${BASE_URL}${CONFIG.endpoints.seriesCredits.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }
  static async getSeriesVideos(id) { // Vidéos série
    if (!CONFIG.endpoints.seriesVideos) {
      const url = `${BASE_URL}tv/${id}/videos?api_key=${API_KEY}&language=fr-FR`;
      return this.fetchData(url);
    }
    const url = `${BASE_URL}${CONFIG.endpoints.seriesVideos.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }
  static async getTopRatedSeries() { // Séries mieux notées
    const url = `${BASE_URL}${CONFIG.endpoints.topRatedSeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getTrendingSeries() { // Séries tendance
    const url = `${BASE_URL}${CONFIG.endpoints.trendingSeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getAiringTodaySeries() { // Séries diffusées aujourd'hui
    const url = `${BASE_URL}${CONFIG.endpoints.airingTodaySeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getOnTheAirSeries() { // Séries en cours de diffusion
    const url = `${BASE_URL}${CONFIG.endpoints.onTheAirSeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getMoviesByGenre(genreId) { // Films par genre
    const url = `${BASE_URL}${CONFIG.endpoints.discoverMovies}?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&sort_by=popularity.desc`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getSeriesByGenre(genreId) { // Séries par genre
    const url = `${BASE_URL}${CONFIG.endpoints.discoverSeries}?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&sort_by=popularity.desc`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static getImageUrl(path, size = 'w500') { // Génère URL image
    if (!path) return 'https://via.placeholder.com/300x450/333/fff?text=Pas+d\'image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
  static getYouTubeUrl(key) { // Génère URL YouTube
    return `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=1&showinfo=0`;
  }
}