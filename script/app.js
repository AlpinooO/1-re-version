import { CONFIG } from './config.js';
import { TMDBAPI } from './api.js';
import { UIManager } from './ui.js';
import { HeroManager } from './hero.js';
import { SearchManager } from './search.js';
import { ListsManager } from './lists.js';
import './auth.js';

let searchManager;
let listsManager;

async function loadHome() {
  console.log("🎬 Chargement de la page d'accueil...");

  // Charger le hero banner dynamique
  await HeroManager.loadHeroBanner();

  const filmsRow = document.querySelector(".films-row");
  const seriesRow = document.querySelector(".series-row");

  console.log("📍 Films row found:", !!filmsRow);
  console.log("📍 Series row found:", !!seriesRow);

  if (filmsRow) {
    console.log("🎬 Chargement des films...");
    await loadMovieRow(filmsRow, 'popular');
  }

  if (seriesRow) {
    console.log("📺 Chargement des séries...");
    await loadSeriesRow(seriesRow);
  }

  // Charger les autres sections si elles existent
  await loadAdditionalSections();
}

async function loadMovieRow(container, type = 'popular') {
  // Si container est déjà la row, l'utiliser directement, sinon chercher .row à l'intérieur
  const row = container.classList?.contains('row') ? container : container.querySelector(".row");
  if (!row) {
    console.error("❌ Aucun conteneur .row trouvé dans:", container);
    return;
  }

  console.log("🎯 Chargement dans:", row.className);
  UIManager.showLoading(row, "Chargement des films...");

  try {
    let data;
    switch(type) {
      case 'popular':
        data = await TMDBAPI.getPopularMovies();
        break;
      case 'top_rated':
        data = await TMDBAPI.getTopRatedMovies();
        break;
      case 'trending':
        data = await TMDBAPI.getTrendingMovies();
        break;
      default:
        data = await TMDBAPI.getPopularMovies();
    }

    UIManager.clearContainer(row);

    if (data && data.length > 0) {
      data.forEach(movie => {
        const card = UIManager.createCard(movie, "movie");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log("✅ Films chargés:", data.length);
    } else {
      console.warn("⚠️ Aucun film reçu de l'API");
      UIManager.showMessage(row, "Aucun film disponible");
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des films:", error);
    UIManager.showError(row, "Erreur de chargement des films");
  }
}

async function loadSeriesRow(container, type = 'popular') {
  // Si container est déjà la row, l'utiliser directement, sinon chercher .row à l'intérieur
  const row = container.classList?.contains('row') ? container : container.querySelector(".row");
  if (!row) {
    console.error("❌ Aucun conteneur .row trouvé dans:", container);
    return;
  }

  console.log("🎯 Chargement séries dans:", row.className);
  UIManager.showLoading(row, "Chargement des séries...");

  try {
    let data;
    switch(type) {
      case 'popular':
        data = await TMDBAPI.getPopularSeries();
        break;
      case 'top_rated':
        data = await TMDBAPI.getTopRatedSeries();
        break;
      case 'trending':
        data = await TMDBAPI.getTrendingSeries();
        break;
      case 'airing_today':
        data = await TMDBAPI.getAiringTodaySeries();
        break;
      case 'on_the_air':
        data = await TMDBAPI.getOnTheAirSeries();
        break;
      default:
        console.warn(`⚠️ Type de série inconnu: ${type}, utilisation de 'popular'`);
        data = await TMDBAPI.getPopularSeries();
    }

    UIManager.clearContainer(row);

    if (data && data.length > 0) {
      data.forEach(series => {
        const card = UIManager.createCard(series, "tv");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log("✅ Séries chargées:", data.length, `(${type})`);
    } else {
      console.warn("⚠️ Aucune série reçue de l'API");
      UIManager.showMessage(row, "Aucune série disponible");
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des séries:", error);
    UIManager.showError(row, "Erreur de chargement des séries");
  }
}

async function loadMovieRowByGenre(container, genreKey) {
  const row = container.classList?.contains('row') ? container : container.querySelector(".row");
  if (!row) {
    console.error("❌ Aucun conteneur .row trouvé dans:", container);
    return;
  }

  console.log("🎯 Chargement films par genre:", genreKey);
  UIManager.showLoading(row, "Chargement des films...");

  try {
    const genreId = CONFIG.movieGenres[genreKey];
    if (!genreId) {
      console.warn(`⚠️ Genre inconnu: ${genreKey}`);
      const data = await TMDBAPI.getPopularMovies();
      UIManager.clearContainer(row);
      if (data && data.length > 0) {
        data.forEach(movie => {
          const card = UIManager.createCard(movie, "movie");
          if (card) {
            UIManager.appendToContainer(row, card);
          }
        });
      }
      return;
    }

    const data = await TMDBAPI.getMoviesByGenre(genreId);
    UIManager.clearContainer(row);

    if (data && data.length > 0) {
      data.forEach(movie => {
        const card = UIManager.createCard(movie, "movie");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log(`✅ Films ${genreKey} chargés:`, data.length);
    } else {
      console.warn("⚠️ Aucun film reçu pour le genre:", genreKey);
      UIManager.showMessage(row, "Aucun film disponible");
    }

  } catch (error) {
    console.error("❌ Erreur lors du chargement des films par genre:", error);
    UIManager.showError(row, "Erreur de chargement");
  }
}

async function loadSeriesRowByGenre(container, genreKey) {
  const row = container.classList?.contains('row') ? container : container.querySelector(".row");
  if (!row) {
    console.error("❌ Aucun conteneur .row trouvé dans:", container);
    return;
  }

  console.log("🎯 Chargement séries par genre:", genreKey);
  UIManager.showLoading(row, "Chargement des séries...");

  try {
    const genreId = CONFIG.seriesGenres[genreKey];
    if (!genreId) {
      console.warn(`⚠️ Genre inconnu: ${genreKey}`);
      const data = await TMDBAPI.getPopularSeries();
      UIManager.clearContainer(row);
      if (data && data.length > 0) {
        data.forEach(series => {
          const card = UIManager.createCard(series, "tv");
          if (card) {
            UIManager.appendToContainer(row, card);
          }
        });
      }
      return;
    }

    const data = await TMDBAPI.getSeriesByGenre(genreId);
    UIManager.clearContainer(row);

    if (data && data.length > 0) {
      data.forEach(series => {
        const card = UIManager.createCard(series, "tv");
        if (card) {
          UIManager.appendToContainer(row, card);
        }
      });
      console.log(`✅ Séries ${genreKey} chargées:`, data.length);
    } else {
      console.warn("⚠️ Aucune série reçue pour le genre:", genreKey);
      UIManager.showMessage(row, "Aucune série disponible");
    }

  } catch (error) {
    console.error("❌ Erreur lors du chargement des séries par genre:", error);
    UIManager.showError(row, "Erreur de chargement");
  }
}

async function loadAdditionalSections() {
  const topRatedSection = document.querySelector(".top-rated-row");
  if (topRatedSection) {
    await loadMovieRow(topRatedSection, 'top_rated');
  }

  const trendingSection = document.querySelector(".trending-row");
  if (trendingSection) {
    await loadMovieRow(trendingSection, 'trending');
  }
}

async function loadMovies() {
  console.log("🎬 Chargement de la page des films...");
  
  const movieStrips = document.querySelectorAll(".movies-page .strip");
  
  for (const strip of movieStrips) {
    const rowContainer = strip.querySelector('.row');
    if (rowContainer) {
      const type = strip.dataset.type;
      const genre = strip.dataset.genre;
      
      if (type) {
        // Utiliser l'API par type (popular, top_rated, etc.)
        await loadMovieRow(rowContainer, type);
      } else if (genre) {
        // Utiliser l'API par genre
        await loadMovieRowByGenre(rowContainer, genre);
      } else {
        // Par défaut, charger populaire
        await loadMovieRow(rowContainer, 'popular');
      }
    }
  }
}

async function loadSeries() {
  console.log("📺 Chargement de la page des séries...");
  
  const seriesStrips = document.querySelectorAll(".series-page .strip");
  
  for (const strip of seriesStrips) {
    const rowContainer = strip.querySelector('.row');
    if (rowContainer) {
      const type = strip.dataset.type;
      const genre = strip.dataset.genre;
      
      if (type) {
        // Utiliser l'API par type (popular, top_rated, etc.)
        await loadSeriesRow(rowContainer, type);
      } else if (genre) {
        // Utiliser l'API par genre
        await loadSeriesRowByGenre(rowContainer, genre);
      } else {
        // Par défaut, charger populaire
        await loadSeriesRow(rowContainer, 'popular');
      }
    }
  }
}

async function showDetailModal(id, type) {
  console.log(`🎬 Opening detail modal for ${type} ${id}`);
  
  const modal = document.getElementById('modal');
  const modalBody = document.querySelector('.modal-body');
  
  if (!modal || !modalBody) {
    console.error('❌ Modal elements not found');
    UIManager.showNotification('Erreur: Interface modale introuvable', 'error');
    return;
  }

  modalBody.innerHTML = '<div class="loading">Chargement des détails...</div>';
  modal.classList.add('open');
  modal.style.removeProperty('display');
  console.log('🟦 Modal open classes:', modal.className, 'inline display:', modal.style.display || '(none)');
  document.body.style.overflow = 'hidden';

  try {
    let data;
    console.log(`🔍 Fetching ${type} details for ID:`, id);
    
    if (type === 'movie') {
      data = await TMDBAPI.getMovieDetails(id);
    } else {
      data = await TMDBAPI.getSeriesDetails(id);
    }

    const [creditsData, videosData] = await Promise.all([
      (type === 'movie' ? TMDBAPI.getMovieCredits(id) : TMDBAPI.getSeriesCredits(id)),
      (type === 'movie' ? TMDBAPI.getMovieVideos(id) : TMDBAPI.getSeriesVideos(id))
    ]);

    console.log('🎯 API Response data:', data);
    console.log('📊 Data structure:', {
      title: data.title,
      name: data.name,
      overview: data.overview,
      vote_average: data.vote_average,
      poster_path: data.poster_path
    });

    if (!data) {
      console.error('❌ No data received from API');
      throw new Error('Aucune donnée reçue de l\'API');
    }

    if (!data.title && !data.name) {
      console.error('⚠️ Données reçues mais pas de titre:', data);
      throw new Error('Données incomplètes reçues');
    }

    console.log('🏗️ Generating modal HTML...');
  const posterUrl = data.poster_path ? TMDBAPI.getImageUrl(data.poster_path) : '';
  const backdropUrl = data.backdrop_path ? TMDBAPI.getImageUrl(data.backdrop_path, 'w1280') : '';
  if (!posterUrl) console.warn('⚠️ Aucun poster_path pour', id, type);
  if (!backdropUrl) console.warn('ℹ️ Pas de backdrop, affichage sans image de fond');
    
    const title = type === 'movie' ? data.title : data.name;
    console.log('📝 Modal title:', title);
    const releaseDate = type === 'movie' ? data.release_date : data.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
    
    const genres = data.genres ? data.genres.map(g => g.name).join(', ') : 'Non spécifié';
    const runtime = type === 'movie' ? 
      (data.runtime ? `${data.runtime} min` : 'N/A') : 
      (data.episode_run_time && data.episode_run_time.length > 0 ? `${data.episode_run_time[0]} min/épisode` : 'N/A');
    
    const rating = data.vote_average ? `${data.vote_average.toFixed(1)}/10` : 'N/A';
    const overview = data.overview || 'Aucun résumé disponible.';

    let trailerKey = '';
    if (videosData?.results?.length) {
      const trailer = videosData.results.find(v => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube') || videosData.results[0];
      trailerKey = trailer?.key || '';
    }

    let castHTML = '';
    const cast = creditsData?.cast?.slice(0, 8) || [];
    if (cast.length) {
      castHTML = `<div class="modal-cast"><h3>Distribution</h3><div class="cast-grid">${cast.map(member => {
        const img = member.profile_path ? TMDBAPI.getImageUrl(member.profile_path, 'w185') : 'https://via.placeholder.com/185x278/222/999?text=?';
        return `<div class="cast-member"><img loading="lazy" src="${img}" alt="${member.name}" class="cast-photo"><div class="cast-info"><div class="cast-name">${member.name}</div><div class="cast-character">${member.character || ''}</div></div></div>`;
      }).join('')}</div></div>`;
    }

    const lm = window.listsManager || null;
    const authed = window.auth?.isLoggedIn?.() || false;
    const inFav = lm ? lm.isInList(id, 'favoris') : false;
    const inWatch = lm ? lm.isInList(id, 'aVoir') : false;
    const inSeen = lm ? lm.isInList(id, 'dejaVu') : false;
    const tmdbUrl = `https://www.themoviedb.org/${type === 'movie' ? 'movie' : 'tv'}/${id}`;
    const disabledAttr = authed ? '' : ' data-auth-required="1"';
    const actionsHTML = `
      <div class="modal-actions" data-content-id="${id}" data-content-type="${type}">
        <button class="action-btn list-fav ${inFav ? 'active' : ''}" data-id="${id}" data-list="favoris" title="Ajouter aux favoris"${disabledAttr}>${inFav ? '❤️ Favori' : '🤍 Favori'}</button>
        <button class="action-btn list-watch ${inWatch ? 'active' : ''}" data-id="${id}" data-list="aVoir" title="À regarder plus tard"${disabledAttr}>${inWatch ? '📋 Dans à voir' : '📝 À voir'}</button>
        <button class="action-btn list-seen ${inSeen ? 'active' : ''}" data-id="${id}" data-list="dejaVu" title="Marquer comme vu"${disabledAttr}>${inSeen ? '✅ Vu' : '👁️ Vu ?'}</button>
        ${trailerKey ? `<button class="action-btn play-trailer" data-key="${trailerKey}" data-title="${title}">▶ Bande‑annonce</button>` : ''}
        <a class="action-btn external-link" href="${tmdbUrl}" target="_blank" rel="noopener">🌐 TMDB</a>
        <button class="action-btn close-modal">✖ Fermer</button>
      </div>`;

  const posterTrailerWrapper = trailerKey ? `<div class="poster-trailer" data-key="${trailerKey}"></div>` : '';

    modalBody.innerHTML = `
      <div class="modal-detail" tabindex="-1" aria-modal="true" role="dialog" aria-label="Détails ${title}">
        ${backdropUrl ? `<div class="modal-backdrop" style="background-image:url(${backdropUrl})"></div>` : ''}
        <div class="modal-content-inner">
          <div class="modal-poster">
            ${ posterTrailerWrapper || (posterUrl ? `<img class="poster-image" loading="lazy" src="${posterUrl}" alt="${title}" data-pending="1">` : '<div class="no-poster">Aucune affiche</div>') }
          </div>
          <div class="modal-info">
            <h2>${title}</h2>
            <div class="modal-meta">
              <span class="year">${year}</span>
              <span class="rating">⭐ ${rating}</span>
              <span class="duration">${runtime}</span>
            </div>
            <div class="modal-genres"><strong>Genres:</strong> ${genres}</div>
            <div class="modal-overview"><p>${overview}</p></div>
            ${type === 'tv' && data.number_of_seasons ? 
              `<div class="modal-seasons"><strong>Saisons:</strong> ${data.number_of_seasons} (${data.number_of_episodes || 0} épisodes)</div>` : ''}
            ${actionsHTML}
            ${castHTML}
          </div>
        </div>
      </div>`;

    initModalDetailActions();

    const posterImgEl = modalBody.querySelector('.poster-image');
    if (posterImgEl) {
      posterImgEl.addEventListener('load', () => {
        posterImgEl.removeAttribute('data-pending');
        console.log('🖼️ Poster chargé:', posterImgEl.src);
      }, { once:true });
      posterImgEl.addEventListener('error', () => {
        console.warn('⚠️ Échec chargement poster, application placeholder');
        posterImgEl.src = 'https://via.placeholder.com/360x540/1b2a44/7fa6d9?text=Affiche+indisponible';
        posterImgEl.removeAttribute('data-pending');
      }, { once:true });
    }

    if (trailerKey) {
      const slot = modalBody.querySelector('.poster-trailer');
      if (slot) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=1&playsinline=1&controls=1&modestbranding=1&rel=0`;
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
        iframe.loading = 'eager';
        iframe.title = `${title} - Bande-annonce`;
        iframe.setAttribute('allowfullscreen','');
        iframe.style.width='100%';
        iframe.style.height='100%';
        iframe.style.border='0';
        iframe.style.opacity='0';
        iframe.style.transition='opacity .5s';
        iframe.addEventListener('load', () => { requestAnimationFrame(()=> iframe.style.opacity='1'); }, { once:true });
        iframe.addEventListener('error', () => {
          console.warn('⚠️ Trailer non disponible, fallback affiche');
          if (slot) {
            if (posterUrl) {
              slot.outerHTML = `<img class=\"poster-image\" src=\"${posterUrl}\" alt=\"${title}\">`;
            } else {
              slot.outerHTML = '<div class=\"no-poster\">Aucune affiche</div>';
            }
          }
        }, { once:true });
        slot.appendChild(iframe);
      }
    }

    const manualPlayBtn = modalBody.querySelector('.play-trailer');
    if (manualPlayBtn) {
      manualPlayBtn.addEventListener('click', () => {
        if (manualPlayBtn.classList.contains('active')) {
          return;
        }
        manualPlayBtn.classList.add('active');
        manualPlayBtn.textContent = '⏹ Bande‑annonce';
        mountTrailer();
      });
    }

    if (trailerKey) {
      const trailerWrapperEl = modalBody.querySelector('.trailer-wrapper');
      const playBtnEl = modalBody.querySelector('.play-trailer');
      if (trailerWrapperEl && playBtnEl) {
        setTimeout(() => {
          // Ne l'affiche que si toujours caché et la modale est ouverte
          if (modal.classList.contains('open') && trailerWrapperEl.hidden) {
            trailerWrapperEl.hidden = false;
            playBtnEl.textContent = '⏹ Fermer la vidéo';
          }
        }, 4500);
      }
    }

    console.log('📄 HTML generated and inserted into modal');
    console.log('🎨 Modal HTML content:', modalBody.innerHTML.substring(0, 200) + '...');
    console.log('📏 Modal dimensions:', {
      modal: modal.getBoundingClientRect(),
      modalBody: modalBody.getBoundingClientRect()
    });
    console.log(`✅ Détails chargés pour: ${title}`);

    const bodyRect = modalBody.getBoundingClientRect();
    if (!modalBody.innerHTML.trim() || bodyRect.height < 50) {
      console.warn('⚠️ Fallback modal activé (contenu vide ou trop petit)');
      modalBody.innerHTML = `
        <div style="padding:2rem;text-align:center;">
          <h2>${title}</h2>
          <p>${overview}</p>
          <p><strong>${year}</strong> • ${rating} • ${genres}</p>
        </div>`;
    }

  } catch (error) {
    console.error('❌ Erreur lors du chargement des détails:', error);
    modalBody.innerHTML = `
      <div class="modal-error">
        <h3>⚠️ Erreur de chargement</h3>
        <p>Impossible de charger les détails du ${type === 'movie' ? 'film' : 'série'}.</p>
        <button onclick="document.getElementById('modal').style.display='none'; document.body.style.overflow='auto';" class="retry-btn">Fermer</button>
      </div>
    `;
  }
}

function initModal() {
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.modal-close');
  
  if (!modal) {
    console.warn('⚠️ Modal element not found');
    return;
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const iframe = modal.querySelector('.poster-trailer iframe');
      if (iframe) {
        iframe.remove();
      }
      modal.classList.remove('open');
      modal.style.display = 'none'; // fermeture explicite
      document.body.style.overflow = 'auto';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      const iframe = modal.querySelector('.poster-trailer iframe');
      if (iframe) iframe.remove();
      modal.classList.remove('open');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      const iframe = modal.querySelector('.poster-trailer iframe');
      if (iframe) iframe.remove();
      modal.classList.remove('open');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  console.log('✅ Modale initialisée');
}

function initModalDetailActions() {
  const modal = document.getElementById('modal');
  const modalBody = document.querySelector('.modal-body');
  if (!modal || !modalBody) return;

  const listButtons = modalBody.querySelectorAll('.modal-actions .action-btn[data-list]');
  const closeBtn = modalBody.querySelector('.close-modal');
  const dialog = modalBody.querySelector('.modal-detail');
  const lm = window.listsManager || null;

  if (dialog) {
    const focusable = dialog.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    setTimeout(() => first?.focus(), 50);
  }

  listButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const auth = window.auth;
      if (!auth || !auth.isLoggedIn()) {
        UIManager.showNotification('Connectez-vous pour gérer vos listes.', 'warning');
        auth?.showLoginModal?.();
        return;
      }
      if (!lm) return;
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const list = btn.getAttribute('data-list');
      if (!id || !list) return;
      const already = lm.isInList(id, list);
      if (already) {
        lm.removeFromList(id, list);
        btn.classList.remove('active');
        if (list === 'favoris') btn.textContent = '🤍 Favori';
        else if (list === 'aVoir') btn.textContent = '📝 À voir';
        else if (list === 'dejaVu') btn.textContent = '👁️ Vu ?';
      } else {
        lm.addToList(id, list);
        btn.classList.add('active');
        if (list === 'favoris') btn.textContent = '❤️ Favori';
        else if (list === 'aVoir') btn.textContent = '📋 Dans à voir';
        else if (list === 'dejaVu') btn.textContent = '✅ Vu';
      }
    });
  });
  const refreshButtons = () => {
    const auth = window.auth;
    listButtons.forEach(btn => {
      const list = btn.getAttribute('data-list');
      const id = btn.getAttribute('data-id');
      if (!auth || !auth.isLoggedIn()) {
        btn.classList.remove('active');
        btn.setAttribute('data-auth-required','1');
        if (list === 'favoris') btn.textContent = '🤍 Favori';
        else if (list === 'aVoir') btn.textContent = '📝 À voir';
        else if (list === 'dejaVu') btn.textContent = '👁️ Vu ?';
        return;
      }
      btn.removeAttribute('data-auth-required');
      if (lm && id) {
        const inList = lm.isInList(parseInt(id,10), list);
        if (inList) {
          btn.classList.add('active');
          if (list === 'favoris') btn.textContent = '❤️ Favori';
          else if (list === 'aVoir') btn.textContent = '📋 Dans à voir';
          else if (list === 'dejaVu') btn.textContent = '✅ Vu';
        } else {
          btn.classList.remove('active');
          if (list === 'favoris') btn.textContent = '🤍 Favori';
          else if (list === 'aVoir') btn.textContent = '📝 À voir';
          else if (list === 'dejaVu') btn.textContent = '👁️ Vu ?';
        }
      }
    });
  };
  window.addEventListener('authStateChanged', refreshButtons);
  window.addEventListener('userListsUpdated', refreshButtons);
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      const iframe = modal.querySelector('.poster-trailer iframe');
      if (iframe) iframe.remove();
    });
  }
}

