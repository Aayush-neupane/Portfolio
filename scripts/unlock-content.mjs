// Decrypts public/content.enc straight into dist/ (never into source).
// Runs automatically as part of `npm run build`.
// Needs CONTENT_KEY in the environment (hosting dashboard). Without it,
// the build still succeeds; data-driven sections fall back to defaults.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createDecipheriv, pbkdf2Sync } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bundlePath = join(root, 'public', 'content.enc');
if (!existsSync(bundlePath)) {
  console.warn('unlock: no public/content.enc found, skipping.');
  process.exit(0);
}
const key = process.env.CONTENT_KEY;
if (!key) {
  console.warn('unlock: CONTENT_KEY not set, shipping without private content.');
  process.exit(0);
}

const bundle = JSON.parse(readFileSync(bundlePath, 'utf8'));
let n = 0;
for (const [rel, box] of Object.entries(bundle.files || {})) {
  const k = pbkdf2Sync(key, Buffer.from(box.salt, 'base64'), 210000, 32, 'sha256');
  const decipher = createDecipheriv('aes-256-cbc', k, Buffer.from(box.iv, 'base64'));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(box.data, 'base64')),
    decipher.final(),
  ]);
  const out = join(root, 'dist', rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, plain);
  n++;
}
console.log(`unlocked ${n} files into dist/`);
