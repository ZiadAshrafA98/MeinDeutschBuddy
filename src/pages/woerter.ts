/** Entry point: Wortschatz */
import { initChrome } from '../modules/chrome.js';
import { initSearch } from '../modules/search.js';
import { initVocabPreview } from '../modules/vocab-preview.js';
import { initBodyFigure } from '../modules/body-figure.js';

initChrome();
initSearch();
initVocabPreview();
initBodyFigure();
