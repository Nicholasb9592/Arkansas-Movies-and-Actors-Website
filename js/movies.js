const arkansasMovies = [
  "Mud",
  "Sling Blade",
  "True Grit",
  "Arkansas",
  "The Quick and the Dead",
  "End of the Line",
  "Mindcage",
  "The Ernest Green Story",
  "Walk the Line",
  "Jackass Number Two"
];

const movieListEl = document.getElementById("movie-list");

function safeImgHtml(src, alt = "", width = "100%") {
  if (!src) {
    return `<div style="width:${width};height:260px;background:#ddd;display:flex;align-items:center;justify-content:center;border-radius:6px;">No Image</div>`;
  }
  return `<img src="${src}" alt="${alt}" style="width:${width};height:260px;object-fit:cover;border-radius:6px" onerror="this.onerror=null;this.src='images/placeholder.png'">`;
}

async function buildMovieCard(title) {
  try {
    const found = await searchMovieRaw(title);
    if (!found) {
      console.warn("Movie not found:", title);
      return;
    }
    const details = await getMovieDetails(found.id);
    const posterUrl = tmdbImage(details.poster_path, "w342");

    const card = document.createElement("div");
    card.className = "card movie-card";
    card.innerHTML = `
      ${safeImgHtml(posterUrl, details.title)}
      <h3>${details.title || ""} ${details.release_date ? `(${details.release_date.slice(0,4)})` : ""}</h3>
      <p>${details.overview ? (details.overview.slice(0,110) + (details.overview.length>110 ? "…" : "")) : ""}</p>
    `;

    card.addEventListener("click", () => openMovieDetail(details));
    movieListEl.appendChild(card);
  } catch (err) {
    console.error("buildMovieCard error:", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!movieListEl) {
    console.error("movie-list element not found in DOM.");
    return;
  }
  movieListEl.innerHTML = "";
  for (const t of arkansasMovies) {
    await buildMovieCard(t);
  }
});
