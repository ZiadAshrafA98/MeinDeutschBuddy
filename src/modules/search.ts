/**
 * Mein Deutsch Buddy — search
 *
 * The document is 54,000px tall and the median section is 1,252px, so a
 * search that returns section links hands you a haystack and calls it an
 * answer. The unit of value here is the row: 461 table rows averaging 45
 * characters, plus 180 vocab entries and 78 rule bullets. Results therefore
 * render the fact itself, and jumping to context is the secondary action.
 *
 * The index is built from the live DOM at load rather than maintained
 * separately, so it can never drift from the content. The whole corpus is
 * 8,561 words, which makes that free.
 */

type EntryType = 'row' | 'vocab' | 'rule' | 'note' | 'section';

interface Entry {
  key: string;
  keyFold: string;
  cells: string[];
  cellsFold: string[];
  text: string;
  textFold: string;
  context: string;
  sectionId: string;
  sectionTitle: string;
  kase: string | null;
  type: EntryType;
  el: HTMLElement | null;
  /* Position of the owning section in the document. The page is ordered from
     fundamentals outwards, so an earlier section is the more canonical home
     for a form: "dem" belongs to the article table, not to the demonstrative
     and relative tables that repeat it. */
  order: number;
}

const MAX_RESULTS = 24;

/* ------------------------------------------------------------- normalising */

/**
 * Folds the query and the corpus into the same shape. Umlauts and ß are the
 * point: on a keyboard without them, "fur" has to find "für" and "gross" has
 * to find "große", or search fails exactly when it is most needed.
 */
function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Reads an element's text including anything the current language mode has
 * hidden. innerText would drop the English spans in DE mode and the
 * translation lines outside EN mode, which would make the index depend on
 * which button was last pressed.
 */
function readText(el: Element): string {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.en, .tr').forEach((n) => {
    n.textContent = ' · ' + (n.textContent || '').trim();
  });
  return (clone.textContent || '').replace(/\s+/g, ' ').trim();
}

const sectionOrder = new Map<string, number>();
document.querySelectorAll('section.topic').forEach((s, i) => sectionOrder.set(s.id, i));

function sectionOf(el: Element): { id: string; title: string; order: number } {
  const sec = el.closest('section.topic');
  if (!sec) return { id: '', title: '', order: 99 };
  const h2 = sec.querySelector('h2');
  return {
    id: sec.id,
    title: h2 ? readText(h2).split(' · ')[0] : sec.id,
    order: sectionOrder.get(sec.id) ?? 99,
  };
}

/* ---------------------------------------------------------------- indexing */

