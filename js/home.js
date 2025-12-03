const arkansasMovies = [
  "Walk the Line",
  "Sling Blade",
  "True Grit",
  "Arkansas",
  "The Quick and the Dead"
];

const arkansasActors = [
  "Billy Bob Thornton",
  "Mary Steenburgen",
  "Wes Bentley",
  "Johnny Cash",
  "George Newbern"
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function loadFeaturedMovie() {
  const box = document.getElementById("featured-movie");

  try {
    const title = pickRandom(arkansasMovies);
    const movie = await searchMovieRaw(title);
    if (!movie) throw new Error("Movie not found");
    const details = await getMovieDetails(movie.id);

    const poster = tmdbImage(details.poster_path, "w342");

    box.innerHTML = `
  <div class="featured-box clickable">
      <img src="${poster}" alt="${details.title}">
      <h4>${details.title}</h4>
      <p>${details.overview.slice(0, 120)}...</p>
  </div>
`;

   box.querySelector(".clickable").onclick = () => openMovieDetail(details);

  } catch (err) {
    console.error(err);
    box.innerHTML = "<p>Unable to load movie</p>";
  }
}

async function loadFeaturedActor() {
  const box = document.getElementById("featured-actor");

  try {
    const name = pickRandom(arkansasActors);
    const person = await searchPersonRaw(name);
    if (!person) throw new Error("Actor not found");
    const details = await getPersonDetails(person.id);

    const img = tmdbImage(details.profile_path);

   box.innerHTML = `
      <div class="featured-box clickable">
          <img src="${img}" alt="${details.name}">
          <h4>${details.name}</h4>
          <p>${details.biography ? details.biography.slice(0, 120) + "..." : "Biography unavailable."}</p>
      </div>
    `;

    box.querySelector(".clickable").onclick = () => openActorDetail(details);

  } catch (err) {
    console.error(err);
    box.innerHTML = "<p>Unable to load actor</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadFeaturedMovie();
  loadFeaturedActor();
});
