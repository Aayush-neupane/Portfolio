import { useEffect, useRef, useState } from 'react'
import ContactForm from './ContactForm'
import { MessageIcon } from './OutlineLogo'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const [collapsed, setCollapsed] = useState(false)
  const lastScroll = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      setCollapsed(current > lastScroll.current && current > 120)
      lastScroll.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) {
      buttonRef.current?.focus()
      return undefined
    }
    const focusable = panelRef.current?.querySelectorAll('input, textarea, button, a')
    focusable?.[0]?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className={`chat-widget${open ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`}>
      {open && (
        <section id="contact-panel" ref={panelRef} className="chat-panel" role="dialog" aria-modal="true" aria-labelledby="chat-title">
          <div className="chat-panel-heading">
            <div><h2 id="chat-title">Send a message</h2><p>I will reply to your email.</p></div>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close contact form">×</button>
          </div>
          <ContactForm />
        </section>
      )}
      <button ref={buttonRef} type="button" className="chat-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="contact-panel" aria-label={open ? 'Close contact form' : 'Open contact form'}>
        <MessageIcon open={open} />
        <span>{open ? 'Close' : 'Message'}</span>
      </button>
    </div>
  )
}
