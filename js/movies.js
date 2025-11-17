const apiKey = "e36a7ff4d8c66d63173b15bb01e21258";
const movieList = document.getElementById("movie-list");
const modal = document.getElementById("movieModal");
const modalContent = document.getElementById("movieDetails");
const closeBtn = document.querySelector(".close");

// Example movies filmed in Arkansas
const arkansasMovies = ["Mud", "Sling Blade", "True Grit", "Arkansas", "A Face in the Crowd", "Jackass Number Two", "", ""];

async function getMovieDetails(title) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results[0];
}

async function displayMovies() {
  for (let title of arkansasMovies) {
    const movie = await getMovieDetails(title);
    if (!movie) continue;

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.overview.substring(0, 100)}...</p>
    `;

    movieCard.addEventListener("click", () => openMovieModal(movie));
    movieList.appendChild(movieCard);
  }
}

function openMovieModal(movie) {
  modalContent.innerHTML = `
    <h2>${movie.title}</h2>
    <p><strong>Original Language:</strong> ${movie.original_language}</p>
    <p>${movie.overview}</p>
    <a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank">View on IMDb</a>
  `;
  modal.style.display = "block";
}

closeBtn.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

displayMovies();
