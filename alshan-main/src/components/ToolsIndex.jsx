import { useEffect, useRef, useState } from 'react'
import techStack from '../data/techStack.json'
import { ToolIcon } from '../lib/toolIcons'

export default function ToolsIndex() {
  const sectionRef = useRef(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={sectionRef} className={`tools-layout${entered ? ' is-entered' : ''}`}>
      <div className="tools-intro">
        <h3>Tools I <span className="accent-word">shape</span><br />products with</h3>
        <p>The languages, frameworks and cloud services I use day to day.</p>
      </div>
      <div className="tools-list">
        {techStack.map((group, groupIndex) => (
          <div key={group.category} className="tool-group">
            <h3>{group.category}</h3>
            <ul className="tool-items">
              {group.items.map((item, itemIndex) => (
                <li key={item.name} style={{ '--tool-delay': `${(groupIndex * 6 + itemIndex) * 40}ms`, '--tool-light': item.brand.light, '--tool-dark': item.brand.dark }}>
                  <span tabIndex="0" className="tool-item">
                    <ToolIcon iconKey={item.iconKey} />
                    <span>{item.name}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
