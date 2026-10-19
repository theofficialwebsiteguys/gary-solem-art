#!/usr/bin/env node
/**
 * Image inventory + display-copy generator for Gary Solem Art.
 *
 *   npm run images            # process new/changed originals
 *   npm run images -- --force # regenerate everything
 *
 * Reads the original artwork under public/assets/<collection>/ (recursively),
 * never modifies those files, and writes:
 *
 *   public/images/<collection>/<slug>-<width>.webp   responsive display copies
 *   public/images/<collection>/<slug>-detail.webp    high-resolution copy for the zoom viewer
 *   public/images/social/og-image.jpg                social sharing image
 *   src/app/content/artwork-files.generated.ts      typed file inventory used by the site
 *
 * Curated data (alt text, captions, focal points, pairings) lives in
 * src/app/content/artwork-details.ts and is merged with this inventory at runtime.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC_ROOT = path.join(ROOT, 'public', 'assets');
const OUT_ROOT = path.join(ROOT, 'public', 'images');
const MANIFEST = path.join(ROOT, 'src', 'app', 'content', 'artwork-files.generated.ts');

/** Folders under public/assets that become collections, in display order. */
const COLLECTIONS = ['intro-images', 'collage-pieces', 'finding-reasons', 'lips'];

/** Display widths (px). Widths at or above an image's detail width are skipped. */
const WIDTHS = [480, 800, 1200, 1800, 2400];
const DISPLAY_QUALITY = 80;

/** Detail copy limits: long edge and total pixels (keeps mobile browsers from failing to decode). */
const DETAIL_MAX_EDGE = 7000;
const DETAIL_MAX_PIXELS = 16_000_000;
const DETAIL_QUALITY = 80;

/** Social sharing image: a crop of a single photograph (never a collage). */
const SOCIAL = {
  file: 'intro-images/1.arrivaor.png',
  width: 1200,
  height: 630,
  focus: [0.62, 0.78], // fractional x / y centre of the crop
};

const SUPPORTED = /\.(png|jpe?g|webp|tiff?)$/i;
const force = process.argv.includes('--force');

sharp.cache(false);

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return SUPPORTED.test(entry.name) ? [full] : [];
    });
}

