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
  
  // API Configuration
  TMDB_API_KEY: API_KEY,
  TMDB_BASE_URL: BASE_URL,
  TMDB_IMAGE_URL: IMAGE_BASE_URL,
  
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
    topRatedMovies: "/movie/top_rated",
    topRatedSeries: "/tv/top_rated",
    trendingMovies: "/trending/movie/week",
    trendingSeries: "/trending/tv/week",
    airingTodaySeries: "/tv/airing_today",
    onTheAirSeries: "/tv/on_the_air",
    discoverMovies: "/discover/movie",
    discoverSeries: "/discover/tv",
    search: "/search/multi",
    movieDetails: "/movie/",
    seriesDetails: "/tv/",
    movieCredits: "/movie/{id}/credits",
    movieVideos: "/movie/{id}/videos"
  },
  
  // IDs des genres TMDB
  movieGenres: {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    horror: 27,
    mystery: 9648,
    scifi: 878
  },
  
  seriesGenres: {
    action: 10759, // Action & Adventure
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    kids: 10762,
    mystery: 9648,
    scifi: 10765 // Sci-Fi & Fantasy
  }
};