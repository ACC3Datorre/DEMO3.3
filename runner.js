// =============================================================
// runner.js
// Botón "Ejecutar demo" + autoplay por pasos.
//
// No toca app.js: simula clicks en el stepper (.step[data-step])
// para avanzar, igual que si el usuario clickeara.
//
// Atajos:
//   - Espacio  : play / pausa
//   - R        : reset (vuelve al primer paso vía Esc nativo)
// =============================================================

import { $id, $$, sleep, prefersReducedMotion } from './utils.js';

const STEP_DELAY = prefersReducedMotion() ? 250 : 1800;

let running = false;
let cancelToken = 0; // sube cada vez que se cancela; si el loop ve cambio, frena

/** Devuelve los .step actualmente renderizados. */
function getSteps() {
  return $$('.step', $id('steps'));
}

/** Índice del paso activo en el stepper. */
function getActiveIdx() {
  const steps = getSteps();
  return steps.findIndex((el) => el.classList.contains('active'));
}

/** Hace click en el paso `i` para que app.js lo active. */
function clickStep(i) {
  // El stepper se re-renderiza en cada cambio, así que buscamos el nodo "fresco"
  const steps = getSteps();
  if (i >= 0 && i < steps.length) {
    steps[i].click();
  }
}

/** Va al primer paso. Usa la tecla Escape que app.js ya maneja. */
function resetToFirst() {
  // Dispatch keydown Escape — app.js lo escucha globalmente
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
}

/** Actualiza el botón según el estado. */
function paintButton(btn, mode) {
  const label = btn.querySelector('.run-label');
  const icon = btn.querySelector('.run-icon');
  if (mode === 'running') {
    btn.classList.add('running');
    btn.classList.remove('done');
    document.body.classList.add('is-running');
    icon.textContent = '■';
    label.textContent = 'Detener';
  } else if (mode === 'done') {
    btn.classList.remove('running');
    btn.classList.add('done');
    document.body.classList.remove('is-running');
    icon.textContent = '↻';
    label.textContent = 'Reiniciar';
  } else {
    btn.classList.remove('running');
    btn.classList.remove('done');
    document.body.classList.remove('is-running');
    icon.textContent = '▶';
    label.textContent = 'Ejecutar demo';
  }
}

/** Loop principal: avanza paso a paso hasta el final o hasta que se cancele. */
async function runDemo(btn) {
  if (running) return;

  // Si estoy parado en el último paso, primero hago reset.
  const steps0 = getSteps();
  if (steps0.length && getActiveIdx() === steps0.length - 1) {
    resetToFirst();
    await sleep(250);
  }

  running = true;
  const myToken = ++cancelToken;
  paintButton(btn, 'running');

  // Avanzo desde el paso actual hasta el final.
  while (running && myToken === cancelToken) {
    const steps = getSteps();
    const cur = getActiveIdx();
    if (cur === -1 || cur >= steps.length - 1) break;

    clickStep(cur + 1);
    await sleep(STEP_DELAY);
  }

  if (myToken === cancelToken) {
    running = false;
    const steps = getSteps();
    const done = steps.length && getActiveIdx() === steps.length - 1;
    paintButton(btn, done ? 'done' : 'idle');
  }
}

/** Detiene el autoplay sin tocar el paso actual. */
function stopDemo(btn) {
  running = false;
  cancelToken++;
  const steps = getSteps();
  const done = steps.length && getActiveIdx() === steps.length - 1;
  paintButton(btn, done ? 'done' : 'idle');
}

/** Inserta el botón en la top bar (a la izquierda del theme toggle). */
function injectButton() {
  const top = document.querySelector('.top');
  const themeBtn = $id('themeToggle');
  if (!top || !themeBtn) return null;

  const btn = document.createElement('button');
  btn.id = 'runBtn';
  btn.type = 'button';
  btn.className = 'run-btn';
  btn.setAttribute('aria-label', 'Ejecutar la demo');
  btn.innerHTML = `<span class="run-icon">▶</span><span class="run-label">Ejecutar demo</span>`;
  top.insertBefore(btn, themeBtn);
  return btn;
}

/** Si el usuario cambia de tab manualmente mientras corre, detenemos. */
function watchTabChange(btn) {
  $$('.tab').forEach((t) => {
    t.addEventListener('click', () => {
      if (running) stopDemo(btn);
    });
  });
}

/** Si el usuario clickea un paso o usa flechas mientras corre, detenemos. */
function watchManualNav(btn) {
  $id('steps').addEventListener('click', () => {
    if (running) stopDemo(btn);
  }, true); // capture para llegar antes que el handler del stepper

  document.addEventListener('keydown', (e) => {
    if (!running) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Escape') {
      stopDemo(btn);
    }
  });
}

/** Init. */
document.addEventListener('DOMContentLoaded', () => {
  // Espera un tick para que app.js termine de renderizar el stepper.
  setTimeout(() => {
    const btn = injectButton();
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (running) stopDemo(btn);
      else runDemo(btn);
    });

    watchTabChange(btn);
    watchManualNav(btn);

    // Atajo Espacio: play / pause
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === ' ') {
        e.preventDefault();
        if (running) stopDemo(btn);
        else runDemo(btn);
      }
    });
  }, 0);
});
