/**
 * Pura Gracia - Lógica del Sitio Web Público con Detección Automática y Mapa Mundial de Oración
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

// Coordenadas aproximadas de ciudades principales para posicionar en el mapa
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
  "houston": { lat: 29.7604, lng: -95.3698, country: "US", flag: "🇺🇸" }
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
let mapWorldPrayer = null;
let worldPrayerMarkers = [];

// ========================================================
// 1. DETECCIÓN AUTOMÁTICA DE PAÍS
// ========================================================
function autoDetectCountry() {
  // 1. Si el usuario ya eligió un país en su sesión previa, respetarlo
  const savedCountry = PGStorage.getActiveCountryCode();
  if (savedCountry) {
    applyDetectedCountry(savedCountry, false);
    return;
  }

  let detected = "PE"; // Por defecto Perú

  // 2. Detección por Zona Horaria del navegador
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
      // 3. Detección por idioma del navegador
      const lang = (navigator.language || navigator.userLanguage || "").toUpperCase();
      if (lang.includes("PE")) detected = "PE";
      else if (lang.includes("CO")) detected = "CO";
      else if (lang.includes("MX")) detected = "MX";
      else if (lang.includes("AR")) detected = "AR";
    }
  } catch (e) {}

  applyDetectedCountry(detected, true);

  // 4. Verificación asíncrona por IP rápida de fondo
  fetch("https://api.country.is/")
    .then(res => res.json())
    .then(data => {
      if (data && data.country) {
        const cCode = data.country.toUpperCase();
        if (["PE", "CO", "MX", "AR", "US"].includes(cCode)) {
          applyDetectedCountry(cCode, true);
        }
      }
    })
    .catch(() => {});
}

function applyDetectedCountry(code, isAuto = false) {
  PGStorage.setActiveCountryCode(code);
  const globalSelect = document.getElementById("global-country-select");
  if (globalSelect) globalSelect.value = code;

  const autoTag = document.getElementById("auto-detect-tag");
  if (autoTag) {
    const c = PGStorage.getActiveCountry();
    autoTag.textContent = isAuto ? `📍 Auto (${c.name})` : `📍 ${c.name}`;
  }

  // Prellenar inputs de la sala de oración según país
  const c = PGStorage.getActiveCountry();
  const inputCountry = document.getElementById("input-orante-country");
  const inputCity = document.getElementById("input-orante-city");
  if (inputCountry && !inputCountry.value) inputCountry.value = c.name;
  if (inputCity && !inputCity.value && c.cities && c.cities.length) inputCity.value = c.cities[0];

  updateMeetingsAndMap();
  updateDonationsUI();
}

// ========================================================
// 2. SISTEMA DE ORACIÓN MUNDIAL EN VIVO (MAPA & SALA)
// ========================================================
function initMapaMundial() {
  if (typeof L === "undefined") return;

  const mapContainer = document.getElementById("mapa-mundial");
  if (!mapContainer || mapWorldPrayer) return;

  // Inicializar mapa centrado en América / Mundo
  mapWorldPrayer = L.map("mapa-mundial", {
    scrollWheelZoom: false,
    minZoom: 2,
    maxZoom: 10
  }).setView([5, -60], 3);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  }).addTo(mapWorldPrayer);

  renderOrantesEnMapaMundial();
  renderOrantesConectados();
}

function renderOrantesEnMapaMundial() {
  if (!mapWorldPrayer) return;

  // Limpiar marcadores anteriores
  worldPrayerMarkers.forEach(m => m.remove());
  worldPrayerMarkers = [];

  const orantes = PGStorage.getOrantesMundiales();
  document.getElementById("orantes-activos-count").textContent = orantes.length;

  orantes.forEach((o) => {
    if (!o.lat || !o.lng) return;

    // Ícono personalizado con animación de pulso
    const pulseIcon = L.divIcon({
      className: "pulse-prayer-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
      html: `
        <div class="pulse-glow"></div>
        <div class="pulse-pin">🙏</div>
      `
    });

    const marker = L.marker([o.lat, o.lng], { icon: pulseIcon }).addTo(mapWorldPrayer);
    
    marker.bindPopup(`
      <div style="font-family: Outfit, sans-serif; min-width: 170px;">
        <strong style="font-size: 1.05rem; display:block; color:#1c2422;">🙏 ${escapeHtml(o.nombre)}</strong>
        <span style="color:#2f6f62; font-weight:700; font-size:0.85rem;">${escapeHtml(o.ciudad)}, ${escapeHtml(o.pais)} ${o.flag || ""}</span>
        <div style="font-size: 0.75rem; color:#718096; margin: 4px 0 8px;">Conectado ${escapeHtml(o.time || "en vivo")}</div>
        <div style="font-size: 0.8rem; background:#f6f1e4; padding: 4px 6px; border-radius: 6px; border:1px dashed #2f6f62;">
          "Orando por la paz, salud y bendición de las familias."
        </div>
      </div>
    `);

    worldPrayerMarkers.push(marker);
  });
}

function renderOrantesConectados() {
  const list = document.getElementById("lista-orantes-conectados");
  if (!list) return;

  const orantes = PGStorage.getOrantesMundiales();
  list.innerHTML = orantes.slice(0, 6).map(o => `
    <li class="orante-item">
      <div>
        <strong>${o.flag || "📍"} ${escapeHtml(o.nombre)}</strong>
        <span style="color:var(--teal); font-weight:600;">(${escapeHtml(o.ciudad)})</span>
      </div>
      <span class="orante-time">${escapeHtml(o.time || "Ahora")}</span>
    </li>
  `).join("");
}

// RENDERIZADO DE LA PIZARRA DE NOTAS
function renderPizarra() {
  const board = document.getElementById("pizarra");
  const peticiones = PGStorage.getPeticiones();
  
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
      prayBtn.addEventListener("click", () => {
        const newCount = PGStorage.addPrayCount(p.id);
        prayBtn.querySelector(".pray-count").textContent = newCount;
        prayBtn.style.transform = "scale(1.2)";
        setTimeout(() => { prayBtn.style.transform = "scale(1)"; }, 200);
      });

      return el;
    })
  );
}

// PETICIONES DE HOY
function peticionesDeHoy() {
  const peticiones = PGStorage.getPeticiones();
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
  galeria.replaceChildren(
    ...FOTOS.map((f) => {
      const fig = document.createElement("figure");
      fig.className = "foto";
      fig.innerHTML = `<img src="${f.src}" alt="${escapeHtml(f.alt)}" loading="lazy" /><figcaption>${escapeHtml(f.caption)}</figcaption>`;
      return fig;
    })
  );
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
  document.getElementById("form-peticion").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const nombre = String(data.get("nombre") || "").trim();
    const category = String(data.get("category") || "Salud");
    const texto = String(data.get("texto") || "").trim();
    const correo = String(data.get("correo") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    const activeCountry = PGStorage.getActiveCountryCode();

    if (!nombre || !texto) return;

    const list = PGStorage.getPeticiones();
    list.unshift({
      id: uid(),
      country: activeCountry,
      category,
      nombre,
      texto,
      correo,
      telefono,
      praysCount: 1,
      createdAt: new Date().toISOString(),
    });

    PGStorage.savePeticiones(list);
    e.target.reset();
    renderPizarra();
    renderHoy();
    document.getElementById("peticiones").scrollIntoView({ behavior: "smooth" });
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

  // Entrada a la Sala Mundial y Marcador en Mapa Mundial
  document.getElementById("form-sala").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const nombre = String(data.get("orante") || "").trim();
    const ciudad = String(data.get("ciudad") || "Lima").trim();
    const pais = String(data.get("pais") || "Perú").trim();

    if (!nombre) return;

    oranteActual = nombre;
    sessionStorage.setItem("puraGracia.orantes", nombre);

    // Buscar coordenadas de la ciudad o asignar coordenadas por defecto
    const normalizedCity = ciudad.toLowerCase();
    const foundCoords = CITY_COORDS[normalizedCity] || { lat: -12.0464, lng: -77.0428, country: "PE", flag: "🇵🇪" };

    const nuevoOrante = {
      id: "o_" + Date.now(),
      nombre,
      ciudad,
      pais,
      flag: foundCoords.flag || "📍",
      lat: foundCoords.lat + (Math.random() * 0.04 - 0.02), // Pequeño jitter para no solapar marcadores exactos
      lng: foundCoords.lng + (Math.random() * 0.04 - 0.02),
      time: "Ahora"
    };

    PGStorage.addOranteMundial(nuevoOrante);
    renderOrantesEnMapaMundial();
    renderOrantesConectados();

    document.getElementById("sala-estado").innerHTML = `✨ <strong>¡Conectado en vivo!</strong> Tu punto está brillando en el mapa mundial como <em>${escapeHtml(nombre)} (${escapeHtml(ciudad)}, ${escapeHtml(pais)})</em>.`;

    // Hacer zoom y animación en el mapa mundial hacia la ubicación del orante
    if (mapWorldPrayer) {
      mapWorldPrayer.flyTo([nuevoOrante.lat, nuevoOrante.lng], 7, { duration: 1.5 });
    }
  });

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

  // Selector de País Global (Header)
  const globalSelect = document.getElementById("global-country-select");
  globalSelect.addEventListener("change", (e) => {
    applyDetectedCountry(e.target.value, false);
  });

  // Selector de País en Donaciones
  const donateSelect = document.getElementById("donate-country-select");
  donateSelect.addEventListener("change", (e) => {
    applyDetectedCountry(e.target.value, false);
  });

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
  autoDetectCountry();
  renderPizarra();
  renderHoy();
  renderGaleria();
  initGalleryNav();
  initMapaMundial();

  if (oranteActual) {
    document.getElementById("input-orante-name").value = oranteActual;
    document.getElementById("sala-estado").textContent = `Estás orando como ${oranteActual}.`;
  }
});
