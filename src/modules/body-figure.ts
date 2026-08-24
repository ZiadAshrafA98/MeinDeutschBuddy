/**
 * Mein Deutsch Buddy — body figure
 *
 * The Körper vocabulary describes positions on a body, so a labelled drawing
 * carries meaning a two-column word list cannot. Hovering a name lights the
 * part, hovering the part lights the name, and everything else recedes so the
 * pairing is unambiguous.
 */
export function initBodyFigure(): void {
  const found = document.querySelector<HTMLElement>('.body-figure');
  if (!found) return;
  const fig: HTMLElement = found;

  const labels = Array.from(fig.querySelectorAll<SVGGElement>('.bd-label'));
  const parts = Array.from(fig.querySelectorAll<SVGGElement>('.bd-part'));
  const chips = Array.from(fig.querySelectorAll<HTMLButtonElement>('.bd-chip'));

  /* A 2px stroke on a fill:none path is a 2px hover target. Each drawn shape
     gets a transparent twin with a fat stroke to catch the pointer, so the
     drawing is as easy to hover as the labels are. */
  parts.forEach((group) => {
    Array.from(group.querySelectorAll<SVGGeometryElement>('path, ellipse, circle')).forEach(
      (shape) => {
        if (shape.classList.contains('bd-solid')) return;
        const hit = shape.cloneNode(false) as SVGGeometryElement;
        hit.setAttribute('class', 'bd-hit');
        group.insertBefore(hit, group.firstChild);
      }
    );
  });

  /* The label group is mostly empty space: a thin leader line and some text.
     A transparent rect covering both texts, padded, makes the whole label
     region hoverable instead of just the glyphs. */
  labels.forEach((group) => {
    const texts = Array.from(group.querySelectorAll<SVGTextElement>('.bd-name'));
    if (!texts.length) return;
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;
    texts.forEach((t) => {
      const bb = t.getBBox();
      /* A text hidden by the current language mode reports a zero box at the
         origin, which would stretch the rect back to x=0 and leave every
         label overlapping every other. */
      if (!bb.width && !bb.height) return;
      x1 = Math.min(x1, bb.x);
      y1 = Math.min(y1, bb.y);
      x2 = Math.max(x2, bb.x + bb.width);
      y2 = Math.max(y2, bb.y + bb.height);
    });
    if (!isFinite(x1)) return;
    const pad = 6;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', 'bd-label-hit');
    rect.setAttribute('x', String(x1 - pad));
    rect.setAttribute('y', String(y1 - pad));
    rect.setAttribute('width', String(x2 - x1 + pad * 2));
    /* Room for the English line that appears underneath in DE+EN. */
    rect.setAttribute('height', String(y2 - y1 + pad * 2 + 15));
    group.insertBefore(rect, group.firstChild);
  });

  function setActive(part: string | null): void {
    fig.classList.toggle('focused', !!part);
    labels.forEach((l) => l.classList.toggle('on', l.dataset.part === part));
    parts.forEach((p) => p.classList.toggle('on', p.dataset.part === part));
    chips.forEach((c) => {
      const on = c.dataset.part === part;
      c.classList.toggle('on', on);
      c.setAttribute('aria-pressed', String(on));
    });
  }

  /* Labels and the drawing are two views of the same thing, so either one
     lighting up should light the other. */
  [...labels, ...parts].forEach((el) => {
    const part = el.dataset.part || null;
    el.addEventListener('pointerenter', (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse') return;
      setActive(part);
    });
    el.addEventListener('pointerleave', (ev: PointerEvent) => {
      if (ev.pointerType !== 'mouse') return;
      setActive(null);
    });
    el.addEventListener('focus', () => setActive(part));
    el.addEventListener('blur', () => setActive(null));
  });

  /* Touch: tapping the figure or a chip pins the highlight until it is
     tapped again, since there is nothing to hover away from. */
  let pinned: string | null = null;
  const toggle = (part: string | null): void => {
    pinned = pinned === part ? null : part;
    setActive(pinned);
  };

  chips.forEach((c) => c.addEventListener('click', () => toggle(c.dataset.part || null)));
  parts.forEach((p) =>
    p.addEventListener('click', () => {
      if (window.innerWidth <= 760) toggle(p.dataset.part || null);
    })
  );
  labels.forEach((l) => l.addEventListener('click', () => toggle(l.dataset.part || null)));
}

