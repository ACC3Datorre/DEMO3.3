# Copilot Studio Demo · Agente Comité Ejecutivo

Demo interactiva en una sola página que muestra dos vistas complementarias del mismo caso:

1. **Configuración en Copilot Studio** — paso a paso de cómo se arma el agente.
2. **Vista usuario final** — cómo se ve el resultado en Microsoft Teams.

Sin frameworks, sin build step. Solo HTML + CSS + JavaScript con módulos ES6.

---

## Estructura

```
proyecto/
├── index.html        # solo HTML
├── css/
│   └── styles.css    # estilos + dark mode + responsive
├── js/
│   ├── app.js        # lógica principal + wireEvents()
│   ├── data.js       # configSteps, bizSteps, NAV_ITEMS
│   ├── theme.js      # dark/light mode (localStorage + prefers-color-scheme)
│   └── utils.js      # helpers ($id, $$, sleep, clamp)
├── README.md
└── .gitignore
```

---

## Deploy en GitHub Pages

1. Crear un repositorio nuevo en GitHub y pushear el contenido de esta carpeta.
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```
2. En el repo, ir a **Settings → Pages**.
3. En **Source**, seleccionar:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click en **Save**.
5. GitHub publica el sitio en `https://<tu-usuario>.github.io/<tu-repo>/` (puede tardar 1-2 minutos la primera vez).

Todas las rutas del proyecto son **relativas** (`css/styles.css`, `js/app.js`, etc.), así que funciona tanto en la raíz del dominio como en un subpath de GitHub Pages sin tener que cambiar nada.

---

## Probar en local

> ⚠️ **No funciona haciendo doble click en `index.html`.** El proyecto usa módulos ES6 (`import`/`export`), y los navegadores bloquean los módulos sobre `file://` por la política CORS. Vas a ver un error en la consola y la página queda en blanco.

Hay que servirlo sobre HTTP. Cualquiera de estas opciones funciona:

**Python** (no requiere instalar nada extra si ya tenés Python 3):
```bash
python -m http.server 8000
# abrir http://localhost:8000
```

**Node** (sin instalar globalmente):
```bash
npx serve .
# o
npx http-server .
```

**VS Code**: instalar la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) y click derecho sobre `index.html` → *Open with Live Server*.

Una vez en GitHub Pages el proyecto se sirve por HTTPS, así que CORS no es un problema y los módulos cargan sin issues.

---

## Features

- **Dark / light mode** con toggle en la barra superior. Persiste la elección en `localStorage` y respeta `prefers-color-scheme` del sistema operativo cuando no hay elección manual.
- **Responsive**: layout adaptado para tablet (≤1180px) y mobile (≤768px). En mobile el stepper pasa a una fila scrolleable arriba.
- **Atajos de teclado**:
  - `←` / `→` para navegar entre pasos
  - `Esc` para volver al primer paso
  - `Enter` / `Espacio` sobre un paso del stepper para activarlo
- **Animaciones de entrada** suaves al cargar y al cambiar de paso. Respeta `prefers-reduced-motion`.
- **Micro-interacciones**: elevación sutil + sombra de marca al hacer hover sobre botones primarios.

---

## Agregar un paso nuevo

Toda la data está centralizada en `js/data.js`. Para agregar un paso al builder de Copilot Studio:

```js
// js/data.js
export const configSteps = [
  // ...pasos existentes,
  {
    t: 'Mi paso nuevo',
    s: 'Subtítulo corto',
    nav: 'Test',           // qué item del nav se resalta
    html: () => `<h1 class="section-title">Contenido</h1>...`
  }
];
```

Para agregar un mensaje a la vista de usuario final, lo mismo en `bizSteps`. La UI se reconstruye sola — no hay que tocar nada más.
