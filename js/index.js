const arkansasMovies = [
  "Mud",
  "Sling Blade",
  "True Grit",
  "Arkansas",
  "The Quick and the Dead"
];

const arkansasActors = [
  "Billy Bob Thornton",
  "Mary Steenburgen",
  "Wes Bentley",
  "Joey Lauren Adams"
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* Featured Movie */
async function loadFeaturedMovie() {
  const container = document.getElementById("featured-movie");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const title = pickRandom(arkansasMovies);
    const found = await searchMovieRaw(title);
    if (!found) throw new Error("No movie found!");

    const details = await getMovieDetails(found.id);
    const poster = tmdbImage(details.poster_path, "w342");

    container.innerHTML = `
      <div class="featured-box" style="cursor:pointer;">
        <img src="${poster}" alt="${details.title}">
        <h4>${details.title}</h4>
        <p>${details.overview.slice(0, 120)}...</p>
      </div>
    `;

    container.onclick = () => openMovieDetail(details);

  } catch (err) {
    container.innerHTML = "<p>Unable to load featured movie.</p>";
    console.error(err);
  }
}

/* Featured Actor */
async function loadFeaturedActor() {
  const container = document.getElementById("featured-actor");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const name = pickRandom(arkansasActors);
    const found = await searchPersonRaw(name);
    if (!found) throw new Error("No actor found!");

    const details = await getPersonDetails(found.id);
    const photo = tmdbImage(details.profile_path, "w300");

    container.innerHTML = `
      <div class="featured-box" style="cursor:pointer;">
        <img src="${photo}" alt="${details.name}">
        <h4>${details.name}</h4>
        <p>${details.biography ? details.biography.slice(0,120) + "..." : "Biography unavailable."}</p>
      </div>
    `;

    container.onclick = () => openActorDetail(details);

  } catch (err) {
    container.innerHTML = "<p>Unable to load featured actor.</p>";
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadFeaturedMovie();
  loadFeaturedActor();
});
