const apiKey = "e36a7ff4d8c66d63173b15bb01e21258";
const actorList = document.getElementById("actor-list");
const actorModal = document.getElementById("actorModal");
const actorDetails = document.getElementById("actorDetails");
const closeBtn = document.querySelector(".close");

// list of Arkansas Actors
const arkansasActors = ["Billy Bob Thornton", "Mary Steenburgen", "Brandon Keener", "George Newbern", "Johnny Cash", "Josh Lucas", "Ne-Yo", "Daniel Davis"];

async function getActorDetails(name) {
  const url = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results[0];
}

async function displayActors() {
  for (let name of arkansasActors) {
    const actor = await getActorDetails(name);
    if (!actor) continue;

    const actorCard = document.createElement("div");
    actorCard.classList.add("actor-card");
    actorCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${actor.profile_path}" alt="${actor.name}">
      <h3>${actor.name}</h3>
    `;

    actorCard.addEventListener("click", () => openActorModal(actor));
    actorList.appendChild(actorCard);
  }
}

function openActorModal(actor) {
  actorDetails.innerHTML = `
    <h2>${actor.name}</h2>
    <p>${actor.known_for_department}</p>
    <h4>Known For:</h4>
    <ul>${actor.known_for.map(f => `<li>${f.title || f.name}</li>`).join("")}</ul>
    <a href="https://www.imdb.com/name/${actor.imdb_id}" target="_blank">View on IMDb</a>
  `;
  actorModal.style.display = "block";
}

closeBtn.addEventListener("click", () => (actorModal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === actorModal) actorModal.style.display = "none";
});

displayActors();