function buildIndex(): Entry[] {
  const out: Entry[] = [];

  const push = (e: Omit<Entry, 'keyFold' | 'cellsFold' | 'textFold'>): void => {
    if (!e.text) return;
    out.push({
      ...e,
      keyFold: fold(e.key),
      cellsFold: e.cells.map(fold),
      textFold: fold(e.text),
    });
  };

  /* Table rows. The row on its own is often meaningless ("Dativ: dem, der,
     dem"), so each carries its caption and column headers as context. */
  document.querySelectorAll<HTMLTableRowElement>('tbody tr').forEach((tr) => {
    const table = tr.closest('table');
    const caption = table?.querySelector('caption');
    const heads = Array.from(table?.querySelectorAll('thead th') ?? []).map(readText);
    const cellEls = Array.from(tr.children) as HTMLElement[];
    const cells = cellEls.map(readText);
    const { id, title, order } = sectionOf(tr);
    const labelled = cells
      .map((c, i) => (heads[i] && i > 0 ? `${heads[i]}: ${c}` : c))
      .filter(Boolean);
    push({
      key: cells[0] || '',
      cells,
      text: labelled.join(' · '),
      context: caption ? readText(caption) : title,
      sectionId: id,
      sectionTitle: title,
      kase: tr.getAttribute('data-case'),
      type: 'row',
      el: tr,
      order,
    });
  });

  /* Vocab entries: term plus gloss, with grammatical gender preserved. */
  document.querySelectorAll<HTMLElement>('.vocab div').forEach((row) => {
    const dt = row.querySelector('dt');
    const dd = row.querySelector('dd');
    if (!dt) return;
    const term = readText(dt);
    const gloss = dd ? readText(dd) : '';
    const { id, title, order } = sectionOf(row);
    const gender = dt.classList.contains('g-m')
      ? 'dat'
      : dt.classList.contains('g-f')
        ? 'akk'
        : dt.classList.contains('g-n')
          ? 'nom'
          : null;
    push({
      key: term,
      cells: [term, gloss],
      text: `${term} · ${gloss}`,
      context: title,
      sectionId: id,
      sectionTitle: title,
      kase: gender,
      type: 'vocab',
      el: row,
      order,
    });
  });

  /* Labels on the body figure. These replaced a vocabulary list, so without
     this the eighteen body parts would silently vanish from search. */
  document.querySelectorAll<SVGGElement>('.bd-label').forEach((label) => {
    const de = label.querySelector('.bd-name.de')?.textContent?.trim() || '';
    const en = label.querySelector('.bd-name.en')?.textContent?.trim() || '';
    if (!de) return;
    const { id, title, order } = sectionOf(label);
    push({
      key: de,
      cells: [de, en],
      text: `${de} · ${en}`,
      context: 'Körper',
      sectionId: id,
      sectionTitle: title,
      kase: null,
      type: 'vocab',
      el: label as unknown as HTMLElement,
      order,
    });
  });

  /* Rule bullets: short, declarative, often the actual answer to a "when do
     I use X" question. */
  document.querySelectorAll<HTMLElement>('.rule li').forEach((li) => {
    const { id, title, order } = sectionOf(li);
    const tag = li.closest('.rule')?.querySelector('.tag');
    push({
      key: '',
      cells: [],
      text: readText(li),
      context: tag ? readText(tag) : title,
      sectionId: id,
      sectionTitle: title,
      kase: null,
      type: 'rule',
      el: li,
      order,
    });
  });

  /* Explanations. Only the first paragraph; the flip gives the rest. */
  document.querySelectorAll<HTMLElement>('.note').forEach((note) => {
    const { id, title, order } = sectionOf(note);
    push({
      key: '',
      cells: [],
      text: readText(note),
      context: title,
      sectionId: id,
      sectionTitle: title,
      kase: null,
      type: 'note',
      el: note,
      order,
    });
  });

  /* Sections, so the palette can also do the nav's job — which matters most
     on mobile, where the nav is behind a drawer. */
  document.querySelectorAll<HTMLElement>('section.topic').forEach((sec) => {
    const h2 = sec.querySelector('h2');
    const gloss = sec.querySelector('.gloss');
    if (!h2) return;
    const title = readText(h2);
    push({
      key: title,
      cells: [title],
      text: `${title} · ${gloss ? readText(gloss) : ''}`,
      context: '',
      sectionId: sec.id,
      sectionTitle: title,
      kase: null,
      type: 'section',
      el: sec,
      order: sectionOrder.get(sec.id) ?? 99,
    });
  });

  return out;
}

/* ----------------------------------------------------------------- scoring */

/**
 * Deliberately not fuzzy. Prefix, substring and word-boundary matching over
 * folded text covers the realistic cases; typo tolerance and synonyms make
 * ranking worse long before they make it better.
 */
