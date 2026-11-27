import { execFileSync } from 'node:child_process'
import { existsSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import projects from '../src/data/projects.json' with { type: 'json' }
import profile from '../src/data/profile.json' with { type: 'json' }

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const publicDir = join(root, 'public')
const site = 'https://alshanrijal.com.np'
const xml = (value) => String(value).replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character]))

function lastModified(files) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], { cwd: root, encoding: 'utf8' }).trim() || new Date(Math.max(...files.map((file) => statSync(join(root, file)).mtimeMs))).toISOString()
  } catch {
    return new Date(Math.max(...files.map((file) => statSync(join(root, file)).mtimeMs))).toISOString()
  }
}

const images = ['/og.png', profile.avatar, ...projects.map((project) => project.image).filter(Boolean).filter((image) => existsSync(join(publicDir, image.slice(1))))]
const imageXml = images.map((image) => `    <image:image><image:loc>${site}${xml(image)}</image:loc></image:image>`).join('\n')
const homeDate = lastModified(['src/pages/HomePage.jsx', 'src/data/profile.json', 'src/data/projects.json', 'src/data/education.json', 'index.html'])
const privacyDate = lastModified(['src/pages/PrivacyPage.jsx', 'index.html'])
const url = (loc, date, changefreq, priority, extra = '') => `  <url>\n    <loc>${site}${loc}</loc>\n    <lastmod>${xml(date)}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n${extra}  </url>`
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${url('/', homeDate, 'weekly', '1.0', `${imageXml}\n`)}\n${url('/privacy', privacyDate, 'yearly', '0.3')}\n</urlset>\n`
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
console.log('Generated public/sitemap.xml')
