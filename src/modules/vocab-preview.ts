/**
 * Mein Deutsch Buddy — vocabulary preview
 *
 * Pairing a word with an image measurably helps retention, so hovering a
 * concrete noun raises a small card showing it.
 *
 * These are drawn as line pictograms rather than photographs. Photos would
 * mean bundling roughly 180 images or hotlinking a CDN, and the second breaks
 * the property that this whole app is one file that works offline. Strokes
 * inherit currentColor, so they follow the theme for free, and they share the
 * stroke language of the search and theme icons instead of reading as clip
 * art dropped into a typographic layout.
 *
 * Colours get a literal swatch, which beats any drawing of a colour.
 */

const VIEW = '0 0 24 24';

/* Path data only; stroke styling is applied once in CSS. */
const ICONS: Record<string, string> = {
  /* ---- Kleidung ---- */
  tshirt: 'M8.5 3.5 3.5 5.5 2 10l3.5 1.2V20.5h13V11.2L22 10l-1.5-4.5-5-2a3.5 3.5 0 0 1-7 0Z',
  hemd: 'M8.5 3.5 3.5 5.5 2 10l3.5 1.2V20.5h13V11.2L22 10l-1.5-4.5-5-2M8.5 3.5 12 7.5l3.5-4M12 7.5v13',
  pullover:
    'M8.5 3.5 2.5 6 1 12.5l4 1.3M15.5 3.5 21.5 6 23 12.5l-4 1.3M5 13.8V20.5h14v-6.7M8.5 3.5a3.5 3.5 0 0 0 7 0',
  jacke:
    'M8.5 3.5 2.5 6 1 12.5l4 1.3M15.5 3.5 21.5 6 23 12.5l-4 1.3M5 13.8V20.5h14v-6.7M8.5 3.5 12 8l3.5-4.5M12 8v12.5',
  mantel:
    'M8 3.5 3 6 1.5 12.5l3.5 1.2V21h14v-7.3l3.5-1.2L20 6l-5-2.5M8 3.5 12 8.5l4-5M12 8.5V21M9.5 14.5h1',
  bluse:
    'M9 3.5 4.5 6 3 11.5l3 1V20.5h12v-8l3-1L19.5 6 15 3.5M9 3.5 12 7.5l3-4M12 7.5v13',
  hose: 'M6.5 3h11l1 18h-4.5L12 11.5 10 21H5.5ZM6.5 3h11M12 11.5V3',
  rock: 'M8 4h8l3.5 15.5h-15ZM8 4h8M11 4v15.5M13 4v15.5',
  kleid: 'M9 3.5 12 6.5l3-3 2 4.5-1.8 1.8L18.5 21h-13l2.3-11.2L6 8Z',
  guertel: 'M2 9.5h20v5H2Zm7.5 0v5m5-5v5M14.5 12h5',
  schuh: 'M2.5 16.5h6.5l3 2.2h8a2 2 0 0 1 2 2v.8H2.5Zm0 0v-4.8h4.2l2.3 4.8',
  socke: 'M8 3h5.5v8.8l3.8 3.2a3.6 3.6 0 0 1-4.6 5.5l-4.7-4V3ZM8 6h5.5',

  /* ---- Körper ---- */
  kopf: 'M12 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM4 21a8 8 0 0 1 16 0',
  gesicht:
    'M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19ZM9 10h.01M15 10h.01M8.5 14.5a4.5 4.5 0 0 0 7 0',
  auge: 'M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12Zm10.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  ohr: 'M7 8.5a5 5 0 0 1 10 0c0 3-2 4-2.8 5.6-.7 1.4-.2 2.4-1.2 4.4A3.4 3.4 0 0 1 7 17.5c0-3 1.5-4 1.5-6a2 2 0 0 1 4 0',
  nase: 'M12 3v8.5c0 1.4 1.5 2 1.5 3.5a3 3 0 0 1-5.5 1.6M12 3l-2.5 2.5M15 19.5c-1 1-4.5 1.4-6.5 0',
  mund: 'M2.5 12S6.5 8 12 8s9.5 4 9.5 4-4 4-9.5 4-9.5-4-9.5-4Zm0 0h19',
  zahn: 'M6.5 3.5c-2 0-3 1.8-3 4 0 4 1.7 5.5 2.4 10 .3 2 .8 3 1.8 3 1.6 0 1.6-3 2.3-5.6.3-1 .6-1.4 2-1.4s1.7.4 2 1.4c.7 2.6.7 5.6 2.3 5.6 1 0 1.5-1 1.8-3 .7-4.5 2.4-6 2.4-10 0-2.2-1-4-3-4-1.7 0-2.6 1-5.5 1s-3.8-1-5.5-1Z',
  schulter: 'M12 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM3 21c0-4 3-6.5 5.5-7.5M21 21c0-4-3-6.5-5.5-7.5M3 21h4.5M21 21h-4.5',
  arm: 'M7 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM7 9v5.5c0 3 2 5 5 5h5.5M17.5 16.5l3 3-3 3',
  hand: 'M8.5 12V5a1.5 1.5 0 0 1 3 0v5.5M11.5 10V4a1.5 1.5 0 0 1 3 0v6.5M14.5 10.5V6a1.5 1.5 0 0 1 3 0v8c0 4-2.5 7-6 7s-6-2.5-6-6v-4.5a1.5 1.5 0 0 1 3 0V13',
  bauch: 'M12 2.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM7.5 21c-1-3.5-1-6 0-8.5C8.3 10.6 9.8 9.5 12 9.5s3.7 1.1 4.5 3c1 2.5 1 5 0 8.5M9.5 15a3.5 3.5 0 0 0 5 0',
  ruecken: 'M12 2.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM7.5 21c-1-3.5-1-6 0-8.5C8.3 10.6 9.8 9.5 12 9.5s3.7 1.1 4.5 3c1 2.5 1 5 0 8.5M12 10v10M9.8 12.5h4.4M9.8 15.5h4.4M9.8 18.5h4.4',
  bein: 'M9 2.5h6l-.8 8.5c-.2 2 .3 3 .8 4.5.6 1.8.8 3.5.8 6h-4c0-2.5-.4-4-1-5.5-.6 1.5-1 3-1 5.5H6c0-3 .3-5 1-7 .6-1.8.8-3 .7-4.5Z',
  fuss: 'M6 4.5c-1.5 2-2 5-1.5 8 .4 2.5 1.2 4 1.2 6.5h4.6c0-2.5-.8-4-1-6 2 1 4 1.5 6.2 1.5 2 0 3-1 3-2.5s-1.5-2.5-3.5-3c-3-.8-5.5-2.5-6.5-4.5Z',
  fieber:
    'M14 14.8V4.5a2.5 2.5 0 0 0-5 0v10.3a4.5 4.5 0 1 0 5 0ZM11.5 16.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0-1.5V7',
  husten:
    'M9 4.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM2 21c0-3.5 2.5-6 7-6M14.5 8.5c1.5.6 1.5 2.4 0 3M17.5 6.5c3 1.3 3 6.7 0 8M15 16.5h5M15 19.5h3',
  schnupfen: 'M12 3v8.5c0 1.4 1.5 2 1.5 3.5a3 3 0 0 1-5.5 1.6M12 3l-2.5 2.5M16.5 15c1.2 1.6 2 2.7 2 3.6a2 2 0 1 1-4 0c0-.9.8-2 2-3.6Z',
  schmerzen:
    'M12 1.5 14 8l6.5-2-4 5.5 4 5.5L14 15l-2 6.5-2-6.5-6.5 2 4-5.5-4-5.5L10 8Z',

  /* ---- Wohnung ---- */
  haus: 'M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M10 21v-6.5h4V21',
  wohnung: 'M2.5 21h19M4.5 21V6l7-3.5V21M11.5 21V8.5l8 3V21M7 9h1.5M7 12.5h1.5M7 16h1.5M15 13.5h1.5M15 17h1.5',
  zimmer: 'M3 20V7l9-4 9 4v13M3 20h18M8 20v-6h4v6M16 10.5h2.5v3H16Z',
  tisch: 'M2 9h20M4 9v11M20 9v11M2 9v-.5A1.5 1.5 0 0 1 3.5 7h17A1.5 1.5 0 0 1 22 8.5V9',
  schreibtisch: 'M2 8.5h20M3.5 8.5V20M20.5 8.5V20M13 8.5V16h7.5M15.5 12h2.5M15.5 8.5h5',
  stuhl: 'M6.5 3.5h11v9h-11ZM6.5 12.5h11M7.5 12.5V21M16.5 12.5V21M7.5 17.5h9',
  sofa: 'M2 11.5a2 2 0 0 1 4 0v3h12v-3a2 2 0 0 1 4 0V18H2ZM6 14.5V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6.5M4 18v2.5M20 18v2.5',
  sessel: 'M5 11.5a2 2 0 0 1 3.5-1.3v-2A2.2 2.2 0 0 1 10.7 6h2.6a2.2 2.2 0 0 1 2.2 2.2v2A2 2 0 0 1 19 11.5V18H5ZM8.5 10.2V15h7v-4.8M6.5 18v2.5M17.5 18v2.5',
  bett: 'M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8M2 16h20M2 12V6M22 12V6M6 10V7.5h5V10',
  kleiderschrank: 'M4 2.5h16v19H4ZM12 2.5v19M10 11v2.5M14 11v2.5M4 21.5v-19M7 6h2M15 6h2',
  fernseher: 'M2.5 4.5h19v12h-19ZM8 20.5h8M12 16.5v4',
  kuehlschrank: 'M4.5 2.5h15v19h-15ZM4.5 9.5h15M7.5 5.5v2.5M7.5 12v3',
  herd: 'M3 6.5h18v14H3ZM3 11.5h18M6.5 8.5h.01M10 8.5h.01M13.5 8.5h.01M17 8.5h.01M7 15.5h10M7 18h10',
  dusche: 'M12 2.5v4M7 9.5a5 5 0 0 1 10 0ZM9 13.5v1.5M12 13.5v3M15 13.5v1.5M9.5 19v1.5M13.5 18.5v2',
  waschbecken: 'M3 11.5h18v2a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6ZM12 11.5V7a3 3 0 0 1 3-3h2M12 15.5h.01',
  toilette: 'M6 3.5h4v6h6a2 2 0 0 1 2 2c0 3.5-1.5 6-4 7.5V21H9v-2c-2.5-1.5-4-4-4-7.5a2 2 0 0 1 1-1.7M6 3.5v6',
  teppich: 'M4 6.5h16v11H4ZM4 6.5 2 4.5M20 6.5l2-2M4 17.5l-2 2M20 17.5l2 2M7.5 9.5h9M7.5 12h9M7.5 14.5h9',
  fenster: 'M3.5 3.5h17v17h-17ZM12 3.5v17M3.5 12h17',
  tuer: 'M5 2.5h14v19H5ZM15 12h.01',
  wand: 'M2.5 5h19v14h-19ZM2.5 9.5h19M2.5 14.5h19M9 5v4.5M15 9.5V14.5M9 14.5V19',
  balkon: 'M3 3.5h18M4.5 3.5V10M19.5 3.5V10M3 10h18M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11M3 21h18',
  kueche: 'M3 3.5h18v17H3ZM3 10.5h18M6.5 6.5h.01M6.5 14h4M6.5 17h4M15 13.5h3v6h-3Z',
  keller: 'M3 10.5 12 3l9 7.5M5 9.5V15h14V9.5M3 15h18v6H3ZM8 18h.01M12 18h.01M16 18h.01',
  geschirr: 'M4.5 2.5h15v19h-15ZM4.5 7h15M7.5 4.5h.01M10.5 4.5h.01M12 10a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z',
};

