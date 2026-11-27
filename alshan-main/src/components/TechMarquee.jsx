import { useEffect, useMemo, useRef, useState } from 'react'
import techStack from '../data/techStack.json'
import { ToolIcon } from '../lib/toolIcons'

export default function TechMarquee() {
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const items = useMemo(() => techStack.flatMap((group) => group.items), [])

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return undefined
    const updateDuration = () => {
      const width = track.scrollWidth / 2
      root.style.setProperty('--marquee-duration', `${Math.max(30, width / 50)}s`)
    }
    const observer = new ResizeObserver(updateDuration)
    const visibility = () => root.classList.toggle('is-hidden', document.hidden)
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 })
    observer.observe(track)
    intersection.observe(root)
    document.addEventListener('visibilitychange', visibility)
    updateDuration()
    return () => {
      observer.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  const renderItems = (hidden = false) => items.map((item) => (
    <li aria-hidden={hidden || undefined} key={`${hidden ? 'copy-' : ''}${item.name}`} className="tech-chip" style={{ '--tool-light': item.brand.light, '--tool-dark': item.brand.dark }}>
      <span className="tech-chip-icon"><ToolIcon iconKey={item.iconKey} size={24} /></span>
      <span>{item.name}</span>
    </li>
  ))

  return (
    <div ref={rootRef} className={`tech-marquee${visible ? '' : ' is-offscreen'}`}>
      <div className="tech-marquee-viewport">
        <ul ref={trackRef} className="tech-marquee-track" aria-label="Technology tools">
          {renderItems()}
          {renderItems(true)}
        </ul>
      </div>
    </div>
  )
}
