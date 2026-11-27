import profile from '../data/profile.json'
import BrandLogo from './BrandLogo'
import { useRouteNavigation } from '../hooks/useRouteNavigation'
import SocialLinks from './SocialLinks'

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Footer() {
  const { navigate } = useRouteNavigation()
  const routeLink = (event, target) => {
    event.preventDefault()
    navigate(target)
  }
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <a href="/" className="footer-logo" aria-label="Alshan Rijal home" onClick={(event) => routeLink(event, '/')}>
            <BrandLogo />
          </a>
          <p className="footer-note">{profile.tagline}</p>
        </div>

        <div className="footer-actions">
          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="/#about" onClick={(event) => routeLink(event, '/#about')}>About</a>
            <a href="/#skills" onClick={(event) => routeLink(event, '/#skills')}>Skills</a>
            <a href="/#projects" onClick={(event) => routeLink(event, '/#projects')}>Projects</a>
            <a href="/#education" onClick={(event) => routeLink(event, '/#education')}>Education</a>
            <a href="/#contact" onClick={(event) => routeLink(event, '/#contact')}>Contact</a>
            <a href="/privacy">Privacy</a>
          </nav>

          <a href="/" className="link-button footer-back" onClick={(event) => routeLink(event, '/')}>
            <ArrowUpIcon />
            Back to top
          </a>
        </div>
        <SocialLinks className="footer-socials" />
      </div>
    </footer>
  )
}
