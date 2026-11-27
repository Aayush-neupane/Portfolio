import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GithubIcon, GlobeIcon } from './ProjectIcons'
import { OutlineLogo } from './OutlineLogo'
import techStack from '../data/techStack.json'
import { getToolIconKey, getToolIconPaths } from '../lib/toolIcons'

const toolDetails = techStack.flatMap((group) => group.items)
const techDetails = (name) => {
  const iconKey = getToolIconKey(name)
  return {
    iconKey,
    paths: iconKey ? getToolIconPaths(iconKey) : undefined,
    brand: toolDetails.find((item) => item.iconKey === iconKey)?.brand,
  }
}

function linksFor(project) {
  return [
    project.liveUrl && project.liveUrl !== '#' ? { label: 'Live demo', href: project.liveUrl, Icon: GlobeIcon } : null,
    project.githubUrl && project.githubUrl !== '#' ? { label: 'Source', href: project.githubUrl, Icon: GithubIcon } : null,
  ].filter(Boolean)
}

export default function ProjectList({ projects }) {
  const [active, setActive] = useState(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0, tilt: 0 })
  const listRef = useRef(null)
  const frameRef = useRef(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const positionRef = useRef({ x: 0, y: 0, tilt: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const preloadedRef = useRef(false)

  useEffect(() => () => window.cancelAnimationFrame(frameRef.current), [])

  const movePreview = (event) => {
    const row = event.target.closest('.project-row')
    if (!row || event.pointerType !== 'mouse') return
    const width = Math.min(400, window.innerWidth * 0.26)
    const height = width * 0.75
    const x = event.clientX + 28 + width > window.innerWidth ? event.clientX - width - 28 : event.clientX + 28
    const y = event.clientY + 28 + height > window.innerHeight ? event.clientY - height - 28 : event.clientY + 28
    const previous = targetRef.current
    velocityRef.current = { x: x - previous.x, y: y - previous.y }
    targetRef.current = { x, y }
    if (active !== row.dataset.projectKey) setActive(row.dataset.projectKey)
    if (frameRef.current) return
    const tick = () => {
      const current = positionRef.current
      const target = targetRef.current
      current.x += (target.x - current.x) * 0.16
      current.y += (target.y - current.y) * 0.16
      current.tilt += ((velocityRef.current.x * 0.04) - current.tilt) * 0.16
      setPointer({ x: current.x, y: current.y, tilt: Math.max(-4, Math.min(4, current.tilt)) })
      frameRef.current = window.requestAnimationFrame(tick)
    }
    frameRef.current = window.requestAnimationFrame(tick)
  }

  const stopPreview = () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    setActive(null)
  }

  const preload = () => {
    if (preloadedRef.current) return
    preloadedRef.current = true
    projects.forEach((project) => {
      if (project.image) {
        const image = new Image()
        image.src = project.image
      }
    })
  }

  return (
    <>
      <div
        ref={listRef}
        className="project-list"
        onPointerMove={movePreview}
        onPointerEnter={preload}
        onPointerLeave={stopPreview}
      >
        {projects.map((project, index) => {
          const links = linksFor(project)
          const projectKey = `${project.id}-${index}`
          const expanded = active === projectKey
          return (
            <article
              key={`${project.id}-${index}`}
              data-project-key={`${project.id}-${index}`}
              className={`project-row${expanded ? ' expanded' : ''}`}
              tabIndex="0"
              onFocus={(event) => {
                setActive(`${project.id}-${index}`)
                const rect = event.currentTarget.getBoundingClientRect()
                targetRef.current = { x: Math.max(16, window.innerWidth - 420), y: rect.top + 16 }
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) stopPreview()
              }}
              onClick={() => {
                if (window.matchMedia('(pointer: coarse)').matches)                 setActive(expanded ? null : projectKey)
              }}
            >
              <div className="project-meta">
                <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
              <div className="project-stack" aria-label={`${project.title} technology stack`}>
                <span className="sr-only">{project.techStack.join(' / ')}</span>
                {project.techStack.map((tech) => {
                  const details = techDetails(tech)
                  return details.paths
                    ? <OutlineLogo key={tech} paths={details.paths} size={20} className="project-tech-logo" ariaLabel={tech} title={tech} style={{ '--tool-light': details.brand?.light, '--tool-dark': details.brand?.dark }} />
                    : <span key={tech} className="project-tech-fallback">{tech}</span>
                })}
              </div>
              <div className="project-links">
                {links.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label === 'Source' ? `Source code of ${project.title} on GitHub` : `Live demo of ${project.title}`}`}>
                    <link.Icon />
                    {link.label}
                  </a>
                ))}
              </div>
              {expanded && (
                <div className="project-touch-detail">
                  {project.image ? <img src={project.image} alt="" width="640" height="480" /> : <div className="project-placeholder">{project.title}</div>}
                  <p>{project.description}</p>
                </div>
              )}
              <span className="marker" aria-hidden="true" />
            </article>
          )
        })}
      </div>
      {active && typeof document !== 'undefined' && createPortal(
        <div className="project-preview" style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0) rotate(${pointer.tilt}deg)` }} aria-hidden="true">
          {projects[Number(active?.split('-').pop())]?.image
            ? <img src={projects[Number(active.split('-').pop())].image} alt="" width="640" height="480" />
            : <div className="project-placeholder">{projects[Number(active?.split('-').pop())]?.title}</div>}
        </div>,
        document.body,
      )}
    </>
  )
}
