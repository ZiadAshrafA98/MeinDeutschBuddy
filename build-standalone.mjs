/**
 * Inlines CSS and JS into single-file builds, written to standalone/.
 *
 * The served site uses real ES modules, which browsers refuse to load over
 * file:// because of CORS. Inline module scripts are exempt from that rule,
 * so these builds stay double-clickable while the served site stays modular.
 *
 * Run: npm run standalone
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');

/** Resolves the @import chain in styles/index.css into one stylesheet. */
function bundleCss() {
  const index = read('styles/index.css');
  return Array.from(index.matchAll(/@import url\("([^"]+)"\);/g))
    .map((m) => read(`styles/${m[1]}`))
    .join('\n');
}

/** Walks an entry point's import graph and flattens it in dependency order. */
function bundleJs(entry) {
  const seen = new Set();
  const out = [];

  function walk(file) {
    if (seen.has(file)) return;
    seen.add(file);
    if (!existsSync(file)) throw new Error(`Missing ${file}. Run npm run build first.`);
    const src = read(file);
    const dir = file.slice(0, file.lastIndexOf('/'));
    for (const m of src.matchAll(/^import\s+.*?from\s+'([^']+)';?$/gm)) {
      const resolved = new URL(m[1], `file:///${dir}/`).pathname.replace(/^\//, '');
      walk(resolved);
    }
    out.push(
      src
        .replace(/^import\s+.*?from\s+'[^']+';?$/gm, '')
        .replace(/^export\s+/gm, '')
        .replace(/^\/\/# sourceMappingURL=.*$/gm, '')
    );
  }

  walk(entry);
  return out.join('\n');
}

const css = bundleCss();
mkdirSync('standalone', { recursive: true });

function inline(src, out, entry, cssHref, jsSrc, swaps) {
  let html = read(src);
  const head = [
    [`  <link rel="stylesheet" href="${cssHref}">\n  <script type="module" src="${jsSrc}"></script>`,
     `  <style>\n${css}\n  </style>\n  <script type="module">\n${bundleJs(`dist/pages/${entry}.js`)}\n  </script>`],
  ];
  /* The head swap must land; a page never links to itself, so the rest are
     applied only where present. */
  for (const [find, replace] of head) {
    if (!html.includes(find)) throw new Error(`Pattern not found in ${src}: ${find.slice(0, 70)}`);
    html = html.replaceAll(find, replace);
  }
  for (const [find, replace] of swaps) html = html.replaceAll(find, replace);
  writeFileSync(out, html);
  console.log(`${out}  ${Math.round(html.length / 1024)} KB`);
}

/* Everything lands flat in standalone/, so cross-links lose their folders. */
inline('index.html', 'standalone/index.html', 'home', 'styles/index.css', 'dist/pages/home.js', [
  ['href="pages/grammatik.html"', 'href="grammatik.html"'],
  ['href="pages/woerter.html"', 'href="woerter.html"'],
  ['href="pages/pruefung.html"', 'href="pruefung.html"'],
]);

for (const page of ['grammatik', 'woerter', 'pruefung']) {
  inline(
    `pages/${page}.html`,
    `standalone/${page}.html`,
    page,
    '../styles/index.css',
    `../dist/pages/${page}.js`,
    [
      ['href="../index.html"', 'href="index.html"'],
      ['href="./grammatik.html"', 'href="grammatik.html"'],
      ['href="./woerter.html"', 'href="woerter.html"'],
      ['href="./pruefung.html"', 'href="pruefung.html"'],
    ]
  );
}
