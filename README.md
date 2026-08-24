# Mein Deutsch Buddy

A German reference built while learning: grammar tables, themed vocabulary,
and an exam revision mode. Bilingual throughout, with three language modes
(German, English, or both).

Live: https://ziadashrafa98.github.io/MeinDeutschBuddy/

## Structure

```
index.html            homepage, three destinations
pages/
  grammatik.html      30 sections, 60 tables
  worten.html         8 themes, vocabulary with gender colour
  pruefung.html       exam revision: plan, drills, spoken practice
src/
  modules/            one module per concern
  pages/              one entry point per page
styles/
  index.css           @imports the rest, in load-bearing order
  tokens.css          variables and reset, must load first
  ...                 typography, layout, chrome, content, figures,
                      search, home, exam
  responsive.css      mobile and print, must load last
dist/                 compiled JS, committed so Pages can serve it
standalone/           single-file builds, generated
assets/               images and other static files
```

## Working on it

The site uses real ES modules, which browsers refuse to load over `file://`
because of CORS. So it needs a server:

```bash
npm install
npm run build     # compile TypeScript to dist/
npm run serve     # http://localhost:8000
```

`npm run dev` watches and recompiles on save.

**Always run `npm run build` before committing.** Pages serves `dist/`
directly with no build step, so stale compiled output ships stale behaviour.

## Standalone builds

`npm run standalone` inlines the CSS and flattens each entry point's import
graph into `standalone/`. Inline module scripts are exempt from the CORS rule,
so those four files open by double-click with no server. Useful offline or on
a phone.

They are generated output. Edit `src/` and `styles/`, never `standalone/`.

## Deployment

Settings → Pages → Source: **Deploy from a branch**, then pick the branch and
`/ (root)`. Any branch works, including `dev`.

`.nojekyll` is present so Pages serves the files as they are instead of
running them through Jekyll.

Because there is no build step on the server, `dist/` is committed on purpose.

## Notes

- Colour encodes meaning: the four cases have fixed hues, and the three
  genders borrow the same palette in vocabulary lists.
- Press `/` or `Ctrl`+`K` on the grammar and vocabulary pages to search.
- `styles/index.css` order is load-bearing: tokens define the variables
  everything else reads, responsive overrides last.
