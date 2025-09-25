const API_KEY = "e4b90327227c88daac14c0bd0c1f93cd";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// =========================
// Fetch API
// =========================
async function fetchData(url) {
  try {
    console.log("🌐 Fetching:", url);
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    console.log("✅ Data received:", data.results?.length || 0, "items");
    return data;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return { results: [] };
  }
}

// =========================
// Create Card
// =========================
function createCard(item, type = "movie") {
  if (!item.poster_path) {
    console.log("⚠️ Skipping item without poster:", item.title || item.name);
    return null;
  }
  const card = document.createElement("div");
  card.className = "card";
  card.style.cursor = "pointer";
  card.dataset.id = item.id;
  card.dataset.type = type;
  card.innerHTML = `<img src="${IMAGE_BASE_URL}${item.poster_path}" alt="${
    type === "movie" ? item.title : item.name
  }">`;

  // Ajouter l'événement de clic pour ouvrir la popup
  card.addEventListener("click", () => showDetailModal(item.id, type));

  return card;
}

// =========================
// Load Home Page
// =========================
async function loadHome() {
  console.log("🎬 Chargement de la page d'accueil...");

  // Charger le hero banner dynamique
  await loadHeroBanner();

  const filmsRow = document.querySelector(".films-row");
  const seriesRow = document.querySelector(".series-row");

  console.log("📍 Films row found:", !!filmsRow);
  console.log("📍 Series row found:", !!seriesRow);

  if (filmsRow) {
    console.log("🎬 Chargement des films...");
    const data = await fetchData(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    console.log("🎬 Films reçus:", data.results?.length || 0);
    filmsRow.innerHTML = "";
    data.results.slice(0, 80).forEach((movie) => {
      const card = createCard(movie, "movie");
      if (card) filmsRow.appendChild(card);
    });
    console.log("🎬 Films affichés:", filmsRow.children.length);
  }

  if (seriesRow) {
    console.log("📺 Chargement des séries...");
    const data = await fetchData(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    console.log("📺 Séries reçues:", data.results?.length || 0);
    seriesRow.innerHTML = "";
    data.results.slice(0, 80).forEach((show) => {
      const card = createCard(show, "series");
      if (card) seriesRow.appendChild(card);
    });
    console.log("📺 Séries affichées:", seriesRow.children.length);
  }
}

// =========================
// Load Dynamic Hero Banner
// =========================
async function loadHeroBanner() {
  const heroSection = document.querySelector(".hero");
  if (!heroSection) return;

  try {
    // Récupérer les dernières sorties et les mieux notés
    const [latestMovies, topRatedMovies, latestSeries, topRatedSeries] =
      await Promise.all([
        fetchData(
          `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=fr-FR&page=1`
        ),
        fetchData(
          `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=fr-FR&page=1`
        ),
        fetchData(
          `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=fr-FR&page=1`
        ),
        fetchData(
          `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=fr-FR&page=1`
        ),
      ]);

    // Combiner tous les contenus
    const allContent = [
      ...latestMovies.results
        .slice(0, 10)
        .map((item) => ({ ...item, type: "movie", category: "latest" })),
      ...topRatedMovies.results
        .slice(0, 10)
        .map((item) => ({ ...item, type: "movie", category: "top_rated" })),
      ...latestSeries.results
        .slice(0, 10)
        .map((item) => ({ ...item, type: "tv", category: "latest" })),
      ...topRatedSeries.results
        .slice(0, 10)
        .map((item) => ({ ...item, type: "tv", category: "top_rated" })),
    ];

    // Filtrer les contenus avec backdrop et bonne note
    const qualityContent = allContent.filter(
      (item) => item.backdrop_path && item.vote_average >= 7.0 && item.overview
    );

    // Choisir un contenu aléatoirement
    const randomContent =
      qualityContent[Math.floor(Math.random() * qualityContent.length)];

    if (randomContent) {
      updateHeroBanner(randomContent);
    }
  } catch (error) {
    console.error("Erreur lors du chargement du hero banner:", error);
  }
}

// =========================
// Update Hero Banner
// =========================
async function updateHeroBanner(content) {
  const heroSection = document.querySelector(".hero");
  const heroInner = document.querySelector(".hero-inner");

  if (!heroSection || !heroInner) return;

  const title = content.type === "movie" ? content.title : content.name;
  const backdropUrl = `${IMAGE_BASE_URL}${content.backdrop_path}`;
  const releaseYear =
    content.type === "movie"
      ? content.release_date?.split("-")[0]
      : content.first_air_date?.split("-")[0];

  const categoryText =
    content.category === "latest" ? "Dernière sortie" : "Populaire";

  // Mettre à jour le background
  heroSection.style.setProperty("--hero-bg", `url('${backdropUrl}')`);

  // Mettre à jour le contenu sans vidéo
  heroInner.innerHTML = `
    <div class="hero-content">
      <div class="hero-badge fade-in">${categoryText}</div>
      <h1 class="fade-in text-glow">${title}</h1>
      <div class="hero-meta fade-in">
        <span class="hero-year">${releaseYear || "N/A"}</span>
        <span class="hero-rating">⭐ ${
          content.vote_average ? content.vote_average.toFixed(1) : "N/A"
        }</span>
      </div>
      <p class="fade-in">${content.overview.substring(0, 200)}${
    content.overview.length > 200 ? "..." : ""
  }</p>
      <div class="hero-actions fade-in">
        <button class="cta hero-play-btn" onclick="showDetailModal(${
          content.id
        }, '${content.type}')">
          <span>▶</span> Regarder
        </button>
        <button class="cta-secondary hero-info-btn" onclick="showDetailModal(${
          content.id
        }, '${content.type}')">
          <span>ℹ</span> Plus d'infos
        </button>
      </div>
    </div>
  `;
}

// =========================
// Load Movie / Series Detail
// =========================
async function loadMovieDetail() {
  if (!document.body.classList.contains("movie-detail-page")) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const data = await fetchData(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR`
  );

  const container = document.querySelector(".details");
  container.innerHTML = `
    <h1>${data.title}</h1>
    <img src="${IMAGE_BASE_URL}${data.poster_path}" alt="${data.title}">
    <p>${data.overview}</p>
    <button class="cta">▶ Lire</button>
  `;
}

async function loadSeriesDetail() {
  if (!document.body.classList.contains("series-detail-page")) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const data = await fetchData(
    `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=fr-FR`
  );

  const container = document.querySelector(".details");
  container.innerHTML = `
    <h1>${data.name}</h1>
    <img src="${IMAGE_BASE_URL}${data.poster_path}" alt="${data.name}">
    <p>${data.overview}</p>
    <button class="cta">▶ Lire</button>
  `;
}

// =========================
// Load Category
// =========================
async function loadCategory(selector, genreId, type = "movie") {
  const row = document.querySelector(selector);
  if (!row) return;

  const url =
    type === "movie"
      ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=fr-FR&page=1`
      : `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&language=fr-FR&page=1`;

  const data = await fetchData(url);
  row.innerHTML = "";
  data.results.forEach((item) => {
    const card = createCard(item, type);
    if (card) row.appendChild(card);
  });
}

// =========================
// Load Movies Page
// =========================
async function loadMoviesPage() {
  const popularRow = document.querySelector(".movies-row");
  if (popularRow) {
    const data = await fetchData(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    popularRow.innerHTML = "";
    data.results.forEach((movie) => {
      const card = createCard(movie, "movie");
      if (card) popularRow.appendChild(card);
    });
  }

  await loadCategory(".adventure-row", 12, "movie");
  await loadCategory(".animation-row", 16, "movie");
  await loadCategory(".action-row", 28, "movie");
  await loadCategory(".comedy-row", 35, "movie");
  await loadCategory(".crime-row", 80, "movie");
  await loadCategory(".documentary-row", 99, "movie");
  await loadCategory(".drama-row", 18, "movie");
  await loadCategory(".family-row", 10751, "movie");
  await loadCategory(".fantasy-row", 14, "movie");
  await loadCategory(".horror-row", 27, "movie");
}

// =========================
// Load Series Page
// =========================
async function loadSeriesPage() {
  const popularRow = document.querySelector(".series-row");
  if (popularRow) {
    const data = await fetchData(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    popularRow.innerHTML = "";
    data.results.forEach((show) => {
      const card = createCard(show, "series");
      if (card) popularRow.appendChild(card);
    });
  }

  await loadCategory(".action-row", 10759, "series");
  await loadCategory(".animation-row", 16, "series");
  await loadCategory(".comedy-row", 35, "series");
  await loadCategory(".crime-row", 80, "series");
  await loadCategory(".documentary-row", 10762, "series");
  await loadCategory(".drama-row", 18, "series");
  await loadCategory(".family-row", 10751, "series");
  await loadCategory(".kids-row", 10762, "series");
  await loadCategory(".mystery-row", 9648, "series");
  await loadCategory(".sci-fi-row", 10765, "series");
}

// =========================
// Dynamic Search with Modal
// =========================
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const modal = document.getElementById("modal");
const modalBody = modal?.querySelector(".modal-body");
const modalClose = modal?.querySelector(".modal-close");
const searchContainer = document.querySelector(".search-container");

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modal)
  modal.addEventListener("click", (e) => e.target === modal && closeModal());

function closeModal() {
  modal.style.display = "none";
  if (searchContainer && modal.contains(searchInput)) {
    // Replace search input back in header
    document.querySelector(".topbar").insertBefore(searchInput, searchBtn);
  }
}

function openModal() {
  modal.style.display = "flex";
  if (searchContainer && !modal.contains(searchInput)) {
    // Move search input into modal
    modalBody.prepend(searchInput);
  }
}

let searchTimeout;
async function searchMoviesAndSeries(query) {
  if (!query) return;
  openModal();

  const [movieResults, tvResults] = await Promise.all([
    fetchData(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=fr-FR&page=1`
    ),
    fetchData(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=fr-FR&page=1`
    ),
  ]);

  const results = [
    ...(movieResults.results || []),
    ...(tvResults.results || []),
  ];

  if (!modalBody) return;
  modalBody.innerHTML = "";

  if (results.length === 0) {
    modalBody.innerHTML = "<p>Aucun résultat trouvé.</p>";
  } else {
    results.forEach((item) => {
      const type = item.title ? "movie" : "series";
      const card = createCard(item, type);
      if (card) modalBody.appendChild(card);
    });
  }
}

// Debounce input
if (searchInput) {
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchMoviesAndSeries(searchInput.value);
    }, 300);
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", () =>
    searchMoviesAndSeries(searchInput.value)
  );
}

// =========================
// Modal Detail Functions
// =========================
async function showDetailModal(id, type) {
  try {
    // Corriger le type pour l'API TMDB
    const apiType = type === "series" ? "tv" : type;
    const url = `${BASE_URL}/${apiType}/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits,videos`;
    const data = await fetchData(url);

    if (!data) return;

    // Trouver le trailer YouTube
    let trailerKey = null;
    if (data.videos && data.videos.results.length > 0) {
      const trailer =
        data.videos.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        ) || data.videos.results.find((video) => video.site === "YouTube");
      if (trailer) {
        trailerKey = trailer.key;
      }
    }

    // Stocker la clé du trailer pour le plein écran
    currentTrailerKey = trailerKey;

    // Créer le HTML de la modal
    const modalHTML = `
      <div class="modal-detail" id="detail-modal">
        <div class="modal-detail-content">
          <button class="modal-detail-close" id="close-modal">&times;</button>
          <div class="modal-detail-header" id="modal-header">
            <img class="modal-detail-backdrop" id="modal-backdrop" src="${IMAGE_BASE_URL}${
      data.backdrop_path || data.poster_path
    }" alt="">
            ${
              trailerKey
                ? `
              <iframe class="modal-detail-video" id="modal-video" 
                      src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen
                      style="display: none;">
              </iframe>
            `
                : ""
            }
            <div class="modal-detail-gradient"></div>
            <div class="modal-detail-header-content">
              <h2 class="modal-detail-title">${
                type === "movie" ? data.title : data.name
              }</h2>
            </div>
          </div>
          <div class="modal-detail-body">
            <div class="modal-detail-info">
              <span>${
                type === "movie"
                  ? data.release_date?.split("-")[0] || "N/A"
                  : data.first_air_date?.split("-")[0] || "N/A"
              }</span>
              <span class="rating">⭐ ${
                data.vote_average ? data.vote_average.toFixed(1) : "N/A"
              }/10</span>
              ${
                type === "movie"
                  ? `<span>${
                      data.runtime ? data.runtime + " min" : "N/A"
                    }</span>`
                  : `<span>${
                      data.number_of_seasons
                        ? data.number_of_seasons + " saison(s)"
                        : "N/A"
                    }</span>`
              }
            </div>
            
            <div class="modal-detail-actions">
              <button class="modal-detail-play-btn" onclick="toggleTrailer()">▶ ${
                trailerKey ? "Voir le trailer" : "Regarder"
              }</button>
              ${
                trailerKey
                  ? '<button class="modal-detail-play-btn modal-detail-back-btn" onclick="showBackdrop()" style="display: none;">⬅ Retour</button>'
                  : ""
              }
              ${
                trailerKey
                  ? '<button class="modal-detail-play-btn modal-detail-fullscreen-btn" onclick="openFullscreenTrailer()" style="display: none;">🔍 Plein écran</button>'
                  : ""
              }
            </div>
            
            <p class="modal-detail-overview">${
              data.overview || "Aucune description disponible."
            }</p>
            
            ${
              data.credits?.cast
                ? `
              <div class="modal-detail-cast">
                <h3>Distribution</h3>
                <p>${data.credits.cast
                  .slice(0, 6)
                  .map((actor) => actor.name)
                  .join(", ")}</p>
              </div>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;

    // Ajouter la modal au DOM
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Récupérer les éléments de la modal
    const detailModal = document.getElementById("detail-modal");
    const closeBtn = document.getElementById("close-modal");

    // Afficher la modal avec animation
    setTimeout(() => {
      detailModal.classList.add("show");
    }, 10);

    // Si un trailer existe, le lancer après 1 seconde
    if (trailerKey) {
      setTimeout(() => {
        toggleTrailer();
      }, 1000);
    }

    // Événements de fermeture
    closeBtn.addEventListener("click", closeDetailModal);
    detailModal.addEventListener("click", (e) => {
      if (e.target === detailModal) {
        closeDetailModal();
      }
    });

    // Fermeture avec la touche Échap
    document.addEventListener("keydown", handleEscapeKey);

    // Permettre le défilement du body de la modal et garder la description visible
    const modalBody = detailModal.querySelector(".modal-detail-body");
    if (modalBody) {
      modalBody.style.overflowY = "auto";
      modalBody.style.maxHeight = "60vh";
      modalBody.style.position = "sticky";
      modalBody.style.bottom = "0";
    }
  } catch (error) {
    console.error("Erreur lors du chargement des détails:", error);
  }
}

