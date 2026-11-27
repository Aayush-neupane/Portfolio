import { Suspense, lazy, useEffect, useMemo } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import ScrollProgress from './components/ScrollProgress'
import HomePage from './pages/HomePage'
import { ThemeProvider } from './hooks/useTheme'
import { useRouteNavigation } from './hooks/useRouteNavigation'

const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
function AppShell({ page }) {
  const currentPage = useMemo(() => {
    if (page === 'privacy') return <PrivacyPage />
    if (page === '404') return <NotFoundPage />
    return <HomePage />
  }, [page])

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="site-shell">{currentPage}</main>
      <Footer />
      <ChatWidget />
    </>
  )
}

function RouteMeta({ page }) {
  useEffect(() => {
    const canonical = page === 'privacy'
      ? 'https://alshanrijal.com.np/privacy'
      : page === '404'
        ? 'https://alshanrijal.com.np/404'
        : 'https://alshanrijal.com.np/'
    document.title = page === 'privacy' ? 'Privacy Policy | Alshan Rijal' : page === '404' ? 'Page not found | Alshan Rijal' : 'Alshan Rijal | AI/ML and Cloud Engineer, Nepal'
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
    document.querySelector('meta[name="robots"]')?.setAttribute('content', page === '404' ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1')
  }, [page])
  return null
}

export default function App() {
  const { location } = useRouteNavigation()
  const page = useMemo(() => {
    const path = location.pathname.replace(/\/+$/, '') || '/'
    if (path === '/') return 'home'
    if (path === '/privacy') return 'privacy'
    return '404'
  }, [location.pathname])

  return (
    <ThemeProvider>
      <RouteMeta page={page} />
      <Suspense fallback={<div className="loading-shell" />}>
        <AppShell page={page} />
      </Suspense>
    </ThemeProvider>
  )
}
