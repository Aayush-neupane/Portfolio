// Prerenders one static HTML file per project: dist/project/<id>/index.html
// Each file carries full OG/Twitter tags (absolute URLs) so shared project
// links unfurl with their screenshot — social crawlers don't run JS and never
// see hash routes, so the SPA alone can't do this. Browsers hitting the file
// are instantly redirected into the matching hash route.
//
// Runs as part of `npm run build`. Pure node:fs/path/url. Never fails the
// build — worst case it warns and the deploy proceeds without stubs.
//
// Env:
<<<<<<< HEAD
//   OG_SITE_URL — public origin, e.g. https://aayush38.com.np
=======
//   OG_SITE_URL — public origin, e.g. https://aayushnp.netlify.app
>>>>>>> portfolio-remote/rebrand
//                 (defaults to the canonical domain)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
<<<<<<< HEAD
const SITE = (process.env.OG_SITE_URL || 'https://aayush38.com.np').replace(/\/$/, '');
=======
const SITE = (process.env.OG_SITE_URL || 'https://aayushnp.netlify.app').replace(/\/$/, '');
>>>>>>> portfolio-remote/rebrand

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

try {
  const dataPath = join(root, 'public', 'data', 'projects.json');
  if (!existsSync(dataPath)) {
    console.warn('prerender: public/data/projects.json missing, skipping.');
    process.exit(0);
  }
  const data = JSON.parse(readFileSync(dataPath, 'utf8'));
  const items = [...(data.featured || []), ...(data.archive || [])];
  if (items.length === 0) {
    console.warn('prerender: no projects found, skipping.');
    process.exit(0);
  }

  let n = 0;
  for (const p of items) {
    const id = encodeURIComponent(String(p.id));
    const pretty = `${SITE}/project/${id}`;
    const title = `${p.title || 'Project'} — Aayush Neupane`;
    const desc = p.description || 'A project by Aayush Neupane.';
<<<<<<< HEAD
    const img = typeof p.image === 'string' && p.image.startsWith('/')
      ? `${SITE}${p.image}`
      : `${SITE}/assets/images/profile/logo.jpg`;
=======
    // Prefer the generated social card (scripts/generate_og_cards.py), then
    // the project screenshot, then the default logo.
    const ogFile = `assets/og/${String(p.id).replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'project'}.png`;
    const img = existsSync(join(root, 'public', ogFile))
      ? `${SITE}/${ogFile}`
      : typeof p.image === 'string' && p.image.startsWith('/')
        ? `${SITE}${p.image}`
        : `${SITE}/assets/images/profile/logo.jpg`;
>>>>>>> portfolio-remote/rebrand
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${esc(pretty)}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Aayush Neupane" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${esc(pretty)}" />
<meta property="og:image" content="${esc(img)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="twitter:image" content="${esc(img)}" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="index, follow" />
<script type="application/ld+json">${esc(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: p.title,
      description: p.description,
      url: pretty,
      image: img,
<<<<<<< HEAD
      author: { '@type': 'Person', name: 'Aayush Neupane', url: 'https://aayush38.com.np/' },
=======
      author: { '@type': 'Person', name: 'Aayush Neupane', url: 'https://aayushnp.netlify.app/' },
>>>>>>> portfolio-remote/rebrand
      keywords: (p.techStack || []).join(', '),
    }))}</script>
