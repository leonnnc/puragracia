/**
 * Pura Gracia - Lógica del Sitio Web Público con Red de Oración Mundial en 2 Pantallas / Modal Fullscreen
 */

const FOTOS = [
  {
    src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=900&q=80",
    alt: "Personas reunidas en círculo de oración",
    caption: "Círculo de oración comunitaria",
  },
  {
    src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=900&q=80",
    alt: "Encuentro comunitario al atardecer",
    caption: "Noche de gratitud y alabanza",
  },
  {
    src: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80",
    alt: "Manos unidas en oración",
    caption: "Intercesión en el parque",
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80",
    alt: "Grupo compartiendo alrededor de una mesa",
    caption: "Café, palabra y comunión",
  },
];

// Coordenadas mundiales aproximadas de ciudades principales
const CITY_COORDS = {
  "lima": { lat: -12.0464, lng: -77.0428, country: "PE", flag: "🇵🇪" },
  "arequipa": { lat: -16.4090, lng: -71.5375, country: "PE", flag: "🇵🇪" },
  "trujillo": { lat: -8.1116, lng: -79.0287, country: "PE", flag: "🇵🇪" },
  "cusco": { lat: -13.5319, lng: -71.9675, country: "PE", flag: "🇵🇪" },
  "bogotá": { lat: 4.7110, lng: -74.0721, country: "CO", flag: "🇨🇴" },
  "bogota": { lat: 4.7110, lng: -74.0721, country: "CO", flag: "🇨🇴" },
  "medellín": { lat: 6.2442, lng: -75.5812, country: "CO", flag: "🇨🇴" },
  "medellin": { lat: 6.2442, lng: -75.5812, country: "CO", flag: "🇨🇴" },
  "cali": { lat: 3.4516, lng: -76.5320, country: "CO", flag: "🇨🇴" },
  "barranquilla": { lat: 10.9685, lng: -74.7813, country: "CO", flag: "🇨🇴" },
  "ciudad de méxico": { lat: 19.4326, lng: -99.1332, country: "MX", flag: "🇲🇽" },
  "cdmx": { lat: 19.4326, lng: -99.1332, country: "MX", flag: "🇲🇽" },
  "mexico": { lat: 19.4326, lng: -99.1332, country: "MX", flag: "🇲🇽" },
  "guadalajara": { lat: 20.6597, lng: -103.3496, country: "MX", flag: "🇲🇽" },
  "monterrey": { lat: 25.6866, lng: -100.3161, country: "MX", flag: "🇲🇽" },
  "buenos aires": { lat: -34.6037, lng: -58.3816, country: "AR", flag: "🇦🇷" },
  "córdoba": { lat: -31.4201, lng: -64.1888, country: "AR", flag: "🇦🇷" },
  "cordoba": { lat: -31.4201, lng: -64.1888, country: "AR", flag: "🇦🇷" },
  "rosario": { lat: -32.9468, lng: -60.6393, country: "AR", flag: "🇦🇷" },
  "miami": { lat: 25.7617, lng: -80.1918, country: "US", flag: "🇺🇸" },
  "orlando": { lat: 28.5383, lng: -81.3792, country: "US", flag: "🇺🇸" },
  "houston": { lat: 29.7604, lng: -95.3698, country: "US", flag: "🇺🇸" },
  "madrid": { lat: 40.4168, lng: -3.7038, country: "ES", flag: "🇪🇸" },
  "barcelona": { lat: 41.3879, lng: 2.1699, country: "ES", flag: "🇪🇸" },
  "santiago": { lat: -33.4489, lng: -70.6693, country: "CL", flag: "🇨🇱" },
  "quito": { lat: -0.1807, lng: -78.4678, country: "EC", flag: "🇪🇨" }
};

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatFecha(iso) {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  } catch (e) {
    return iso;
  }
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function digitsPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("51") && digits.length >= 11) return digits;
  if (digits.startsWith("57") && digits.length >= 12) return digits;
  if (digits.startsWith("52") && digits.length >= 12) return digits;
  if (digits.startsWith("54") && digits.length >= 12) return digits;
  return digits;
}

// Variables de estado
let activeFilterCategory = "ALL";
let oranteActual = sessionStorage.getItem("puraGracia.orantes") || "";
let reflexionTarget = null;
let mapMeetings = null;
let mapMeetingsMarkers = [];
let mapWorldFullscreen = null;
let worldPrayerMarkers = {};

// Cache de datos en tiempo real (Firebase) o local
let _peticionesCache = null;
let _orantesCache = null;

/** Obtiene peticiones garantizando que siempre haya datos en demo o en la nube */
function getPeticionesData() {
  if (_peticionesCache && Array.isArray(_peticionesCache) && _peticionesCache.length > 0) {
    return _peticionesCache;
  }
  return PGStorage.getPeticiones();
}

/** Obtiene orantes garantizando que siempre haya puntos en el mapa mundial */
function getOrantesData() {
  if (_orantesCache && Array.isArray(_orantesCache) && _orantesCache.length > 0) {
    return _orantesCache;
  }
  return PGStorage.getOrantesMundiales();
}