function scoreToken(e: Entry, q: string): number {
  let best = 0;

  if (e.keyFold === q) best = Math.max(best, 1000);
  else if (e.keyFold.startsWith(q)) best = Math.max(best, 700);

  for (const c of e.cellsFold) {
    if (c === q) best = Math.max(best, 900);
    else if (c.startsWith(q)) best = Math.max(best, 620);
  }

  if (!best && e.keyFold.includes(q)) best = 450;

  if (!best) {
    const i = e.textFold.indexOf(q);
    if (i === 0) best = 320;
    else if (i > 0) best = /\s|·/.test(e.textFold[i - 1] || '') ? 300 : 150;
  }

  if (!best) return 0;

  /* Sections rank up for short queries so navigation intent surfaces fast,
     and down for long ones where the user clearly wants a fact. */
  if (e.type === 'section') best += q.length <= 4 ? 140 : -60;
  if (e.type === 'row' || e.type === 'vocab') best += 40;
  if (e.type === 'note') best -= 40;

  /* Prefer the tersest entry that matches: "dem" should land on a table row,
     not on a sentence that happens to contain it. */
  best -= Math.min(120, e.text.length / 6);

  /* And among equals, prefer the earlier, more fundamental section. */
  best += Math.max(0, 70 - e.order * 2.2);
  return best;
}

interface Hit {
  e: Entry;
  s: number;
}

function search(index: Entry[], raw: string): Hit[] {
  const q = fold(raw);
  if (!q) return [];
  const tokens = q.split(' ').filter(Boolean);

  const scored: Array<{ e: Entry; s: number }> = [];
  for (const e of index) {
    let total = 0;
    let ok = true;
    for (const t of tokens) {
      const s = scoreToken(e, t);
      if (!s) {
        ok = false;
        break;
      }
      total += s;
    }
    if (!ok) continue;
    /* Reward the whole phrase appearing intact. */
    if (tokens.length > 1 && e.textFold.includes(q)) total += 250;
    scored.push({ e, s: total / tokens.length });
  }

  scored.sort((a, b) => b.s - a.s);

  /* Several tables repeat the same paradigm verbatim, so an unfiltered list
     can open with three identical lines. Keep the best-ranked of each. */
  const seen = new Set<string>();
  const unique: Hit[] = [];
  for (const hit of scored) {
    if (seen.has(hit.e.textFold)) continue;
    seen.add(hit.e.textFold);
    unique.push(hit);
    if (unique.length >= MAX_RESULTS) break;
  }
  return unique;
}

/* ------------------------------------------------------------------ markup */

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;'
  );
}

/** Marks every folded occurrence of the query in the original string. */
function highlight(text: string, q: string): string {
  if (!q) return esc(text);
  const foldedText = fold(text);
  const tokens = Array.from(new Set(fold(q).split(' ').filter(Boolean)));
  const hits: Array<[number, number]> = [];
  for (const t of tokens) {
    let i = foldedText.indexOf(t);
    while (i !== -1) {
      hits.push([i, i + t.length]);
      i = foldedText.indexOf(t, i + t.length);
    }
  }
  if (!hits.length) return esc(text);
  hits.sort((a, b) => a[0] - b[0]);

  /* Folding can change length (ß becomes ss), so only use these offsets when
     the two strings still line up. */
  if (foldedText.length !== text.length) return esc(text);

  let out = '';
  let cursor = 0;
  for (const [s, e] of hits) {
    if (s < cursor) continue;
    out += esc(text.slice(cursor, s)) + '<mark>' + esc(text.slice(s, e)) + '</mark>';
    cursor = e;
  }
  return out + esc(text.slice(cursor));
}

const TYPE_LABEL: Record<EntryType, string> = {
  section: 'Kapitel',
  row: 'Tabellen',
  vocab: 'Wortschatz',
  rule: 'Regeln',
  note: 'Erklärungen',
};

/* Groups appear in this order only when tied; otherwise the group holding the
   single best hit leads, so relevance still governs what you see first. */
const TYPE_ORDER: EntryType[] = ['section', 'row', 'vocab', 'rule', 'note'];

function clamp(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}

/**
 * Splits an entry into three tiers: where it lives, what it is, and what it
 * says. A single undifferentiated line gives the eye nothing to land on, and
 * scanning collapses.
 */
