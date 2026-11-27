import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')
const robots = readFileSync(join(root, 'public/robots.txt'), 'utf8')
const llms = readFileSync(join(root, 'public/llms.txt'), 'utf8')
const html = readFileSync(join(root, 'index.html'), 'utf8')
const required = ['https://alshanrijal.com.np/', 'https://alshanrijal.com.np/privacy', '<image:image>', 'lastmod', '<priority>1.0</priority>', '<priority>0.3</priority>']
if (required.some((token) => !sitemap.includes(token)) || !robots.includes('Sitemap: https://alshanrijal.com.np/sitemap.xml') || !llms.includes('# Alshan Rijal') || !html.includes('"@graph"') || !existsSync(join(root, 'public/sitemap.xml'))) {
  throw new Error('SEO assets are incomplete.')
}
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  if (!match[1].startsWith('https://alshanrijal.com.np/')) throw new Error(`Non-canonical sitemap URL: ${match[1]}`)
}
console.log('SEO verification checks passed.')
