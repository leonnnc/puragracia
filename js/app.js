const CONFIG = {
  iglesiaWhatsApp: "573001112233",
  storageKey: "puraGracia.peticiones",
  orantesKey: "puraGracia.orantes",
};

const SEED = [
  { nombre: "María", texto: "Por la salud de mi mamá y paz en casa.", correo: "", telefono: "" },
  { nombre: "Andrés", texto: "Trabajo estable y sabiduría para decidir.", correo: "", telefono: "" },
  { nombre: "Lucía", texto: "Por mi hijo, que encuentre camino y consuelo.", correo: "", telefono: "" },
  { nombre: "Camilo", texto: "Gratitud. Oración por una familia en duelo.", correo: "", telefono: "" },
  { nombre: "Elena", texto: "Sanidad y fuerzas para este tratamiento.", correo: "", telefono: "" },
  { nombre: "Sofía", texto: "Protección en el viaje y unidad familiar.", correo: "", telefono: "" },
];

const REUNIONES = [
  {
    id: "r1",
    titulo: "Oración en el parque",
    fecha: "2026-09-06",
    hora: "7:00 p. m.",
    lugar: "Parque de los Novios",
    lat: 4.6686,
    lng: -74.064,
  },
  {
    id: "r2",
    titulo: "Noche de intercesión",
    fecha: "2026-09-13",
    hora: "6:30 p. m.",
    lugar: "Salón comunal La Soledad",
    lat: 4.647,
    lng: -74.072,
  },
  {
    id: "r3",
    titulo: "Mañana de alabanza",
    fecha: "2026-09-20",
    hora: "9:00 a. m.",
    lugar: "Plazoleta Lourdes",
    lat: 4.6548,
    lng: -74.0622,
  },
];

const FOTOS = [
  {
    src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80",
    alt: "Personas reunidas en círculo de oración",
    caption: "Círculo de oración · agosto 2026",
  },
  {
    src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=80",
    alt: "Encuentro comunitario al atardecer",
    caption: "Noche de gratitud · julio 2026",
  },
  {
    src: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80",
    alt: "Manos unidas en oración",
    caption: "Intercesión en el parque · junio 2026",
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80",
    alt: "Grupo compartiendo alrededor de una mesa",
    caption: "Café y oración · mayo 2026",
  },
];

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatFecha(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function loadPeticiones() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const seeded = SEED.map((item, i) => ({
    ...item,
    id: uid(),
    createdAt: new Date(Date.now() - i * 36e5).toISOString(),
  }));
  savePeticiones(seeded);
  return seeded;
}

function savePeticiones(list) {
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(list));
}

function digitsPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("57") && digits.length >= 12) return digits;
  if (digits.length === 10) return "57" + digits;
  return digits;
}

let peticiones = loadPeticiones();
let oranteActual = sessionStorage.getItem(CONFIG.orantesKey) || "";
let reflexionTarget = null;
let map;
let markers = {};

function renderPizarra() {
  const board = document.getElementById("pizarra");
  const ordered = [...peticiones].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  document.getElementById("total-notas").textContent = ordered.length;
  board.replaceChildren(
    ...ordered.map((p) => {
      const el = document.createElement("article");
      el.className = "nota";
      el.setAttribute("role", "listitem");
      const time = new Date(p.createdAt);
      el.innerHTML = `
        <h3>${escapeHtml(p.nombre)}</h3>
        <p>${escapeHtml(p.texto)}</p>
        <time datetime="${p.createdAt}">${time.toLocaleDateString("es-CO")}</time>
      `;
      return el;
    })
  );
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function peticionesDeHoy() {
  return peticiones.filter((p) => p.createdAt.slice(0, 10) === hoyISO());
}

function renderHoy() {
  const list = document.getElementById("lista-hoy");
  const today = peticionesDeHoy();
  const orantes = oranteActual ? 1 : 0;
  document.getElementById("orantes-activos").textContent = `${orantes} orando`;
  if (!oranteActual) {
    list.innerHTML = `<li class="peticion-hoy">Entra a la sala para ver las peticiones del día y responder.</li>`;
    return;
  }
  if (!today.length) {
    list.innerHTML = `<li class="peticion-hoy">Aún no hay peticiones nuevas hoy. Puedes orar también por las de la pizarra.</li>`;
    return;
  }
  list.replaceChildren(
    ...today.map((p) => {
      const li = document.createElement("li");
      li.className = "peticion-hoy";
      const phone = digitsPhone(p.telefono);
      const canWa = Boolean(phone);
      const canMail = Boolean(p.correo);
      li.innerHTML = `
        <strong>${escapeHtml(p.nombre)}</strong>
        <p>${escapeHtml(p.texto)}</p>
        <div class="actions"></div>
      `;
      const actions = li.querySelector(".actions");
      if (canWa) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-small btn-whatsapp";
        btn.textContent = "Reflexión por WhatsApp";
        btn.addEventListener("click", () => openReflexion(p, "whatsapp"));
        actions.appendChild(btn);
      }
      if (canMail) {
        const a = document.createElement("a");
        a.className = "btn btn-small btn-ghost";
        a.href = `mailto:${encodeURIComponent(p.correo)}?subject=${encodeURIComponent("Oramos por ti — Pura Gracia")}&body=${encodeURIComponent(`Hola ${p.nombre}, oramos por tu petición.`)}`;
        a.textContent = "Escribir al correo";
        actions.appendChild(a);
      }
      if (!canWa && !canMail) {
        const span = document.createElement("span");
        span.className = "muted";
        span.textContent = "Esta petición es anónima: ora en silencio.";
        actions.appendChild(span);
      }
      return li;
    })
  );
}

