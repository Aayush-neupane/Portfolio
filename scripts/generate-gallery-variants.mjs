/**
 * Generates responsive AVIF variants for every photo in public/data/gallery.json.
 *
 *  <name>-thumb.avif  (480px wide)  for grids, rails and cards
 *  <name>-mid.avif    (960px wide)  for the lightbox
 *
 * Originals are never upscaled and never overwritten. Outputs are skipped when
 * newer than their source, so re-runs are cheap. Run:
 *
 *   npm run gallery:variants
 *
 * Requires `sharp` to be resolvable (npm i -D sharp). The generated files are
 * committed; the grid falls back to the original JPEG when a variant is absent.
 */
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const galleryDir = join(root, 'public', 'assets', 'images', 'gallery');

const VARIANTS = [
  { suffix: 'thumb', width: 480, quality: 52, effort: 4 },
  { suffix: 'mid', width: 960, quality: 60, effort: 4 },
];

function loadSharp() {
  const req = createRequire(join(root, 'package.json'));
  const candidates = ['sharp', '/Users/bhaktidhungel/node_modules/sharp'];
  for (const id of candidates) {
    try {
      return req(id);
    } catch {
      /* try next */
    }
  }
  console.error(
    'gallery:variants needs the `sharp` package (npm i -D sharp) to encode AVIF.'
  );
  process.exit(1);
}

const sharp = loadSharp();
const gallery = JSON.parse(
  readFileSync(join(root, 'public', 'data', 'gallery.json'), 'utf8')
);
const photos = [...(gallery.featured || []), ...(gallery.photos || [])];
mkdirSync(galleryDir, { recursive: true });

let made = 0;
let skipped = 0;
for (const photo of photos) {
  const file = basename(photo.src || '');
  const base = file.slice(0, -extname(file).length);
  if (!base) continue;
  const input = join(galleryDir, file);
  if (!existsSync(input)) {
    console.warn(`missing source, skipping: ${file}`);
    continue;
  }
  const inputMtime = statSync(input).mtimeMs;
  for (const v of VARIANTS) {
    const out = join(galleryDir, `${base}-${v.suffix}.avif`);
    if (existsSync(out) && statSync(out).mtimeMs >= inputMtime) {
      skipped++;
      continue;
    }
    await sharp(input, { failOn: 'none' })
      .rotate()
      .resize({ width: v.width, withoutEnlargement: true })
      .avif({ quality: v.quality, effort: v.effort })
      .toFile(out);
    made++;
    console.log(`wrote ${basename(out)}`);
  }
}
console.log(`done: ${made} written, ${skipped} up to date, ${photos.length} photos`);
