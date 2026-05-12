// =============================================================
// app.js
// Lógica principal de la demo + wiring de eventos.
// =============================================================

import { configSteps, bizSteps, NAV_ITEMS } from './data.js';
import { $id, $$ } from './utils.js';
import { initTheme, toggleTheme } from './theme.js';

// -------------------------------------------------------------
// Estado
// -------------------------------------------------------------
const state = {
  tab: 'config', // 'config' | 'business'
  idx: 0
};

// -------------------------------------------------------------
// Helpers de render
// -------------------------------------------------------------

/** Devuelve el array de pasos según la tab activa. */
function currentSteps() {
  return state.tab === 'config' ? configSteps : bizSteps;
}

/** HTML del builder de Copilot Studio (tab "config"). */
function shell(inner) {
  const navHtml = NAV_ITEMS
    .map((x) => `<div class="navitem ${x === configSteps[state.idx].nav ? 'on' : ''}">${x}</div>`)
    .join('');

  return `
    <div class="builder-head">
      <b>Copilot Studio</b>
      <div>
        <button class="btn">Save</button>
        <button class="btn primary">Publish</button>
      </div>
    </div>
    <div class="grid">
      <div class="nav">${navHtml}</div>
      <div class="work fade">
        ${inner}
        <div class="preview">
          <div class="ph">Test your agent</div>
          <div class="pb">
            Prepará el brief del comité ejecutivo de esta semana.<br><br>
            <span class="kbd">El agente responderá con fuentes y aclaraciones.</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-controls">
      <button class="btn" data-action="prev">← Anterior</button>
      <div class="progress">Paso ${state.idx + 1} de ${configSteps.length}</div>
      <button class="btn primary" data-action="next">Siguiente →</button>
    </div>`;
}

/** HTML del mockup de Teams (tab "business"). */
function teamsShell(msgs) {
  const timeline = bizSteps
    .map((s, i) => {
      const cls = i < state.idx ? 'done' : i === state.idx ? 'on' : '';
      const icon = i < state.idx ? '✓' : i + 1;
      return `
        <div class="titem ${cls}">
          <div class="tdot">${icon}</div>
          <div><b>${s.t}</b><br>${s.s}</div>
        </div>`;
    })
    .join('');

  return `
    <div class="card teams">
      <div class="teams-head">
        <b>Microsoft Teams</b>
        <span class="pill">Copilot agent</span>
      </div>
      <div class="teams-body">
        <div class="rail">
          <div>💬</div>
          <div class="on">🤖</div>
          <div>📁</div>
          <div>📅</div>
        </div>
        <div class="chatlist">
          <h3 style="font-size:14px;margin:4px 0 12px">Chats</h3>
          <div class="chatitem on">
            <b>Preparador de Comité</b>
            <div class="small">Brief semanal listo</div>
          </div>
          <div class="chatitem">
            <b>CFO Office</b>
            <div class="small">Equipo</div>
          </div>
        </div>
        <div class="chat">
          <div class="chat-title">Preparador de Comité Ejecutivo</div>
          <div class="messages fade">${msgs}</div>
        </div>
      </div>
    </div>
    <div class="right-panel">
      <div class="card mini">
        <h3>Qué ve el usuario</h3>
        <div class="timeline">${timeline}</div>
      </div>
      <div class="card mini">
        <h3>Límites reales</h3>
        <div class="small">
          El agente resume información disponible, muestra fuentes y pide confirmación antes de enviar.
          No decide ni inventa datos faltantes.
        </div>
      </div>
    </div>`;
}