/* Term to icon. Written against the normalised term: no article, and only
   the part before a slash. */
const TERMS: Record<string, string> = {
  /* Kleidung */
  'hose': 'hose', 'mantel': 'mantel', 'jacke': 'jacke', 'bluse': 'bluse',
  'guertel': 'guertel', 'hemd': 'hemd', 't-shirt': 'tshirt', 'pullover': 'pullover',
  'kleid': 'kleid', 'rock': 'rock', 'schuh': 'schuh', 'socke': 'socke',
  /* Körper */
  'kopf': 'kopf', 'gesicht': 'gesicht', 'auge': 'auge', 'ohr': 'ohr',
  'nase': 'nase', 'mund': 'mund', 'zahn': 'zahn', 'schulter': 'schulter',
  'arm': 'arm', 'hand': 'hand', 'bauch': 'bauch', 'ruecken': 'ruecken',
  'bein': 'bein', 'fuss': 'fuss', 'husten': 'husten', 'fieber': 'fieber',
  'schnupfen': 'schnupfen', 'schmerzen': 'schmerzen',
  /* Wohnung */
  'wohnung': 'wohnung', 'haus': 'haus', 'zimmer': 'zimmer',
  'wohnzimmer': 'sofa', 'schlafzimmer': 'bett', 'arbeitszimmer': 'schreibtisch',
  'badezimmer': 'dusche', 'kueche': 'kueche', 'balkon': 'balkon',
  'keller': 'keller', 'sofa': 'sofa', 'sessel': 'sessel', 'tisch': 'tisch',
  'esstisch': 'tisch', 'schreibtisch': 'schreibtisch', 'stuhl': 'stuhl',
  'fernseher': 'fernseher', 'bett': 'bett', 'kleiderschrank': 'kleiderschrank',
  'herd': 'herd', 'kuehlschrank': 'kuehlschrank',
  'geschirrspuelmaschine': 'geschirr', 'dusche': 'dusche',
  'waschbecken': 'waschbecken', 'toilette': 'toilette', 'teppich': 'teppich',
  'fenster': 'fenster', 'tuer': 'tuer', 'wand': 'wand',
};

