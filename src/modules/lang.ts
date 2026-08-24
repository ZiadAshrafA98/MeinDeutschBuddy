/**
 * Mein Deutsch Buddy — language mode
 * DE, EN and DE+EN, plus per-block flipping.
 */

import { LangMode, STORE, root } from './shared.js';

/* -------------------------------------------------------------- language */

const HINTS: Record<LangMode, string> = {
  de: 'CLICK FOR EN',
  en: 'CLICK FOR DE',
  both: '',
};

function setLang(mode: LangMode): void {
  root.setAttribute('data-lang', mode);
  document.querySelectorAll<HTMLElement>('.note').forEach((n) => {
    n.classList.remove('flipped');
    n.dataset.hint = HINTS[mode];
  });
  document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.langBtn === mode));
  });
  try {
    localStorage.setItem(STORE.lang, mode);
  } catch {
    /* storage unavailable, mode still applies for this visit */
  }
}

export function initLang(): void {
  let saved: LangMode = 'de';
  try {
    const v = localStorage.getItem(STORE.lang);
    if (v === 'de' || v === 'en' || v === 'both') saved = v;
  } catch {
    /* ignore */
  }
  setLang(saved);

  document.querySelectorAll<HTMLButtonElement>('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.langBtn as LangMode));
  });

  // Click any note to flip that one block to the other language.
  document.querySelectorAll<HTMLElement>('.note').forEach((note) => {
    note.tabIndex = 0;
    note.setAttribute('role', 'button');
    const flip = (): void => {
      if (root.getAttribute('data-lang') === 'both') return;
      note.classList.toggle('flipped');
    };
    note.addEventListener('click', flip);
    note.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
  });
}
