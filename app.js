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
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Toggle de tema
  const themeBtn = $id('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Stepper: delegación porque los .step se re-renderizan en cada cambio.
  $id('steps').addEventListener('click', (e) => {
    const stepEl = e.target.closest('.step');
    if (stepEl) goToStep(stepEl.dataset.step);
  });
  // También accesible por teclado (Enter/Espacio sobre un .step con tabindex)
  $id('steps').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const stepEl = e.target.closest('.step');
    if (stepEl) {
      e.preventDefault();
      goToStep(stepEl.dataset.step);
    }
  });

  // Botones prev/next: viven dentro de configView y se re-renderizan,
  // así que se enganchan por delegación a través del data-action.
  $id('configView').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'next') goNext();
    if (btn.dataset.action === 'prev') goPrev();
  });

  // Tecla Esc: vuelve al primer paso (cierra cualquier "panel" lógico abierto).
  // Si más adelante hay modales, este es el único punto a tocar.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.idx !== 0) {
      state.idx = 0;
      render();
    }
  });

  // Flechas izquierda / derecha para navegar pasos (ignoradas dentro de inputs/textareas).
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });
}

// -------------------------------------------------------------
// Inicialización
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  wireEvents();
  render();
});