// Fonctions pour gérer le trailer
// Fonctions pour gérer le trailer
function toggleTrailer() {
  const backdrop = document.getElementById("modal-backdrop");
  const video = document.getElementById("modal-video");
  const playBtn = document.querySelector(".modal-detail-play-btn");
  const backBtn = document.querySelector(".modal-detail-back-btn");
  const fullscreenBtn = document.querySelector(".modal-detail-fullscreen-btn");
  const header = document.getElementById("modal-header");

  if (backdrop && video) {
    backdrop.style.display = "none";
    video.style.display = "block";
    if (playBtn) playBtn.style.display = "none";
    if (backBtn) backBtn.style.display = "inline-flex";
    if (fullscreenBtn) fullscreenBtn.style.display = "inline-flex";
    // Activer l'effet de fondu
    if (header) header.classList.add("video-playing");
  }
}

function showBackdrop() {
  const backdrop = document.getElementById("modal-backdrop");
  const video = document.getElementById("modal-video");
  const playBtn = document.querySelector(".modal-detail-play-btn");
  const backBtn = document.querySelector(".modal-detail-back-btn");
  const fullscreenBtn = document.querySelector(".modal-detail-fullscreen-btn");
  const header = document.getElementById("modal-header");

  if (backdrop && video) {
    backdrop.style.display = "block";
    video.style.display = "none";
    if (playBtn) playBtn.style.display = "inline-flex";
    if (backBtn) backBtn.style.display = "none";
    if (fullscreenBtn) fullscreenBtn.style.display = "none";
    // Désactiver l'effet de fondu
    if (header) header.classList.remove("video-playing");
  }
}

