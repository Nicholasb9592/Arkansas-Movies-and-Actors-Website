const arkansasMovies = [
  "Mud",
  "Sling Blade",
  "True Grit",
  "Arkansas",
  "A Face in the Crowd",
  "The Quick and the Dead"
];

const movieListEl = document.getElementById("movie-list");

// Builds individual movie card
async function buildMovieCard(title) {
  try {
    const found = await searchMovieRaw(title);
    if (!found) return;

    const details = await getMovieDetails(found.id);

    const card = document.createElement("div");
    card.className = "card movie-card";

    card.innerHTML = `
      <img src="${tmdbImage(details.poster_path, 'w342')}" alt="${details.title}">
      <h3>${details.title}</h3>
      <p>${details.overview?.slice(0, 100) || ""}...</p>
    `;

    card.addEventListener("click", () => openMovieDetail(details));
    movieListEl.appendChild(card);

  } catch (err) {
    console.error("Movie error:", err);
  }
}

// Opens modal with details
function openMovieDetail(details) {
  const cast = details.credits?.cast?.slice(0, 8) || [];
  const posters = details.images?.posters?.slice(0, 6) || [];
  const imdbUrl = details.imdb_id
    ? `https://www.imdb.com/title/${details.imdb_id}`
    : "#";

  const html = `
    <h2>${details.title} (${details.release_date?.slice(0,4) || ""})</h2>
    <img class="poster" src="${tmdbImage(details.poster_path,'w342')}">

    <p><strong>Language:</strong> ${details.original_language}</p>
    <p><strong>Runtime:</strong> ${details.runtime} min</p>
    <p><strong>Synopsis:</strong> ${details.overview}</p>
    <p><strong>Cast:</strong> ${cast.map(c => c.name).join(", ")}</p>

    <p><a href="${imdbUrl}" target="_blank">View on IMDb</a></p>

    <h3>Posters</h3>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      ${posters.map(p => `<img style="width:120px;" src="${tmdbImage(p.file_path,'w200')}">`).join("")}
    </div>
  `;

  openInfoModal(html);
}

// Initial load
(async function initMovies() {
  for (const title of arkansasMovies) {
    buildMovieCard(title);
  }
})();
