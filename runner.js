// =============================================================
// runner.js
// Botón "Ejecutar demo" + autoplay por pasos.
// Versión simple y robusta. Loguea en consola para debug.
// =============================================================

// Delay fijo entre pasos (ms). Subilo/bajalo a gusto.
const STEP_DELAY = 1800;

let running = false;
let timeoutId = null;

const log = (...a) => console.log('[runner]', ...a);

/** Devuelve los .step actualmente renderizados. */
function getSteps() {
  return Array.from(document.querySelectorAll('#steps .step'));
}

/** Índice del paso activo. */
function getActiveIdx() {
  return getSteps().findIndex((el) => el.classList.contains('active'));
}

/** Click sobre el paso `i`. */
function clickStep(i) {
  const steps = getSteps();
  if (i >= 0 && i < steps.length && steps[i]) {
    log('click step', i);
    steps[i].click();
  }
}

/** Pinta el botón según estado. */
function paintButton(btn, mode) {
  const label = btn.querySelector('.run-label');
  const icon = btn.querySelector('.run-icon');
  btn.classList.remove('running', 'done');
  document.body.classList.remove('is-running');

  if (mode === 'running') {
    btn.classList.add('running');
    document.body.classList.add('is-running');
    if (icon) icon.textContent = '■';
    if (label) label.textContent = 'Detener';
  } else if (mode === 'done') {
    btn.classList.add('done');
    if (icon) icon.textContent = '↻';
    if (label) label.textContent = 'Reiniciar';
  } else {
    if (icon) icon.textContent = '▶';
    if (label) label.textContent = 'Ejecutar demo';
  }
}

/** Loop recursivo con setTimeout. */
function tick(btn) {
  if (!running) return;
  const steps = getSteps();
  const cur = getActiveIdx();

  log('tick · paso actual:', cur, 'total:', steps.length);

  if (cur === -1 || cur >= steps.length - 1) {
    running = false;
    paintButton(btn, 'done');
    log('terminado');
    return;
  }

  clickStep(cur + 1);
  timeoutId = setTimeout(() => tick(btn), STEP_DELAY);
}

/** Empieza la demo. */
function start(btn) {
  if (running) return;
  log('start');

  const steps = getSteps();
  if (steps.length === 0) {
    log('ERROR: no hay pasos en el stepper');
    alert('No se encontraron pasos. Recargá la página.');
    return;
  }

  if (getActiveIdx() === steps.length - 1) {
    clickStep(0);
    setTimeout(() => realStart(btn), 300);
  } else {
    realStart(btn);
  }
}

function realStart(btn) {
  running = true;
  paintButton(btn, 'running');
  timeoutId = setTimeout(() => tick(btn), STEP_DELAY);
}

/** Detiene la demo. */
function stop(btn) {
  log('stop');
  running = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  const steps = getSteps();
  const done = steps.length > 0 && getActiveIdx() === steps.length - 1;
  paintButton(btn, done ? 'done' : 'idle');
}

/** Inyecta el botón en la top bar. */
function injectButton() {
  const top = document.querySelector('.top');
  const themeBtn = document.getElementById('themeToggle');

  if (!top) {
    log('ERROR: no se encontró .top');
    return null;
  }

  let btn = document.getElementById('runBtn');
  if (btn) {
    log('botón ya existe, lo reuso');
    return btn;
  }

  btn = document.createElement('button');
  btn.id = 'runBtn';
  btn.type = 'button';
  btn.className = 'run-btn';
  btn.setAttribute('aria-label', 'Ejecutar la demo');
  btn.innerHTML = '<span class="run-icon">▶</span><span class="run-label">Ejecutar demo</span>';

  if (themeBtn) {
    top.insertBefore(btn, themeBtn);
  } else {
    top.appendChild(btn);
  }

  log('botón inyectado');
  return btn;
}

/** Init con reintentos por si app.js no terminó. */
function init(attempt = 0) {
  log('init · intento', attempt);

  const btn = injectButton();
  if (!btn) {
    if (attempt < 10) setTimeout(() => init(attempt + 1), 200);
    return;
  }

  const steps = getSteps();
  log('pasos encontrados:', steps.length);

  if (steps.length === 0 && attempt < 10) {
    setTimeout(() => init(attempt + 1), 200);
    return;
  }

  btn.addEventListener('click', () => {
    log('click en botón. running=', running);
    if (running) stop(btn);
    else start(btn);
  });

  const stepsContainer = document.getElementById('steps');
  if (stepsContainer) {
    stepsContainer.addEventListener('click', (e) => {
      if (running && e.target.closest('.step')) {
        log('click manual en stepper, deteniendo');
        stop(btn);
      }
    }, true);
  }

  document.querySelectorAll('.tab').forEach((t) => {
    t.addEventListener('click', () => {
      if (running) {
        log('cambio de tab, deteniendo');
        stop(btn);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === ' ') {
      e.preventDefault();
      if (running) stop(btn);
      else start(btn);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Escape') {
      if (running) stop(btn);
    }
  });

  log('listo ✓');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
} else {
  init();
}
