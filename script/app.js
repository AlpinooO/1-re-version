const API_KEY = "e4b90327227c88daac14c0bd0c1f93cd";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// =========================
// Fetch API
// =========================
async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API request failed");
    return res.json();
  } catch (error) {
    console.error(error);
    return { results: [] };
  }
}

// =========================
// Create Card
// =========================
function createCard(item, type = "movie") {
  if (!item.poster_path) return null;
  const card = document.createElement("a");
  card.className = "card";
  card.href =
    type === "movie"
      ? `html/movie-detail.html?id=${item.id}`
      : `html/series-detail.html?id=${item.id}`;
  card.innerHTML = `<img src="${IMAGE_BASE_URL}${item.poster_path}" alt="${
    type === "movie" ? item.title : item.name
  }">`;
  return card;
}

// =========================
// Load Home Page
// =========================
async function loadHome() {
  const filmsRow = document.querySelector(".films-row");
  const seriesRow = document.querySelector(".series-row");

  if (filmsRow) {
    const data = await fetchData(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    filmsRow.innerHTML = "";
    data.results.slice(0, 80).forEach((movie) => {
      const card = createCard(movie, "movie");
      if (card) filmsRow.appendChild(card);
    });
  }

  if (seriesRow) {
    const data = await fetchData(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    seriesRow.innerHTML = "";
    data.results.slice(0, 80).forEach((show) => {
      const card = createCard(show, "series");
      if (card) seriesRow.appendChild(card);
    });
  }
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
// Hamburger Menu
// =========================
function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }
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
// Init
// =========================
document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
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
