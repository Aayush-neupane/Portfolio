// Locks private content (data JSONs + resume) into public/content.enc
// Usage: CONTENT_KEY=<secret> npm run content:lock
// Pure node:crypto. No dependencies.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const key = process.env.CONTENT_KEY;
if (!key || key.length < 16) {
  console.error('CONTENT_KEY is missing (min 16 characters). Aborting.');
  process.exit(1);
}

const targets = [];
for (const f of readdirSync(join(root, 'public', 'data'))) {
  if (f.endsWith('.json')) targets.push(join('data', f));
}
targets.push(join('assets', 'resume.pdf'));

const files = {};
for (const rel of targets) {
  const buf = readFileSync(join(root, 'public', rel));
  const salt = randomBytes(16);
  const iv = randomBytes(16);
  const k = pbkdf2Sync(key, salt, 210000, 32, 'sha256');
  const cipher = createCipheriv('aes-256-cbc', k, iv);
  files[rel] = {
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    data: Buffer.concat([cipher.update(buf), cipher.final()]).toString('base64'),
  };
}
writeFileSync(join(root, 'public', 'content.enc'), JSON.stringify({ v: 1, files }));
console.log(`locked ${Object.keys(files).length} files -> public/content.enc`);
