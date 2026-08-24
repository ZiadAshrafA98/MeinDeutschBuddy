/**
 * Mein Deutsch Buddy — language mode
 * DE, EN and DE+EN, plus per-block flipping.
 */
import { STORE, root } from './shared.js';
/* -------------------------------------------------------------- language */
const HINTS = {
    de: 'CLICK FOR EN',
    en: 'CLICK FOR DE',
    both: '',
};
function setLang(mode) {
    root.setAttribute('data-lang', mode);
    document.querySelectorAll('.note').forEach((n) => {
        n.classList.remove('flipped');
        n.dataset.hint = HINTS[mode];
    });
    document.querySelectorAll('[data-lang-btn]').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.langBtn === mode));
    });
    try {
        localStorage.setItem(STORE.lang, mode);
    }
    catch {
        /* storage unavailable, mode still applies for this visit */
    }
}
export function initLang() {
    let saved = 'de';
    try {
        const v = localStorage.getItem(STORE.lang);
        if (v === 'de' || v === 'en' || v === 'both')
            saved = v;
    }
    catch {
        /* ignore */
    }
    setLang(saved);
    document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
        btn.addEventListener('click', () => setLang(btn.dataset.langBtn));
    });
    // Click any note to flip that one block to the other language.
    document.querySelectorAll('.note').forEach((note) => {
        note.tabIndex = 0;
        note.setAttribute('role', 'button');
        const flip = () => {
            if (root.getAttribute('data-lang') === 'both')
                return;
            note.classList.toggle('flipped');
        };
        note.addEventListener('click', flip);
        note.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                flip();
            }
        });
    });
}
//# sourceMappingURL=lang.js.map