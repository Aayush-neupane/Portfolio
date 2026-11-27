export function OutlineLogo({ size = 18, className = '', paths, ariaLabel, title, style }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" role={ariaLabel ? 'img' : undefined} aria-label={ariaLabel} aria-hidden={ariaLabel ? undefined : 'true'}>
      {title && <title>{title}</title>}
      {(paths ?? ['M5 19 11.8 5h.6L19 19M7.6 14.2h8.8M9.2 10.8l5.7 4.6']).map((d) => <path key={d} d={d} />)}
    </svg>
  )
}

export function MessageIcon({ size = 22, open = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /> : <><path d="M4 5.5h16v11H9l-5 3v-14Z" /><path d="M8 10h8M8 13h5" strokeLinecap="round" /></>}
    </svg>
  )
}
