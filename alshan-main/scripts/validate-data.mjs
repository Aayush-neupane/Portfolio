import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const readJson = (name) => JSON.parse(readFileSync(join(root, 'src', 'data', name), 'utf8'))

const profile = readJson('profile.json')
const projects = readJson('projects.json')
const techStack = readJson('techStack.json')
const toolIcons = readFileSync(join(root, 'src', 'lib', 'toolIcons.jsx'), 'utf8')

const missingAssets = []
const checkAsset = (path, where) => {
  if (path?.startsWith('/') && !existsSync(join(root, 'public', path))) {
    missingAssets.push(`${path} (${where})`)
  }
}
checkAsset(profile.photo, 'profile.photo')
checkAsset(profile.resume, 'profile.resume')
projects.forEach((project) => checkAsset(project.image, `projects.${project.id}.image`))
const missingToolIcons = techStack.flatMap((group) =>
  group.items.filter((item) => !toolIcons.includes(`${item.iconKey}:`)).map((item) => item.iconKey),
)
const normalizeIconKey = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '')
const iconKeys = [...toolIcons.matchAll(/^\s{2}([a-z0-9]+):\s*\[/gm)].map((match) => match[1])
const unmatchedProjectTech = [...new Set(projects.flatMap((project) =>
  project.techStack.filter((name) => !iconKeys.some((key) => normalizeIconKey(key) === normalizeIconKey(name))),
))]

let failed = false

if (missingAssets.length) {
  failed = true
  console.error('\nMissing asset files (add them under /public):')
  missingAssets.forEach((entry) => console.error(`  - ${entry}`))
}
if (missingToolIcons.length) {
  failed = true
  console.error(`Missing outline tool icons: ${missingToolIcons.join(', ')}`)
}
if (unmatchedProjectTech.length) {
  console.warn(`Unmatched project technology names (shown as text): ${unmatchedProjectTech.join(', ')}`)
}

if (failed) process.exit(1)

console.log('All portfolio data asset paths resolve correctly.')
