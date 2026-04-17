/* ============================================================
   POKÉDEX — script.js
   ------------------------------------------------------------
   CÓMO AÑADIR UN POKÉMON NUEVO:
   1) Coloca tus sprites en una carpeta, p. ej.:  /sprites/front/  y  /sprites/back/
   2) Añade un objeto al array `pokemons` siguiendo este formato:

      {
        id: 4,                              // número de la Pokédex
        name: "charmander",                 // nombre (en minúsculas)
        types: ["fire"],                    // 1 o 2 tipos (ver lista abajo)
        front: "sprites/front/004.png",     // ruta al sprite frontal
        back:  "sprites/back/004.png",      // ruta al sprite trasero
        height: "0.6 m",
        weight: "8.5 kg",
        category: "Lagartija",
        description: "Prefiere las cosas calientes..."
      }

   TIPOS VÁLIDOS (ponlos en inglés y en minúscula):
   normal, fire, water, electric, grass, ice, fighting, poison,
   ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy

   Eso es todo. Recarga la página y aparecerá. ✨
============================================================ */

const pokemons = [
  {
    id: 1,
    name: "bulbasaur",
    types: ["grass", "poison"],
    front: "sprites/front/001.png",
    back:  "sprites/back/001.png",
    height: "0.7 m",
    weight: "6.9 kg",
    category: "Semilla",
    description: "Una rara semilla fue plantada en su lomo al nacer. La planta brota y crece con este Pokémon."
  },
  {
    id: 4,
    name: "charmander",
    types: ["fire"],
    front: "sprites/front/004.png",
    back:  "sprites/back/004.png",
    height: "0.6 m",
    weight: "8.5 kg",
    category: "Lagartija",
    description: "La llama de su cola indica su estado de ánimo. Llamea con fuerza cuando está feliz."
  },
  {
    id: 7,
    name: "squirtle",
    types: ["water"],
    front: "sprites/front/007.png",
    back:  "sprites/back/007.png",
    height: "0.5 m",
    weight: "9.0 kg",
    category: "Tortuguita",
    description: "Cuando se siente en peligro, se esconde dentro de su caparazón y dispara agua."
  },
  {
    id: 25,
    name: "pikachu",
    types: ["electric"],
    front: "sprites/front/025.png",
    back:  "sprites/back/025.png",
    height: "0.4 m",
    weight: "6.0 kg",
    category: "Ratón",
    description: "Cuando varios se juntan, su electricidad puede causar fuertes tormentas."
  },
];

/* ============================================================
   A partir de aquí no necesitas tocar nada.
============================================================ */

const TYPES = [
  "normal","fire","water","electric","grass","ice","fighting","poison",
  "ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy"
];

const TYPE_COLORS = {
  normal:"#A8A77A", fire:"#EE8130", water:"#6390F0", electric:"#F7D02C",
  grass:"#7AC74C", ice:"#96D9D6", fighting:"#C22E28", poison:"#A33EA1",
  ground:"#E2BF65", flying:"#A98FF3", psychic:"#F95587", bug:"#A6B91A",
  rock:"#B6A136", ghost:"#735797", dragon:"#6F35FC", dark:"#705746",
  steel:"#B7B7CE", fairy:"#D685AD"
};

const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const search = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");

// Modal
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalId = document.getElementById("modalId");
const modalName = document.getElementById("modalName");
const modalTypes = document.getElementById("modalTypes");
const spriteFront = document.getElementById("spriteFront");
const spriteBack = document.getElementById("spriteBack");
const modalHeight = document.getElementById("modalHeight");
const modalWeight = document.getElementById("modalWeight");
const modalCategory = document.getElementById("modalCategory");
const modalDesc = document.getElementById("modalDesc");

// ---- Helpers ----
const pad = (n) => String(n).padStart(3, "0");

function typeBadge(type) {
  return `<span class="type t-${type}">${type}</span>`;
}

function cardGradient(types) {
  const c1 = TYPE_COLORS[types[0]] || "#4f8cff";
  const c2 = TYPE_COLORS[types[1]] || c1;
  return `linear-gradient(135deg, ${c1}55, ${c2}55)`;
}

// ---- Render ----
function render(list) {
  grid.innerHTML = "";
  if (list.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  for (const p of list) {
    const card = document.createElement("article");
    card.className = "card";
    card.style.setProperty("--card-gradient", cardGradient(p.types));
    card.innerHTML = `
      <div class="id">N.º ${pad(p.id)}</div>
      <img class="sprite" src="${p.front}" alt="${p.name}" loading="lazy"
           onerror="this.style.opacity=.3;this.alt='sprite no encontrado';" />
      <div class="name">${p.name}</div>
      <div class="types">${p.types.map(typeBadge).join("")}</div>
    `;
    card.addEventListener("click", () => openModal(p));
    grid.appendChild(card);
  }
}

// ---- Filtros ----
function applyFilters() {
  const q = search.value.trim().toLowerCase();
  const t = typeFilter.value;
  const filtered = pokemons.filter((p) => {
    const matchesQ = !q || p.name.includes(q) || String(p.id).includes(q) || pad(p.id).includes(q);
    const matchesT = !t || p.types.includes(t);
    return matchesQ && matchesT;
  }).sort((a, b) => a.id - b.id);
  render(filtered);
}

// ---- Modal ----
function openModal(p) {
  modalId.textContent = `N.º ${pad(p.id)}`;
  modalName.textContent = p.name;
  modalTypes.innerHTML = p.types.map(typeBadge).join("");
  spriteFront.src = p.front;
  spriteFront.alt = `${p.name} - frente`;
  spriteBack.src = p.back;
  spriteBack.alt = `${p.name} - espalda`;
  modalHeight.textContent = p.height || "—";
  modalWeight.textContent = p.weight || "—";
  modalCategory.textContent = p.category || "—";
  modalDesc.textContent = p.description || "";
  modal.classList.remove("hidden");
}

function hideModal() { modal.classList.add("hidden"); }

closeModal.addEventListener("click", hideModal);
modal.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideModal(); });

// ---- Init ----
function populateTypeFilter() {
  for (const t of TYPES) {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    typeFilter.appendChild(opt);
  }
}

search.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);

populateTypeFilter();
applyFilters();