/** Actualiza el contador "Fase X / Y · Nombre" y el status sutil del agente. */
function updateMeta() {
  const steps = currentSteps();
  const cur = state.idx;
  const total = steps.length;
  const name = steps[cur] ? steps[cur].t : '';

  // Contador "Fase X / Y · Nombre"
  let meta = $id('phaseMeta');
  if (!meta) {
    const bar = document.querySelector('.progress-bar');
    if (bar) {
      meta = document.createElement('div');
      meta.id = 'phaseMeta';
      meta.className = 'phase-meta';
      bar.parentNode.insertBefore(meta, bar);
    }
  }
  if (meta) {
    meta.innerHTML = `
      <span class="pm-count">Fase <b>${cur + 1}</b> <span class="pm-sep">/</span> <b>${total}</b></span>
      <span class="pm-dot"></span>
      <span class="pm-name">${name}</span>
      <span class="pm-status" id="phaseStatus">Listo</span>
    `;
  }
}

/** Repinta toda la UI según el estado actual. */
function render() {
  // Tabs
  $$('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === state.tab));

  // Stepper lateral. Cada paso tiene data-step para el handler delegado.
  const steps = currentSteps();
  $id('steps').innerHTML = steps
    .map((s, i) => {
      const cls = `${i === state.idx ? 'active' : ''} ${i < state.idx ? 'done' : ''}`.trim();
      const icon = i < state.idx ? '✓' : i + 1;
      return `
        <div class="step ${cls}" data-step="${i}" role="button" tabindex="0">
          <div class="num">${icon}</div>
          <div><b>${s.t}</b><span>${s.s}</span></div>
        </div>`;
    })
    .join('');

  // Mostrar la vista correspondiente
  $id('configView').classList.toggle('hidden', state.tab !== 'config');
  $id('businessView').classList.toggle('hidden', state.tab !== 'business');

  if (state.tab === 'config') {
    $id('configView').innerHTML = shell(configSteps[state.idx].html());
  } else {
    const msgs = bizSteps.slice(0, state.idx + 1).map((s) => s.html()).join('');
    $id('businessView').innerHTML = teamsShell(msgs);
  }

  // Contador + status sutil
  updateMeta();
}

// -------------------------------------------------------------
// Acciones (navegación)
// -------------------------------------------------------------
function goNext() {
  const len = currentSteps().length;
  if (state.idx < len - 1) {
    state.idx++;
    render();
  }
}

function goPrev() {
  if (state.idx > 0) {
    state.idx--;
    render();
  }
}

function goToStep(i) {
  const n = Number(i);
  if (Number.isInteger(n) && n >= 0 && n < currentSteps().length) {
    state.idx = n;
    render();
  }
}

function switchTab(tab) {
  if (tab !== 'config' && tab !== 'business') return;
  state.tab = tab;
  state.idx = 0;
  render();
}

// -------------------------------------------------------------
// Wiring de eventos (sin onclick inline)
// -------------------------------------------------------------
function wireEvents() {
  // Tabs (existen al cargar el HTML)
  $$('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      autorun.stop(); // detener autoplay si está corriendo
      switchTab(btn.dataset.tab);
    });
  });

  // Toggle de tema
  const themeBtn = $id('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Stepper: delegación porque los .step se re-renderizan en cada cambio.
  $id('steps').addEventListener('click', (e) => {
    const stepEl = e.target.closest('.step');
    if (stepEl) {
      // Si el click viene del autoplay (programático), no detener.
      if (!autorun.isAutoClick()) autorun.stop();
      goToStep(stepEl.dataset.step);
    }
  });
  // También accesible por teclado (Enter/Espacio sobre un .step con tabindex)
  $id('steps').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const stepEl = e.target.closest('.step');
    if (stepEl) {
      e.preventDefault();
      autorun.stop();
      goToStep(stepEl.dataset.step);
    }
  });

  // Botones prev/next: viven dentro de configView y se re-renderizan,
  // así que se enganchan por delegación a través del data-action.
  $id('configView').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    autorun.stop();
    if (btn.dataset.action === 'next') goNext();
    if (btn.dataset.action === 'prev') goPrev();
  });

  // Tecla Esc: vuelve al primer paso (cierra cualquier "panel" lógico abierto).
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.idx !== 0) {
      autorun.stop();
      state.idx = 0;
      render();
    }
  });

  // Flechas izquierda / derecha para navegar pasos.
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === 'ArrowRight') { autorun.stop(); goNext(); }
    if (e.key === 'ArrowLeft')  { autorun.stop(); goPrev(); }
  });

  // Atajo Espacio: toggle play / pause del autorun.
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === ' ') {
      e.preventDefault();
      autorun.toggle();
    }
  });
}