function tiers(e: Entry): { crumb: string; title: string; detail: string } {
  const sec = e.sectionTitle;
  switch (e.type) {
    case 'row': {
      const caption = e.context && e.context !== sec ? `${sec} › ${e.context}` : sec;
      const rest = e.cells.slice(1).filter(Boolean).join('  ·  ');
      return { crumb: clamp(caption, 62), title: e.cells[0] || sec, detail: rest };
    }
    case 'vocab':
      return { crumb: sec, title: e.cells[0] || '', detail: e.cells[1] || '' };
    case 'section':
      return { crumb: 'Kapitel', title: e.key, detail: e.text.replace(`${e.key} · `, '') };
    default:
      return {
        crumb: e.context && e.context !== sec ? `${sec} › ${e.context}` : sec,
        title: clamp(e.text, 150),
        detail: '',
      };
  }
}

function renderResult(e: Entry, q: string, active: boolean, i: number): string {
  const t = tiers(e);
  const kase = e.kase ? ` data-case="${e.kase}"` : '';
  return (
    `<li class="sr${active ? ' active' : ''}"${kase} role="option" data-i="${i}" ` +
    `aria-selected="${active}">` +
    `<div class="sr-crumb">${esc(t.crumb)}</div>` +
    `<div class="sr-title">${highlight(t.title, q)}</div>` +
    (t.detail ? `<div class="sr-detail">${highlight(t.detail, q)}</div>` : '') +
    `</li>`
  );
}

/** Groups hits by type, ordering groups by the strongest hit inside each. */
function renderGrouped(hits: Hit[], q: string): { html: string; flat: Entry[] } {
  const buckets = new Map<EntryType, Hit[]>();
  hits.forEach((h) => {
    const arr = buckets.get(h.e.type) ?? [];
    arr.push(h);
    buckets.set(h.e.type, arr);
  });

  const groups = Array.from(buckets.entries()).sort((a, b) => {
    const best = Math.max(...b[1].map((h) => h.s)) - Math.max(...a[1].map((h) => h.s));
    return best !== 0 ? best : TYPE_ORDER.indexOf(a[0]) - TYPE_ORDER.indexOf(b[0]);
  });

  const flat: Entry[] = [];
  let html = '';
  for (const [type, list] of groups) {
    html += `<li class="sr-group" role="presentation">${TYPE_LABEL[type]}</li>`;
    for (const h of list) {
      html += renderResult(h.e, q, flat.length === 0, flat.length);
      flat.push(h.e);
    }
  }
  return { html, flat };
}

/* --------------------------------------------------------------------- ui */

