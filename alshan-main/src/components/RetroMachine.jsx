import { useCallback, useEffect, useRef, useState } from 'react'
import { RESUME_FILENAME, RESUME_PATH } from '../config/resume'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './RetroMachine.css'

/**
 * RetroMachine: the hero's right-hand instrument. Nine keys stand on the
 * device photo, each one jumping straight to a real part of the site.
 *
 * Photo lives at /retro-device-reference.png. Its pixel coordinates are the
 * source of truth below; box() turns them into percentages so the whole thing
 * scales from one aspect-ratio wrapper.
 *
 * Colour lives in RetroMachine.css, two blocks at the top of that file.
 */

const PHOTO = '/retro-device-reference.png'
const W = 1315
const H = 1196
const TYPE_LIMIT = 28
const TYPE_RESET = 3500
const PRESS_HOLD = 600

/* --- the nine keys -------------------------------------------------------
   letter  the big cap letter
   caption the small line on the cap
   tone    cap colour: char | cream | coral
   target  section id to scroll to
   screen  name shown on the screen while hovered
   hint    line shown under it
   dialog  true opens the résumé dialog instead of scrolling
   wide    true for the big key
   x/y/w/h position and size in photo pixels
------------------------------------------------------------------------- */
const KEYS = [
  { letter: 'P', caption: 'PROJECTS', tone: 'cream', target: '#projects', screen: 'Projects', hint: 'Press to jump.', x: 323, y: 712, w: 146, h: 92 },
  { letter: 'O', caption: 'ABOUT ME', tone: 'char', target: '#about', screen: 'About me', hint: 'Press to jump.', x: 491, y: 736, w: 146, h: 92 },
  { letter: 'R', caption: 'RÉSUMÉ', tone: 'coral', dialog: true, screen: 'Résumé', hint: 'Press to download.', x: 658, y: 760, w: 146, h: 92 },
  { letter: 'T', caption: 'TOOLKIT', tone: 'cream', target: '#skills', screen: 'Toolkit', hint: 'Press to jump.', x: 825, y: 785, w: 146, h: 92 },
  { letter: 'F', caption: 'FEATURED', tone: 'char', target: '#projects', screen: 'Featured work', hint: 'Press to jump.', x: 990, y: 810, w: 146, h: 92 },
  { letter: 'O', caption: 'EDUCATION', tone: 'coral', target: '#education', screen: 'Education', hint: 'Press to jump.', x: 240, y: 830, w: 150, h: 98 },
  { letter: 'L', caption: 'STACK', tone: 'cream', target: '#skills', screen: 'Stack', hint: 'Press to jump.', x: 413, y: 861, w: 150, h: 98 },
  { letter: 'I', caption: 'CONTACT', tone: 'char', target: '#contact', screen: 'Contact', hint: 'Press to jump.', x: 587, y: 890, w: 150, h: 98 },
  { letter: 'O', caption: "LET'S TALK ↵", tone: 'char', target: '#contact', screen: 'Contact', hint: 'Press to say hello.', wide: true, x: 848, y: 939, w: 304, h: 110 },
]

// What the screen says while scrolling there.
const OPENS = { '#projects': 'Projects', '#about': 'About', '#skills': 'Skills', '#education': 'Education', '#contact': 'Contact' }
const SECTIONS = { '#projects': 'projects', '#about': 'about', '#skills': 'skills', '#education': 'education', '#contact': 'contact' }

const SCREEN = { x: 652, y: 345, w: 668, h: 322 }

const STORY = [
  ['HELLO', 'Alshan Rijal.', 'Software engineer from Itahari, Nepal.'],
  ['STACK', 'Python and MERN.', 'APIs, models and the web.'],
  ['FOCUS', 'AI / ML + Cloud.', 'Training and deploying on AWS.'],
  ['WORK', 'Open to work.', "Let's build something useful."],
]

