const PATH_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
  pathLength: 1,
}

const ICON_PATHS = {
  javascript: ['M4 4h16v16H4z', 'M8 16c1.3 1 2.4.7 2.4-.7V10', 'M14 16c1.3 1 2.6.7 2.6-.7 0-1.4-2.6-1.3-2.6-2.8 0-1.2 1.4-1.7 2.5-.8'],
  typescript: ['M4 4h16v16H4z', 'M8 12h5M10.5 12v5M16 12c-2-1.1-3.2.4-1.7 1.3l1.3.7c1.7.9.5 2.5-1.4 1.9'],
  python: ['M12 4c-4 0-4 2-4 4v2h8v2H8c-4 0-4 2-4 4s0 4 4 4h3v-2H8c-2 0-2-1-2-2s0-2 2-2h8c4 0 4-2 4-4V8c0-4-2-4-8-4Z', 'M9 7h.01M15 17h.01'],
  cplusplus: ['M19 9a7 7 0 1 0 0 6', 'M20 8v6M17 11h6'],
  c: ['M19 8a7 7 0 1 0 0 8'],
  react: ['M12 6c4.5 0 8 2.7 8 6s-3.5 6-8 6-8-2.7-8-6 3.5-6 8-6Z', 'M12 4c2 0 3.5 3.6 3.5 8s-1.5 8-3.5 8-3.5-3.6-3.5-8S10 4 12 4Z', 'M5 8c3.5-1 8.2.8 11 3s3.5 4.3 2 5.4-5.8-.4-8.5-2.5S3.5 9.2 5 8Z'],
  tailwindcss: ['M4 14c2.3-5.2 5.2-5.2 7.5-2.6S15.8 15.9 20 10'],
  html5: ['M5 4h14l-1.5 15L12 21l-5.5-2L5 4Z', 'M8 8h8M8.5 12h7M9 16l3 1 3-1'],
  css3: ['M5 4h14l-1.5 15L12 21l-5.5-2L5 4Z', 'M8 8h8M8.5 12h7M9 16l3 1 3-1'],
  vite: ['M12 3l8 3-8 15L4 6l8-3Z', 'M8 10l4 6 4-6'],
  nodejs: ['M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z', 'M9 9v6l3 1.5 3-1.5V9'],
  mongodb: ['M12 3c-1 4-1 7 0 10s1 5 0 8', 'M12 13c4-1 6-3 7-6'],
  postgresql: ['M6 7c0-3 12-3 12 0v8c0 3-12 3-12 0V7Z', 'M6 7c0 3 12 3 12 0'],
  mysql: ['M4 15c2-5 4-5 6 0s4 5 6 0', 'M4 17c2 2 4 2 6 0s4-2 6 0'],
  express: ['M4 12h16M12 4v16'],
  firebase: ['M12 3l-7 17 7-4 7 4-7-17Z', 'M9 13l3-10 2 7'],
  tensorflow: ['M5 6l7-3 7 3-7 3-7-3ZM5 12l7-3 7 3-7 3-7-3ZM5 18l7-3 7 3-7 3-7-3Z'],
  pytorch: ['M12 4a8 8 0 1 0 8 8', 'M12 4v4M12 12h4'],
  scikitlearn: ['M4 17c3-8 6-8 8-3s5 5 8-3', 'M5 7h.01M19 17h.01'],
  pandas: ['M7 4v16M17 4v16M7 8h10M7 16h10'],
  jupyter: ['M4 17c4 3 12 3 16 0M4 7c4-3 12-3 16 0', 'M6 12h.01M18 12h.01'],
  docker: ['M4 14h16M6 10h3v4H6zM10 10h3v4h-3zM14 10h3v4h-3z', 'M5 17c3 2 10 2 14-1'],
  git: ['M12 4v16M8 8l4 4 4-4M8 16l4-4'],
  github: ['M12 4a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.5c-2 .4-2.4-1-2.4-1-.3-.8-.8-1-.8-1 .6 0 1 .6 1 .6.5 1 1.4.8 1.8.6.1-.5.2-.8.4-1-1.6-.2-3.3-.8-3.3-3.5 0-.8.3-1.5.8-2-.1-.2-.4-1 .1-2 0 0 .7-.2 2.1.8a7 7 0 0 1 3.8 0c1.4-1 2.1-.8 2.1-.8.5 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.7-1.7 3.3-3.3 3.5.3.3.5.7.5 1.4v2.1c0 .2.1.5.5.4A8 8 0 0 0 12 4Z'],
  linux: ['M12 4c-2 2-3 4-2 7l-3 4 4 1 2 4 2-4 4-1-3-4c1-3 0-5-2-7Z'],
  cloudflare: ['M4 15h16M7 15a5 5 0 0 1 9-3 4 4 0 0 1 1 3'],
  vercel: ['M4 19 12 5l8 14H4Z'],
}

const normalizeIconKey = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

export function getToolIconPaths(iconKey) {
  return ICON_PATHS[iconKey]
}

export function getToolIconKey(name) {
  const normalizedName = normalizeIconKey(name)
  return Object.keys(ICON_PATHS).find((key) => normalizeIconKey(key) === normalizedName)
}

export function ToolIcon({ iconKey, size = 28 }) {
  const paths = ICON_PATHS[iconKey] ?? ['M5 5h14v14H5z', 'M8 12h8']
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...PATH_PROPS}>
      {paths.map((d) => <path key={d} d={d} />)}
    </svg>
  )
}
