/**
 * ============================================================================
 * PURA GRACIA - CONFIGURACIÓN CENTRAL DE FIREBASE & CAPA DE DATOS MULTI-PAÍS
 * ============================================================================
 * 
 * INSTRUCCIONES PARA CONECTAR TU PROYECTO FIREBASE:
 * 1. Ve a https://console.firebase.google.com/ y crea tu proyecto.
 * 2. Activa "Firestore Database" en modo de prueba o con reglas públicas.
 * 3. En Configuración del proyecto > Apps Web (</>), copia el objeto firebaseConfig.
 * 4. Pega tus credenciales directamente en el objeto `FIREBASE_CONFIG` abajo:
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA73w4hd6FAru3BQZKM2F6B0CnNb9HkbfI",
  authDomain: "puragracia-da17c.firebaseapp.com",
  projectId: "puragracia-da17c",
  storageBucket: "puragracia-da17c.firebasestorage.app",
  messagingSenderId: "1039612656582",
  appId: "1:1039612656582:web:9628ce35d596584f59d0c7"
};

// ─── Datos por defecto multi-país (fallback y estructura) ─────────────────────
const PG_DEFAULTS = {
  activeCountry: "PE",
  countries: {
    PE: {
      code: "PE", name: "Perú", flag: "🇵🇪", currency: "PEN", currencySymbol: "S/.",
      whatsapp: "51987654321", defaultAmounts: [20, 50, 100], defaultAmountStep: 10, minAmount: 5,
      paymentMethods: [
        { id: "yape",  name: "Yape",      icon: "🟣", account: "987 654 321",                      holder: "Pura Gracia Perú",             instructions: "Yapea al número o escanea el QR en la app." },
        { id: "plin",  name: "Plin",      icon: "🔵", account: "987 654 321",                      holder: "Pura Gracia Perú",             instructions: "Transfiere por Plin (BBVA, Interbank o Scotiabank)." },
        { id: "bcp",   name: "BCP Soles", icon: "🏦", account: "193-98765432-0-12 (CCI: 0021930098765432012)", holder: "Asociación Pura Gracia", instructions: "Transferencia BCP o interbancaria en Soles." }
      ],
      cities: ["Lima", "Arequipa", "Trujillo", "Cusco"],
      reuniones: [
        { id: "r_pe_1", country: "PE", city: "Lima",     titulo: "Oración en el Malecón",    fecha: "2026-09-07", hora: "7:00 p. m.", lugar: "Parque del Amor, Miraflores",  lat: -12.1245, lng: -77.0370 },
        { id: "r_pe_2", country: "PE", city: "Lima",     titulo: "Clamor por las Familias",  fecha: "2026-09-14", hora: "6:30 p. m.", lugar: "Campo de Marte, Jesús María", lat: -12.0716, lng: -77.0428 }
      ]
    },
    CO: {
      code: "CO", name: "Colombia", flag: "🇨🇴", currency: "COP", currencySymbol: "$",
      whatsapp: "573001112233", defaultAmounts: [20000, 50000, 100000], defaultAmountStep: 5000, minAmount: 5000,
      paymentMethods: [
        { id: "nequi",      name: "Nequi",       icon: "📱", account: "300 123 4567",            holder: "Pura Gracia Colombia",  instructions: "Envía por Nequi al número o escanea en la app." },
        { id: "daviplata",  name: "Daviplata",   icon: "💳", account: "300 123 4567",            holder: "Pura Gracia Colombia",  instructions: "Transfiere por Daviplata al celular." },
        { id: "bancolombia",name: "Bancolombia", icon: "🏦", account: "Ahorros # 123-456789-00", holder: "Iglesia Pura Gracia NIT: 900.123.456-1", instructions: "Transferencia o consignación nacional." }
      ],
      cities: ["Bogotá", "Medellín", "Cali", "Barranquilla"],
      reuniones: [
        { id: "r_co_1", country: "CO", city: "Bogotá", titulo: "Oración en el parque",      fecha: "2026-09-06", hora: "7:00 p. m.", lugar: "Parque de los Novios, Bogotá", lat: 4.6686, lng: -74.0640 },
        { id: "r_co_2", country: "CO", city: "Bogotá", titulo: "Noche de intercesión",      fecha: "2026-09-13", hora: "6:30 p. m.", lugar: "Salón comunal La Soledad",     lat: 4.6470, lng: -74.0720 }
      ]
    },
    MX: {
      code: "MX", name: "México", flag: "🇲🇽", currency: "MXN", currencySymbol: "$",
      whatsapp: "525512345678", defaultAmounts: [100, 250, 500], defaultAmountStep: 50, minAmount: 50,
      paymentMethods: [
        { id: "spei", name: "SPEI",        icon: "🏦", account: "CLABE: 012180001234567890",     holder: "Pura Gracia México A.C.",  instructions: "Transferencia interbancaria SPEI sin comisión." },
        { id: "oxxo", name: "Depósito OXXO",icon: "🏪", account: "Tarjeta: 4152 3138 9012 3456", holder: "Pura Gracia México",        instructions: "Deposita en cualquier tienda OXXO del país." }
      ],
      cities: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla"],
      reuniones: [
        { id: "r_mx_1", country: "MX", city: "Ciudad de México", titulo: "Encuentro de Fe y Gratitud", fecha: "2026-09-08", hora: "7:00 p. m.", lugar: "Parque México, Condesa", lat: 19.4124, lng: -99.1698 }
      ]
    },
    AR: {
      code: "AR", name: "Argentina", flag: "🇦🇷", currency: "ARS", currencySymbol: "$",
      whatsapp: "5491123456789", defaultAmounts: [5000, 10000, 25000], defaultAmountStep: 1000, minAmount: 1000,
      paymentMethods: [
        { id: "mp_ar", name: "Mercado Pago", icon: "💙", account: "CVU: 0000003100012345678901 / Alias: puragracia.mp", holder: "Pura Gracia Argentina", instructions: "Envía dinero por Mercado Pago usando el Alias o CVU." }
      ],
      cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
      reuniones: [
        { id: "r_ar_1", country: "AR", city: "Buenos Aires", titulo: "Oración al aire libre", fecha: "2026-09-09", hora: "6:30 p. m.", lugar: "Rosedal de Palermo", lat: -34.5711, lng: -58.4173 }
      ]
    },
    US: {
      code: "US", name: "Internacional / EE.UU.", flag: "🌎", currency: "USD", currencySymbol: "$",
      whatsapp: "13051234567", defaultAmounts: [15, 30, 75], defaultAmountStep: 5, minAmount: 5,
      paymentMethods: [
        { id: "zelle", name: "Zelle", icon: "⚡", account: "donate@puragracia.org", holder: "Pure Grace Community Inc.", instructions: "Send directly through your bank's Zelle feature — no fees." }
      ],
      cities: ["Miami", "Orlando", "Houston", "Internacional Online"],
      reuniones: [
        { id: "r_us_1", country: "US", city: "Miami", titulo: "Bilingual Prayer Gathering", fecha: "2026-09-10", hora: "7:00 p. m.", lugar: "Bayfront Park, Miami, FL", lat: 25.7753, lng: -80.1866 }
      ]
    }
  },

  orantesMundiales: [
    { id: "o1", nombre: "Leonel C.",      ciudad: "Lima",              pais: "Perú",      flag: "🇵🇪", motivo: "Por sanidad de mi familia, sabiduría y paz en el hogar",                      lat: -12.0464, lng: -77.0428, time: "Hace 2 min" },
    { id: "o2", nombre: "Pastor David",   ciudad: "Bogotá",            pais: "Colombia",  flag: "🇨🇴", motivo: "Por avivamiento espiritual y fortaleza en la juventud",                       lat:   4.7110, lng: -74.0721, time: "Hace 5 min" },
    { id: "o3", nombre: "María Isabel",   ciudad: "Medellín",          pais: "Colombia",  flag: "🇨🇴", motivo: "Por provisión en los emprendimientos y salud para mi madre",                  lat:   6.2442, lng: -75.5812, time: "Hace 8 min" },
    { id: "o4", nombre: "Carlos Mendoza", ciudad: "Arequipa",          pais: "Perú",      flag: "🇵🇪", motivo: "Por restauración en los matrimonios de mi congregación",                      lat: -16.4090, lng: -71.5375, time: "Hace 10 min" },
    { id: "o5", nombre: "Fernanda R.",    ciudad: "Ciudad de México",  pais: "México",    flag: "🇲🇽", motivo: "Pidiendo protección divina y paz en mi país",                                 lat:  19.4326, lng: -99.1332, time: "Hace 12 min" },
    { id: "o6", nombre: "Mateo & Familia",ciudad: "Buenos Aires",      pais: "Argentina", flag: "🇦🇷", motivo: "Gratitud por nuevas oportunidades laborales",                                 lat: -34.6037, lng: -58.3816, time: "Hace 15 min" },
    { id: "o7", nombre: "Jennifer S.",    ciudad: "Miami",             pais: "EE.UU.",    flag: "🇺🇸", motivo: "Por sanidad de un amigo en tratamiento médico",                               lat:  25.7617, lng: -80.1918, time: "Hace 20 min" },
    { id: "o8", nombre: "Andrés V.",      ciudad: "Trujillo",          pais: "Perú",      flag: "🇵🇪", motivo: "Por dirección en mis estudios y proyectos",                                   lat:  -8.1116, lng: -79.0287, time: "Hace 25 min" },
    { id: "o9", nombre: "Lucas M.",       ciudad: "Madrid",            pais: "España",    flag: "🇪🇸", motivo: "Unidad y amor fraternal entre creyentes",                                     lat:  40.4168, lng:  -3.7038, time: "Hace 30 min" }
  ],

  admins: [
    { id: "adm_global", email: "admin@puragracia.org",    name: "Pastor / Administrador General", country: "GLOBAL", password: "admin123", role: "superadmin" },
    { id: "adm_pe",     email: "peru@puragracia.org",     name: "Administrador Perú",              country: "PE",     password: "admin123", role: "country_admin" },
    { id: "adm_co",     email: "colombia@puragracia.org", name: "Administrador Colombia",          country: "CO",     password: "admin123", role: "country_admin" },
    { id: "adm_mx",     email: "mexico@puragracia.org",   name: "Administrador México",            country: "MX",     password: "admin123", role: "country_admin" },
    { id: "adm_ar",     email: "argentina@puragracia.org",name: "Administrador Argentina",         country: "AR",     password: "admin123", role: "country_admin" }
  ]
};

// ─── Almacenamiento Local (localStorage) ──────────────────────────────────────
const PGStorage = {
  KEYS: {
    ACTIVE_COUNTRY:   "puraGracia.activeCountry",
    COUNTRIES:        "puraGracia.countries",
    PETICIONES:       "puraGracia.peticiones",
    ORANTES_MUNDIALES:"puraGracia.orantesMundiales",
    ADMINS:           "puraGracia.admins",
    ADMIN_SESSION:    "puraGracia.adminSession"
  },

  getCountries() {
    try { const s = localStorage.getItem(this.KEYS.COUNTRIES); if (s) return JSON.parse(s); } catch (e) {}
    this.saveCountries(PG_DEFAULTS.countries);
    return PG_DEFAULTS.countries;
  },
  saveCountries(c) { localStorage.setItem(this.KEYS.COUNTRIES, JSON.stringify(c)); },

  getActiveCountryCode() { return localStorage.getItem(this.KEYS.ACTIVE_COUNTRY) || ""; },
  setActiveCountryCode(code) { localStorage.setItem(this.KEYS.ACTIVE_COUNTRY, code); },
  getActiveCountry() {
    const countries = this.getCountries();
    const code = this.getActiveCountryCode() || PG_DEFAULTS.activeCountry;
    return countries[code] || countries["PE"] || PG_DEFAULTS.countries.PE;
  },

  getOrantesMundiales() {
    try { const s = localStorage.getItem(this.KEYS.ORANTES_MUNDIALES); if (s) return JSON.parse(s); } catch (e) {}
    this.saveOrantesMundiales(PG_DEFAULTS.orantesMundiales);
    return PG_DEFAULTS.orantesMundiales;
  },
  saveOrantesMundiales(list) { localStorage.setItem(this.KEYS.ORANTES_MUNDIALES, JSON.stringify(list)); },
  addOranteMundial(o) {
    const list = this.getOrantesMundiales();
    list.unshift(o);
    this.saveOrantesMundiales(list);
    return list;
  },

  getPeticiones() {
    try { const s = localStorage.getItem(this.KEYS.PETICIONES); if (s) return JSON.parse(s); } catch (e) {}
    const init = [
      { id: "p1", country: "PE", category: "Salud",   nombre: "Leonel", texto: "Por la salud y bienestar de toda mi familia en Lima.",      correo: "", telefono: "987654321", praysCount: 18, createdAt: new Date(Date.now() - 18e5).toISOString() },
      { id: "p2", country: "CO", category: "Salud",   nombre: "María",  texto: "Por la salud de mi mamá y paz en casa.",                    correo: "", telefono: "3001234567", praysCount: 12, createdAt: new Date(Date.now() - 36e5).toISOString() },
      { id: "p3", country: "PE", category: "Trabajo", nombre: "Andrés", texto: "Trabajo estable y sabiduría para emprender.",               correo: "", telefono: "987654321", praysCount: 8,  createdAt: new Date(Date.now() - 72e5).toISOString() }
    ];
    this.savePeticiones(init);
    return init;
  },
  savePeticiones(list) { localStorage.setItem(this.KEYS.PETICIONES, JSON.stringify(list)); },
  addPrayCount(id) {
    const list = this.getPeticiones();
    const item = list.find(p => p.id === id);
    if (item) { item.praysCount = (item.praysCount || 0) + 1; this.savePeticiones(list); return item.praysCount; }
    return 0;
  },

  getAdmins() {
    try { const s = localStorage.getItem(this.KEYS.ADMINS); if (s) return JSON.parse(s); } catch (e) {}
    this.saveAdmins(PG_DEFAULTS.admins);
    return PG_DEFAULTS.admins;
  },
  saveAdmins(a) { localStorage.setItem(this.KEYS.ADMINS, JSON.stringify(a)); },

  getAdminSession() {
    try { const s = sessionStorage.getItem(this.KEYS.ADMIN_SESSION); if (s) return JSON.parse(s); } catch (e) {}
    return null;
  },
  setAdminSession(admin) {
    if (!admin) { sessionStorage.removeItem(this.KEYS.ADMIN_SESSION); }
    else { sessionStorage.setItem(this.KEYS.ADMIN_SESSION, JSON.stringify(admin)); }
  }
};

// ─── Capa Firebase Firestore en Tiempo Real ───────────────────────────────────
const PGFirebase = {
  app: null,
  db: null,
  initialized: false,
  listeners: [],

  /**
   * Inicializa Firebase automáticamente si se han configurado credenciales en FIREBASE_CONFIG.
   */
  init() {
    const cfg = FIREBASE_CONFIG;
    if (!cfg || !cfg.apiKey || !cfg.projectId || cfg.apiKey === "TU_API_KEY") {
      console.info("ℹ️ Firebase: sin credenciales configuradas en js/firebase-config.js. Usando modo local.");
      return false;
    }
    try {
      if (typeof firebase === "undefined") {
        console.warn("⚠️ Firebase SDK no disponible en el navegador.");
        return false;
      }
      if (!firebase.apps.length) {
        this.app = firebase.initializeApp(cfg);
      } else {
        this.app = firebase.apps[0];
      }
      this.db = firebase.firestore();
      this.initialized = true;
      console.info("🔥 Firebase conectado exitosamente al proyecto:", cfg.projectId);
      return true;
    } catch (err) {
      console.error("❌ Error al inicializar Firebase:", err.message);
      this.initialized = false;
      return false;
    }
  },

  // ── Orantes Mundiales en tiempo real (Colección: 'orantes') ──────────────────
  subscribeOrantes(callback) {
    if (!this.initialized) return null;
    const unsub = this.db.collection("orantes")
      .orderBy("createdAt", "desc")
      .limit(50)
      .onSnapshot(snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(list);
      }, err => {
        console.warn("Firebase orantes snapshot warning:", err.message);
      });
    this.listeners.push(unsub);
    return unsub;
  },

  async addOrante(orante) {
    if (!this.initialized) return PGStorage.addOranteMundial(orante);
    try {
      await this.db.collection("orantes").add({
        ...orante,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) {
      console.warn("Error guardando orante en Firebase, usando local:", err.message);
      PGStorage.addOranteMundial(orante);
    }
  },

  // ── Peticiones en tiempo real (Colección: 'peticiones') ──────────────────────
  subscribePeticiones(callback) {
    if (!this.initialized) return null;
    const unsub = this.db.collection("peticiones")
      .orderBy("createdAt", "desc")
      .limit(100)
      .onSnapshot(snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(list);
      }, err => {
        console.warn("Firebase peticiones snapshot warning:", err.message);
      });
    this.listeners.push(unsub);
    return unsub;
  },

  async addPeticion(peticion) {
    if (!this.initialized) {
      const list = PGStorage.getPeticiones();
      list.unshift(peticion);
      PGStorage.savePeticiones(list);
      return;
    }
    try {
      await this.db.collection("peticiones").add({
        ...peticion,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (err) {
      console.warn("Error guardando petición en Firebase, usando local:", err.message);
      const list = PGStorage.getPeticiones();
      list.unshift(peticion);
      PGStorage.savePeticiones(list);
    }
  },

  async incrementPrayCount(peticionId) {
    if (!this.initialized) return PGStorage.addPrayCount(peticionId);
    try {
      await this.db.collection("peticiones").doc(peticionId).update({
        praysCount: firebase.firestore.FieldValue.increment(1)
      });
    } catch (err) {
      return PGStorage.addPrayCount(peticionId);
    }
  },

  unsubscribeAll() {
    this.listeners.forEach(fn => { try { fn(); } catch (e) {} });
    this.listeners = [];
  }
};

// Auto-inicializar al cargar
(function autoInit() {
  if (typeof firebase !== "undefined") {
    PGFirebase.init();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      if (typeof firebase !== "undefined") PGFirebase.init();
    });
  }
})();

// Exportar al ámbito global
window.FIREBASE_CONFIG = FIREBASE_CONFIG;
window.PG_DEFAULTS     = PG_DEFAULTS;
window.PGStorage       = PGStorage;
window.PGFirebase      = PGFirebase;
