// =============================================================
// theme.js
// Manejo de dark / light mode.
//
// Prioridad:
//   1. Lo guardado por el usuario en localStorage (si existe).
//   2. La preferencia del sistema operativo (prefers-color-scheme).
//   3. Default: light.
//
// El tema se aplica como atributo `data-theme="dark"` en <html>.
// El CSS define las variables base (light) en :root y los overrides
// para dark bajo `[data-theme="dark"]`, sin duplicar reglas.
// =============================================================

const STORAGE_KEY = 'demo-theme';
const root = document.documentElement;

/** Devuelve 'dark' si el SO lo prefiere, 'light' si no. */
function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Lee el tema preferido (storage > sistema > light). */
function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return systemPrefersDark() ? 'dark' : 'light';
}

/** Aplica el tema al DOM y actualiza el botón toggle si existe. */
function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  }
}

/** Alterna entre dark/light, guardando la elección del usuario. */
export function toggleTheme() {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
}

/** Inicializa el tema y se suscribe a cambios del SO (si el usuario no eligió manualmente). */
export function initTheme() {
  applyTheme(getPreferredTheme());

  // Si el usuario no fijó preferencia, seguimos los cambios del sistema en vivo.
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  };
  // addEventListener moderno; fallback no es necesario en navegadores que soportan ES modules.
  mq.addEventListener('change', handler);
}
