const ICON_PROPS = {
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
  'aria-hidden': true,
}

export function GithubIcon() {
  return <svg {...ICON_PROPS}><path d="M12 4a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.5c-2 .4-2.4-1-2.4-1-.3-.8-.8-1-.8-1 .6 0 1 .6 1 .6.5 1 1.4.8 1.8.6.1-.5.2-.8.4-1-1.6-.2-3.3-.8-3.3-3.5 0-.8.3-1.5.8-2-.1-.2-.4-1 .1-2 0 0 .7-.2 2.1.8a7 7 0 0 1 3.8 0c1.4-1 2.1-.8 2.1-.8.5 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.7-1.7 3.3-3.3 3.5.3.3.5.7.5 1.4v2.1c0 .2.1.5.5.4A8 8 0 0 0 12 4Z" /></svg>
}

export function GlobeIcon() {
  return <svg {...ICON_PROPS}><circle cx="12" cy="12" r="8.5" /><path d="M3.8 12h16.4M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.2-3.3-8.5S9.8 5.9 12 3.5Z" /></svg>
}