function slugify(relPath) {
  return relPath
    .replace(/\.[^.]+$/, '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
}

/** "1a.Splash dragon-Edit.png" -> { sequence: 1, label: "1a" }; "our-Logan.png" -> null */
function parseSequence(fileName) {
  const match = /^(\d+)([a-z])?(?=[.\s_-])/i.exec(fileName);
  return match ? { sequence: Number(match[1]), label: match[0] } : null;
}

/** URL for the original file: each path segment encoded once, slashes preserved. */
function originalUrl(relFromPublic) {
  return relFromPublic.split(path.sep).map(encodeURIComponent).join('/');
}

function isFresh(outputs, sourceMtime) {
  if (force) return false;
  return outputs.every((file) => fs.existsSync(file) && fs.statSync(file).mtimeMs >= sourceMtime);
}

function cropRect(width, height, ratio, [fx, fy]) {
  let w = width;
  let h = Math.round(width / ratio);
  if (h > height) {
    h = height;
    w = Math.round(height * ratio);
  }
  const left = Math.min(Math.max(Math.round(fx * width - w / 2), 0), width - w);
  const top = Math.min(Math.max(Math.round(fy * height - h / 2), 0), height - h);
  return { left, top, width: w, height: h };
}

async function processImage(file, collection) {
  const relFromCollection = path.relative(path.join(SRC_ROOT, collection), file);
  const relFromPublic = path.relative(path.join(ROOT, 'public'), file);
  const fileName = path.basename(file);
  const slug = slugify(relFromCollection);
  const outDir = path.join(OUT_ROOT, collection);
  fs.mkdirSync(outDir, { recursive: true });

  const meta = await sharp(file, { limitInputPixels: false }).metadata();
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;

  const scale = Math.min(1, DETAIL_MAX_EDGE / Math.max(width, height), Math.sqrt(DETAIL_MAX_PIXELS / (width * height)));
  const detailW = Math.round(width * scale);
  const detailH = Math.round(height * scale);
  const widths = WIDTHS.filter((w) => w < detailW * 0.95);

  const urlFor = (suffix) => `images/${collection}/${slug}-${suffix}.webp`;
  const fileFor = (suffix) => path.join(outDir, `${slug}-${suffix}.webp`);
  const outputs = [...widths.map((w) => fileFor(w)), fileFor('detail')];

  if (!isFresh(outputs, fs.statSync(file).mtimeMs)) {
    // Decode the (very large) original once, then derive every size from that buffer.
    const base = await sharp(file, { limitInputPixels: false })
      .rotate()
      .resize(detailW, detailH, { kernel: 'lanczos3' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const raw = { raw: base.info };

    await sharp(base.data, raw).webp({ quality: DETAIL_QUALITY, effort: 5 }).toFile(fileFor('detail'));
    for (const w of widths) {
      await sharp(base.data, raw)
        .resize({ width: w, kernel: 'lanczos3' })
        .webp({ quality: DISPLAY_QUALITY, effort: 5 })
        .toFile(fileFor(w));
    }
    process.stdout.write(`  generated ${collection}/${fileName}\n`);
  } else {
    process.stdout.write(`  up to date ${collection}/${fileName}\n`);
  }

  const variants = widths.map((w) => ({ src: urlFor(w), width: w, height: Math.round((w * detailH) / detailW) }));
  const detail = { src: urlFor('detail'), width: detailW, height: detailH };
  // Small originals: the detail copy doubles as the largest display size.
  if (detailW <= WIDTHS[WIDTHS.length - 1]) variants.push(detail);

  const seq = parseSequence(fileName);
  return {
    id: `${collection}/${slug}`,
    collection,
    fileName: relFromCollection.split(path.sep).join('/'),
    originalSrc: originalUrl(relFromPublic),
    width,
    height,
    sequence: seq?.sequence ?? null,
    sequenceLabel: seq?.label ?? null,
    variants,
    detail,
    outputs: outputs.map((f) => path.resolve(f)),
  };
}

async function buildSocialImage() {
  const src = path.join(SRC_ROOT, SOCIAL.file);
  const out = path.join(OUT_ROOT, 'social', 'og-image.jpg');
  if (!fs.existsSync(src)) {
    console.warn(`! Social image source missing: ${SOCIAL.file}`);
    return null;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (!isFresh([out], fs.statSync(src).mtimeMs)) {
    const meta = await sharp(src, { limitInputPixels: false }).metadata();
    const rect = cropRect(meta.width, meta.height, SOCIAL.width / SOCIAL.height, SOCIAL.focus);
    await sharp(src, { limitInputPixels: false })
      .extract(rect)
      .resize(SOCIAL.width, SOCIAL.height)
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
    console.log('  generated social/og-image.jpg');
  }
  return path.resolve(out);
}

function removeStale(keep) {
  if (!fs.existsSync(OUT_ROOT)) return;
  for (const file of walk(OUT_ROOT)) {
    if (!keep.has(path.resolve(file))) {
      fs.unlinkSync(file);
      console.log(`  removed stale ${path.relative(OUT_ROOT, file)}`);
    }
  }
}

function writeManifest(entries) {
  const body = entries
    .map(({ outputs, ...entry }) => JSON.stringify(entry, null, 2).replace(/^/gm, '  '))
    .join(',\n');
  const ts = `// AUTO-GENERATED by scripts/build-images.mjs. Do not edit by hand: run \`npm run images\`.
// Curated alt text, captions and focal points live in artwork-details.ts.
import type { ArtworkFile } from './artwork.types';

export const ARTWORK_FILES: readonly ArtworkFile[] = [
${body},
];
`;
  fs.writeFileSync(MANIFEST, ts);
}

async function main() {
  if (!fs.existsSync(SRC_ROOT)) {
    console.error(`No originals found at ${path.relative(ROOT, SRC_ROOT)}`);
    process.exit(1);
  }
  const unknown = fs
    .readdirSync(SRC_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !COLLECTIONS.includes(d.name));
  for (const d of unknown) console.warn(`! Folder public/assets/${d.name} is not a configured collection and was skipped.`);

  const entries = [];
  for (const collection of COLLECTIONS) {
    const dir = path.join(SRC_ROOT, collection);
    if (!fs.existsSync(dir)) {
      console.warn(`! Collection folder missing: public/assets/${collection}`);
      continue;
    }
    console.log(collection);
    const slugs = new Set();
    for (const file of walk(dir)) {
      const entry = await processImage(file, collection);
      if (slugs.has(entry.id)) throw new Error(`Two files produce the same id "${entry.id}". Rename one of them.`);
      slugs.add(entry.id);
      entries.push(entry);
    }
  }

  const social = await buildSocialImage();
  const keep = new Set(entries.flatMap((e) => e.outputs));
  if (social) keep.add(social);
  removeStale(keep);
  writeManifest(entries);
  console.log(`\n${entries.length} artworks written to ${path.relative(ROOT, MANIFEST)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
