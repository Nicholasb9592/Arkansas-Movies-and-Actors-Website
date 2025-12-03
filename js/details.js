function openMovieDetail(movie) {
    const modal = document.getElementById("detail-modal");
    const modalContent = document.getElementById("detail-content");

    const poster = tmdbImage(movie.poster_path, "w342");
    const homepage = movie.homepage ? `<a href="${movie.homepage}" target="_blank">Official Site</a>` : "";
    const imdb = movie.imdb_id ? `<a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank">View on IMDB</a>` : "";

    modalContent.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="${poster}" class="popup-img">
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Overview:</strong> ${movie.overview}</p>
        <p>${homepage}</p>
        <p>${imdb}</p>
    `;

    modal.style.display = "block";
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
