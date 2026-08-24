/**
 * Mein Deutsch Buddy — theme
 * Light and dark, swapped behind a blur so the change is never seen mid-flight.
 */

import { STORE, root } from './shared.js';

/* ----------------------------------------------------------------- theme */

function setTheme(t: 'light' | 'dark'): void {
  root.setAttribute('data-theme', t);
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-btn]');
  if (btn) {
    /* The button holds an SVG, so its label lives on aria-label and title.
       Writing textContent here would delete the icon. */
    const label = t === 'dark' ? 'Hellmodus einschalten' : 'Dunkelmodus einschalten';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }
  try {
    localStorage.setItem(STORE.theme, t);
  } catch {
    /* ignore */
  }
}

export function initTheme(): void {
  let t: 'light' | 'dark' = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
  try {
    const v = localStorage.getItem(STORE.theme);
    if (v === 'light' || v === 'dark') t = v;
  } catch {
    /* ignore */
  }
  setTheme(t);
  getVeil();
  document
    .querySelector<HTMLButtonElement>('[data-theme-btn]')
    ?.addEventListener('click', () => {
      morphTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
}

/* Timings are duplicated from the CSS by necessity: the swap has to land at
   peak blur, so JS and CSS must agree on when that is. */
const MORPH_OUT = 300;
const MORPH_IN = 300;
let morphing = false;
let veil: HTMLElement | null = null;

function getVeil(): HTMLElement {
  if (!veil) {
    veil = document.createElement('div');
    veil.className = 'theme-veil';
    veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);
  }
  return veil;
}

function morphTheme(next: 'light' | 'dark'): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    setTheme(next);
    return;
  }
  /* A second click mid-flight would strand the page blurred. */
  if (morphing) return;
  morphing = true;

  const body = document.body;
  getVeil();
  body.classList.add('theme-morph');

  requestAnimationFrame(() => {
    body.classList.add('theme-morph-out');

    window.setTimeout(() => {
      /* Swap with other transitions suppressed, then force a reflow so the
         browser commits the new colours before animation resumes. The theme
         toggle is exempt in CSS so its icon still morphs. */
      root.setAttribute('data-theme-instant', '');
      setTheme(next);
      void body.offsetWidth;
      root.removeAttribute('data-theme-instant');

      body.classList.remove('theme-morph-out');

      window.setTimeout(() => {
        body.classList.remove('theme-morph');
        morphing = false;
      }, MORPH_IN + 40);
    }, MORPH_OUT);
  });
}
