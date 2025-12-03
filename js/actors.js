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
  "Bronco Billy Anderson",
  "Alan Ladd",
  "Rodger Bumpass",
  "Clark Duke",
  "Sheryl Underwood",
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
