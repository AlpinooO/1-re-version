import { API_KEY, BASE_URL, CONFIG } from './config.js';

export class TMDBAPI {
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
  static async fetchDetailsData(url) {
    try {
      console.log("🎬 Fetching details:", url);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API request failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log("✅ Details received:", data.title || data.name || 'Unknown');
      return data;
    } catch (error) {
      console.error("❌ Details fetch error:", error);
      return null;
    }
  }
  static async getPopularMovies() {
    const url = `${BASE_URL}${CONFIG.endpoints.popularMovies}?api_key=${API_KEY}&language=fr-FR`;
    console.log("🎬 Fetching popular movies from:", url);
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getPopularSeries() {
    const url = `${BASE_URL}${CONFIG.endpoints.popularSeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getTopRatedMovies() {
    const url = `${BASE_URL}${CONFIG.endpoints.topRated}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getTrendingMovies() {
    const url = `${BASE_URL}${CONFIG.endpoints.trendingMovies}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async searchMulti(query) {
    const url = `${BASE_URL}${CONFIG.endpoints.search}?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`;
    return this.fetchData(url);
  }
  static async getMovieDetails(id) {
    const url = `${BASE_URL}${CONFIG.endpoints.movieDetails}${id}?api_key=${API_KEY}&language=fr-FR`;
    console.log('🔗 Movie details URL:', url);
    return this.fetchDetailsData(url);
  }
  static async getSeriesDetails(id) {
    const url = `${BASE_URL}${CONFIG.endpoints.seriesDetails}${id}?api_key=${API_KEY}&language=fr-FR`;
    console.log('🔗 Series details URL:', url);
    return this.fetchDetailsData(url);
  }
  static async getMovieCredits(id) {
    const url = `${BASE_URL}${CONFIG.endpoints.movieCredits.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }
  static async getMovieVideos(id) {
    const url = `${BASE_URL}${CONFIG.endpoints.movieVideos.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }
  static async getSeriesCredits(id) {
    if (!CONFIG.endpoints.seriesCredits) {
      const url = `${BASE_URL}tv/${id}/credits?api_key=${API_KEY}&language=fr-FR`;
      return this.fetchData(url);
    }
    const url = `${BASE_URL}${CONFIG.endpoints.seriesCredits.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }
  static async getSeriesVideos(id) {
    if (!CONFIG.endpoints.seriesVideos) {
      const url = `${BASE_URL}tv/${id}/videos?api_key=${API_KEY}&language=fr-FR`;
      return this.fetchData(url);
    }
    const url = `${BASE_URL}${CONFIG.endpoints.seriesVideos.replace('{id}', id)}?api_key=${API_KEY}&language=fr-FR`;
    return this.fetchData(url);
  }
  static async getTopRatedSeries() {
    const url = `${BASE_URL}${CONFIG.endpoints.topRatedSeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getTrendingSeries() {
    const url = `${BASE_URL}${CONFIG.endpoints.trendingSeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getAiringTodaySeries() {
    const url = `${BASE_URL}${CONFIG.endpoints.airingTodaySeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getOnTheAirSeries() {
    const url = `${BASE_URL}${CONFIG.endpoints.onTheAirSeries}?api_key=${API_KEY}&language=fr-FR`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getMoviesByGenre(genreId) {
    const url = `${BASE_URL}${CONFIG.endpoints.discoverMovies}?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&sort_by=popularity.desc`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static async getSeriesByGenre(genreId) {
    const url = `${BASE_URL}${CONFIG.endpoints.discoverSeries}?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&sort_by=popularity.desc`;
    const data = await this.fetchData(url);
    return data?.results || [];
  }
  static getImageUrl(path, size = 'w500') {
    if (!path) return 'https://via.placeholder.com/300x450/333/fff?text=Pas+d\'image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
  static getYouTubeUrl(key) {
    return `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=1&showinfo=0`;
  }
}