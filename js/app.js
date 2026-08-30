/**
 * Pura Gracia - Lógica del Sitio Web Público Multi-País
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
  if (digits.startsWith("57") && digits.length >= 12) return digits;
  if (digits.startsWith("51") && digits.length >= 11) return digits;
  if (digits.startsWith("52") && digits.length >= 12) return digits;
  if (digits.startsWith("54") && digits.length >= 12) return digits;
  return digits;
}

// Variables de estado
let activeFilterCategory = "ALL";
let oranteActual = sessionStorage.getItem("puraGracia.orantes") || "";
let reflexionTarget = null;
let mapInstance = null;
let mapMarkers = [];

// RENDERIZADO DE LA PIZARRA
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

// PETICIONES DE HOY & SALA
function peticionesDeHoy() {
  const peticiones = PGStorage.getPeticiones();
  return peticiones.filter((p) => (p.createdAt || "").slice(0, 10) === hoyISO());
}

function renderHoy() {
  const list = document.getElementById("lista-hoy");
  const today = peticionesDeHoy();
  const orantes = oranteActual ? 1 : 0;
  document.getElementById("orantes-activos").textContent = `${orantes} orando`;
  
  if (!oranteActual) {
    list.innerHTML = `<li class="peticion-hoy">Entra a la sala con tu nombre para ver las peticiones del día y responder.</li>`;
    return;
  }
  if (!today.length) {
    list.innerHTML = `<li class="peticion-hoy">Aún no hay peticiones nuevas hoy. Puedes unirte en oración por las notas de la pizarra.</li>`;
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
    `Hola ${peticion.nombre}, soy ${oranteActual} de la comunidad Pura Gracia. Oramos por tu petición: "${peticion.texto}". Que la paz y la gracia de Dios te acompañen hoy.`;
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

// MAPA Y REUNIONES DINÁMICAS POR PAÍS
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
          if (mapInstance && r.lat && r.lng) {
            mapInstance.flyTo([r.lat, r.lng], 15);
            if (mapMarkers[index]) mapMarkers[index].openPopup();
          }
        });
        return btn;
      })
    );
  }

  // Actualizar mapa Leaflet
  if (typeof L !== "undefined") {
    if (!mapInstance) {
      mapInstance = L.map("mapa", { scrollWheelZoom: false }).setView([4.653, -74.066], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance);
    }

    // Limpiar marcadores anteriores
    mapMarkers.forEach(m => m.remove());
    mapMarkers = [];

    if (reuniones.length > 0) {
      reuniones.forEach((r, i) => {
        if (r.lat && r.lng) {
          const marker = L.marker([r.lat, r.lng]).addTo(mapInstance);
          marker.bindPopup(`<strong>${escapeHtml(r.titulo)}</strong><br>${escapeHtml(r.city)}<br>${formatFecha(r.fecha)} · ${escapeHtml(r.hora)}<br>${escapeHtml(r.lugar)}`);
          mapMarkers.push(marker);
        }
      });

      // Centrar en el primer evento del país
      const first = reuniones[0];
      if (first && first.lat && first.lng) {
        mapInstance.setView([first.lat, first.lng], 13);
      }
    }
  }
}

// SECCIÓN DE DONACIONES DINÁMICAS (OPCIÓN 3)
function updateDonationsUI() {
  const country = PGStorage.getActiveCountry();
  const symbol = country.currencySymbol || "$";
  const currency = country.currency || "COP";
  const amounts = country.defaultAmounts || [20000, 50000, 100000];

  // Actualizar label de moneda
  document.getElementById("donate-amount-label").textContent = `Otro monto (${currency} ${symbol})`;

  // Selector sincronizado
  const donateSelect = document.getElementById("donate-country-select");
  if (donateSelect) donateSelect.value = country.code;

  // Chips dinámicos
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

  // Tabs de métodos de pago (Yape, Plin, Nequi, etc.)
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

  // Entrada a la sala de oración
  document.getElementById("form-sala").addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = String(new FormData(e.target).get("orante") || "").trim();
    if (!nombre) return;
    oranteActual = nombre;
    sessionStorage.setItem("puraGracia.orantes", nombre);
    document.getElementById("sala-estado").textContent = `Estás orando como ${nombre}.`;
    renderHoy();
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
  globalSelect.value = PGStorage.getActiveCountryCode();
  globalSelect.addEventListener("change", (e) => {
    PGStorage.setActiveCountryCode(e.target.value);
    updateMeetingsAndMap();
    updateDonationsUI();
  });

  // Selector de País en Donaciones
  const donateSelect = document.getElementById("donate-country-select");
  donateSelect.addEventListener("change", (e) => {
    globalSelect.value = e.target.value;
    globalSelect.dispatchEvent(new Event("change"));
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
  renderPizarra();
  renderHoy();
  renderGaleria();
  initGalleryNav();
  updateMeetingsAndMap();
  updateDonationsUI();

  if (oranteActual) {
    document.querySelector("#form-sala [name=orante]").value = oranteActual;
    document.getElementById("sala-estado").textContent = `Estás orando como ${oranteActual}.`;
  }
});
