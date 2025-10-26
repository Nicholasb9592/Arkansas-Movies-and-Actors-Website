const apiKey = "";
const apiBase = "https://api.themoviedb.org/3";

async function getArkansasMovies() {
  const response = await fetch(`${apiBase}/search/movie?query=Arkansas&api_key=${apiKey}`);
  const data = await response.json();
  console.log(data.results);
}

getArkansasMovies();