function detectPageAndLoad() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  
  console.log("🔍 Page détectée:", page);
  
  switch(page) {
    case 'index.html':
    case '':
      loadHome();
      break;
    case 'movies.html':
      loadMovies();
      break;
    case 'series.html':
      loadSeries();
      break;
    case 'list.html':
      // Les listes sont gérées par ListsManager
      break;
    default:
      console.log("📄 Page inconnue, chargement par défaut");
      loadHome();
  }
}

window.showDetailModal = showDetailModal;
window.showMovieDetail = showDetailModal;

window.showMovieDetail = function(movieId) {
  showDetailModal(movieId, 'movie');
};

function initApp() {
  console.log("🚀 Initialisation de BlueFlix...");
  
  UIManager.initHamburgerMenu();
  UIManager.initScrollEffects();
  UIManager.initScrollButtons();
  
  initModal();
  
  searchManager = new SearchManager();
  searchManager.init();
  
  listsManager = new ListsManager();
  listsManager.init();
  window.listsManager = listsManager;
  
  HeroManager.initHeroEvents();
  
  if (window.auth) {
    console.log("🔐 Système d'authentification détecté");
    window.auth.reinitEventListeners();
  } else {
    console.warn("⚠️ Système d'authentification non trouvé - tentative de réinitialisation...");
    setTimeout(() => {
      if (window.auth) {
        console.log("🔐 Système d'authentification trouvé en différé");
        window.auth.reinitEventListeners();
      } else {
        console.error("❌ Impossible d'initialiser l'authentification");
      }
    }, 500);
  }
  
  window.loadHome = loadHome;
  window.loadMovies = loadMovies;
  window.loadSeries = loadSeries;
  window.loadMovieRow = loadMovieRow;
  window.loadSeriesRow = loadSeriesRow;
  window.CONFIG = CONFIG;
  window.TMDBAPI = TMDBAPI;
  window.showDetailModal = showDetailModal;
  
  detectPageAndLoad();
  
  console.log("✅ BlueFlix initialisé avec succès!");
  console.log("🔧 showDetailModal exposed:", typeof window.showDetailModal);
}

document.addEventListener("DOMContentLoaded", initApp);

// Export pour la compatibilité avec les autres modules
export { 
  loadHome, 
  loadMovies, 
  loadSeries, 
  showDetailModal,
  searchManager,
  listsManager 
};