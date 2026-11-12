/**
 * Generates 1200x630 Open Graph cards for every gallery frame.
 *
 *  public/assets/og/gallery-<id>.jpg
 *
 * The source is the already-watermarked JPEG, centre-cropped so the
 * watermark stays in frame. Existing cards are skipped when newer than the
 * source. Run:
 *
 *   npm run gallery:og
 */
import { readFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'public', 'data', 'gallery.json'), 'utf8'));
const outDir = join(root, 'public', 'assets', 'og');
mkdirSync(outDir, { recursive: true });

const sharp = createRequire(join(root, 'package.json'))('sharp');
const seen = new Set();
let made = 0;

for (const photo of [...(data.featured || []), ...(data.photos || [])]) {
  const id = String(photo.id);
  if (seen.has(id) || !photo.src) continue;
  seen.add(id);

  const src = join(root, 'public', photo.src.replace(/^\//, ''));
  const safe = id.replace(/[^A-Za-z0-9_-]+/g, '-');
  const out = join(outDir, `gallery-${safe}.jpg`);
  if (!existsSync(src)) continue;
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;

  await sharp(src)
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out);
  made++;
}

console.log(`gallery og cards: ${made} generated, ${seen.size} frames total`);
