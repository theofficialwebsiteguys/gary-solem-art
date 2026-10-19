# Gary Solem Art — garysolemart.com

The website for Gary Solem's beach mandalas and photography. It is an Angular 19 single-page app with standalone components, signals, and SCSS custom properties, and it has no backend.

Routes: `/` Home · `/my-art` · `/direct-photography` · `/wave-photography` · `/contact-me` · anything else → a not-found page.

**Before launch:** see [Launch blockers](#launch-blockers). Content questions for Gary are in [CONTENT_REVIEW.md](CONTENT_REVIEW.md).

## Run and build

```bash
npm install
npm start            # dev server at http://localhost:4200
npm run build        # production build → dist/gary-solem-art/browser
npm run images       # regenerate optimized images after adding or changing originals
npm run deploy:gh-pages  # build and publish to the gh-pages branch (see GitHub Pages below)
npm test             # Karma unit tests (needs Chrome; with only Edge installed, set CHROME_BIN to msedge.exe)
```

## How images work

- **Originals** live in `public/assets/<collection>/` (`intro-images`, `collage-pieces`, `finding-reasons`, `lips`). They are never modified. Together they are about 1.7 GB, with single files up to 155 MB and 15,000 px wide, so **they are excluded from the build** (`"ignore": ["assets/**"]` in `angular.json`).
- **`npm run images`** (`scripts/build-images.mjs`, using `sharp`) reads every original and writes:
  - WebP display copies at 480–2400 px, plus a high-resolution `-detail.webp` (up to 7000 px / 16 MP) for the zoom viewer, in `public/images/<collection>/`. All of these come to about 97 MB.
  - `public/images/social/og-image.jpg`, the 1200×630 social image cropped from `1.arrivaor.png`.
  - `src/app/content/artwork-files.generated.ts`, the typed inventory: ids, exact original URLs, dimensions, numeric prefixes and variants.
  It only processes new or changed files. Use `-- --force` to rebuild everything.
- **`public/images/` is committed**, because the deployed site depends on it. The originals are git-ignored: GitHub rejects files over 100 MB, and five of them are larger than that. Keep them backed up elsewhere, or use Git LFS.
- If you do want originals downloadable and your host allows large files, remove the `ignore` entry. Then `originalSrc` in the manifest is a working URL.

## Adding artwork, captions and ordering

1. Put the file in the right `public/assets/<collection>/` folder. Filenames may contain spaces and punctuation.
2. Run `npm run images`. The image now appears on its page automatically; no template edits are needed.
3. Describe it in `src/app/content/artwork-details.ts`, using the id printed in `artwork-files.generated.ts`:
   - `alt`: what is visible. Required for accessibility.
   - `format`: `'single'` for one photograph (it may be cropped for thumbnails), or `'composite'` for collages, diptychs, bordered or captioned pieces (never cropped). Unknown files default to `composite`.
   - `textId`: pairs the image with Gary's numbered text, for example `'lips-8'`.
   - `transcript`: text that is lettered inside the artwork, copied exactly.
   - `title`: only once Gary confirms it.
   - `order`: overrides the default order, which is the numeric filename prefix, then the filename.
4. Gary's words live in `src/app/content/site-text.ts`, stored verbatim. Poems keep their line breaks (`\n`). A `null` text means "pending" and is not shown.

Page layouts follow each image's aspect ratio: wide pieces get full rows, medium pieces pair up, and very tall pieces get a side column.

## Featured images, hero and focal points

All featured choices are in `src/app/content/page-copy.ts`:

- `HOME.hero.slides`: the carousel images, in order. Each has an `artworkId`, a `focal` (desktop) and a `mobileFocal` (phone). Use single photographs only, because the hero fills the screen.
- `HOME.explore.items[].image`, `markInTheSand.image`, `tideReturns.image`, `perspective.image` and `CONTACT_PAGE.image`.

Focal points are CSS `object-position` values, such as `'78% 80%'` (x then y), and mark the part of the photo to keep. `fit: 'cover'` is ignored for composites, which always show whole.

## Brand colors and fonts

Design tokens are at the top of `src/styles.scss`: `--ivory`, `--sand`, `--mist`, `--footer-mist`, `--ink`, `--slate`, `--ochre`. `--ochre-text` (#80592B) is a darker ochre used for small text, because the brand ochre #A47B46 is only 3.1–3.5:1 against the backgrounds.

Fonts are self-hosted through `@fontsource-variable` (registered in `angular.json` → `styles`). They are open-license fonts chosen to fit the brief, not the mockup's exact fonts:
- **Cormorant Garamond**: headings and the wordmark.
- **Nunito Sans**: body text and navigation.
- **Caveat**: the occasional handwritten quote. Ink Free ships with Windows and can't be self-hosted without a license, so Caveat stands in for it.

## Contact details and form

Edit `src/app/content/contact.config.ts` with **verified** values only:

```ts
export const CONTACT: ContactConfig = {
  email: 'gary@example.com',      // shown as a mailto link
  phone: null,                    // shown as a tel: link
  formEndpoint: 'https://formspree.io/f/xxxxxxx', // enables the form
};
```

The form sends `POST` JSON `{ name, email, message }` with `Accept: application/json`. It shows success only after a 2xx response, and shows an error (keeping what the visitor typed) otherwise. Any service that accepts JSON works, including Formspree or a serverless function. While all three values are `null`, the page says "Contact details will be available here soon." and shows no form.

## GitHub Pages

```bash
npm run deploy:gh-pages
```

This builds the site for `https://theofficialwebsiteguys.github.io/gary-solem-art/` and replaces the `gh-pages` branch with the build output. It also adds `404.html`, so direct links like `/my-art` work, and `.nojekyll`. In the repository settings, **Settings → Pages → Build and deployment** must be set to **Deploy from a branch → `gh-pages` / `(root)`**.

Preview hosts such as github.io get `noindex` automatically, so the preview won't compete with garysolemart.com in search results.

When garysolemart.com points to GitHub Pages, deploy at the domain root with a CNAME file:

```bash
npm run deploy:gh-pages -- --base-href / --cname garysolemart.com
```

(From Git Bash, prefix that with `MSYS_NO_PATHCONV=1`, or Git Bash turns `/` into a Windows path.)

The originals in `public/assets/` are git-ignored (see `.gitignore`), so keep a backup of them elsewhere.

## SEO and deployment

- `src/app/content/site.config.ts`: `origin` (canonical URLs) and `indexableHosts`. Any other host, such as a preview deploy, staging or localhost, automatically gets `noindex`.
- `public/sitemap.xml` and `public/robots.txt` list the five public routes on `https://garysolemart.com`.
- Each route sets its title, description, canonical URL and Open Graph tags. `src/index.html` has defaults for crawlers that don't run JavaScript. Prerendering (`ng add @angular/ssr`) would improve this further and is optional.
- **The host must serve `index.html` for unknown paths**, or direct visits to `/my-art` will 404. For example:
  - Netlify: `public/_redirects` containing `/*  /index.html  200`
  - Vercel: `vercel.json` → `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
  - Firebase: `"rewrites": [{ "source": "**", "destination": "/index.html" }]`
  - Nginx: `try_files $uri $uri/ /index.html;`
  - Apache: `FallbackResource /index.html`

  Deploy the folder `dist/gary-solem-art/browser`.

## Launch blockers

1. **Contact method**: no email, phone or form endpoint has been supplied (see above).
2. **Hosting**: the SPA fallback and the domain / DNS for garysolemart.com are not set up yet.
3. **Originals**: decide where the full-size originals are backed up. They are not in git.
4. **Content sign-off**: Gary should review the pairings, transcripts, alt text and pending poems 8 and 10 in [CONTENT_REVIEW.md](CONTENT_REVIEW.md), and the result should be compared with the approved light mockup.

`public/favicon.ico` is still Angular's default icon. The site links its own `favicon.svg` and PNG icons instead; replace the `.ico` when a final icon exists.
