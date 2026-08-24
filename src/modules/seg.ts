/**
 * Mein Deutsch Buddy — segmented control
 * A single pill that slides to the pressed chip.
 */


/* ------------------------------------------------------- segmented control */

/* The pressed pill used to appear on one chip and vanish from another. A
   single indicator element per group slides and resizes to the pressed chip
   instead, so DE to DE+EN reads as one object moving. It watches aria-pressed
   rather than being called from setLang and setFocus, so it stays correct no
   matter what changes the state. */
export function initSegments(): void {
  document.querySelectorAll<HTMLElement>('.ctrl-group').forEach((group) => {
    const chips = Array.from(group.querySelectorAll<HTMLButtonElement>('.chip'));
    if (!chips.length) return;

    const indicator = document.createElement('span');
    indicator.className = 'seg-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    group.prepend(indicator);

    const sync = (): void => {
      const on = group.querySelector<HTMLButtonElement>('.chip[aria-pressed="true"]');
      /* The case group has no pressed chip when no case is focused. */
      group.classList.toggle('has-active', !!on);
      if (!on) return;
      indicator.style.width = `${on.offsetWidth}px`;
      indicator.style.transform = `translateX(${on.offsetLeft}px)`;
    };

    const observer = new MutationObserver(sync);
    chips.forEach((c) =>
      observer.observe(c, { attributes: true, attributeFilter: ['aria-pressed'] })
    );
    window.addEventListener('resize', sync);
    /* Web fonts change chip widths after load. */
    if (document.fonts?.ready) void document.fonts.ready.then(sync);

    sync();
    /* Position first, animate after, or the pill slides in from the left on
       page load. */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => group.classList.add('seg-ready'));
    });
  });
}
