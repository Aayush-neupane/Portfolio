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
//   OG_SITE_URL — public origin, e.g. https://aayush38.com.np
//                 (defaults to the canonical domain)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = (process.env.OG_SITE_URL || 'https://aayush38.com.np').replace(/\/$/, '');

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
    const img = typeof p.image === 'string' && p.image.startsWith('/')
      ? `${SITE}${p.image}`
      : `${SITE}/assets/images/profile/logo.jpg`;
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

  // Sitemap with one entry per project (dist-only; public source untouched).
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    `  <url>\n    <loc>${SITE}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ...items.map(
      (p) =>
        `  <url>\n    <loc>${SITE}/project/${encodeURIComponent(String(p.id))}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`
    ),
  ];
  writeFileSync(
    join(root, 'dist', 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  );
  console.log(`prerendered ${n} project pages + sitemap -> dist/`);
} catch (err) {
  console.warn(`prerender: skipped (${err && err.message ? err.message : err})`);
}
