const arkansasActors = [
  "Billy Bob Thornton",
  "Mary Steenburgen",
  "Wes Bentley",
  "Joey Lauren Adams",
  "Brandon Keener",
  "George Newbern",
  "Johnny Cash",
  "Josh Lucas",
  "Ne-Yo",
  "Daniel Davis"
];

const actorListEl = document.getElementById("actor-list");

function safeSmallImg(src, alt = "") {
  if (!src) return `<div style="width:100%;height:260px;background:#ddd;display:flex;align-items:center;justify-content:center;border-radius:6px;">No Image</div>`;
  return `<img src="${src}" alt="${alt}" style="width:100%;height:260px;object-fit:cover;border-radius:6px;" onerror="this.onerror=null;this.src='images/placeholder.png'">`;
}

async function buildActorCard(name) {
  try {
    const found = await searchPersonRaw(name);
    if (!found) {
      console.warn("Actor not found:", name);
      return;
    }
    const details = await getPersonDetails(found.id);
    const profileUrl = tmdbImage(details.profile_path, "w300");

    const card = document.createElement("div");
    card.className = "card actor-card";
    card.innerHTML = `
      ${safeSmallImg(profileUrl, details.name)}
      <h3>${details.name || ""}</h3>
      <p>${details.place_of_birth || ""}</p>
    `;

    card.addEventListener("click", () => openActorDetail(details));
    actorListEl.appendChild(card);

  } catch (err) {
    console.error("buildActorCard error:", err);
  }
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

document.addEventListener("DOMContentLoaded", async () => {
  if (!actorListEl) {
    console.error("actor-list element not found in DOM.");
    return;
  }
  actorListEl.innerHTML = "";
  for (const a of arkansasActors) {
    await buildActorCard(a);
  }
});