// =============================================================
// Auto-run (Ejecutar demo): avanza paso a paso automáticamente.
// =============================================================
const autorun = (() => {
  const STEP_DELAY = 1800;   // ms entre pasos. Subilo o bajalo a gusto.
  let running = false;
  let timeoutId = null;
  let autoClickFlag = false; // se pone true mientras el autoplay clickea

  const log = (...a) => console.log('[autorun]', ...a);

  /** El handler delegado del stepper consulta esto para no abortar el autoplay. */
  function isAutoClick() { return autoClickFlag; }

  /** Pinta el botón según el estado. */
  function paintButton(mode) {
    const btn = $id('runBtn');
    if (!btn) return;
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

    // Status sutil del agente en la barra de meta
    const status = $id('phaseStatus');
    if (status) {
      status.classList.remove('on', 'ok');
      if (mode === 'running') {
        status.textContent = 'Ejecutando…';
        status.classList.add('on');
      } else if (mode === 'done') {
        status.textContent = 'Completado';
        status.classList.add('ok');
      } else {
        status.textContent = 'Listo';
      }
    }
  }

  /** Tick del loop: avanza un paso si se puede, agenda el próximo. */
  function tick() {
    if (!running) return;
    const total = currentSteps().length;
    log('tick · idx=', state.idx, '/', total - 1);

    if (state.idx >= total - 1) {
      // Llegamos al final.
      running = false;
      paintButton('done');
      log('terminado');
      return;
    }

    // Avanzo un paso usando la API real de app.js.
    autoClickFlag = true;
    goNext();
    autoClickFlag = false;

    timeoutId = setTimeout(tick, STEP_DELAY);
  }

  /** Empieza la demo desde donde esté, o resetea si está al final. */
  function start() {
    if (running) return;
    log('start');

    const total = currentSteps().length;
    if (total === 0) {
      log('ERROR: no hay pasos en la tab actual');
      return;
    }

    // Si está al final, primero vuelvo al inicio.
    if (state.idx >= total - 1) {
      state.idx = 0;
      render();
    }

    running = true;
    paintButton('running');
    timeoutId = setTimeout(tick, STEP_DELAY);
  }

  /** Para el autoplay sin perder posición. */
  function stop() {
    if (!running && !timeoutId) return;
    log('stop');
    running = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    const total = currentSteps().length;
    const done = total > 0 && state.idx >= total - 1;
    paintButton(done ? 'done' : 'idle');
  }

  function toggle() {
    if (running) stop();
    else start();
  }

  /** Inyecta el botón en la top bar. */
  function injectButton() {
    if ($id('runBtn')) return; // ya existe

    const top = document.querySelector('.top');
    const themeBtn = $id('themeToggle');
    if (!top) {
      log('ERROR: no se encontró .top');
      return;
    }

    const btn = document.createElement('button');
    btn.id = 'runBtn';
    btn.type = 'button';
    btn.className = 'run-btn';
    btn.setAttribute('aria-label', 'Ejecutar la demo');
    btn.innerHTML = '<span class="run-icon">▶</span><span class="run-label">Ejecutar demo</span>';

    if (themeBtn) top.insertBefore(btn, themeBtn);
    else top.appendChild(btn);

    btn.addEventListener('click', toggle);
    log('botón inyectado');
  }

  return { start, stop, toggle, isAutoClick, injectButton };
})();

// -------------------------------------------------------------
// Inicialización
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  wireEvents();
  render();
  autorun.injectButton();
});