/** Renderiza el panel de intercesores conectados visible en la sección principal de oración */
function renderConnectedPanel() {
  const grid = document.getElementById("connected-grid");
  const countEl = document.getElementById("connected-count");
  if (!grid) return;

  const orantes = getOrantesData();
  if (countEl) countEl.textContent = orantes.length;

  grid.innerHTML = orantes.map((o, i) => `
    <div class="connected-card" style="animation-delay:${i * 0.05}s;">
      <div class="connected-card-flag">${o.flag || "🙏"}</div>
      <div class="connected-card-info">
        <div class="connected-card-name">🙏 ${escapeHtml(o.nombre)}</div>
        <div class="connected-card-location">${escapeHtml(o.ciudad)}, ${escapeHtml(o.pais)}</div>
        <div class="connected-card-motivo">"${escapeHtml(o.motivo || 'En oración')}"</div>
        <div class="connected-card-time">⏱ ${escapeHtml(o.time || 'Conectado en vivo')}</div>
      </div>
    </div>
  `).join("");
}

function updateAllCounters() {
  const orantes = getOrantesData();
  const peticiones = getPeticionesData();

  const countEl = document.getElementById("orantes-activos-count");
  if (countEl) countEl.textContent = orantes.length;

  const mfCount = document.getElementById("mf-live-count");
  if (mfCount) mfCount.textContent = orantes.length;

  const totalNotas = document.getElementById("total-notas");
  if (totalNotas) totalNotas.textContent = peticiones.length;

  // Actualizar panel de conectados visible en la sección principal
  renderConnectedPanel();
}

// ========================================================
// 1. DETECCIÓN AUTOMÁTICA DE PAÍS
// ========================================================
function autoDetectCountry() {
  const savedCountry = PGStorage.getActiveCountryCode();
  if (savedCountry) {
    applyDetectedCountry(savedCountry);
    return;
  }

  let detected = "PE"; // Por defecto Perú

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Lima")) {
      detected = "PE";
    } else if (tz.includes("Bogota")) {
      detected = "CO";
    } else if (tz.includes("Mexico") || tz.includes("Monterrey") || tz.includes("Cancun") || tz.includes("Tijuana") || tz.includes("Chihuahua") || tz.includes("Hermosillo")) {
      detected = "MX";
    } else if (tz.includes("Argentina") || tz.includes("Buenos_Aires") || tz.includes("Cordoba")) {
      detected = "AR";
    } else if (tz.includes("New_York") || tz.includes("Chicago") || tz.includes("Los_Angeles") || tz.includes("Denver") || tz.includes("Phoenix") || tz.includes("Miami")) {
      detected = "US";
    } else {
      const lang = (navigator.language || navigator.userLanguage || "").toUpperCase();
      if (lang.includes("PE")) detected = "PE";
      else if (lang.includes("CO")) detected = "CO";
      else if (lang.includes("MX")) detected = "MX";
      else if (lang.includes("AR")) detected = "AR";
    }
  } catch (e) {}

  applyDetectedCountry(detected);

  // Verificación rápida en segundo plano por IP
  fetch("https://api.country.is/")
    .then(res => res.json())
    .then(data => {
      if (data && data.country) {
        const cCode = data.country.toUpperCase();
        if (["PE", "CO", "MX", "AR", "US"].includes(cCode)) {
          applyDetectedCountry(cCode);
        }
      }
    })
    .catch(() => {});
}

function applyDetectedCountry(code) {
  PGStorage.setActiveCountryCode(code);

  const c = PGStorage.getActiveCountry();
  const inputCountry = document.getElementById("input-orante-country");
  const inputCity = document.getElementById("input-orante-city");
  if (inputCountry && !inputCountry.value) inputCountry.value = c.name;
  if (inputCity && !inputCity.value && c.cities && c.cities.length) inputCity.value = c.cities[0];

  updateMeetingsAndMap();
  updateDonationsUI();
}

// ========================================================
// 2. MODAL FULLSCREEN - PLANO COMPLETO DE LA TIERRA
// ========================================================
function openWorldPrayerFullscreen(currentOrante = null) {
  const modal = document.getElementById("modal-mapa-mundial");
  if (!modal) return;

  modal.hidden = false;
  document.body.style.overflow = "hidden"; // Evitar scroll de fondo

  updateAllCounters();

  if (currentOrante) {
    document.getElementById("mf-user-name").textContent = `🙏 ${currentOrante.nombre}`;
    document.getElementById("mf-user-location").textContent = `Conectado desde ${currentOrante.ciudad}, ${currentOrante.pais}`;
  } else if (oranteActual) {
    document.getElementById("mf-user-name").textContent = `🙏 ${oranteActual}`;
  }

  // Inicializar o redimensionar mapa Leaflet
  setTimeout(() => {
    if (typeof L === "undefined") return;

    if (!mapWorldFullscreen) {
      mapWorldFullscreen = L.map("mapa-mundial-fullscreen", {
        scrollWheelZoom: true,
        minZoom: 2,
        maxZoom: 12,
        worldCopyJump: true
      }).setView([20, 0], 2);

      // Tiles limpios de OpenStreetMap sin marcas de agua
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(mapWorldFullscreen);
    }

    mapWorldFullscreen.invalidateSize();
    renderFullscreenOrantesMarkers();
    renderFullscreenLiveStream();

    // Si viene de registrarse, volar a su ubicación
    if (currentOrante && currentOrante.lat && currentOrante.lng) {
      mapWorldFullscreen.flyTo([currentOrante.lat, currentOrante.lng], 5, { duration: 1.5 });
      setTimeout(() => {
        if (worldPrayerMarkers[currentOrante.id]) {
          worldPrayerMarkers[currentOrante.id].openPopup();
        }
      }, 1600);
    } else {
      mapWorldFullscreen.setView([20, 0], 2);
    }
  }, 100);

  // Segundo pase para asegurar renderizado en todas las pantallas
  setTimeout(() => {
    if (mapWorldFullscreen) {
      mapWorldFullscreen.invalidateSize();
    }
  }, 400);
}

