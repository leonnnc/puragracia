# 🙏 Pura Gracia · Plataforma Web de Oración Comunitaria & Altar Mundial

Una plataforma web interactiva y moderna para comunidades de fe, intercesión global en tiempo real y administración pastoral multi-país.

---

## 🌟 Características Principales

### 1. 📜 Pizarra Comunitaria de Peticiones
* **Publicación rápida**: Los usuarios pueden dejar sus peticiones clasificadas por categoría (*Salud, Familia, Trabajo, Gratitud, Paz*).
* **Contador de oración (`🙏 Me uno a orar`)**: Cada visitante puede sumarse en intercesión y aumentar el contador de apoyo en tiempo real.
* **Respuesta pastoral**: Opción de dejar WhatsApp o correo para recibir una reflexión personalizada.

### 2. 🌎 Detección Automática de País y Moneda
* Detecta automáticamente el país del visitante por zona horaria, idioma e IP:
  * 🇵🇪 **Perú** (Soles `PEN S/.` · Yape, Plin, BCP)
  * 🇨🇴 **Colombia** (Pesos `COP $` · Nequi, Daviplata, Bancolombia)
  * 🇲🇽 **México** (Pesos `MXN $` · SPEI, OXXO)
  * 🇦🇷 **Argentina** (Pesos `ARS $` · Mercado Pago)
  * 🌎 **Internacional / EE.UU.** (Dólares `USD $` · Zelle)
* Ajusta automáticamente las sugerencias de ofrenda y cuentas bancarias locales.

### 3. 🕊️ Altar Mundial de Oración (Plano de la Tierra en Pantalla Completa)
* **Ingreso en 2 Pasos**: Formulario inicial limpio y apertura de **Modal Fullscreen Inmersivo** al conectarse.
* **Mapa Mundial Libre de Marcas de Agua**: Utiliza capas oficiales de OpenStreetMap con visualización mundial de extremo a extremo.
* **Puntos Pulsantes en Vivo**: Cada intercesor brilla en el mapa con su nombre, bandera, ciudad y solicitud exacta de oración.
* **🎙️ Podio de Voz y Micrófono en Vivo**:
  * Cualquier intercesor puede pedir el micrófono para guiar la oración de la congregación mundial.
  * Captura de micrófono real del navegador (`getUserMedia`) con onda sonora / ecualizador animado.
  * Botón para oyentes: `🔊 Escuchar Oración en Vivo`.
* **⏱️ Temporizador Estricto de 5 Minutos por Ponente**:
  * Cronómetro visible de `05:00` a `00:00` con barra de progreso.
  * **Pase automático de turno**: Al agotarse los 5 minutos, el micrófono pasa automáticamente al siguiente hermano en la fila de espera y la cámara del mapa vuela hacia su ubicación.
  * **Fila de espera interactiva (`👥 Fila`)**: Los participantes pueden ver su posición en la fila y el tiempo estimado para su turno.

### 4. 🎛️ CPanel Administrativo Privado (`/admin.html` o `/admin`)
Acceso protegido exclusivo mediante URL directa (sin botones visibles en la web pública):
* 👥 **1. Administradores**: Creación y gestión de administradores globales o asignados a un país específico.
* 📜 **2. Peticiones de Oración**: Moderación de notas, filtrado por categorías y envío de respuestas pastorales directas a WhatsApp.
* 🌐 **3. Países & Sedes**: Gestión de ciudades, WhatsApp de contacto y programación de reuniones de oración con coordenadas GPS en el mapa.
* 💳 **4. Cuentas Donación**: Configuración de números de cuenta, titulares e instrucciones de depósito por país.

---

## 📁 Estructura del Proyecto

```text
puraGracia/
├── index.html              # Página web pública principal y Altar Mundial
├── admin.html              # CPanel de administración privado
├── admin/
│   └── index.html          # Redirección amigable (/admin -> /admin.html)
├── css/
│   ├── styles.css          # Estilos de la web pública, modal fullscreen y podio de voz
│   └── admin.css           # Estilos del panel de control CPanel
├── js/
│   ├── firebase-config.js  # Credenciales de Firebase y capa de datos unificada
│   ├── app.js              # Controlador del frontend, mapa Leaflet y motor de voz
│   └── admin.js            # Controlador del panel de administración CPanel
├── .gitignore              # Archivos y carpetas ignorados por Git
└── README.md               # Documentación completa de instalación y despliegue
```

---

## 🚀 Guía de Despliegue e Instalación

El proyecto está desarrollado con **HTML5, CSS3 moderno y Vanilla JavaScript** (sin necesidad de compiladores complejos como Webpack o Vite), lo que permite implementarlo en **cualquier servidor o hosting en minutos**.

### Opción 1: Servidor Local (Para Pruebas)

#### Con Python:
```bash
# Python 3
python -m http.server 8080
```
Abre en tu navegador: `http://localhost:8080`

#### Con Node.js:
```bash
npx serve -p 8080 .
```

---

### Opción 2: Despliegue en Vercel (Recomendado - Gratis)

