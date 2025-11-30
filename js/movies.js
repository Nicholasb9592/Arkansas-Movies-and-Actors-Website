const apiKey = "e36a7ff4d8c66d63173b15bb01e21258";
const movieList = document.getElementById("movie-list");
const modal = document.getElementById("movieModal");
const modalContent = document.getElementById("movieDetails");
const closeBtn = document.querySelector(".close");

// Example movies filmed in Arkansas
const arkansasMovies = ["Mud", "Sling Blade", "True Grit", "End of the Line", "Mindcage", "The Ernest Green Story", "Walk the Line", "Jackass Number Two"];

const movieListEl = document.getElementById("movie-list"); // ensure movies.html has <section id="movie-list" class="movie-grid"></section>

async function buildMovieCard(title) {
  try {
    const found = await searchMovieRaw(title);
    if (!found) {
      console.warn("Movie not found:", title);
      return;
    }
    const details = await getMovieDetails(found.id);
    const card = document.createElement("div");
    card.className = "card movie-card";
    card.innerHTML = `
      <img src="${tmdbImage(details.poster_path, 'w342')}" alt="${details.title}">
      <h3>${details.title} (${(details.release_date||"").slice(0,4)})</h3>
      <p>${details.overview ? details.overview.slice(0,100) + "…" : ""}</p>
    `;
    card.addEventListener("click", () => openMovieDetail(details));
    movieListEl.appendChild(card);
  } catch (err) {
    console.error("Error building card for", title, err);
  }
}

async function openMovieDetail(details) {
  // details should be the full movie object returned by getMovieDetails()
  // try to get top cast from details.credits if appended
  const cast = (details.credits && details.credits.cast) ? details.credits.cast.slice(0,8) : [];
  const posters = (details.images && details.images.posters) ? details.images.posters.slice(0,6) : [];
  const imdbUrl = details.imdb_id ? `https://www.imdb.com/title/${details.imdb_id}` : "#";

  const html = `
    <div style="display:flex; gap:16px; align-items:flex-start;">
      <div style="flex:0 0 180px;">
        <img class="poster" src="${tmdbImage(details.poster_path,'w342')}" alt="${details.title}">
      </div>
      <div class="modal-meta" style="flex:1;">
        <h2>${details.title} ${details.release_date ? `(${details.release_date.slice(0,4)})` : ""}</h2>
        <p><strong>Original language:</strong> ${details.original_language || "Unknown"}</p>
        <p><strong>Runtime:</strong> ${details.runtime ? details.runtime + " min" : "Unknown"}</p>
        <p><strong>Synopsis:</strong> ${details.overview || "No synopsis available."}</p>
        <p><strong>Top Cast:</strong> ${cast.map(c => c.name).join(", ")}</p>
        <p><a href="${imdbUrl}" target="_blank" rel="noopener">View on IMDb</a></p>
      </div>
    </div>

    <hr />

    <div>
      <h4>Posters</h4>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${posters.map(p => `<img style="width:110px;height:160px;object-fit:cover;border-radius:4px" src="${tmdbImage(p.file_path,'w200')}" />`).join("")}
      </div>
    </div>
  `;

  openInfoModal(html);
}

// initialize list
(async function initMovies() {
  if (!movieListEl) return console.error("movie-list element not found");
  movieListEl.innerHTML = "";
  for (const title of arkansasMovies) {
    // we don't await sequentially to speed up UI; but to limit concurrency you can await each
    // for simplicity, build one-by-one
    // await buildMovieCard(title);
    buildMovieCard(title);
  }
})();