export function initSearch(): void {
  if (!document.querySelector('section.topic')) return;

  const index = buildIndex();
  let results: Entry[] = [];
  let cursor = 0;
  let open = false;

  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Suchen');
  overlay.innerHTML =
    '<div class="search-panel">' +
    '<div class="search-field">' +
    '<button type="button" class="search-back" aria-label="Suche schließen">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg></button>' +
    '<svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><line x1="15.8" y1="15.8" x2="21" y2="21"/></svg>' +
    '<input type="text" class="search-input" autocomplete="off" spellcheck="false" ' +
    'placeholder="Wort, Form oder Kapitel suchen" aria-label="Suchen" ' +
    'role="combobox" aria-expanded="true" aria-controls="search-results">' +
    '<button type="button" class="search-clear" aria-label="Eingabe löschen" hidden>' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
    '<button type="button" class="search-close" aria-label="Suche schließen">Esc</button>' +
    '</div>' +
    '<ul class="search-results" id="search-results" role="listbox"></ul>' +
    '<div class="search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> bewegen</span>' +
    '<span><kbd>↵</kbd> öffnen</span><span class="search-count"></span></div>' +
    '</div>';

  document.body.appendChild(overlay);

  const input = overlay.querySelector<HTMLInputElement>('.search-input')!;
  const list = overlay.querySelector<HTMLUListElement>('.search-results')!;
  const count = overlay.querySelector<HTMLElement>('.search-count')!;
  const clearBtn = overlay.querySelector<HTMLButtonElement>('.search-clear')!;
  const closeBtn = overlay.querySelector<HTMLButtonElement>('.search-close')!;
  const backBtn = overlay.querySelector<HTMLButtonElement>('.search-back')!;

  /* Before anything is typed the palette lists the chapters, so it doubles as
     navigation rather than showing an empty box. */
  const sections = index.filter((e) => e.type === 'section');

  function draw(): void {
    const q = input.value.trim();
    clearBtn.hidden = !q;
    cursor = 0;

    if (!q) {
      const hits = sections.map((e) => ({ e, s: 1 }));
      const g = renderGrouped(hits, '');
      list.innerHTML = g.html;
      results = g.flat;
      count.textContent = `${sections.length} Kapitel`;
      list.scrollTop = 0;
      return;
    }

    const hits = search(index, q);
    if (!hits.length) {
      results = [];
      list.innerHTML =
        '<li class="sr-empty"><span class="sr-empty-q">Keine Treffer für „' +
        esc(q) +
        '“</span>Versuch ein einzelnes Wort, zum Beispiel <b>dem</b>, <b>weil</b> ' +
        'oder <b>Dativ</b>. Umlaute sind egal: <b>fur</b> findet <b>für</b>.</li>';
      count.textContent = '0 Treffer';
      return;
    }

    const g = renderGrouped(hits, q);
    list.innerHTML = g.html;
    results = g.flat;
    count.textContent = `${results.length} Treffer`;
    list.scrollTop = 0;
  }

  function moveCursor(delta: number): void {
    if (!results.length) return;
    const items = list.querySelectorAll<HTMLElement>('.sr[data-i]');
    items[cursor]?.classList.remove('active');
    items[cursor]?.setAttribute('aria-selected', 'false');
    cursor = (cursor + delta + results.length) % results.length;
    const next = items[cursor];
    if (next) {
      next.classList.add('active');
      next.setAttribute('aria-selected', 'true');
      next.scrollIntoView({ block: 'nearest' });
    }
  }

  function choose(i: number): void {
    const e = results[i];
    if (!e) return;
    close();
    const target = e.el ?? document.getElementById(e.sectionId);
    if (!target) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* Sections go to their top; a fact is centred, since its meaning usually
       depends on the rows around it. */
    if (e.type === 'section') {
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    } else {
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }
    target.classList.add('search-flash');
    window.setTimeout(() => target.classList.remove('search-flash'), 1800);
  }

  function openPalette(): void {
    if (open) return;
    open = true;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    input.value = '';
    draw();
    /* iOS needs the focus in the same gesture turn to raise the keyboard. */
    input.focus();
  }

  function close(): void {
    if (!open) return;
    open = false;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  input.addEventListener('input', draw);

  closeBtn.addEventListener('click', close);
  backBtn.addEventListener('click', close);

  clearBtn.addEventListener('click', () => {
    input.value = '';
    draw();
    input.focus();
  });

  input.addEventListener('keydown', (ev: KeyboardEvent) => {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      moveCursor(1);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      moveCursor(-1);
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      choose(cursor);
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      close();
    }
  });

  list.addEventListener('click', (ev: MouseEvent) => {
    const li = (ev.target as HTMLElement).closest('.sr[data-i]') as HTMLElement | null;
    if (!li) return;
    choose(Number(li.dataset.i));
  });

  overlay.addEventListener('mousedown', (ev: MouseEvent) => {
    if (ev.target === overlay) close();
  });

  document.querySelectorAll('[data-search-open]').forEach((btn) => {
    btn.addEventListener('click', openPalette);
  });

  document.addEventListener('keydown', (ev: KeyboardEvent) => {
    const k = ev.key.toLowerCase();
    if ((ev.metaKey || ev.ctrlKey) && k === 'k') {
      ev.preventDefault();
      open ? close() : openPalette();
      return;
    }
    if (open && ev.key === 'Escape') {
      close();
      return;
    }
    /* Slash opens search, but not while the user is typing somewhere else. */
    const t = ev.target as HTMLElement;
    const typing = /^(input|textarea|select)$/i.test(t.tagName) || t.isContentEditable;
    if (!open && !typing && ev.key === '/') {
      ev.preventDefault();
      openPalette();
    }
  });
}

