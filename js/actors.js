const arkansasActors = [
  "Billy Bob Thornton",
  "Mary Steenburgen",
  "Wes Bentley",
  "Joey Lauren Adams"
];

const actorListEl = document.getElementById("actor-list");

// Build actor card
async function buildActorCard(name) {
  try {
    const found = await searchPersonRaw(name);
    if (!found) return;

    const details = await getPersonDetails(found.id);

    const card = document.createElement("div");
    card.className = "card actor-card";

    card.innerHTML = `
      <img src="${tmdbImage(details.profile_path,'w300')}">
      <h3>${details.name}</h3>
      <p>${details.place_of_birth || ""}</p>
    `;

    card.addEventListener("click", () => openActorDetail(details));
    actorListEl.appendChild(card);

  } catch (err) {
    console.error("Actor error:", err);
  }
}

// Open modal with actor info
function openActorDetail(details) {
  const credits = details.combined_credits?.cast || [];
  credits.sort((a,b) => (b.release_date || "").localeCompare(a.release_date || ""));

  const imdbUrl = details.imdb_id
    ? `https://www.imdb.com/name/${details.imdb_id}`
    : "#";

  const html = `
    <h2>${details.name}</h2>
    <img class="poster" src="${tmdbImage(details.profile_path,'w300')}">

    <p><strong>Born:</strong> ${details.birthday || ""} in ${details.place_of_birth || ""}</p>
    <p><strong>Biography:</strong> ${details.biography?.slice(0, 700) || "No biography available."}...</p>

    <p><a href="${imdbUrl}" target="_blank">View on IMDb</a></p>

    <h3>Filmography</h3>
    <ul>
      ${credits.slice(0, 15).map(c => `
        <li>${c.title || c.name} (${c.release_date?.slice(0,4) || ""})</li>
      `).join("")}
    </ul>
  `;

  openInfoModal(html);
}

// Initial load
(async function initActors() {
  for (const name of arkansasActors) {
    buildActorCard(name);
  }
})();
