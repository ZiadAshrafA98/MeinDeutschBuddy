/**
 * Deutsch A1 Handbuch — interaction layer
 * Language mode, case focus, theme, section nav.
 */

type LangMode = 'de' | 'en' | 'both';
type CaseId = 'nom' | 'akk' | 'dat' | 'gen';

const STORE = {
  lang: 'da1.lang',
  theme: 'da1.theme',
} as const;

const root: HTMLElement = document.documentElement;

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

function initLang(): void {
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

/* ------------------------------------------------------------ case focus */

function setFocus(c: CaseId | null): void {
  if (c) root.setAttribute('data-focus', c);
  else root.removeAttribute('data-focus');
  document.querySelectorAll<HTMLButtonElement>('[data-case-btn]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.caseBtn === c));
  });
}

function initFocus(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-case-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.caseBtn as CaseId;
      setFocus(root.getAttribute('data-focus') === id ? null : id);
    });
  });
}

/* ----------------------------------------------------------------- theme */

function setTheme(t: 'light' | 'dark'): void {
  root.setAttribute('data-theme', t);
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-btn]');
  if (btn) btn.textContent = t === 'dark' ? 'Hell' : 'Dunkel';
  try {
    localStorage.setItem(STORE.theme, t);
  } catch {
    /* ignore */
  }
}

function initTheme(): void {
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
  document
    .querySelector<HTMLButtonElement>('[data-theme-btn]')
    ?.addEventListener('click', () => {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
}

/* ------------------------------------------------------------------- nav */

function initNav(): void {
  const nav = document.querySelector<HTMLElement>('.sidenav');
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');

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
  const links = Array.from(nav?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
  const byId = new Map<string, HTMLAnchorElement>();
  links.forEach((l) => byId.set(l.hash.slice(1), l));

  const sections = Array.from(document.querySelectorAll<HTMLElement>('section.topic'));
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const seen = new Set<string>();
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) seen.add(e.target.id);
        else seen.delete(e.target.id);
      });
      const first = sections.find((s) => seen.has(s.id));
      links.forEach((l) => l.classList.remove('active'));
      if (first) byId.get(first.id)?.classList.add('active');
    },
    { rootMargin: '-88px 0px -70% 0px', threshold: 0 }
  );
  sections.forEach((s) => obs.observe(s));
}

/* ------------------------------------------------------------------ boot */

function boot(): void {
  initTheme();
  initLang();
  initFocus();
  initNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
