const TMDB_API_KEY = "e36a7ff4d8c66d63173b15bb01e21258";
const TMDB_BASE = "https://api.themoviedb.org/3";

async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  if (!res.ok) {
    console.error("TMDB fetch failed:", url.toString(), res.status, res.statusText);
    throw new Error(`TMDB fetch error ${res.status}`);
  }
  return res.json();
}

async function searchMovieRaw(title) {
  const data = await tmdbFetch("/search/movie", { query: title });
  return data.results?.length ? data.results[0] : null;
}

async function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: "credits,images" });
}

async function searchPersonRaw(name) {
  const data = await tmdbFetch("/search/person", { query: name });
  return data.results?.length ? data.results[0] : null;
}

async function getPersonDetails(id) {
  return tmdbFetch(`/person/${id}`, { append_to_response: "combined_credits,images" });
}

function tmdbImage(path, size = "w300") {
  if (!path) return "";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `https://image.tmdb.org/t/p/${size}${clean}`;
}

/* Modal helpers */
function ensureModalElements() {
  const modalEl = document.getElementById("infoModal");
  const modalInnerEl = document.getElementById("modalInner");
  const modalCloseEl = document.getElementById("modalClose");
  return { modalEl, modalInnerEl, modalCloseEl };
}

function openInfoModal(html) {
  const { modalEl, modalInnerEl } = ensureModalElements();
  if (!modalEl || !modalInnerEl) {
    console.error("Modal elements missing in HTML (infoModal/modalInner)");
    return;
  }
  modalInnerEl.innerHTML = html;
  modalEl.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeInfoModal() {
  const { modalEl, modalInnerEl } = ensureModalElements();
  if (!modalEl || !modalInnerEl) return;
  modalEl.style.display = "none";
  modalInnerEl.innerHTML = "";
  document.body.style.overflow = "";
}

function attachModalHandlers() {
  const { modalEl, modalCloseEl } = ensureModalElements();
  if (!modalEl || !modalCloseEl) return;
  modalCloseEl.onclick = closeInfoModal;
  window.addEventListener("click", (e) => {
    if (e.target === modalEl) closeInfoModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeInfoModal();
  });
}

document.addEventListener("DOMContentLoaded", attachModalHandlers);