<script>try{var m=location.pathname.match(/\\/project\\/([^/]+)\\/?$/);var pid=m?decodeURIComponent(m[1]):"${esc(id)}";var base=location.pathname.replace(/\\/project\\/[^/]+\\/?$/,"")||"/";base=base.replace(/\\/$/,"");location.replace(base+"/#/project/"+pid);}catch(e){}</script>
</head>
<body>
<p>Opening the project&hellip; <a href="${esc(pretty)}">${esc(p.title || 'Project')}</a></p>
</body>
</html>
`;
    const outDir = join(root, 'dist', 'project', String(p.id));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);
    n++;
  }

<<<<<<< HEAD
  // Sitemap with one entry per project (dist-only; public source untouched).
  const today = new Date().toISOString().slice(0, 10);
=======
  // Gallery frames get the same treatment: one static stub per photo so a
  // shared /gallery/:id link unfurls with the photo and its title.
  let g = 0;
  try {
    const galPath = join(root, 'public', 'data', 'gallery.json');
    if (existsSync(galPath)) {
      const gal = JSON.parse(readFileSync(galPath, 'utf8'));
      const seen = new Set();
      const frames = [...(gal.featured || []), ...(gal.photos || [])].filter((f) => {
        const key = String(f.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      for (const f of frames) {
        const id = encodeURIComponent(String(f.id));
        const pretty = `${SITE}/gallery/${id}`;
        const title = `${f.title || 'Photo'} — Aayush Neupane`;
        const desc = f.story || f.title || 'A photograph by Aayush Neupane.';
        const img = typeof f.src === 'string' && f.src.startsWith('/')
          ? `${SITE}${f.src}`
          : `${SITE}/assets/images/profile/logo.jpg`;
        const ghtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="${esc(pretty)}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="Aayush Neupane" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:url" content="${esc(pretty)}" />
<meta property="og:image" content="${esc(img)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="twitter:image" content="${esc(img)}" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="index, follow" />
<script type="application/ld+json">${esc(JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Photograph',
          name: f.title,
          description: desc,
          url: pretty,
          image: img,
          author: { '@type': 'Person', name: 'Aayush Neupane', url: `${SITE}/` },
        }))}</script>
<script>try{var m=location.pathname.match(/\\/gallery\\/([^/]+)\\/?$/);var pid=m?decodeURIComponent(m[1]):"${esc(id)}";var base=location.pathname.replace(/\\/gallery\\/[^/]+\\/?$/,"")||"/";base=base.replace(/\\/$/,"");location.replace(base+"/#/gallery/"+pid);}catch(e){}</script>
</head>
<body>
<p>Opening the photo&hellip; <a href="${esc(pretty)}">${esc(f.title || 'Photo')}</a></p>
</body>
</html>
`;
        const outDir = join(root, 'dist', 'gallery', String(f.id));
        mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, 'index.html'), ghtml);
        g++;
      }
    }
  } catch (err) {
    console.warn(`prerender: gallery stubs skipped (${err && err.message ? err.message : err})`);
  }

  // Sitemap with one entry per project (dist-only; public source untouched).
  const today = new Date().toISOString().slice(0, 10);
  const galUrls = [];
  try {
    const galPath = join(root, 'public', 'data', 'gallery.json');
    if (existsSync(galPath)) {
      const gal = JSON.parse(readFileSync(galPath, 'utf8'));
      const seen = new Set();
      for (const f of [...(gal.featured || []), ...(gal.photos || [])]) {
        const key = String(f.id);
        if (seen.has(key)) continue;
        seen.add(key);
        galUrls.push(
          `  <url>\n    <loc>${SITE}/gallery/${encodeURIComponent(key)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>`
        );
      }
    }
  } catch {
    /* gallery sitemap entries are optional */
  }
>>>>>>> portfolio-remote/rebrand
  const urls = [
    `  <url>\n    <loc>${SITE}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ...items.map(
      (p) =>
        `  <url>\n    <loc>${SITE}/project/${encodeURIComponent(String(p.id))}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ),
<<<<<<< HEAD
=======
    ...galUrls,
>>>>>>> portfolio-remote/rebrand
  ];
  writeFileSync(
    join(root, 'dist', 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  );
<<<<<<< HEAD
  console.log(`prerendered ${n} project pages + sitemap -> dist/`);
=======
  console.log(`prerendered ${n} project pages + ${g} gallery stubs + sitemap -> dist/`);
>>>>>>> portfolio-remote/rebrand
} catch (err) {
  console.warn(`prerender: skipped (${err && err.message ? err.message : err})`);
}