/* Colours render as a swatch instead of a drawing. */
const SWATCHES: Record<string, string> = {
  rot: '#c8302b', blau: '#2a5cad', gelb: '#e8b83a', 'gruen': '#2f8f4e',
  schwarz: '#1d1d1f', weiss: '#fbfbfd', grau: '#8e8e93', braun: '#8a5a3b',
  dunkelbraun: '#4a2f1d', lila: '#7b4fa8', orange: '#e07a2f', rosa: '#e7a0bd',
  silber: '#c0c3c8', gold: '#c9a227',
};

/** Strips the article, plural marker and any alternative after a slash. */
function normalise(raw: string): string {
  return raw
    .toLowerCase()
    .split('/')[0]
    .replace(/\bpl\.?\b/g, '')
    .replace(/^(der|die|das)\s+/, '')
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/[^a-z0-9-]/g, '')
    .trim();
}

interface Art {
  kind: 'icon' | 'swatch';
  value: string;
}

function artFor(term: string): Art | null {
  const key = normalise(term);
  if (!key) return null;
  if (TERMS[key] && ICONS[TERMS[key]]) return { kind: 'icon', value: ICONS[TERMS[key]] };
  if (SWATCHES[key]) return { kind: 'swatch', value: SWATCHES[key] };
  return null;
}

