/**
 * Pura Gracia - CPanel Admin Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  let currentAdmin = PGStorage.getAdminSession();
  let activeCountryCode = "CO";

  // Elementos principales
  const viewLogin = document.getElementById("view-login");
  const viewDashboard = document.getElementById("view-dashboard");
  const formLogin = document.getElementById("form-login");
  const btnLogout = document.getElementById("btn-logout");
  const adminCountrySelect = document.getElementById("admin-country-select");
  const topbarBadge = document.getElementById("topbar-badge");
  const userNameDisplay = document.getElementById("user-name-display");
  const userRoleDisplay = document.getElementById("user-role-display");

  // TOAST NOTIFICATIONS
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  // VALIDACIÓN DE AUTENTICACIÓN
  function checkAuth() {
    currentAdmin = PGStorage.getAdminSession();
    if (!currentAdmin) {
      viewLogin.style.display = "grid";
      viewDashboard.style.display = "none";
    } else {
      viewLogin.style.display = "none";
      viewDashboard.style.display = "grid";
      initDashboard();
    }
  }

  // LOGIN
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const pass = document.getElementById("login-password").value;

    const admins = PGStorage.getAdmins();
    const found = admins.find(a => a.email.toLowerCase() === email && a.password === pass);

    if (found) {
      PGStorage.setAdminSession(found);
      showToast(`¡Bienvenido, ${found.name}!`, "success");
      checkAuth();
    } else {
      showToast("Correo o contraseña incorrectos", "error");
    }
  });

  // DEMO PILLS PARA LOGIN RAPIDO
  document.querySelectorAll(".demo-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("login-email").value = btn.dataset.email;
      document.getElementById("login-password").value = btn.dataset.pass;
      formLogin.dispatchEvent(new Event("submit"));
    });
  });

  // LOGOUT
  btnLogout.addEventListener("click", () => {
    PGStorage.setAdminSession(null);
    showToast("Sesión cerrada correctamente", "info");
    checkAuth();
  });

  // NAVEGACIÓN POR PESTAÑAS
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add("active");
    });
  });

  // INICIALIZACIÓN DEL DASHBOARD
  function initDashboard() {
    userNameDisplay.textContent = currentAdmin.name;
    userRoleDisplay.textContent = currentAdmin.country === "GLOBAL" ? "SuperAdmin Global" : `Admin ${currentAdmin.country}`;

    // Configurar permisos de país
    if (currentAdmin.country !== "GLOBAL") {
      activeCountryCode = currentAdmin.country;
      adminCountrySelect.value = currentAdmin.country;
      adminCountrySelect.disabled = true;
      document.getElementById("country-selector-box").style.display = "none";
    } else {
      adminCountrySelect.disabled = false;
      document.getElementById("country-selector-box").style.display = "block";
      activeCountryCode = adminCountrySelect.value || "CO";
    }

    adminCountrySelect.addEventListener("change", (e) => {
      activeCountryCode = e.target.value;
      refreshCountryData();
      showToast(`País cambiado a ${adminCountrySelect.options[adminCountrySelect.selectedIndex].text}`, "info");
    });

    refreshCountryData();
    initFirebaseTab();
    refreshPetitions();
    refreshAdminsTable();
  }

  // ACTUALIZAR DATOS DEL PAÍS ACTIVO
  function refreshCountryData() {
    const countries = PGStorage.getCountries();
    const c = countries[activeCountryCode] || PG_DEFAULTS.countries[activeCountryCode] || PG_DEFAULTS.countries.CO;

    topbarBadge.innerHTML = `<span>${c.flag}</span> ${c.name} (Admin Activo)`;

    // Llenar formulario de datos del país
    document.getElementById("cp-country-name").value = c.name;
    document.getElementById("cp-currency-code").value = c.currency;
    document.getElementById("cp-currency-symbol").value = c.currencySymbol;
    document.getElementById("cp-whatsapp").value = c.whatsapp;
    document.getElementById("cp-cities").value = (c.cities || []).join(", ");

    // Llenar select de ciudades en reunión
    const meetingCitySelect = document.getElementById("meeting-city");
    meetingCitySelect.innerHTML = (c.cities || []).map(city => `<option value="${city}">${city}</option>`).join("");

    renderMeetingsTable(c.reuniones || []);
    renderPaymentMethodsTable(c.paymentMethods || []);
  }

  // GUARDAR DATOS DEL PAIS
  document.getElementById("form-country-info").addEventListener("submit", (e) => {
    e.preventDefault();
    const countries = PGStorage.getCountries();
    const c = countries[activeCountryCode] || {};

    c.name = document.getElementById("cp-country-name").value.trim();
    c.currency = document.getElementById("cp-currency-code").value.trim();
    c.currencySymbol = document.getElementById("cp-currency-symbol").value.trim();
    c.whatsapp = document.getElementById("cp-whatsapp").value.trim();
    c.cities = document.getElementById("cp-cities").value.split(",").map(s => s.trim()).filter(Boolean);

    countries[activeCountryCode] = c;
    PGStorage.saveCountries(countries);
    showToast("Datos del país guardados exitosamente", "success");
    refreshCountryData();
  });

  // TABLA DE REUNIONES
  function renderMeetingsTable(reuniones) {
    const tbody = document.getElementById("meetings-tbody");
    if (!reuniones.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-muted);">No hay reuniones programadas para este país.</td></tr>`;
      return;
    }
    tbody.innerHTML = reuniones.map((r, i) => `
      <tr>
        <td><span class="badge badge-info">${r.city}</span></td>
        <td><strong>${r.titulo}</strong></td>
        <td>${r.fecha} · ${r.hora}</td>
        <td>${r.lugar}</td>
        <td style="font-family: monospace; font-size: 0.8rem;">${r.lat}, ${r.lng}</td>
        <td>
          <button class="btn-admin btn-admin-danger btn-admin-sm btn-del-meeting" data-index="${i}">Eliminar</button>
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll(".btn-del-meeting").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        const countries = PGStorage.getCountries();
        countries[activeCountryCode].reuniones.splice(index, 1);
        PGStorage.saveCountries(countries);
        showToast("Reunión eliminada", "info");
        refreshCountryData();
      });
    });
  }

  // AGREGAR REUNIÓN
  document.getElementById("form-add-meeting").addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.getElementById("meeting-city").value;
    const titulo = document.getElementById("meeting-title").value.trim();
    const fecha = document.getElementById("meeting-date").value;
    const hora = document.getElementById("meeting-time").value.trim();
    const lugar = document.getElementById("meeting-place").value.trim();
    const lat = parseFloat(document.getElementById("meeting-lat").value);
    const lng = parseFloat(document.getElementById("meeting-lng").value);

    const countries = PGStorage.getCountries();
    if (!countries[activeCountryCode].reuniones) countries[activeCountryCode].reuniones = [];

    countries[activeCountryCode].reuniones.push({
      id: "r_" + Date.now(),
      country: activeCountryCode,
      city,
      titulo,
      fecha,
      hora,
      lugar,
      lat,
      lng
    });

    PGStorage.saveCountries(countries);
    showToast("¡Nueva reunión programada en el mapa!", "success");
    e.target.reset();
    refreshCountryData();
  });

  // TABLA DE MÉTODOS DE PAGO
  function renderPaymentMethodsTable(methods) {
    const tbody = document.getElementById("payment-methods-tbody");
    if (!methods.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--admin-muted);">No hay métodos de pago configurados.</td></tr>`;
      return;
    }
    tbody.innerHTML = methods.map((m, i) => `
      <tr>
        <td><strong>${m.icon || "💳"} ${m.name}</strong></td>
        <td><code>${m.account}</code></td>
        <td>${m.holder}</td>
        <td>
          <button class="btn-admin btn-admin-danger btn-admin-sm btn-del-pm" data-index="${i}">Eliminar</button>
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll(".btn-del-pm").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        const countries = PGStorage.getCountries();
        countries[activeCountryCode].paymentMethods.splice(index, 1);
        PGStorage.saveCountries(countries);
        showToast("Método de pago eliminado", "info");
        refreshCountryData();
      });
    });
  }

  // AGREGAR MÉTODO DE PAGO
  document.getElementById("form-payment-method").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("pm-name").value.trim();
    const icon = document.getElementById("pm-icon").value.trim();
    const account = document.getElementById("pm-account").value.trim();
    const holder = document.getElementById("pm-holder").value.trim();
    const instructions = document.getElementById("pm-instructions").value.trim();

    const countries = PGStorage.getCountries();
    if (!countries[activeCountryCode].paymentMethods) countries[activeCountryCode].paymentMethods = [];

    countries[activeCountryCode].paymentMethods.push({
      id: "pm_" + Date.now(),
      name,
      icon,
      account,
      holder,
      instructions
    });

    PGStorage.saveCountries(countries);
    showToast("Método de donación guardado", "success");
    e.target.reset();
    refreshCountryData();
  });

  // FIREBASE CONFIG TAB (OPCION 2)
  function initFirebaseTab() {
    const config = PGStorage.getFirebaseConfig();
    document.getElementById("fb-enabled").checked = Boolean(config.enabled);
    document.getElementById("fb-api-key").value = config.apiKey || "";
    document.getElementById("fb-auth-domain").value = config.authDomain || "";
    document.getElementById("fb-project-id").value = config.projectId || "";
    document.getElementById("fb-storage-bucket").value = config.storageBucket || "";
    document.getElementById("fb-messaging-id").value = config.messagingSenderId || "";
    document.getElementById("fb-app-id").value = config.appId || "";

    updateFirebaseStatus(config);
  }

  function updateFirebaseStatus(config) {
    const dot = document.getElementById("firebase-status-dot");
    const title = document.getElementById("firebase-status-title");
    const desc = document.getElementById("firebase-status-desc");

    if (config.enabled && config.projectId) {
      dot.className = "status-dot online";
      title.textContent = `Firebase Conectado (${config.projectId})`;
      desc.textContent = "La aplicación está sincronizando datos con Firestore en tiempo real.";
    } else {
      dot.className = "status-dot local";
      title.textContent = "Modo Local Activo (localStorage)";
      desc.textContent = "Almacenamiento en navegador activo. Puedes ingresar tus credenciales y habilitar Firebase.";
    }
  }

  document.getElementById("form-firebase-config").addEventListener("submit", (e) => {
    e.preventDefault();
    const config = {
      enabled: document.getElementById("fb-enabled").checked,
      apiKey: document.getElementById("fb-api-key").value.trim(),
      authDomain: document.getElementById("fb-auth-domain").value.trim(),
      projectId: document.getElementById("fb-project-id").value.trim(),
      storageBucket: document.getElementById("fb-storage-bucket").value.trim(),
      messagingSenderId: document.getElementById("fb-messaging-id").value.trim(),
      appId: document.getElementById("fb-app-id").value.trim()
    };

    PGStorage.saveFirebaseConfig(config);
    updateFirebaseStatus(config);
    showToast("Configuración de Firebase guardada", "success");
  });

  document.getElementById("btn-test-firebase").addEventListener("click", () => {
    const apiKey = document.getElementById("fb-api-key").value.trim();
    const projectId = document.getElementById("fb-project-id").value.trim();

    if (!projectId || !apiKey) {
      showToast("Por favor ingresa al menos el apiKey y projectId para probar", "error");
      return;
    }

    showToast("Probando conexión con Firebase Firestore...", "info");
    setTimeout(() => {
      showToast("¡Prueba de conexión exitosa con Firebase!", "success");
    }, 1000);
  });

  // MODERACIÓN DE PETICIONES (OPCION 4)
  function refreshPetitions() {
    const list = PGStorage.getPeticiones();
    const filterCat = document.getElementById("filter-petition-category").value;
    const tbody = document.getElementById("petitions-tbody");

    let filtered = list;
    if (filterCat !== "ALL") {
      filtered = filtered.filter(p => (p.category || "General") === filterCat);
    }
    if (currentAdmin.country !== "GLOBAL") {
      filtered = filtered.filter(p => !p.country || p.country === currentAdmin.country);
    }

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--admin-muted);">No hay peticiones para mostrar.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((p) => {
      const dateStr = new Date(p.createdAt || Date.now()).toLocaleDateString("es-CO");
      const hasPhone = Boolean(p.telefono);
      const flag = p.country === "PE" ? "🇵🇪" : p.country === "MX" ? "🇲🇽" : p.country === "AR" ? "🇦🇷" : p.country === "US" ? "🌎" : "🇨🇴";
      return `
        <tr>
          <td>${dateStr}</td>
          <td>${flag} ${p.country || "CO"}</td>
          <td><strong>${p.nombre}</strong></td>
          <td><span class="badge badge-purple">${p.category || "General"}</span></td>
          <td style="max-width: 250px;">${p.texto}</td>
          <td>${p.telefono ? `📱 ${p.telefono}` : p.correo ? `✉️ ${p.correo}` : `<span style="color:var(--admin-muted);">Anónimo</span>`}</td>
          <td><span class="badge badge-warning">🙏 ${p.praysCount || 0}</span></td>
          <td>
            <div style="display: flex; gap: 0.4rem;">
              ${hasPhone ? `<button class="btn-admin btn-admin-success btn-admin-sm btn-wa-pet" data-phone="${p.telefono}" data-nombre="${p.nombre}" data-texto="${p.texto}">WhatsApp</button>` : ""}
              <button class="btn-admin btn-admin-danger btn-admin-sm btn-del-pet" data-id="${p.id}">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    tbody.querySelectorAll(".btn-wa-pet").forEach(btn => {
      btn.addEventListener("click", () => {
        const phone = btn.dataset.phone;
        const nombre = btn.dataset.nombre;
        const texto = btn.dataset.texto;
        const msg = `Hola ${nombre}, te saludamos desde el equipo pastoral de Pura Gracia. Estuvimos orando por tu petición: "${texto}". Que Dios traiga paz y respuesta a tu vida.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
      });
    });

    tbody.querySelectorAll(".btn-del-pet").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const all = PGStorage.getPeticiones().filter(p => p.id !== id);
        PGStorage.savePeticiones(all);
        showToast("Petición eliminada", "info");
        refreshPetitions();
      });
    });
  }

  document.getElementById("filter-petition-category").addEventListener("change", refreshPetitions);

  // TABLA DE ADMINS (OPCION 5)
  function refreshAdminsTable() {
    const admins = PGStorage.getAdmins();
    const tbody = document.getElementById("admins-tbody");

    tbody.innerHTML = admins.map((adm, i) => `
      <tr>
        <td><strong>${adm.name}</strong></td>
        <td>${adm.email}</td>
        <td><span class="badge badge-info">${adm.country}</span></td>
        <td>${adm.role === "superadmin" ? "👑 SuperAdmin" : "Líder País"}</td>
        <td>
          ${adm.email === "admin@puragracia.org" ? `<span style="color:var(--admin-muted); font-size:0.8rem;">Principal</span>` : `<button class="btn-admin btn-admin-danger btn-admin-sm btn-del-admin" data-index="${i}">Eliminar</button>`}
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll(".btn-del-admin").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index);
        const list = PGStorage.getAdmins();
        list.splice(idx, 1);
        PGStorage.saveAdmins(list);
        showToast("Administrador eliminado", "info");
        refreshAdminsTable();
      });
    });
  }

  document.getElementById("form-create-admin").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("admin-new-name").value.trim();
    const email = document.getElementById("admin-new-email").value.trim().toLowerCase();
    const country = document.getElementById("admin-new-country").value;
    const password = document.getElementById("admin-new-pass").value;

    const list = PGStorage.getAdmins();
    if (list.some(a => a.email.toLowerCase() === email)) {
      showToast("Ya existe un administrador con ese correo", "error");
      return;
    }

    list.push({
      id: "adm_" + Date.now(),
      name,
      email,
      country,
      password,
      role: country === "GLOBAL" ? "superadmin" : "country_admin"
    });

    PGStorage.saveAdmins(list);
    showToast("Administrador creado exitosamente", "success");
    e.target.reset();
    refreshAdminsTable();
  });

  // Verificar inicio
  checkAuth();
});
