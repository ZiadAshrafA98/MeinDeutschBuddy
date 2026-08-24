/**
 * Mein Deutsch Buddy — case focus
 * Dims every row outside the selected case.
 */
import { root } from './shared.js';
/* ------------------------------------------------------------ case focus */
function setFocus(c) {
    if (c)
        root.setAttribute('data-focus', c);
    else
        root.removeAttribute('data-focus');
    document.querySelectorAll('[data-case-btn]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.caseBtn === c));
    });
}
export function initFocus() {
    document.querySelectorAll('[data-case-btn]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.caseBtn;
            setFocus(root.getAttribute('data-focus') === id ? null : id);
        });
    });
}
//# sourceMappingURL=focus.js.map