import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';

const FALLBACK_LINKS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'resume', label: 'Resume', href: '#resume' },
  { id: 'gallery', label: 'Gallery', href: '#/gallery' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export default function Navbar({ links, activeSection, onNavClick, isGallery }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const items = links && links.length > 0 ? links : FALLBACK_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    if (onNavClick) onNavClick(href);
  };

  const isActive = (item) => {
    if (item.href.startsWith('#/')) return isGallery || activeSection === item.id;
    return !isGallery && activeSection === item.id;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${scrolled ? 'border-b border-border bg-bg' : 'border-b border-transparent bg-transparent'
        }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6"
      >
        <a
          href="#home"
          onClick={(e) => go(e, '#home')}
          className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-text transition-colors hover:text-accent"
        >
          Aayush N<span className="text-accent">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              aria-current={isActive(item) ? 'true' : undefined}
              className={`nav-link text-sm font-medium transition-colors hover:text-accent ${isActive(item) ? 'active' : 'text-muted'
                }`}
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-elevated text-text"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-b transition-[max-height] duration-200 ease-out md:hidden ${open ? 'max-h-96 border-border bg-bg' : 'max-h-0 border-transparent'
          }`}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 py-4">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-subtle hover:text-accent ${isActive(item) ? 'text-accent' : 'text-muted'
                }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