const box = ({ x, y, w, h }) => ({
  left: `${((x - w / 2) / W) * 100}%`,
  top: `${((y - h / 2) / H) * 100}%`,
  width: `${(w / W) * 100}%`,
  height: `${(h / H) * 100}%`,
})

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function RetroMachine({ className = '' }) {
  const reduce = useReducedMotion()
  const wideKey = KEYS[KEYS.length - 1]

  const [phase, setPhase] = useState('story')
  const [story, setStory] = useState({ tag: STORY[0][0], head: '', detail: '' })
  const [hovered, setHovered] = useState(null)
  const [typed, setTyped] = useState('')
  const [pressText, setPressText] = useState('')
  const [down, setDown] = useState(() => new Set())
  const [hopIdx, setHopIdx] = useState(-1)
  const [dialogOpen, setDialogOpen] = useState(false)

  const wrapRef = useRef(null)
  const dialogRef = useRef(null)
  const keyRef = useRef(null)
  const typedRef = useRef('')
  const clearTimer = useRef(null)
  const speakTimer = useRef(null)
  const pressTimer = useRef(null)
  const storyIdx = useRef(0)
  const hovering = useRef(false)

  const resume = useCallback(() => setPhase(hovering.current || typedRef.current ? 'hover' : 'story'), [])

  /* --- the always-typing story ------------------------------------------- */
  useEffect(() => {
    if (phase !== 'story' || dialogOpen) return undefined
    let dead = false
    const run = async () => {
      while (!dead) {
        const [tag, head, detail] = STORY[storyIdx.current % STORY.length]
        storyIdx.current += 1
        if (reduce) {
          setStory({ tag, head, detail })
          await wait(3500)
          continue
        }
        setStory({ tag, head: '', detail: '' })
        await wait(180)
        for (let i = 1; i <= head.length && !dead; i += 1) {
          setStory({ tag, head: head.slice(0, i), detail: '' })
          await wait(head[i - 1] === ' ' ? 190 : 96)
        }
        for (let i = 1; i <= detail.length && !dead; i += 1) {
          setStory({ tag, head, detail: detail.slice(0, i) })
          await wait(26)
        }
        await wait(2600)
        for (let i = head.length - 1; i >= 0 && !dead; i -= 1) {
          setStory({ tag, head: head.slice(0, i), detail })
          await wait(40)
        }
      }
    }
    run()
    return () => { dead = true }
  }, [phase, dialogOpen, reduce])

  /* --- speaking ------------------------------------------------------ */
  const speak = useCallback((text) => {
    window.clearInterval(speakTimer.current)
    setPhase('press')
    if (reduce) {
      setPressText(text)
      return
    }
    setPressText('')
    let i = 0
    speakTimer.current = window.setInterval(() => {
      i += 1
      setPressText(text.slice(0, i))
      if (i >= text.length) window.clearInterval(speakTimer.current)
    }, 22)
  }, [reduce])

  /* --- going somewhere --------------------------------------------------- */
  const go = useCallback((target) => {
    const section = document.querySelector(target)
    if (!section) return
    section.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(null, '', target)
    const heading = section.querySelector('h1, h2, h3')
    if (!heading) return
    heading.classList.add('rm-jump')
    heading.tabIndex = -1
    window.setTimeout(() => heading.focus({ preventScroll: true }), reduce ? 0 : 450)
  }, [reduce])

  const flash = useCallback((letter, ms) => {
    if (!letter) return
    setDown((prev) => new Set(prev).add(letter))
    window.setTimeout(() => {
      setDown((prev) => {
        const next = new Set(prev)
        next.delete(letter)
        return next
      })
    }, ms)
  }, [])

  const press = useCallback((key) => {
    flash(key.letter, PRESS_HOLD + 20)
    speak(`Opening ${OPENS[key.target] || key.screen}…`)
    window.clearTimeout(pressTimer.current)
    pressTimer.current = window.setTimeout(() => {
      go(key.target)
      resume()
    }, PRESS_HOLD)
  }, [flash, go, resume, speak])

  const activate = useCallback((key) => {
    if (key.dialog) {
      setDialogOpen(true)
      setPhase('dialog')
      return
    }
    press(key)
  }, [press])

  /* --- hovering a key ---------------------------------------------------- */
  const enter = (key) => {
    hovering.current = true
    setHovered(key)
    setPhase('hover')
  }
  const leave = () => {
    if (dialogRef.current?.open) return
    hovering.current = false
    setHovered(null)
    setPhase(typedRef.current ? 'you' : 'story')
  }

  /* --- the visitor's own keyboard ---------------------------------------- */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (dialogRef.current?.open) return
      const el = event.target
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return
      if ((tag === 'A' || tag === 'BUTTON') && (event.key === ' ' || event.key === 'Enter')) return

      if (event.key === 'Enter') {
        window.clearTimeout(clearTimer.current)
        typedRef.current = ''
        setTyped('')
        activate(wideKey)
        return
      }

      if (event.key === 'Backspace') {
        typedRef.current = typedRef.current.slice(0, -1)
      } else if (event.key.length === 1) {
        if (event.key === ' ') event.preventDefault()
        typedRef.current = (typedRef.current + event.key).slice(-TYPE_LIMIT)
        flash(event.key.toUpperCase(), 140)
      } else {
        return
      }

      setTyped(typedRef.current)
      setPhase(typedRef.current ? 'you' : 'story')
      window.clearTimeout(clearTimer.current)
      clearTimer.current = window.setTimeout(() => {
        typedRef.current = ''
        setTyped('')
        setPhase('story')
      }, TYPE_RESET)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(clearTimer.current)
      window.clearTimeout(pressTimer.current)
      window.clearInterval(speakTimer.current)
    }
  }, [activate, flash, wideKey])

  /* --- the typing wave, every 10s ---------------------------------------- */
  useEffect(() => {
    if (reduce) return undefined
    let dead = false
    const id = window.setInterval(async () => {
      const busy =
        dialogRef.current?.open || hovering.current || typedRef.current ||
        document.hidden || wrapRef.current?.contains(document.activeElement)
      if (busy) return
      for (let i = 0; i < KEYS.length && !dead; i += 1) {
        setHopIdx(i)
        await wait(460)
      }
      if (!dead) setHopIdx(-1)
    }, 10000)
    return () => {
      dead = true
      window.clearInterval(id)
    }
  }, [reduce])

  /* --- the dialog -------------------------------------------------------- */
  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && dialogOpen && !dialog.open) dialog.showModal()
  }, [dialogOpen])

  const closeDialog = useCallback(() => dialogRef.current?.close(), [])
  const onDialogClose = useCallback(() => {
    setDialogOpen(false)
    setPhase(hovering.current || typedRef.current ? 'hover' : 'story')
    keyRef.current?.focus()
  }, [])
  const onDownload = () => {
    closeDialog()
    speak('Downloading résumé…')
    window.setTimeout(resume, 1600)
  }

  const view = phase === 'press'
    ? { tag: 'RUN', head: pressText, detail: '' }
    : phase === 'dialog'
      ? { tag: 'DL', head: 'Download my résumé?', detail: 'Pick an option below.' }
      : phase === 'hover' && hovered
        ? { tag: 'KEYS', head: hovered.screen, detail: hovered.hint }
        : phase === 'you'
          ? { tag: 'YOU', head: typed, detail: "You're on my keyboard." }
          : { tag: story.tag, head: story.head, detail: story.detail }

  return (
    <div className={`rm ${className}`.trim()} ref={wrapRef}>
      <div className="rm-device">
        <img
          className="rm-photo"
          src={PHOTO}
          alt="A retro computer with a dark screen and nine keys, each linked to a part of this site"
          draggable="false"
        />

        <div className="rm-screen" style={box(SCREEN)}>
          <div className="rm-screen-in">
            <div className="rm-top">
              <span>ALSHAN / PORTFOLIO.EXE</span>
              <span>{view.tag}</span>
            </div>
            <div className="rm-head">
              {view.head}
              <i className="rm-cur" aria-hidden="true" />
            </div>
            <div className="rm-detail">{view.detail}</div>
          </div>
        </div>

        {KEYS.map((key) => {
          const label = key.dialog
            ? 'Résumé, opens the download dialog'
            : `${key.screen}, scrolls to the ${SECTIONS[key.target]} section`
          const classes = [
            'rm-cap',
            `t-${key.tone}`,
            key.wide ? 'wide' : '',
            hopIdx === KEYS.indexOf(key) ? 'hop' : '',
            down.has(key.letter) ? 'down' : '',
          ].filter(Boolean).join(' ')

          return (
            <a
              key={key.caption}
              ref={key.dialog ? keyRef : null}
              href={key.dialog ? RESUME_PATH : key.target}
              aria-label={label}
              className={classes}
              style={box(key)}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                activate(key)
              }}
              onKeyDown={(event) => {
                // an <a> activates on Enter by itself; Space needs a hand
                if (event.key !== ' ' && event.key !== 'Spacebar') return
                event.preventDefault()
                activate(key)
              }}
              onMouseEnter={() => enter(key)}
              onMouseLeave={leave}
              onFocus={() => enter(key)}
              onBlur={leave}
            >
              <span className="rm-face" aria-hidden="true">
                <span className="rm-dish">
                  {key.letter && <b>{key.letter}</b>}
                  <em>{key.caption}</em>
                </span>
              </span>
            </a>
          )
        })}
      </div>

      <p className="rm-hint">
        Hover a key, or start <kbd>typing</kbd>
      </p>

      <dialog
        ref={dialogRef}
        className="rm-dialog"
        aria-labelledby="rm-dialog-title"
        onClose={onDialogClose}
        onClick={(event) => { if (event.target === dialogRef.current) closeDialog() }}
      >
        <div className="rm-card">
          <h2 id="rm-dialog-title">Download my résumé?</h2>
          <p>A one-page PDF with the full history. Happy to walk you through it any time.</p>
          <div className="rm-card-actions">
            <a className="rm-pill" href={RESUME_PATH} download={RESUME_FILENAME} onClick={onDownload}>
              Download PDF
            </a>
            <button type="button" className="rm-ghost" onClick={closeDialog}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