1. Sube tu proyecto a GitHub (o usa tu repositorio actual).
2. Entra a [https://vercel.com/](https://vercel.com/) e inicia sesión con GitHub.
3. Haz clic en **"Add New Project"** y selecciona el repositorio `puragracia`.
4. En **Framework Preset**, selecciona **Other** (o déjalo por defecto).
5. Haz clic en **"Deploy"**. ¡Tu web estará lista con HTTPS y dominio gratuito en segundos!

---

### Opción 3: Despliegue en Netlify (Gratis)

1. Entra a [https://www.netlify.com/](https://www.netlify.com/).
2. Haz clic en **"Add new site" > "Import an existing project"** y conecta tu GitHub.
3. En Build command deja vacío y en Publish directory coloca `.`.
4. Haz clic en **"Deploy site"**.

---

### Opción 4: Despliegue en Firebase Hosting

1. Instala Firebase Tools en tu terminal:
   ```bash
   npm install -g firebase-tools
   ```
2. Inicia sesión en Firebase:
   ```bash
   firebase login
   ```
3. Inicializa el hosting en la carpeta del proyecto:
   ```bash
   firebase init hosting
   ```
   * Selecciona tu proyecto existente: `puragracia-da17c`.
   * Public directory: `.` (la carpeta raíz).
   * Configure as a single-page app: `No`.
4. Despliega la web:
   ```bash
   firebase deploy --only hosting
   ```

---

### Opción 5: Hosting Tradicional con cPanel / Apache / Nginx

1. Comprime los archivos del proyecto en un archivo `.zip`.
2. Ingresa al Administrador de Archivos de tu cPanel o conéctate vía FTP (FileZilla).
3. Sube y extrae el contenido dentro de la carpeta `public_html/`.
4. ¡Listo! La web estará disponible de inmediato en tu dominio.

---

## 🔥 Conexión y Configuración de Firebase Firestore

La aplicación ya cuenta con las librerías de Firebase SDK integradas.

### 1. Ubicación de las Credenciales
Las credenciales del proyecto se configuran directamente en el archivo **`js/firebase-config.js`**:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA73w4hd6FAru3BQZKM2F6B0CnNb9HkbfI",
  authDomain: "puragracia-da17c.firebaseapp.com",
  projectId: "puragracia-da17c",
  storageBucket: "puragracia-da17c.firebasestorage.app",
  messagingSenderId: "1039612656582",
  appId: "1:1039612656582:web:9628ce35d596584f59d0c7"
};
```

### 2. Reglas de Seguridad de Firestore Database
Para permitir que los usuarios lean y escriban peticiones y orantes en tiempo real:

1. Ve a [Firebase Console](https://console.firebase.google.com/) > Tu Proyecto > **Firestore Database** > Pestaña **Reglas**.
2. Pega la siguiente configuración y presiona **Publicar**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Colecciones Utilizadas en Firestore
* `peticiones`: Almacena las peticiones de oración enviadas desde el formulario.
* `orantes`: Almacena los intercesores conectados al mapa mundial en tiempo real.

*(Nota: Si no hay conexión a internet o no se configuran credenciales, el sistema cuenta con un fallback automático a `localStorage` para no interrumpir la experiencia).*

---

## 🔑 Accesos por Defecto al CPanel

| Rol | Correo Electrónico | Contraseña | Alcance |
| :--- | :--- | :--- | :--- |
| **SuperAdmin Global** | `admin@puragracia.org` | `admin123` | Acceso a todos los países y configuración total |
| **Admin Perú** | `peru@puragracia.org` | `admin123` | Exclusivo para gestión en Perú (PE) |
| **Admin Colombia** | `colombia@puragracia.org` | `admin123` | Exclusivo para gestión en Colombia (CO) |
| **Admin México** | `mexico@puragracia.org` | `admin123` | Exclusivo para gestión en México (MX) |
| **Admin Argentina** | `argentina@puragracia.org` | `admin123` | Exclusivo para gestión en Argentina (AR) |

> 💡 *Puedes crear nuevos administradores y cambiar contraseñas directamente desde la pestaña **1. Administradores** dentro del CPanel.*

---

## 🛠️ Tecnologías y Librerías Utilizadas

* **HTML5 Semántico & Accesibilidad Web (a11y)**.
* **CSS3 Moderno**: CSS Grid, Flexbox, Glassmorphism con `backdrop-filter`, variables CSS y animaciones `@keyframes`.
* **JavaScript ES6+**: Asincronía con `async/await`, Web Audio API (`AudioContext`, `AnalyserNode`) y MediaDevices API (`getUserMedia`).
* **Leaflet.js (v1.9.4)**: Renderizado de mapas interactivos y marcadores pulsantes con capas libres de OpenStreetMap.
* **Firebase SDK v10 (App & Firestore)**: Base de datos NoSQL reactiva en tiempo real con listeners `onSnapshot`.
* **Google Fonts**: Fuentes tipográficas *Outfit*, *Playfair Display* y *Caveat*.

---

## 📄 Licencia

Este proyecto está disponible para la comunidad de **Pura Gracia** con fines ministeriales y comunitarios de fe y oración.
