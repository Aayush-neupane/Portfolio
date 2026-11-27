import { useCallback, useEffect, useState } from 'react'

const HOME_PATH = '/'
const SCROLL_TIMEOUT_MS = 2000

export function getLocation() {
  if (typeof window === 'undefined') return { pathname: HOME_PATH, hash: '' }
  return { pathname: window.location.pathname, hash: window.location.hash }
}

function scrollToHash(hash) {
  const targetId = decodeURIComponent(hash.replace(/^#/, ''))
  if (!targetId) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const startedAt = performance.now()
  const findTarget = () => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (performance.now() - startedAt < SCROLL_TIMEOUT_MS) {
      window.requestAnimationFrame(findTarget)
    }
  }
  window.requestAnimationFrame(findTarget)
}

export function navigateTo(target = '/') {
  const url = new URL(target, window.location.origin)
  const next = `${url.pathname}${url.hash}`
  window.history.pushState({}, '', next)

  if (url.pathname === HOME_PATH) {
    scrollToHash(url.hash)
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useRouteNavigation() {
  const [location, setLocation] = useState(getLocation)

  useEffect(() => {
    const onPopState = () => setLocation(getLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const go = useCallback((target) => navigateTo(target), [])

  useEffect(() => {
    if (location.pathname === HOME_PATH) {
      scrollToHash(location.hash)
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [location])

  return { location, navigate: go }
}
