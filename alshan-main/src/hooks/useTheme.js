import { createContext, createElement, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio-theme'
const THEME_EASE = 'cubic-bezier(.4,0,.2,1)'
const SWEEP = 'bottom-to-top'
const ThemeContext = createContext(null)

const getSystemTheme = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'

  let stored = null
  try {
    stored = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    stored = null
  }
  return stored === 'dark' || stored === 'light' ? stored : getSystemTheme()
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme

    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0B0B0B' : '#F7F7F5')
    }
  }, [theme])

  useEffect(() => {
    let stored = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }
    if (stored) return undefined

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => setTheme(event.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const root = document.documentElement
    const durationValue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--theme-duration'))
    const duration = Number.isNaN(durationValue) ? 500 : durationValue
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    metaThemeColor?.setAttribute('content', nextTheme === 'dark' ? '#0B0B0B' : '#F7F7F5')
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
    } catch {
      // Theme still updates when storage is unavailable.
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const update = () => setTheme(nextTheme)

    if (typeof document.startViewTransition === 'function' && !reduceMotion) {
      const transition = document.startViewTransition(update)
      transition.ready.then(() => {
        const clipPath = SWEEP === 'bottom-to-top'
          ? ['inset(100% 0 0 0)', 'inset(0 0 0 0)']
          : ['inset(0 0 100% 0)', 'inset(0 0 0 0)']
        document.documentElement.animate(
          { clipPath },
          { duration, easing: THEME_EASE, pseudoElement: '::view-transition-new(root)' },
        )
      }).catch((error) => {
        console.error('Theme reveal failed.', error)
      })
      return
    }

    root.classList.add('theme-changing')
    update()
    window.setTimeout(() => root.classList.remove('theme-changing'), duration + 50)
  }

  return createElement(ThemeContext.Provider, { value: { theme, toggleTheme } }, children)
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}