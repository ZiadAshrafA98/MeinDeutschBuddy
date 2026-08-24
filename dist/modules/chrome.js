/**
 * Mein Deutsch Buddy — page chrome
 *
 * Every page shares the same shell: language modes, case focus, theme and
 * navigation. Pages differ only in what they add on top, so this is the one
 * import an entry point always needs.
 */
import { initLang } from './lang.js';
import { initFocus } from './focus.js';
import { initTheme } from './theme.js';
import { initSegments } from './seg.js';
import { initStickyBar, initNav } from './nav.js';
export function initChrome() {
    initTheme();
    initLang();
    initFocus();
    initSegments();
    initStickyBar();
    initNav();
}
//# sourceMappingURL=chrome.js.map