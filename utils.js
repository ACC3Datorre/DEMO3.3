// =============================================================
// utils.js
// Helpers reutilizables.
// =============================================================

/** document.getElementById más corto. */
export const $id = (id) => document.getElementById(id);

/** querySelectorAll devuelto como Array (para usar map/forEach sin sorpresas). */
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Promesa que resuelve después de `ms` milisegundos. */
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/** Limita un valor entre min y max. */
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
