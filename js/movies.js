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

function openMovieDetail(details) {
  const cast = details.credits?.cast?.slice(0, 8) || [];
  const posters = details.images?.posters?.slice(0, 6) || [];
  const posterMain = tmdbImage(details.poster_path, "w342") || "";

  const tmdbMovieUrl = `https://www.themoviedb.org/movie/${details.id}`;

  const html = `
    <div style="display:flex;gap:16px;align-items:flex-start;">
      <div style="flex:0 0 180px;">${safeImgHtml(posterMain, details.title, "180px")}</div>
      <div style="flex:1;">
        <h2 style="margin-top:0">${details.title || ""} ${details.release_date ? `(${details.release_date.slice(0,4)})` : ""}</h2>
        <p><strong>Language:</strong> ${details.original_language || "Unknown"}</p>
        <p><strong>Runtime:</strong> ${details.runtime ? details.runtime + " min" : "Unknown"}</p>
        <p><strong>Synopsis:</strong> ${details.overview || "No synopsis available."}</p>
        <p><strong>Top Cast:</strong> ${cast.length ? cast.map(c => c.name).join(", ") : "N/A"}</p>
        <p><a href="${tmdbMovieUrl}" target="_blank" rel="noopener">View on TheMovieDB</a></p>
      </div>
    </div>

    <hr/>

    <div>
      <h4>Posters</h4>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${posters.map(p => `<img style="width:120px;height:160px;object-fit:cover;border-radius:4px" src="${tmdbImage(p.file_path,'w200')}" onerror="this.onerror=null;this.src='images/placeholder.png'">`).join("")}
      </div>
    </div>
  `;

  openInfoModal(html);
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