// Variable globale pour stocker la clé du trailer actuel
let currentTrailerKey = null;

// Fonction pour mettre la vidéo existante en plein écran
function openFullscreenTrailer() {
  const video = document.getElementById("modal-video");

  if (video && video.requestFullscreen) {
    video.requestFullscreen().catch((err) => {
      console.log(`Erreur lors du passage en plein écran: ${err.message}`);
      // Fallback: agrandir la modal
      expandVideoModal();
    });
  } else if (video && video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video && video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if (video && video.msRequestFullscreen) {
    video.msRequestFullscreen();
  } else {
    // Fallback si le plein écran n'est pas supporté
    expandVideoModal();
  }
}

// Fonction fallback pour agrandir la modal
function expandVideoModal() {
  const modal = document.getElementById("detail-modal");
  const modalContent = modal?.querySelector(".modal-detail-content");
  const video = document.getElementById("modal-video");

  if (modal && modalContent && video) {
    modal.classList.add("expanded");
    modalContent.classList.add("expanded");
    video.classList.add("expanded");

    // Ajouter un bouton pour revenir à la taille normale
    const exitBtn = document.createElement("button");
    exitBtn.className = "exit-expanded-btn";
    exitBtn.innerHTML = "✖ Quitter plein écran";
    exitBtn.onclick = exitExpandedMode;
    modalContent.appendChild(exitBtn);
  }
}

// Fonction pour quitter le mode agrandi
function exitExpandedMode() {
  const modal = document.getElementById("detail-modal");
  const modalContent = modal?.querySelector(".modal-detail-content");
  const video = document.getElementById("modal-video");
  const exitBtn = document.querySelector(".exit-expanded-btn");

  if (modal) modal.classList.remove("expanded");
  if (modalContent) modalContent.classList.remove("expanded");
  if (video) video.classList.remove("expanded");
  if (exitBtn) exitBtn.remove();
}

// Fonction pour fermer le trailer en plein écran
function closeFullscreenTrailer() {
  const modal = document.getElementById("fullscreen-trailer-modal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "auto";
    }, 300);
  }
}

function closeDetailModal() {
  const modal = document.getElementById("detail-modal");
  if (modal) {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEscapeKey);
    }, 300);
  }
}

function handleEscapeKey(e) {
  if (e.key === "Escape") {
    closeDetailModal();
  }
}

// =========================
// Init
// =========================
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("home-page")) loadHome();
  if (document.body.classList.contains("movies-page")) loadMoviesPage();
  if (document.body.classList.contains("series-page")) loadSeriesPage();
  if (document.body.classList.contains("movie-detail-page")) loadMovieDetail();
  if (document.body.classList.contains("series-detail-page"))
    loadSeriesDetail();
});

document.querySelectorAll(".row-container").forEach((container) => {
  const row = container.querySelector(".row");
  const leftBtn = container.querySelector(".scroll-btn.left");
  const rightBtn = container.querySelector(".scroll-btn.right");

  leftBtn.addEventListener("click", () => {
    row.scrollBy({ left: -300, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    row.scrollBy({ left: 300, behavior: "smooth" });
  });
});
