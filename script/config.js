// =========================
// Configuration et constantes
// =========================

export const API_KEY = "e4b90327227c88daac14c0bd0c1f93cd";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Configuration pour l'affichage des films
export const CONFIG = {
  itemsPerPage: 20,
  heroVideoDelay: 4500, // 4.5 secondes
  notificationDuration: 3000,
  
  // Messages d'erreur
  messages: {
    fetchError: "Erreur lors du chargement des données",
    noResults: "Aucun résultat trouvé",
    loginRequired: "Vous devez être connecté pour effectuer cette action"
  },
  
  // Endpoints API
  endpoints: {
    popularMovies: "/movie/popular",
    popularSeries: "/tv/popular",
    topRated: "/movie/top_rated",
    trending: "/trending/movie/week",
    search: "/search/multi",
    movieDetails: "/movie/",
    seriesDetails: "/tv/",
    movieCredits: "/movie/{id}/credits",
    movieVideos: "/movie/{id}/videos"
  }
};