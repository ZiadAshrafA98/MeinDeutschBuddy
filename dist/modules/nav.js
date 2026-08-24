/**
 * Mein Deutsch Buddy — navigation
 * Mobile drawer, sticky bar and section tracking.
 */
/* ------------------------------------------------------------------- nav */
/* The bar carries two rows on a phone. Tucking it away while the reader is
   moving down the page gives that height back, and any upward scroll returns
   it immediately. */
export function initStickyBar() {
    const bar = document.querySelector('.topbar');
    if (!bar)
        return;
    let last = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking)
            return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            const y = window.scrollY;
            const delta = y - last;
            last = y;
            if (window.innerWidth > 900) {
                bar.classList.remove('tucked');
                return;
            }
            /* Ignore jitter, and never hide it near the top of the page. */
            if (Math.abs(delta) < 6 || y < 140) {
                if (y < 140)
                    bar.classList.remove('tucked');
                return;
            }
            bar.classList.toggle('tucked', delta > 0);
        });
    }, { passive: true });
}
export function initNav() {
    const nav = document.querySelector('.sidenav');
    const toggle = document.querySelector('.nav-toggle');
    /* Backdrop for the mobile drawer. Built here rather than in the markup so
       the two pages that share this script do not both have to declare it. */
    let backdrop = null;
    if (nav) {
        backdrop = document.createElement('button');
        backdrop.className = 'nav-backdrop';
        backdrop.setAttribute('aria-label', 'Menü schließen');
        backdrop.tabIndex = -1;
        document.body.appendChild(backdrop);
    }
    function setNav(open) {
        if (!nav)
            return;
        nav.classList.toggle('open', open);
        backdrop?.classList.toggle('open', open);
        toggle?.setAttribute('aria-expanded', String(open));
        if (backdrop)
            backdrop.tabIndex = open ? 0 : -1;
        /* Stop the page behind the drawer from scrolling under the finger. */
        document.body.style.overflow = open && window.innerWidth <= 900 ? 'hidden' : '';
        if (open) {
            /* preventScroll, or focusing the first link yanks the nav to the top
               and undoes the reveal below. */
            nav.querySelector('a')?.focus({ preventScroll: true });
            /* The active link only gets revealed when the section changes, so a
               drawer opened mid-page would show the top of the list instead. */
            const current = nav.querySelector('a.active');
            if (current)
                requestAnimationFrame(() => keepLinkVisible(current));
        }
    }
    toggle?.addEventListener('click', () => {
        setNav(!(nav?.classList.contains('open') ?? false));
    });
    backdrop?.addEventListener('click', () => {
        setNav(false);
        toggle?.focus();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav?.classList.contains('open')) {
            setNav(false);
            toggle?.focus();
        }
    });
    /* A drawer left open while the viewport grows back to desktop would keep
       the body scroll-locked, so reset on resize. */
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900)
            setNav(false);
    });
    nav?.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            if (window.innerWidth <= 900)
                setNav(false);
        });
    });
    // Highlight the section currently in view.
    const links = Array.from(nav?.querySelectorAll('a') ?? []);
    const byId = new Map();
    links.forEach((l) => byId.set(l.hash.slice(1), l));
    const sections = Array.from(document.querySelectorAll('section.topic'));
    if (!sections.length || !nav)
        return;
    /* An IntersectionObserver watching a thin band near the top of the viewport
       leaves nothing active whenever that band falls in the 104px gap between
       two sections. Resolving against an anchor line instead always yields
       exactly one section: the last one that has started above the line. */
    const ANCHOR = 140;
    let activeId = '';
    function keepLinkVisible(link) {
        if (!nav)
            return;
        /* Skip while the mobile drawer is shut, otherwise the nav silently
           scrolls behind a closed panel. */
        if (window.innerWidth <= 900 && !nav.classList.contains('open'))
            return;
        const nr = nav.getBoundingClientRect();
        const lr = link.getBoundingClientRect();
        const pad = 56;
        let delta = 0;
        if (lr.top < nr.top + pad)
            delta = lr.top - (nr.top + pad);
        else if (lr.bottom > nr.bottom - pad)
            delta = lr.bottom - (nr.bottom - pad);
        if (!delta)
            return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        nav.scrollTo({ top: nav.scrollTop + delta, behavior: reduced ? 'auto' : 'smooth' });
    }
    function syncActive() {
        let current = sections[0];
        for (const s of sections) {
            if (s.getBoundingClientRect().top <= ANCHOR)
                current = s;
            else
                break;
        }
        /* At the very bottom the last section may never cross the line, so claim
           it explicitly. */
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
            current = sections[sections.length - 1];
        }
        if (!current || current.id === activeId)
            return;
        activeId = current.id;
        links.forEach((l) => l.classList.remove('active'));
        const link = byId.get(activeId);
        if (link) {
            link.classList.add('active');
            keepLinkVisible(link);
        }
    }
    let ticking = false;
    function onScroll() {
        if (ticking)
            return;
        ticking = true;
        requestAnimationFrame(() => {
            syncActive();
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    syncActive();
}
//# sourceMappingURL=nav.js.map