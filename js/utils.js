const TMDB_API_KEY = "e36a7ff4d8c66d63173b15bb01e21258";   // <-- Replace with your key
const TMDB_BASE = "https://api.themoviedb.org/3";

// Generic fetch wrapper
async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.set(k, v);
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB fetch error: ${res.status}`);
  return res.json();
}

// Movie Search
async function searchMovieRaw(title) {
  const data = await tmdbFetch("/search/movie", { query: title });
  return data.results?.length ? data.results[0] : null;
}

// Movie Details + credits + posters
async function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: "credits,images" });
}

// Actor Search
async function searchPersonRaw(name) {
  const data = await tmdbFetch("/search/person", { query: name });
  return data.results?.length ? data.results[0] : null;
}

// Actor Details + filmography + images
async function getPersonDetails(id) {
  return tmdbFetch(`/person/${id}`, {
    append_to_response: "combined_credits,images"
  });
}

// Image helper
function tmdbImage(path, size = "w300") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
}

// =====================
// Modal Logic
// =====================
const modal = document.getElementById("infoModal");
const modalInner = document.getElementById("modalInner");
const modalClose = document.getElementById("modalClose");

function openInfoModal(html) {
  modalInner.innerHTML = html;
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeInfoModal() {
  modal.style.display = "none";
  modalInner.innerHTML = "";
  document.body.style.overflow = "";
}

modalClose.onclick = closeInfoModal;
window.onclick = (e) => {
  if (e.target === modal) closeInfoModal();
};
window.onkeydown = (e) => {
  if (e.key === "Escape") closeInfoModal();
};