function openReflexion(peticion, canal) {
  reflexionTarget = { ...peticion, canal };
  const modal = document.getElementById("modal-reflexion");
  document.getElementById("modal-destino").textContent = `Para ${peticion.nombre}`;
  document.getElementById("texto-reflexion").value =
    `Hola ${peticion.nombre}, soy ${oranteActual} de Pura Gracia. Oramos por ti: "${peticion.texto}". Que la paz de Dios te cubra hoy.`;
  modal.hidden = false;
  document.getElementById("texto-reflexion").focus();
}

function closeModal() {
  document.getElementById("modal-reflexion").hidden = true;
  reflexionTarget = null;
}

function enviarReflexion() {
  if (!reflexionTarget) return;
  const texto = document.getElementById("texto-reflexion").value.trim();
  const phone = digitsPhone(reflexionTarget.telefono);
  if (!phone) return;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank", "noopener");
  closeModal();
}

function renderGaleria() {
  const galeria = document.getElementById("galeria");
  galeria.replaceChildren(
    ...FOTOS.map((f) => {
      const fig = document.createElement("figure");
      fig.className = "foto";
      fig.innerHTML = `<img src="${f.src}" alt="${escapeHtml(f.alt)}" loading="lazy" /><figcaption>${escapeHtml(f.caption)}</figcaption>`;
      return fig;
    })
  );
}

function initMapa() {
  map = L.map("mapa", { scrollWheelZoom: false }).setView([4.653, -74.066], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  const list = document.getElementById("lista-fechas");
  list.replaceChildren(
    ...REUNIONES.map((r, index) => {
      const marker = L.marker([r.lat, r.lng]).addTo(map);
      marker.bindPopup(`<strong>${r.titulo}</strong><br>${formatFecha(r.fecha)} · ${r.hora}<br>${r.lugar}`);
      markers[r.id] = marker;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "date-btn" + (index === 0 ? " active" : "");
      btn.innerHTML = `<strong>${r.titulo}</strong><br>${formatFecha(r.fecha)} · ${r.hora}<br>${r.lugar}`;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".date-btn").forEach((el) => el.classList.remove("active"));
        btn.classList.add("active");
        map.flyTo([r.lat, r.lng], 15);
        marker.openPopup();
      });
      return btn;
    })
  );
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("menu");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function initForms() {
  document.getElementById("form-peticion").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const nombre = String(data.get("nombre") || "").trim();
    const texto = String(data.get("texto") || "").trim();
    const correo = String(data.get("correo") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    if (!nombre || !texto) return;
    peticiones.unshift({
      id: uid(),
      nombre,
      texto,
      correo,
      telefono,
      createdAt: new Date().toISOString(),
    });
    savePeticiones(peticiones);
    e.target.reset();
    renderPizarra();
    renderHoy();
    document.getElementById("peticiones").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("form-sala").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = String(new FormData(e.target).get("orante") || "").trim();
    if (!nombre) return;
    oranteActual = nombre;
    sessionStorage.setItem(CONFIG.orantesKey, nombre);
    document.getElementById("sala-estado").textContent = `Estás orando como ${nombre}.`;
    renderHoy();
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      document.querySelector("#form-donar [name=monto]").value = chip.dataset.monto;
    });
  });

  document.getElementById("form-donar").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const monto = data.get("monto") || "una ofrenda";
    const mensaje = String(data.get("mensaje") || "").trim();
    const text = `Hola, quiero donar a Pura Gracia. Monto: ${monto} COP. ${mensaje}`.trim();
    window.open(`https://wa.me/${CONFIG.iglesiaWhatsApp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  document.querySelector(".modal-close").addEventListener("click", closeModal);
  document.getElementById("enviar-reflexion").addEventListener("click", enviarReflexion);
  document.getElementById("modal-reflexion").addEventListener("click", (e) => {
    if (e.target.id === "modal-reflexion") closeModal();
  });
}

function initGalleryNav() {
  const galeria = document.getElementById("galeria");
  document.querySelector(".gallery-nav.prev").addEventListener("click", () => {
    galeria.scrollBy({ left: -280, behavior: "smooth" });
  });
  document.querySelector(".gallery-nav.next").addEventListener("click", () => {
    galeria.scrollBy({ left: 280, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initForms();
  renderPizarra();
  renderHoy();
  renderGaleria();
  initGalleryNav();
  initMapa();
  if (oranteActual) {
    document.querySelector("#form-sala [name=orante]").value = oranteActual;
    document.getElementById("sala-estado").textContent = `Estás orando como ${oranteActual}.`;
  }
});
