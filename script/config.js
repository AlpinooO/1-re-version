export const API_KEY = "e4b90327227c88daac14c0bd0c1f93cd";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const CONFIG = {
  itemsPerPage: 20,
  heroVideoDelay: 4500,
  notificationDuration: 3000,
  TMDB_API_KEY: API_KEY,
  TMDB_BASE_URL: BASE_URL,
  TMDB_IMAGE_URL: IMAGE_BASE_URL,
  messages: {
    fetchError: "Erreur lors du chargement des données",
    noResults: "Aucun résultat trouvé",
    loginRequired: "Vous devez être connecté pour effectuer cette action"
  },
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
    action: 10759,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    kids: 10762,
    mystery: 9648,
    scifi: 10765
  }
};