function closeWorldPrayerFullscreen() {
  const modal = document.getElementById("modal-mapa-mundial");
  if (modal) modal.hidden = true;
  document.body.style.overflow = "";
}

function renderFullscreenOrantesMarkers() {
  if (!mapWorldFullscreen) return;

  // Limpiar marcadores
  Object.values(worldPrayerMarkers).forEach(m => m.remove());
  worldPrayerMarkers = {};

  const orantes = getOrantesData();
  updateAllCounters();

  orantes.forEach((o) => {
    if (!o.lat || !o.lng) return;

    // Marcador pulsante en el plano de la tierra
    const pulseIcon = L.divIcon({
      className: "pulse-prayer-marker",
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -22],
      html: `
        <div class="pulse-glow"></div>
        <div class="pulse-pin">${o.flag || "🙏"}</div>
      `
    });

    const marker = L.marker([o.lat, o.lng], { icon: pulseIcon }).addTo(mapWorldFullscreen);
    
    marker.bindPopup(`
      <div style="font-family: Outfit, sans-serif; min-width: 220px; padding: 4px;">
        <strong style="font-size: 1.15rem; display:block; color:#1c2422; margin-bottom: 2px;">
          🙏 ${escapeHtml(o.nombre)}
        </strong>
        <div style="color:#2f6f62; font-weight:700; font-size:0.9rem; margin-bottom: 6px;">
          ${o.flag || "📍"} ${escapeHtml(o.ciudad)}, ${escapeHtml(o.pais)}
        </div>
        <div style="font-size: 0.88rem; background:#fffaf0; padding: 8px 10px; border-radius: 8px; border:1px solid #e2d8c3; margin-bottom: 8px;">
          <strong style="display:block; color:#7b1f18; font-size:0.75rem; text-transform:uppercase; margin-bottom:3px;">Solicitud de Oración:</strong>
          "${escapeHtml(o.motivo || 'Orando por salud, paz y bendición')}"
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size: 0.75rem; color:#718096;">
          <span>Conectado ${escapeHtml(o.time || 'en vivo')}</span>
          <button type="button" style="background:#10b981; color:#fff; border:0; border-radius:4px; padding:3px 8px; font-weight:700; cursor:pointer;" onclick="alert('✨ ¡Te has unido en oración por ${escapeHtml(o.nombre)}!');">🙏 Orar</button>
        </div>
      </div>
    `);

    worldPrayerMarkers[o.id] = marker;
  });
}

function renderFullscreenLiveStream() {
  const streamContainer = document.getElementById("lista-orantes-stream");
  if (!streamContainer) return;

  const orantes = getOrantesData();
  streamContainer.innerHTML = orantes.map(o => `
    <div class="stream-orante-card" data-id="${o.id}">
      <strong>${o.flag || "📍"} ${escapeHtml(o.nombre)}</strong>
      <span style="color:#34d399; font-weight:600;">(${escapeHtml(o.ciudad)})</span>
      <span class="motivo-preview">· "${escapeHtml(o.motivo || 'En oración')}"</span>
    </div>
  `).join("");

  streamContainer.querySelectorAll(".stream-orante-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const orante = orantes.find(o => o.id === id);
      if (orante && mapWorldFullscreen) {
        mapWorldFullscreen.flyTo([orante.lat, orante.lng], 6, { duration: 1.2 });
        if (worldPrayerMarkers[id]) {
          setTimeout(() => { worldPrayerMarkers[id].openPopup(); }, 1300);
        }
      }
    });
  });
}


// RENDERIZADO DE LA PIZARRA DE NOTAS

function renderPizarra() {
  const board = document.getElementById("pizarra");
  const peticiones = getPeticionesData();
  
  let filtered = [...peticiones].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (activeFilterCategory !== "ALL") {
    filtered = filtered.filter(p => (p.category || "Salud") === activeFilterCategory);
  }

  document.getElementById("total-notas").textContent = peticiones.length;

  if (!filtered.length) {
    board.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #c5d6cf;">No hay notas en esta categoría todavía. ¡Sé el primero en dejar una!</div>`;
    return;
  }

  board.replaceChildren(
    ...filtered.map((p) => {
      const el = document.createElement("article");
      el.className = "nota";
      el.setAttribute("role", "listitem");
      const time = new Date(p.createdAt || Date.now());
      const flag = p.country === "PE" ? "🇵🇪" : p.country === "MX" ? "🇲🇽" : p.country === "AR" ? "🇦🇷" : p.country === "US" ? "🌎" : "🇨🇴";
      
      el.innerHTML = `
        <div class="nota-badge">${flag} ${escapeHtml(p.category || "General")}</div>
        <h3>${escapeHtml(p.nombre)}</h3>
        <p>${escapeHtml(p.texto)}</p>
        <div class="nota-footer">
          <time datetime="${p.createdAt}">${time.toLocaleDateString("es-CO")}</time>
          <button type="button" class="btn-pray-join" data-id="${p.id}" title="Unirme a orar por esta petición">
            <span>🙏</span> <span class="pray-count">${p.praysCount || 0}</span>
          </button>
        </div>
      `;

      const prayBtn = el.querySelector(".btn-pray-join");
      prayBtn.addEventListener("click", async () => {
        const newCount = await PGFirebase.incrementPrayCount(p.id);
        const countSpan = prayBtn.querySelector(".pray-count");
        if (countSpan && newCount) countSpan.textContent = newCount;
        prayBtn.style.transform = "scale(1.2)";
        setTimeout(() => { prayBtn.style.transform = "scale(1)"; }, 200);
      });

      return el;
    })
  );
}

