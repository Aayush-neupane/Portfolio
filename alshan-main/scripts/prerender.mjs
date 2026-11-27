import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const template = readFileSync(join(root, 'dist', 'index.html'), 'utf8')
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })

try {
  const [{ default: App }, { ThemeProvider }, { default: Navbar }, { default: Footer }, { default: PrivacyPage }, { default: ChatWidget }, { default: ScrollProgress }] = await Promise.all([
    server.ssrLoadModule('/src/App.jsx'),
    server.ssrLoadModule('/src/hooks/useTheme.js'),
    server.ssrLoadModule('/src/components/Navbar.jsx'),
    server.ssrLoadModule('/src/components/Footer.jsx'),
    server.ssrLoadModule('/src/pages/PrivacyPage.jsx'),
    server.ssrLoadModule('/src/components/ChatWidget.jsx'),
    server.ssrLoadModule('/src/components/ScrollProgress.jsx'),
  ])
  const home = renderToString(createElement(ThemeProvider, null, createElement(App)))
  const privacy = renderToString(createElement(ThemeProvider, null,
    createElement(ScrollProgress),
    createElement(Navbar),
    createElement('main', { className: 'site-shell' }, createElement(PrivacyPage)),
    createElement(Footer),
    createElement(ChatWidget),
  ))
  const write = (path, body, title, canonical) => {
    const html = template
      .replace('<title>Alshan Rijal | AI/ML and Cloud Engineer, Nepal</title>', `<title>${title}</title>`)
      .replace('<link rel="canonical" href="https://alshanrijal.com.np" />', `<link rel="canonical" href="${canonical}" />`)
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    mkdirSync(join(root, 'dist', path), { recursive: true })
    writeFileSync(join(root, 'dist', path, 'index.html'), html)
  }
  write('', home, 'Alshan Rijal | AI/ML and Cloud Engineer, Nepal', 'https://alshanrijal.com.np/')
  write('privacy', privacy, 'Privacy Policy | Alshan Rijal', 'https://alshanrijal.com.np/privacy')
  copyFileSync(join(root, 'dist', 'privacy', 'index.html'), join(root, 'dist', 'privacy.html'))
  console.log('Prerendered dist/index.html and dist/privacy/index.html')
} finally {
  await server.close()
}
