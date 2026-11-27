import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
// RetroMachine draws each keycap's 3D sides and the dialog card with box-shadow,
// the one world on the site that earns it. It is exempt from the flat-shadow
// ban; nothing else is.
const exempt = [
  join(root, 'src', 'components', 'RetroMachine.jsx'),
  join(root, 'src', 'components', 'RetroMachine.css'),
]
const sourceEntries = readdirSync(join(root, 'src'), { recursive: true, withFileTypes: true })
const paths = [
  join(root, 'index.html'),
  ...sourceEntries
    .filter((entry) => entry.isFile() && /\.(jsx?|css|json)$/.test(entry.name))
    .map((entry) => join(entry.parentPath ?? join(root, 'src'), entry.name))
    .filter((path) => !exempt.includes(path)),
]
const file = paths.map((path) => readFileSync(path, 'utf8')).join('\n')
const html = readFileSync(join(root, 'index.html'), 'utf8')
const faviconLinks = [...html.matchAll(/<link[^>]+(?:rel="icon"|rel="apple-touch-icon")[^>]*>/g)].map(([link]) => link)
const banned = [
  'box-shadow',
  'backdrop-filter',
  'blur',
  'glow',
  'purple',
  'emoji',
  '—',
  '–',
  'Space Grotesk',
  'font-family: Inter',
  '@import url',
  'bg-linear-to-r',
  'dist/',
]

const violations = banned.filter((token) => file.includes(token) || html.includes(token))
if (file.includes('linear-gradient') && !file.includes('mask-image: linear-gradient')) violations.push('linear-gradient')
const expectedPublic = [
  'public/mainfav.png',
  'public/site.webmanifest',
  'public/brand/logo.png',
  'public/fonts/poppins-400.woff2',
  'public/fonts/poppins-600.woff2',
  'public/fonts/syne-500.woff2',
  'public/fonts/syne-800.woff2',
]
const expectedDist = [
  'dist/mainfav.png',
  'dist/site.webmanifest',
  'dist/brand/logo.png',
]
const missingAssets = expectedPublic.filter((path) => !existsSync(join(root, path)))
const missingDistAssets = expectedDist.filter((path) => !existsSync(join(root, path)))
const oldFiles = ['favicon.svg', 'favicon.ico', 'favicon-16.png', 'logo.svg', 'favicon.png', 'favicon-light-32.png', 'favicon-light-48.png', 'favicon-dark-32.png', 'favicon-dark-48.png', 'favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']
const staleAssets = oldFiles.filter((name) => existsSync(join(root, 'public', name)))
const sourceFiles = paths.filter((path) => path.includes(`${join(root, 'src')}${process.platform === 'win32' ? '\\' : '/'}`))
const sourceHasDist = sourceFiles.some((path) => readFileSync(path, 'utf8').includes('dist/'))
const invalidFaviconLinks = faviconLinks.filter((link) => !link.includes('/mainfav.png?v=6'))
const navDotPattern = /\.nav-(?:links|menu)[^{]*\{[^}]*content:\s*['"][^'"]+['"]/s
const sourceHasNavDots = navDotPattern.test(file) || /[•·]|&bull;/.test(file)
const hasNavListReset = /\.nav-links\s*\{[^}]*list-style:\s*none/s.test(file)
const hasThemeDuration = /--theme-duration:\s*500ms/.test(file)
const projectListSource = readFileSync(join(root, 'src', 'components', 'ProjectList.jsx'), 'utf8')
const marqueeSource = readFileSync(join(root, 'src', 'components', 'TechMarquee.jsx'), 'utf8')
const hasProjectTechLogos = projectListSource.includes('<OutlineLogo') && projectListSource.includes('project-tech-fallback')
const hasOutlineOnlyProjectLogos = !projectListSource.match(/<svg[^>]*fill={(?!['"]none['"])/s)
const hasNoMarqueeButton = !marqueeSource.includes('<button') && !marqueeSource.includes('tech-marquee-toggle')
const hasIntro = file.includes("import './intro.js'") && file.includes('id="intro"') && file.includes('introSeen')
const hasSharedBrandMark = file.includes('viewBox="0 0 908 718"') && file.includes('BrandMark')
const hasRevealHooks = file.includes('data-reveal="fade"') && file.includes('data-reveal="line"')
const hasIntroPrepaintGuard = html.includes('intro-pending') && html.includes('sessionStorage.getItem')
const hasOverlayOutsideRoot = html.indexOf('<div class="intro"') < html.indexOf('<div id="root">')
const hasNoReactIntro = !file.includes('IntroAnimation.jsx')

if (violations.length || missingAssets.length || missingDistAssets.length || staleAssets.length || sourceHasDist || faviconLinks.length !== 2 || invalidFaviconLinks.length || sourceHasNavDots || !hasNavListReset || !hasThemeDuration || !hasProjectTechLogos || !hasOutlineOnlyProjectLogos || !hasNoMarqueeButton || !hasIntro || !hasSharedBrandMark || !hasRevealHooks || !hasIntroPrepaintGuard || !hasOverlayOutsideRoot || !hasNoReactIntro) {
  if (violations.length) console.error('Banned token matches found:', violations)
  if (missingAssets.length) console.error('Missing public assets:', missingAssets)
  if (missingDistAssets.length) console.error('Missing built assets:', missingDistAssets)
  if (staleAssets.length) console.error('Old public assets remain:', staleAssets)
  if (sourceHasDist) console.error('Source references dist/.')
  if (faviconLinks.length !== 2 || invalidFaviconLinks.length) console.error('Favicon links must contain only mainfav.png?v=6.')
  if (sourceHasNavDots) console.error('Navigation contains a bullet or generated dot.')
  if (!hasNavListReset) console.error('Desktop navigation list must have list-style: none.')
  if (!hasThemeDuration) console.error('Theme duration must be 500ms.')
  if (!hasProjectTechLogos) console.error('Project rows must render an outline logo or fallback text for each technology.')
  if (!hasOutlineOnlyProjectLogos) console.error('Project row logos must not use filled SVGs.')
  if (!hasNoMarqueeButton) console.error('The technology marquee must not contain a pause/play button.')
  if (!hasIntro) console.error('Home intro animation and session gating are missing.')
  if (!hasSharedBrandMark) console.error('The shared three-path brand mark is missing.')
  if (!hasRevealHooks) console.error('Intro reveal hooks are incomplete.')
  if (!hasIntroPrepaintGuard) console.error('The intro pre-paint guard is missing.')
  if (!hasOverlayOutsideRoot) console.error('The intro overlay must be outside #root.')
  if (!hasNoReactIntro) console.error('The React IntroAnimation implementation must be removed.')
  process.exit(1)
}

const required = [
  '--bg: #f7f7f5',
  '--accent: #4d6b00',
  '--accent: #c6f432',
  'Alshan Rijal',
  'privacy',
  'og:image',
  'site.webmanifest',
  'brand/logo.png',
  'fonts/poppins-400.woff2',
  'fonts/poppins-600.woff2',
  'fonts/syne-500.woff2',
  'fonts/syne-800.woff2',
  'tools-layout',
  'Message',
  'project-preview',
  'mainfav.png?v=6',
  'TechMarquee',
  'theme-duration: 500ms',
  'mainfav.png',
]

const missing = required.filter((token) => !(file.includes(token) || html.includes(token)))
if (missing.length) {
  console.error('Missing required tokens:', missing)
  process.exit(1)
}

console.log('UI verification checks passed.')
