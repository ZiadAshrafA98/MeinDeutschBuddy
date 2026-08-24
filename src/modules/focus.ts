/**
 * Mein Deutsch Buddy — case focus
 * Dims every row outside the selected case.
 */

import { CaseId, root } from './shared.js';

/* ------------------------------------------------------------ case focus */

function setFocus(c: CaseId | null): void {
  if (c) root.setAttribute('data-focus', c);
  else root.removeAttribute('data-focus');
  document.querySelectorAll<HTMLButtonElement>('[data-case-btn]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.caseBtn === c));
  });
}

export function initFocus(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-case-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.caseBtn as CaseId;
      setFocus(root.getAttribute('data-focus') === id ? null : id);
    });
  });
}
