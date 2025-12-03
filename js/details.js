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

function openActorDetail(details) {
  const credits = details.combined_credits?.cast || [];
  credits.sort((a,b) => ((b.release_date || b.first_air_date) || "").localeCompare((a.release_date || a.first_air_date) || ""));
  const topCredits = credits.slice(0, 15);

  const tmdbPersonUrl = `https://www.themoviedb.org/person/${details.id}`;

  const html = `
    <div style="display:flex;gap:16px;align-items:flex-start;">
      <div style="flex:0 0 180px;">${safeSmallImg(tmdbImage(details.profile_path,'w300'), details.name)}</div>
      <div style="flex:1;">
        <h2 style="margin-top:0">${details.name || ""}</h2>
        <p><strong>Born:</strong> ${details.birthday || "Unknown"} ${details.place_of_birth ? `in ${details.place_of_birth}` : ""}</p>
        <p><strong>Known for:</strong> ${details.known_for_department || "N/A"}</p>
        <p><strong>Biography:</strong> ${details.biography ? (details.biography.slice(0,800) + (details.biography.length>800? "…" : "")) : "No biography available."}</p>
        <p><a href="${tmdbPersonUrl}" target="_blank" rel="noopener">View on TheMovieDB</a></p>
      </div>
    </div>

    <hr/>

    <div>
      <h4>Selected Filmography</h4>
      <ul>
        ${topCredits.map(c => `<li>${(c.title||c.name)||"Unknown"} ${c.release_date ? `(${c.release_date.slice(0,4)})` : ""}</li>`).join("")}
      </ul>
    </div>
  `;

  openInfoModal(html);
}


function closeModal() {
    document.getElementById("detail-modal").style.display = "none";
}
