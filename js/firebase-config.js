/**
 * Pura Gracia - Configuración y Capa de Datos Multi-País / Firebase
 */

const PG_DEFAULTS = {
  activeCountry: "CO",
  countries: {
    CO: {
      code: "CO",
      name: "Colombia",
      flag: "🇨🇴",
      currency: "COP",
      currencySymbol: "$",
      whatsapp: "573001112233",
      defaultAmounts: [20000, 50000, 100000],
      defaultAmountStep: 5000,
      minAmount: 5000,
      paymentMethods: [
        {
          id: "nequi",
          name: "Nequi",
          icon: "📱",
          account: "300 123 4567",
          holder: "Comunidad Pura Gracia Colombia",
          instructions: "Envía a través de Nequi al número indicado o escanea en la app."
        },
        {
          id: "daviplata",
          name: "Daviplata",
          icon: "💳",
          account: "300 123 4567",
          holder: "Comunidad Pura Gracia Colombia",
          instructions: "Transfiere desde Daviplata al número de celular."
        },
        {
          id: "bancolombia",
          name: "Bancolombia",
          icon: "🏦",
          account: "Ahorros # 123-456789-00",
          holder: "Iglesia Pura Gracia NIT: 900.123.456-1",
          instructions: "Transferencia directa o consignación nacional."
        }
      ],
      cities: ["Bogotá", "Medellín", "Cali", "Barranquilla"],
      reuniones: [
        {
          id: "r_co_1",
          country: "CO",
          city: "Bogotá",
          titulo: "Oración en el parque",
          fecha: "2026-09-06",
          hora: "7:00 p. m.",
          lugar: "Parque de los Novios, Bogotá",
          lat: 4.6686,
          lng: -74.064
        },
        {
          id: "r_co_2",
          country: "CO",
          city: "Bogotá",
          titulo: "Noche de intercesión",
          fecha: "2026-09-13",
          hora: "6:30 p. m.",
          lugar: "Salón comunal La Soledad, Bogotá",
          lat: 4.647,
          lng: -74.072
        },
        {
          id: "r_co_3",
          country: "CO",
          city: "Bogotá",
          titulo: "Mañana de alabanza",
          fecha: "2026-09-20",
          hora: "9:00 a. m.",
          lugar: "Plazoleta Lourdes, Bogotá",
          lat: 4.6548,
          lng: -74.0622
        }
      ]
    },
    PE: {
      code: "PE",
      name: "Perú",
      flag: "🇵🇪",
      currency: "PEN",
      currencySymbol: "S/.",
      whatsapp: "51987654321",
      defaultAmounts: [20, 50, 100],
      defaultAmountStep: 10,
      minAmount: 5,
      paymentMethods: [
        {
          id: "yape",
          name: "Yape",
          icon: "🟣",
          account: "987 654 321",
          holder: "Pura Gracia Perú",
          instructions: "Yapea directo al número o mediante código QR."
        },
        {
          id: "plin",
          name: "Plin",
          icon: "🔵",
          account: "987 654 321",
          holder: "Pura Gracia Perú",
          instructions: "Transfiere por Plin desde BBVA, Interbank o Scotiabank."
        },
        {
          id: "bcp",
          name: "BCP Soles",
          icon: "🏦",
          account: "193-98765432-0-12 (CCI: 0021930098765432012)",
          holder: "Asociación Pura Gracia",
          instructions: "Transferencia BCP o interbancaria en Soles."
        }
      ],
      cities: ["Lima", "Arequipa", "Trujillo", "Cusco"],
      reuniones: [
        {
          id: "r_pe_1",
          country: "PE",
          city: "Lima",
          titulo: "Oración en el Malecón",
          fecha: "2026-09-07",
          hora: "7:00 p. m.",
          lugar: "Parque del Amor, Miraflores, Lima",
          lat: -12.1245,
          lng: -77.037
        },
        {
          id: "r_pe_2",
          country: "PE",
          city: "Lima",
          titulo: "Clamor por las Familias",
          fecha: "2026-09-14",
          hora: "6:30 p. m.",
          lugar: "Campo de Marte, Jesús María, Lima",
          lat: -12.0716,
          lng: -77.0428
        }
      ]
    },
    MX: {
      code: "MX",
      name: "México",
      flag: "🇲🇽",
      currency: "MXN",
      currencySymbol: "$",
      whatsapp: "525512345678",
      defaultAmounts: [100, 250, 500],
      defaultAmountStep: 50,
      minAmount: 50,
      paymentMethods: [
        {
          id: "spei",
          name: "Transferencia SPEI",
          icon: "🏦",
          account: "CLABE: 012180001234567890",
          holder: "Pura Gracia México A.C.",
          instructions: "Transferencia electrónica interbancaria sin comisión."
        },
        {
          id: "oxxo",
          name: "Depósito OXXO",
          icon: "🏪",
          account: "Tarjeta: 4152 3138 9012 3456",
          holder: "Pura Gracia México",
          instructions: "Deposita en cualquier tienda OXXO del país."
        },
        {
          id: "bbva_mx",
          name: "BBVA Bancomer",
          icon: "💳",
          account: "Cuenta: 0123456789",
          holder: "Pura Gracia México",
          instructions: "Depósito en ventanilla o cajero practicaja."
        }
      ],
      cities: ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla"],
      reuniones: [
        {
          id: "r_mx_1",
          country: "MX",
          city: "Ciudad de México",
          titulo: "Encuentro de Fe y Gratitud",
          fecha: "2026-09-08",
          hora: "7:00 p. m.",
          lugar: "Parque México, Condesa, CDMX",
          lat: 19.4124,
          lng: -99.1698
        }
      ]
    },
    AR: {
      code: "AR",
      name: "Argentina",
      flag: "🇦🇷",
      currency: "ARS",
      currencySymbol: "$",
      whatsapp: "5491123456789",
      defaultAmounts: [5000, 10000, 25000],
      defaultAmountStep: 1000,
      minAmount: 1000,
      paymentMethods: [
        {
          id: "mp_ar",
          name: "Mercado Pago",
          icon: "💙",
          account: "CVU: 0000003100012345678901 / Alias: puragracia.mp",
          holder: "Pura Gracia Argentina",
          instructions: "Envía dinero por Mercado Pago usando el Alias o CVU."
        },
        {
          id: "cbu_ar",
          name: "Cuenta Bancaria (CBU)",
          icon: "🏦",
          account: "CBU: 0720123488000012345678 / Alias: PURA.GRACIA.BANCO",
          holder: "Asociación Pura Gracia",
          instructions: "Transferencia bancaria inmediata."
        }
      ],
      cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
      reuniones: [
        {
          id: "r_ar_1",
          country: "AR",
          city: "Buenos Aires",
          titulo: "Oración al aire libre",
          fecha: "2026-09-09",
          hora: "6:30 p. m.",
          lugar: "Rosedal de Palermo, Buenos Aires",
          lat: -34.5711,
          lng: -58.4173
        }
      ]
    },
    US: {
      code: "US",
      name: "Internacional / EE.UU.",
      flag: "🌎",
      currency: "USD",
      currencySymbol: "$",
      whatsapp: "13051234567",
      defaultAmounts: [15, 30, 75],
      defaultAmountStep: 5,
      minAmount: 5,
      paymentMethods: [
        {
          id: "zelle",
          name: "Zelle",
          icon: "⚡",
          account: "donate@puragracia.org",
          holder: "Pure Grace Community Inc.",
          instructions: "Send directly through your bank's Zelle feature with no fees."
        },
        {
          id: "paypal",
          name: "PayPal",
          icon: "🅿️",
          account: "paypal.me/puragracia",
          holder: "Pura Gracia International",
          instructions: "Dona de forma segura con tarjeta de crédito o saldo PayPal."
        }
      ],
      cities: ["Miami", "Orlando", "Houston", "Internacional Online"],
      reuniones: [
        {
          id: "r_us_1",
          country: "US",
          city: "Miami",
          titulo: "Bilingual Prayer Gathering",
          fecha: "2026-09-10",
          hora: "7:00 p. m.",
          lugar: "Bayfront Park, Miami, FL",
          lat: 25.7753,
          lng: -80.1866
        }
      ]
    }
  },
  admins: [
    {
      id: "adm_global",
      email: "admin@puragracia.org",
      name: "Pastor / Administrador General",
      country: "GLOBAL",
      password: "admin123",
      role: "superadmin"
    },
    {
      id: "adm_co",
      email: "colombia@puragracia.org",
      name: "Líder Colombia",
      country: "CO",
      password: "admin123",
      role: "country_admin"
    },
    {
      id: "adm_pe",
      email: "peru@puragracia.org",
      name: "Líder Perú",
      country: "PE",
      password: "admin123",
      role: "country_admin"
    },
    {
      id: "adm_mx",
      email: "mexico@puragracia.org",
      name: "Líder México",
      country: "MX",
      password: "admin123",
      role: "country_admin"
    },
    {
      id: "adm_ar",
      email: "argentina@puragracia.org",
      name: "Líder Argentina",
      country: "AR",
      password: "admin123",
      role: "country_admin"
    },
    {
      id: "adm_us",
      email: "usa@puragracia.org",
      name: "Líder USA / Global",
      country: "US",
      password: "admin123",
      role: "country_admin"
    }
  ],
  firebase: {
    enabled: false,
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};

const PGStorage = {
  KEYS: {
    COUNTRIES: "puraGracia.countries",
    ACTIVE_COUNTRY: "puraGracia.activeCountry",
    PETICIONES: "puraGracia.peticiones",
    ORANTES: "puraGracia.orantes",
    ADMINS: "puraGracia.admins",
    ADMIN_SESSION: "puraGracia.adminSession",
    FIREBASE_CONFIG: "puraGracia.firebaseConfig"
  },

  getCountries() {
    try {
      const stored = localStorage.getItem(this.KEYS.COUNTRIES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error leyendo países:", e);
    }
    this.saveCountries(PG_DEFAULTS.countries);
    return PG_DEFAULTS.countries;
  },

  saveCountries(countries) {
    localStorage.setItem(this.KEYS.COUNTRIES, JSON.stringify(countries));
  },

  getActiveCountryCode() {
    return localStorage.getItem(this.KEYS.ACTIVE_COUNTRY) || PG_DEFAULTS.activeCountry;
  },

  setActiveCountryCode(code) {
    localStorage.setItem(this.KEYS.ACTIVE_COUNTRY, code);
  },

  getActiveCountry() {
    const countries = this.getCountries();
    const code = this.getActiveCountryCode();
    return countries[code] || countries["CO"] || PG_DEFAULTS.countries.CO;
  },

  getFirebaseConfig() {
    try {
      const stored = localStorage.getItem(this.KEYS.FIREBASE_CONFIG);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return PG_DEFAULTS.firebase;
  },

  saveFirebaseConfig(config) {
    localStorage.setItem(this.KEYS.FIREBASE_CONFIG, JSON.stringify(config));
  },

  getAdmins() {
    try {
      const stored = localStorage.getItem(this.KEYS.ADMINS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    this.saveAdmins(PG_DEFAULTS.admins);
    return PG_DEFAULTS.admins;
  },

  saveAdmins(admins) {
    localStorage.setItem(this.KEYS.ADMINS, JSON.stringify(admins));
  },

  getAdminSession() {
    try {
      const s = sessionStorage.getItem(this.KEYS.ADMIN_SESSION);
      if (s) return JSON.parse(s);
    } catch (e) {}
    return null;
  },

  setAdminSession(admin) {
    if (!admin) {
      sessionStorage.removeItem(this.KEYS.ADMIN_SESSION);
    } else {
      sessionStorage.setItem(this.KEYS.ADMIN_SESSION, JSON.stringify(admin));
    }
  },

  getPeticiones() {
    try {
      const stored = localStorage.getItem(this.KEYS.PETICIONES);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    const initial = [
      { id: "p1", country: "CO", category: "Salud", nombre: "María", texto: "Por la salud de mi mamá y paz en casa.", correo: "", telefono: "3001234567", praysCount: 12, createdAt: new Date(Date.now() - 36e5).toISOString() },
      { id: "p2", country: "PE", category: "Trabajo", nombre: "Andrés", texto: "Trabajo estable y sabiduría para emprender.", correo: "", telefono: "987654321", praysCount: 8, createdAt: new Date(Date.now() - 72e5).toISOString() },
      { id: "p3", country: "CO", category: "Familia", nombre: "Lucía", texto: "Por mi hijo, que encuentre camino y consuelo.", correo: "", telefono: "", praysCount: 15, createdAt: new Date(Date.now() - 108e5).toISOString() },
      { id: "p4", country: "MX", category: "Gratitud", nombre: "Camilo", texto: "Gratitud por la provisión. Oración por mi ciudad.", correo: "", telefono: "", praysCount: 5, createdAt: new Date(Date.now() - 144e5).toISOString() },
      { id: "p5", country: "AR", category: "Salud", nombre: "Elena", texto: "Sanidad y fuerzas para este tratamiento médico.", correo: "", telefono: "", praysCount: 20, createdAt: new Date(Date.now() - 180e5).toISOString() },
      { id: "p6", country: "US", category: "Paz", nombre: "Sofía", texto: "Protección en el viaje y unidad espiritual.", correo: "", telefono: "", praysCount: 7, createdAt: new Date(Date.now() - 216e5).toISOString() }
    ];
    this.savePeticiones(initial);
    return initial;
  },

  savePeticiones(list) {
    localStorage.setItem(this.KEYS.PETICIONES, JSON.stringify(list));
  },

  addPrayCount(peticionId) {
    const list = this.getPeticiones();
    const item = list.find(p => p.id === peticionId);
    if (item) {
      item.praysCount = (item.praysCount || 0) + 1;
      this.savePeticiones(list);
      return item.praysCount;
    }
    return 0;
  }
};

window.PG_DEFAULTS = PG_DEFAULTS;
window.PGStorage = PGStorage;
