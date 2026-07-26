"use strict";
/**
 * Deutsch Buddy — interaction layer
 * Language mode, case focus, theme, section nav.
 */
const STORE = {
    lang: 'de.lang',
    theme: 'de.theme',
};
const root = document.documentElement;
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
function initLang() {
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
function initFocus() {
    document.querySelectorAll('[data-case-btn]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.caseBtn;
            setFocus(root.getAttribute('data-focus') === id ? null : id);
        });
    });
}
/* ----------------------------------------------------------------- theme */
function setTheme(t) {
    root.setAttribute('data-theme', t);
    const btn = document.querySelector('[data-theme-btn]');
    if (btn)
        btn.textContent = t === 'dark' ? 'Hell' : 'Dunkel';
    try {
        localStorage.setItem(STORE.theme, t);
    }
    catch {
        /* ignore */
    }
}
function initTheme() {
    let t = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    try {
        const v = localStorage.getItem(STORE.theme);
        if (v === 'light' || v === 'dark')
            t = v;
    }
    catch {
        /* ignore */
    }
    setTheme(t);
    document
        .querySelector('[data-theme-btn]')
        ?.addEventListener('click', () => {
        setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
}
/* ------------------------------------------------------------------- nav */
function initNav() {
    const nav = document.querySelector('.sidenav');
    const toggle = document.querySelector('.nav-toggle');
    toggle?.addEventListener('click', () => {
        const open = nav?.classList.toggle('open') ?? false;
        toggle.setAttribute('aria-expanded', String(open));
    });
    nav?.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                nav.classList.remove('open');
                toggle?.setAttribute('aria-expanded', 'false');
            }
        });
    });
    // Highlight the section currently in view.
    const links = Array.from(nav?.querySelectorAll('a') ?? []);
    const byId = new Map();
    links.forEach((l) => byId.set(l.hash.slice(1), l));
    const sections = Array.from(document.querySelectorAll('section.topic'));
    if (!sections.length || !('IntersectionObserver' in window))
        return;
    const seen = new Set();
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting)
                seen.add(e.target.id);
            else
                seen.delete(e.target.id);
        });
        const first = sections.find((s) => seen.has(s.id));
        links.forEach((l) => l.classList.remove('active'));
        if (first)
            byId.get(first.id)?.classList.add('active');
    }, { rootMargin: '-88px 0px -70% 0px', threshold: 0 });
    sections.forEach((s) => obs.observe(s));
}
/* ------------------------------------------------------------------ boot */
function boot() {
    initTheme();
    initLang();
    initFocus();
    initNav();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
}
else {
    boot();
}
//# sourceMappingURL=main.js.map