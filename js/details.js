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

function openActorDetail(actor) {
    const modal = document.getElementById("detail-modal");
    const modalContent = document.getElementById("detail-content");

    const img = tmdbImage(actor.profile_path);

    let knownForList = "";
    if (actor.combined_credits && actor.combined_credits.cast) {
        knownForList = actor.combined_credits.cast
            .slice(0, 8)
            .map(movie => `<li>${movie.title || movie.name}</li>`)
            .join("");
    }

    modalContent.innerHTML = `
        <h2>${actor.name}</h2>
        <img src="${img}" class="popup-img">
        <p><strong>Birthday:</strong> ${actor.birthday || "Unknown"}</p>
        <p><strong>Biography:</strong> ${actor.biography || "No biography available."}</p>
        <h3>Known For:</h3>
        <ul>${knownForList}</ul>
        <p><a href="https://www.themoviedb.org/person/${actor.id}" target="_blank">View on TMDB</a></p>
    `;

    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("detail-modal").style.display = "none";
}