/* --------------------------------------------------------------------- ui */

export function initVocabPreview(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.vocab div'));
  if (!items.length) return;

  const card = document.createElement('div');
  card.className = 'vp-card';
  card.setAttribute('aria-hidden', 'true');
  document.body.appendChild(card);

  let showTimer = 0;
  let visible = false;
  let pending: { x: number; y: number } | null = null;
  let frame = 0;

  function place(x: number, y: number): void {
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const pad = 14;
    /* Flip rather than clip when the cursor nears an edge. */
    let left = x + 18;
    let top = y + 18;
    if (left + w > window.innerWidth - pad) left = x - w - 18;
    if (top + h > window.innerHeight - pad) top = y - h - 18;
    card.style.transform = `translate3d(${Math.max(pad, left)}px, ${Math.max(pad, top)}px, 0)`;
  }

  /* Set while the pointer is inside an item, so a card cancelled mid-delay
     (by a scroll, say) can be rescheduled rather than lost until the pointer
     leaves and re-enters. */
  let hovered: { item: HTMLElement; art: Art } | null = null;

  function onMove(ev: PointerEvent): void {
    pending = { x: ev.clientX, y: ev.clientY };
    if (!visible && !showTimer && hovered) {
      const { item, art } = hovered;
      const x = ev.clientX;
      const y = ev.clientY;
      showTimer = window.setTimeout(() => {
        showTimer = 0;
        show(item, art, x, y);
      }, 130);
    }
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (pending && visible) place(pending.x, pending.y);
    });
  }

  function show(item: HTMLElement, art: Art, x: number, y: number): void {
    const dt = item.querySelector('dt');
    const dd = item.querySelector('dd');
    const term = dt ? dt.textContent || '' : '';
    const gloss = dd ? dd.textContent || '' : '';
    const body =
      art.kind === 'icon'
        ? `<svg class="vp-art" viewBox="${VIEW}" aria-hidden="true"><path d="${art.value}"/></svg>`
        : `<span class="vp-swatch" style="background:${art.value}"></span>`;
    card.innerHTML =
      `${body}<div class="vp-text"><span class="vp-term">${term}</span>` +
      `<span class="vp-gloss">${gloss}</span></div>`;
    /* Position before revealing, or the card flashes at its last location. */
    card.classList.add('measuring');
    place(x, y);
    card.classList.remove('measuring');
    card.classList.add('open');
    visible = true;
  }

  /* Anchored placement for touch: centred over the word, flipped below it if
     there is no room above. */
  function anchor(item: HTMLElement, art: Art, r: DOMRect): void {
    show(item, art, 0, 0);
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const pad = 12;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.min(Math.max(pad, left), window.innerWidth - w - pad);
    let top = r.top - h - 10;
    if (top < pad) top = r.bottom + 10;
    card.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  }

  function hide(): void {
    window.clearTimeout(showTimer);
    showTimer = 0;
    card.classList.remove('open');
    visible = false;
  }

  /* Input type is decided per event rather than once from a media query, so
     a laptop with both a trackpad and a touchscreen behaves correctly with
     whichever the reader actually used. */
  let lastPointer: string = 'mouse';
  document.addEventListener(
    'pointerdown',
    (ev: PointerEvent) => {
      lastPointer = ev.pointerType || 'mouse';
    },
    true
  );

  items.forEach((item) => {
    const dt = item.querySelector('dt');
    if (!dt) return;
    const art = artFor(dt.textContent || '');
    if (!art) return;
    item.classList.add('has-preview');

    item.addEventListener('pointerenter', (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse') return;
      /* A short delay stops cards firing while the pointer sweeps down a list
         on its way somewhere else. */
      window.clearTimeout(showTimer);
      hovered = { item, art };
      const x = ev.clientX;
      const y = ev.clientY;
      showTimer = window.setTimeout(() => {
        showTimer = 0;
        show(item, art, x, y);
      }, 130);
      item.addEventListener('pointermove', onMove as EventListener);
    });

    item.addEventListener('pointerleave', (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse') return;
      item.removeEventListener('pointermove', onMove as EventListener);
      hovered = null;
      hide();
    });

    /* Touch and pen have no hover, so the card is tapped open and anchored to
       the word instead of tracking a cursor. */
    item.addEventListener('click', (ev: MouseEvent) => {
      if (lastPointer === 'mouse') return;
      ev.stopPropagation();
      if (visible) {
        hide();
        return;
      }
      const r = item.getBoundingClientRect();
      anchor(item, art, r);
    });
  });

  document.addEventListener('click', () => {
    if (lastPointer !== 'mouse') hide();
  });

  window.addEventListener('scroll', hide, { passive: true });
}

