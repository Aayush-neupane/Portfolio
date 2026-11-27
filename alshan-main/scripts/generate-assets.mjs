import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const publicDir = join(root, 'public')
const logoSource = join(publicDir, 'brand', 'logo.png')
const light = '#F7F7F5'
const dark = '#0B0B0B'

await mkdir(join(publicDir, 'brand'), { recursive: true })
await mkdir(join(publicDir, 'og'), { recursive: true })

const writeAsset = async (source, target, width, options = {}) => {
  await mkdir(dirname(target), { recursive: true })
  const image = sharp(source).resize({
    width,
    height: options.height ?? width,
    fit: options.fit ?? 'contain',
    position: 'centre',
    background: options.background,
  })

  if (options.format === 'webp') {
    await image.webp({ quality: 82, effort: 6 }).toFile(target)
  } else {
    await image.png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(target)
  }
}

const logoMetadata = await sharp(logoSource).metadata()
const logoBuffer = await sharp(logoSource).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const recolorLogo = async (color, target) => {
  const pixels = logoBuffer.data
  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue
    pixels[index] = Number.parseInt(color.slice(1, 3), 16)
    pixels[index + 1] = Number.parseInt(color.slice(3, 5), 16)
    pixels[index + 2] = Number.parseInt(color.slice(5, 7), 16)
  }
  await sharp(pixels, {
    raw: { width: logoMetadata.width, height: logoMetadata.height, channels: 4 },
  }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(target)
}

await recolorLogo(dark, join(publicDir, 'brand', 'logo-on-light.png'))
await recolorLogo(light, join(publicDir, 'brand', 'logo-on-dark.png'))

for (const [name, size] of [['logo-24', 24], ['logo-28', 28], ['logo-32', 32]]) {
  for (const [scale, suffix] of [[1, ''], [2, '@2x'], [3, '@3x']]) {
    await writeAsset(join(publicDir, 'brand', 'logo-on-light.png'), join(publicDir, 'brand', `${name}${suffix}.png`), size * scale)
    await writeAsset(join(publicDir, 'brand', 'logo-on-dark.png'), join(publicDir, 'brand', `${name}${suffix}-dark.png`), size * scale)
    await writeAsset(join(publicDir, 'brand', `${name}${suffix}.png`), join(publicDir, 'brand', `${name}${suffix}.webp`), size * scale, { format: 'webp' })
    await writeAsset(join(publicDir, 'brand', `${name}${suffix}-dark.png`), join(publicDir, 'brand', `${name}${suffix}-dark.webp`), size * scale, { format: 'webp' })
  }
}

const logoForOg = await sharp(join(publicDir, 'brand', 'logo-on-dark.png')).resize(130, 130, { fit: 'contain' }).png().toBuffer()
const ogBase = sharp({
  create: { width: 1200, height: 630, channels: 4, background: dark },
})
  .composite([{ input: logoForOg, left: 60, top: 60 }])
  .png({ compressionLevel: 9, palette: true, quality: 90 })
await ogBase.toFile(join(publicDir, 'og.png'))
await sharp(join(publicDir, 'og.png')).resize(600, 600, { fit: 'cover' }).png({ compressionLevel: 9, palette: true }).toFile(join(publicDir, 'og', 'og-600.png'))

await writeFile(join(publicDir, 'site.webmanifest'), JSON.stringify({
  name: 'Alshan Rijal',
  short_name: 'Alshan',
  start_url: '/',
  display: 'standalone',
  theme_color: dark,
  background_color: dark,
  icons: [
    { src: '/mainfav.png', sizes: '1254x1254', type: 'image/png' },
  ],
}, null, 2) + '\n')

console.log('Generated responsive logo assets, manifest and social preview.')
