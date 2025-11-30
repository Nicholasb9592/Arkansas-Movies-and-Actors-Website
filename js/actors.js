const apiKey = "e36a7ff4d8c66d63173b15bb01e21258";
const actorList = document.getElementById("actor-list");
const actorModal = document.getElementById("actorModal");
const actorDetails = document.getElementById("actorDetails");
const closeBtn = document.querySelector(".close");

// list of Arkansas Actors
const arkansasActors = ["Billy Bob Thornton", "Mary Steenburgen", "Brandon Keener", "George Newbern", "Johnny Cash", "Josh Lucas", "Ne-Yo", "Daniel Davis"];

const actorListEl = document.getElementById("actor-list"); // ensure actors.html has <section id="actor-list" class="actor-grid"></section>

async function buildActorCard(name) {
  try {
    const found = await searchPersonRaw(name);
    if (!found) {
      console.warn("Actor not found:", name);
      return;
    }
    const details = await getPersonDetails(found.id); // combined_credits is already appended
    const profile = details.profile_path;
    const knownFor = (details.known_for_department || "") + (details.popularity ? ` • popularity ${Math.round(details.popularity)}` : "");
    const card = document.createElement("div");
    card.className = "card actor-card";
    card.innerHTML = `
      <img src="${tmdbImage(profile,'w300')}" alt="${details.name}">
      <h3>${details.name}</h3>
      <p>${details.place_of_birth || ""}</p>
    `;
    card.addEventListener("click", () => openActorDetail(details));
    actorListEl.appendChild(card);
  } catch (err) {
    console.error("Error building actor card for", name, err);
  }
}

function openActorDetail(details) {
  // use combined_credits to display filmography, if available
  const credits = (details.combined_credits && details.combined_credits.cast) ? details.combined_credits.cast : [];
  // sort credits by release date descending
  credits.sort((a,b)=> (b.release_date||b.first_air_date || "").localeCompare(a.release_date||a.first_air_date || ""));
  const topMovies = credits.slice(0,12);

  const imdbUrl = details.imdb_id ? `https://www.imdb.com/name/${details.imdb_id}` : "#";
  const html = `
    <div style="display:flex; gap:16px; align-items:flex-start;">
      <div style="flex:0 0 180px;">
        <img class="poster" src="${tmdbImage(details.profile_path,'w300')}" alt="${details.name}">
      </div>
      <div class="modal-meta" style="flex:1;">
        <h2>${details.name}</h2>
        <p><strong>Born:</strong> ${details.birthday || 'Unknown'} ${details.place_of_birth ? `in ${details.place_of_birth}` : ''}</p>
        <p><strong>Known for:</strong> ${details.known_for_department || 'N/A'}</p>
        <p><strong>Biography:</strong> ${details.biography ? details.biography.slice(0,800) + (details.biography.length>800? "…" : "") : "No biography available."}</p>
        <p><a href="${imdbUrl}" target="_blank" rel="noopener">View on IMDb</a></p>
      </div>
    </div>

    <hr />

    <div>
      <h4>Selected Filmography</h4>
      <ul>
        ${topMovies.map(m => `<li>${(m.title || m.name) || 'Unknown'} ${m.release_date ? `(${m.release_date.slice(0,4)})` : ''}</li>`).join("")}
      </ul>
    </div>
  `;

  openInfoModal(html);
}

// initialize list
(async function initActors() {
  if (!actorListEl) return console.error("actor-list element not found");
  actorListEl.innerHTML = "";
  for (const name of arkansasActors) {
    buildActorCard(name);
  }
})();