// PETICIONES DE HOY
function peticionesDeHoy() {
  const peticiones = getPeticionesData();
  return peticiones.filter((p) => (p.createdAt || "").slice(0, 10) === hoyISO());
}

function renderHoy() {
  const list = document.getElementById("lista-hoy");
  const today = peticionesDeHoy();
  
  if (!today.length) {
    list.innerHTML = `<li class="peticion-hoy">Aún no hay peticiones nuevas hoy. Puedes unirte en oración por las notas de la pizarra comunitaria.</li>`;
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
        <div style="display: flex; justify-content: space-between;">
          <strong>${escapeHtml(p.nombre)}</strong>
          <span style="font-size: 0.8rem; color: #5b6b66;">${escapeHtml(p.category || "General")}</span>
        </div>
        <p>${escapeHtml(p.texto)}</p>
        <div class="actions"></div>
      `;
      const actions = li.querySelector(".actions");
      if (canWa) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-small btn-whatsapp";
        btn.textContent = "Enviar reflexión por WhatsApp";
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
        span.textContent = "Petición anónima: ora en silencio.";
        actions.appendChild(span);
      }
      return li;
    })
  );
}

// MODAL DE REFLEXIÓN
function openReflexion(peticion, canal) {
  reflexionTarget = { ...peticion, canal };
  const modal = document.getElementById("modal-reflexion");
  document.getElementById("modal-destino").textContent = `Para ${peticion.nombre} (${peticion.telefono})`;
  document.getElementById("texto-reflexion").value =
    `Hola ${peticion.nombre}, soy ${oranteActual || "un intercesor"} de la comunidad Pura Gracia. Oramos por tu petición: "${peticion.texto}". Que la paz y la gracia de Dios te acompañen hoy.`;
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

// GALERÍA
function renderGaleria() {
  const galeria = document.getElementById("galeria");
  if (!galeria) return;
  galeria.replaceChildren(
    ...FOTOS.map((f) => {
      const fig = document.createElement("figure");
      fig.className = "foto";
      fig.innerHTML = `<img src="${f.src}" alt="${escapeHtml(f.alt)}" loading="lazy" /><figcaption>${escapeHtml(f.caption)}</figcaption>`;
      return fig;
    })
  );
}

// NAVEGACIÓN DE GALERÍA (flechas prev/next)
function initGalleryNav() {
  const galeria = document.getElementById("galeria");
  const prevBtn = document.querySelector(".gallery-nav.prev");
  const nextBtn = document.querySelector(".gallery-nav.next");
  if (!galeria || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function goTo(index) {
    const fotos = galeria.querySelectorAll(".foto");
    if (!fotos.length) return;
    currentIndex = ((index % fotos.length) + fotos.length) % fotos.length;
    galeria.scrollTo({ left: fotos[currentIndex].offsetLeft, behavior: "smooth" });
  }

  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  // Auto-avance cada 5 segundos
  setInterval(() => goTo(currentIndex + 1), 5000);
}


// MAPA DE REUNIONES LOCALES
function updateMeetingsAndMap() {
  const country = PGStorage.getActiveCountry();
  const reuniones = country.reuniones || [];

  document.getElementById("reuniones-title").textContent = `Reuniones de oración · ${country.name}`;
  document.getElementById("hero-country-badge").textContent = `Comunidad de oración · ${country.name}`;

  const list = document.getElementById("lista-fechas");
  if (!reuniones.length) {
    list.innerHTML = `<p class="muted">Pronto anunciaremos nuevas fechas y sedes para ${country.name}.</p>`;
  } else {
    list.replaceChildren(
      ...reuniones.map((r, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "date-btn" + (index === 0 ? " active" : "");
        btn.innerHTML = `<strong>${escapeHtml(r.titulo)}</strong><br><span style="font-size:0.85rem; color:var(--teal); font-weight:600;">${escapeHtml(r.city)}</span> · ${formatFecha(r.fecha)}<br><small style="color:var(--muted);">${escapeHtml(r.lugar)}</small>`;
        
        btn.addEventListener("click", () => {
          document.querySelectorAll(".date-btn").forEach((el) => el.classList.remove("active"));
          btn.classList.add("active");
          if (mapMeetings && r.lat && r.lng) {
            mapMeetings.flyTo([r.lat, r.lng], 15);
            if (mapMeetingsMarkers[index]) mapMeetingsMarkers[index].openPopup();
          }
        });
        return btn;
      })
    );
  }

  // Actualizar mapa Leaflet de reuniones
  if (typeof L !== "undefined") {
    if (!mapMeetings) {
      mapMeetings = L.map("mapa", { scrollWheelZoom: false }).setView([-12.0464, -77.0428], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapMeetings);
    }

    mapMeetingsMarkers.forEach(m => m.remove());
    mapMeetingsMarkers = [];

    if (reuniones.length > 0) {
      reuniones.forEach((r) => {
        if (r.lat && r.lng) {
          const marker = L.marker([r.lat, r.lng]).addTo(mapMeetings);
          marker.bindPopup(`<strong>${escapeHtml(r.titulo)}</strong><br>${escapeHtml(r.city)}<br>${formatFecha(r.fecha)} · ${escapeHtml(r.hora)}<br>${escapeHtml(r.lugar)}`);
          mapMeetingsMarkers.push(marker);
        }
      });

      const first = reuniones[0];
      if (first && first.lat && first.lng) {
        mapMeetings.setView([first.lat, first.lng], 13);
      }
    }
  }
}

// SECCIÓN DE DONACIONES DINÁMICAS
function updateDonationsUI() {
  const country = PGStorage.getActiveCountry();
  const symbol = country.currencySymbol || "$";
  const currency = country.currency || "COP";
  const amounts = country.defaultAmounts || [20, 50, 100];

  document.getElementById("donate-amount-label").textContent = `Otro monto (${currency} ${symbol})`;

  const donateSelect = document.getElementById("donate-country-select");
  if (donateSelect) donateSelect.value = country.code;

  const chipsContainer = document.getElementById("donate-chips-container");
  chipsContainer.replaceChildren(
    ...amounts.map((monto) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.dataset.monto = monto;
      btn.textContent = `${symbol} ${Number(monto).toLocaleString("es-CO")}`;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("donate-custom-amount").value = monto;
      });
      return btn;
    })
  );

  const methods = country.paymentMethods || [];
  const tabsContainer = document.getElementById("pm-tabs-container");
  const contentBox = document.getElementById("pm-content-box");

  if (!methods.length) {
    tabsContainer.innerHTML = "";
    contentBox.innerHTML = "<p class='muted'>Contáctanos por WhatsApp para coordinar tu ofrenda.</p>";
    return;
  }

  tabsContainer.replaceChildren(
    ...methods.map((m, idx) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "pm-tab" + (idx === 0 ? " active" : "");
      tab.innerHTML = `${m.icon || "💳"} ${escapeHtml(m.name)}`;
      tab.addEventListener("click", () => {
        document.querySelectorAll(".pm-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderPaymentMethodContent(m);
      });
      return tab;
    })
  );

  renderPaymentMethodContent(methods[0]);
}

function renderPaymentMethodContent(method) {
  const contentBox = document.getElementById("pm-content-box");
  if (!method) return;

  contentBox.innerHTML = `
    <strong>${method.icon || "💳"} ${escapeHtml(method.name)}</strong>
    <p style="margin: 0.2rem 0; font-size: 0.9rem;">${escapeHtml(method.instructions || "")}</p>
    <div class="pm-account-row">
      <code>${escapeHtml(method.account)}</code>
      <button type="button" class="btn-copy" id="btn-copy-acc">Copiar</button>
    </div>
    <div style="font-size: 0.85rem; color: #4d5b56;">Titular: <strong>${escapeHtml(method.holder || "Pura Gracia")}</strong></div>
  `;

  document.getElementById("btn-copy-acc").addEventListener("click", (e) => {
    navigator.clipboard.writeText(method.account).then(() => {
      e.target.textContent = "¡Copiado!";
      setTimeout(() => { e.target.textContent = "Copiar"; }, 2000);
    });
  });
}

// INICIALIZACIÓN DE FORMULARIOS Y EVENTOS
function initForms() {
  // Petición Submit
  document.getElementById("form-peticion").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const nombre = String(data.get("nombre") || "").trim();
    const category = String(data.get("category") || "Salud");
    const texto = String(data.get("texto") || "").trim();
    const correo = String(data.get("correo") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    const activeCountry = PGStorage.getActiveCountryCode();

    if (!nombre || !texto) return;

    const nuevaPeticion = {
      id: uid(),
      country: activeCountry,
      category, nombre, texto, correo, telefono,
      praysCount: 1,
      createdAt: new Date().toISOString(),
    };

    // Guardar en Firebase (si está activo) o localStorage
    await PGFirebase.addPeticion(nuevaPeticion);

    e.target.reset();

    // Si no hay Firebase activo, refrescar manualmente desde localStorage
    if (!PGFirebase.initialized) {
      renderPizarra();
      renderHoy();
    }
    // Si hay Firebase, la suscripción actualizará automáticamente

    document.getElementById("peticiones").scrollIntoView({ behavior: "smooth" });
  });

  // Selector rápido de categoría en la columna izquierda
  document.querySelectorAll(".qcp-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".qcp-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.dataset.cat;
      const select = document.querySelector('select[name="category"]');
      if (select) {
        select.value = cat;
        select.dispatchEvent(new Event("change"));
      }
      const textarea = document.querySelector('textarea[name="texto"]');
      if (textarea) {
        textarea.focus();
      }
    });
  });

  // Filtros de categoría en la pizarra
  document.querySelectorAll(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      activeFilterCategory = btn.dataset.cat;
      renderPizarra();
    });
  });

  // Entrada a la Red y Plano Mundial de Oración (PANTALLA 1 -> PANTALLA 2 FULLSCREEN)
  document.getElementById("form-sala").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const nombre = String(data.get("orante") || "").trim();
    const ciudad = String(data.get("ciudad") || "Lima").trim();
    const pais = String(data.get("pais") || "Perú").trim();
    const motivo = String(data.get("motivo") || "Orando por paz y salud").trim();

    if (!nombre || !motivo) return;

    oranteActual = nombre;
    sessionStorage.setItem("puraGracia.orantes", nombre);

    // Buscar coordenadas o usar coordenadas por defecto de la ciudad
    const normalizedCity = ciudad.toLowerCase();
    const foundCoords = CITY_COORDS[normalizedCity] || { lat: -12.0464, lng: -77.0428, country: "PE", flag: "🇵🇪" };

    const nuevoOrante = {
      id: "o_" + Date.now(),
      nombre, ciudad, pais, motivo,
      flag: foundCoords.flag || "📍",
      lat: foundCoords.lat + (Math.random() * 0.08 - 0.04),
      lng: foundCoords.lng + (Math.random() * 0.08 - 0.04),
      time: "Ahora mismo"
    };

    // Guardar en Firebase (si está activo) o localStorage
    PGFirebase.addOrante(nuevoOrante);

    // ABRIR PANTALLA 2 (MODAL FULLSCREEN DEL PLANO DE LA TIERRA)
    openWorldPrayerFullscreen(nuevoOrante);
  });

  // Botón para salir del plano mundial fullscreen
  const btnCerrarMapa = document.getElementById("btn-cerrar-mapa-mundial");
  if (btnCerrarMapa) {
    btnCerrarMapa.addEventListener("click", closeWorldPrayerFullscreen);
  }

  // Sincronizar input libre de monto para deseleccionar chips
  const customAmountInput = document.getElementById("donate-custom-amount");
  customAmountInput.addEventListener("input", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  });

  // Envío de donación por WhatsApp
  document.getElementById("form-donar").addEventListener("submit", (e) => {
    e.preventDefault();
    const country = PGStorage.getActiveCountry();
    const data = new FormData(e.target);
    const monto = data.get("monto") || "una ofrenda";
    const mensaje = String(data.get("mensaje") || "").trim();
    const symbol = country.currencySymbol || "$";
    const currency = country.currency || "COP";
    const text = `Hola, quiero enviar una ofrenda a Pura Gracia (${country.name}). Monto: ${symbol} ${monto} ${currency}. ${mensaje ? `Mensaje: "${mensaje}"` : ""}`.trim();
    
    window.open(`https://wa.me/${country.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  // Selector de País en Donaciones
  const donateSelect = document.getElementById("donate-country-select");
  if (donateSelect) {
    donateSelect.addEventListener("change", (e) => {
      applyDetectedCountry(e.target.value);
    });
  }

  // Modales
  document.querySelector(".modal-close").addEventListener("click", closeModal);
  document.getElementById("enviar-reflexion").addEventListener("click", enviarReflexion);
  document.getElementById("modal-reflexion").addEventListener("click", (e) => {
    if (e.target.id === "modal-reflexion") closeModal();
  });
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

// ============================================================================
// 3. MOTOR DE PODIO DE VOZ EN VIVO, MICRÓFONO Y COLA DE 5 MINUTOS POR PONENTE
// ============================================================================

const SPEAKER_DURATION_SECONDS = 300; // 5 minutos exactos por ponente (300 seg)

let liveSpeakerState = {
  activeSpeaker: {
    id: "spk_1",
    nombre: "Pastor David",
    ciudad: "Bogotá",
    pais: "Colombia",
    flag: "🇨🇴",
    motivo: "Por avivamiento espiritual, fortaleza en la juventud y restauración de familias",
    lat: 4.7110,
    lng: -74.0721
  },
  queue: [
    { id: "q1", nombre: "María Isabel", ciudad: "Medellín", pais: "Colombia", flag: "🇨🇴", motivo: "Por provisión en los emprendimientos y salud para mi madre", lat: 6.2442, lng: -75.5812 },
    { id: "q2", nombre: "Carlos Mendoza", ciudad: "Arequipa", pais: "Perú", flag: "🇵🇪", motivo: "Por restauración en los matrimonios de mi congregación", lat: -16.4090, lng: -71.5375 },
    { id: "q3", nombre: "Fernanda R.", ciudad: "Ciudad de México", pais: "México", flag: "🇲🇽", motivo: "Pidiendo protección divina y paz en las familias", lat: 19.4326, lng: -99.1332 }
  ],
  timeRemaining: 275, // Segundos restantes del ponente actual
  timerInterval: null,
  isListening: false,
  isTransmitting: false,
  audioContext: null,
  analyser: null,
  mediaStream: null
};

function formatTimerSeconds(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function initLiveVoicePodio() {
  const btnPedirMic = document.getElementById("btn-pedir-mic");
  const btnToggleAudio = document.getElementById("btn-toggle-audio");
  const btnVerCola = document.getElementById("btn-ver-cola");
  const queueDropdown = document.getElementById("lvp-queue-dropdown");

  if (!btnPedirMic) return;

  // Botón: Pedir Micrófono / Transmitir / Cancelar fila
  btnPedirMic.addEventListener("click", handleMicButtonClick);

  // Botón: Escuchar audio
  btnToggleAudio.addEventListener("click", handleToggleAudio);

  // Botón: Ver / Ocultar Fila de Espera
  btnVerCola.addEventListener("click", () => {
    queueDropdown.hidden = !queueDropdown.hidden;
  });

  renderSpeakerPodioUI();
  startSpeakerTimer();
}

function startSpeakerTimer() {
  if (liveSpeakerState.timerInterval) clearInterval(liveSpeakerState.timerInterval);

  liveSpeakerState.timerInterval = setInterval(() => {
    if (liveSpeakerState.timeRemaining > 0) {
      liveSpeakerState.timeRemaining--;
      updateSpeakerTimerUI();
    } else {
      // Tiempo agotado (5 minutos): Pasar automáticamente al siguiente ponente
      nextSpeakerInQueue();
    }
  }, 1000);
}

function updateSpeakerTimerUI() {
  const timerDisplay = document.getElementById("lvp-timer-display");
  const progressFill = document.getElementById("lvp-progress-fill");

  if (timerDisplay) {
    timerDisplay.textContent = formatTimerSeconds(liveSpeakerState.timeRemaining);
  }

  if (progressFill) {
    const percentage = (liveSpeakerState.timeRemaining / SPEAKER_DURATION_SECONDS) * 100;
    progressFill.style.width = `${Math.max(0, percentage)}%`;

    // Cambiar color si queda menos de 1 minuto
    if (liveSpeakerState.timeRemaining <= 60) {
      progressFill.style.background = "#ef4444";
    } else {
      progressFill.style.background = "linear-gradient(90deg, #10b981, var(--yellow), #ef4444)";
    }
  }
}

function nextSpeakerInQueue() {
  // Si el orador saliente era el usuario actual, detener su micrófono
  if (liveSpeakerState.isTransmitting) {
    stopUserMicrophone();
  }

  if (liveSpeakerState.queue.length > 0) {
    // Tomar el siguiente en la fila
    const nextSpeaker = liveSpeakerState.queue.shift();
    liveSpeakerState.activeSpeaker = nextSpeaker;
    liveSpeakerState.timeRemaining = SPEAKER_DURATION_SECONDS; // Reiniciar 5 minutos exactos

    // Si el siguiente ponente es el usuario actual, activar su micrófono
    if (oranteActual && nextSpeaker.nombre.toLowerCase() === oranteActual.toLowerCase()) {
      startUserMicrophone();
    }

    // Volar el mapa hacia el nuevo ponente en vivo
    if (mapWorldFullscreen && nextSpeaker.lat && nextSpeaker.lng) {
      mapWorldFullscreen.flyTo([nextSpeaker.lat, nextSpeaker.lng], 5, { duration: 1.5 });
      if (worldPrayerMarkers[nextSpeaker.id]) {
        setTimeout(() => { worldPrayerMarkers[nextSpeaker.id].openPopup(); }, 1600);
      }
    }
  } else {
    // Si no hay nadie en fila, reiniciar timer de 5 min con el ponente actual
    liveSpeakerState.timeRemaining = SPEAKER_DURATION_SECONDS;
  }

  renderSpeakerPodioUI();
}

function renderSpeakerPodioUI() {
  const current = liveSpeakerState.activeSpeaker;
  if (!current) return;

  // Actualizar datos del ponente activo
  const nameEl = document.getElementById("lvp-speaker-name");
  const locEl = document.getElementById("lvp-speaker-loc");
  const motivoEl = document.getElementById("lvp-speaker-motivo");
  const flagEl = document.getElementById("lvp-speaker-flag");
  const countEl = document.getElementById("lvp-queue-count");
  const btnMic = document.getElementById("btn-pedir-mic");

  if (nameEl) nameEl.textContent = current.nombre;
  if (locEl) locEl.textContent = `${current.ciudad}, ${current.pais}`;
  if (motivoEl) motivoEl.textContent = `"${current.motivo || 'Orando en unidad por las naciones'}"`;
  if (flagEl) flagEl.textContent = current.flag || "📍";
  if (countEl) countEl.textContent = liveSpeakerState.queue.length;

  // Estado del botón de micrófono según el usuario actual
  if (btnMic) {
    const isMeSpeaking = Boolean(oranteActual && current.nombre.toLowerCase() === oranteActual.toLowerCase());
    const myQueueIndex = liveSpeakerState.queue.findIndex(q => oranteActual && q.nombre.toLowerCase() === oranteActual.toLowerCase());

    if (isMeSpeaking) {
      btnMic.className = "btn-lvp btn-lvp-mic transmitting";
      btnMic.innerHTML = "🎙️ Tu Micrófono está EN VIVO (Terminar)";
    } else if (myQueueIndex !== -1) {
      btnMic.className = "btn-lvp btn-lvp-mic in-queue";
      btnMic.innerHTML = `⏳ En Fila (Turno #${myQueueIndex + 1}) · Salir`;
    } else {
      btnMic.className = "btn-lvp btn-lvp-mic";
      btnMic.innerHTML = "🎤 Pedir el Micrófono para Orar";
    }
  }

  updateSpeakerTimerUI();
  renderSpeakerQueueList();
  updateEqualizerWave();
}

function renderSpeakerQueueList() {
  const list = document.getElementById("lvp-queue-list");
  if (!list) return;

  if (!liveSpeakerState.queue.length) {
    list.innerHTML = `<li style="text-align: center; color: #94a3b8; font-size: 0.78rem; padding: 0.4rem;">No hay personas en espera. ¡Puedes pedir el micrófono ahora!</li>`;
    return;
  }

  list.innerHTML = liveSpeakerState.queue.map((q, i) => `
    <li class="lvp-queue-item">
      <div>
        <span class="pos-badge">#${i + 1}</span>
        <strong>${q.flag || "📍"} ${escapeHtml(q.nombre)}</strong>
        <span style="color:#34d399; font-size:0.75rem;">(${escapeHtml(q.ciudad)})</span>
        <span class="motivo-small">"${escapeHtml(q.motivo || 'Intercesión')}"</span>
      </div>
      <span style="color:var(--yellow); font-size:0.72rem; font-weight:700; white-space:nowrap;">
        En ${Math.max(1, (i + 1) * 5)} min
      </span>
    </li>
  `).join("");
}

async function handleMicButtonClick() {
  // Si no ha ingresado su nombre, pedirlo
  if (!oranteActual) {
    const inputName = document.getElementById("input-orante-name");
    const name = prompt("Para pedir el micrófono, ingresa tu nombre:", inputName ? inputName.value : "");
    if (!name || !name.trim()) return;
    oranteActual = name.trim();
    sessionStorage.setItem("puraGracia.orantes", oranteActual);
  }

  const current = liveSpeakerState.activeSpeaker;
  const isMeSpeaking = Boolean(current && current.nombre.toLowerCase() === oranteActual.toLowerCase());
  const myQueueIndex = liveSpeakerState.queue.findIndex(q => q.nombre.toLowerCase() === oranteActual.toLowerCase());

  if (isMeSpeaking) {
    // Si ya está hablando, terminar su oración y ceder el turno al siguiente
    if (confirm("¿Deseas terminar tu tiempo de oración y ceder el micrófono al siguiente hermano en la fila?")) {
      nextSpeakerInQueue();
    }
    return;
  }

  if (myQueueIndex !== -1) {
    // Si ya está en la fila, cancelar su turno
    if (confirm("¿Deseas salir de la fila de espera de oración?")) {
      liveSpeakerState.queue.splice(myQueueIndex, 1);
      renderSpeakerPodioUI();
    }
    return;
  }

  // Agregar al usuario a la fila o darle el micrófono si no hay nadie
  const country = PGStorage.getActiveCountry();
  const inputMotivo = document.getElementById("input-orante-motivo");
  const motivo = (inputMotivo && inputMotivo.value) ? inputMotivo.value.trim() : "Orando en unidad y fe por las peticiones";

  const userSpeakerObj = {
    id: "spk_" + Date.now(),
    nombre: oranteActual,
    ciudad: country.cities && country.cities[0] ? country.cities[0] : "Lima",
    pais: country.name || "Perú",
    flag: country.flag || "🇵🇪",
    motivo: motivo,
    lat: -12.0464,
    lng: -77.0428
  };

  // Solicitar permiso de micrófono al navegador
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Permiso otorgado
    stream.getTracks().forEach(track => track.stop()); // Detener hasta que le toque su turno
  } catch (err) {
    console.warn("Permiso de micrófono denegado o no disponible:", err.message);
  }

  // Añadir a la fila
  liveSpeakerState.queue.push(userSpeakerObj);
  alert(`✨ ¡Has sido añadido a la fila para orar! Estás en la posición #${liveSpeakerState.queue.length}. Cada ponente cuenta con 5 minutos.`);
  renderSpeakerPodioUI();
}

async function startUserMicrophone() {
  try {
    liveSpeakerState.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    liveSpeakerState.isTransmitting = true;
    
    // Conectar a analizador de audio
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      liveSpeakerState.audioContext = new AudioContextClass();
      const source = liveSpeakerState.audioContext.createMediaStreamSource(liveSpeakerState.mediaStream);
      liveSpeakerState.analyser = liveSpeakerState.audioContext.createAnalyser();
      liveSpeakerState.analyser.fftSize = 64;
      source.connect(liveSpeakerState.analyser);
    }
    
    alert("🎙️ ¡Es tu turno de orar! Tu micrófono está EN VIVO transmitiendo a todos los intercesores conectados. Tienes 5 minutos.");
    renderSpeakerPodioUI();
  } catch (e) {
    console.warn("No se pudo iniciar el micrófono real:", e);
    liveSpeakerState.isTransmitting = true;
    renderSpeakerPodioUI();
  }
}

function stopUserMicrophone() {
  liveSpeakerState.isTransmitting = false;
  if (liveSpeakerState.mediaStream) {
    liveSpeakerState.mediaStream.getTracks().forEach(track => track.stop());
    liveSpeakerState.mediaStream = null;
  }
  if (liveSpeakerState.audioContext) {
    liveSpeakerState.audioContext.close().catch(() => {});
    liveSpeakerState.audioContext = null;
  }
}

function handleToggleAudio() {
  const btn = document.getElementById("btn-toggle-audio");
  liveSpeakerState.isListening = !liveSpeakerState.isListening;

  if (liveSpeakerState.isListening) {
    btn.classList.add("playing");
    btn.innerHTML = "🔊 Escuchando Oración";
    updateEqualizerWave();
  } else {
    btn.classList.remove("playing");
    btn.innerHTML = "🔈 Audio Silenciado";
    updateEqualizerWave();
  }
}

function updateEqualizerWave() {
  const waveBars = document.querySelectorAll(".wave-bar");
  const shouldAnimate = liveSpeakerState.isListening || liveSpeakerState.isTransmitting;

  waveBars.forEach(bar => {
    if (shouldAnimate) {
      bar.classList.add("speaking");
    } else {
      bar.classList.remove("speaking");
    }
  });
}

// ─── Inicialización al cargar la página ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initForms();
  autoDetectCountry();
  renderGaleria();
  initGalleryNav();
  initLiveVoicePodio();

  // Renderizar datos locales de inmediato (garantiza contadores y pizarra sin demoras)
  updateAllCounters();
  renderPizarra();
  renderHoy();

  if (oranteActual) {
    const nameInput = document.getElementById("input-orante-name");
    if (nameInput) nameInput.value = oranteActual;
  }

  // ── Activar suscripciones Firebase en tiempo real si está disponible ────────
  if (window.PGFirebase && PGFirebase.initialized) {
    console.info("🔥 Firebase activo: suscribiendo peticiones y orantes en tiempo real.");

    // Peticiones en tiempo real
    PGFirebase.subscribePeticiones((list) => {
      _peticionesCache = list;
      updateAllCounters();
      renderPizarra();
      renderHoy();
    });

    // Orantes mundiales en tiempo real
    PGFirebase.subscribeOrantes((list) => {
      _orantesCache = list;
      updateAllCounters();
      // Si el mapa fullscreen está abierto, refrescar marcadores
      if (mapWorldFullscreen) {
        renderFullscreenOrantesMarkers();
        renderFullscreenLiveStream();
      }
    });

  } else {
    console.info("📱 Modo local activo: usando almacenamiento local.");
  }
});

