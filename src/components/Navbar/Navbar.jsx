import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import { withBase } from '../../utils/paths.js';

const FALLBACK_LINKS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'resume', label: 'Resume', href: '#resume' },
  { id: 'gallery', label: 'Gallery', href: '#/gallery' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export default function Navbar({ links, activeSection, onNavClick, isGallery, route }) {
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
    if (item.href.startsWith('#/')) return route ? item.href === route : (isGallery || activeSection === item.id);
    return !isGallery && activeSection === item.id;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${scrolled ? 'border-b border-border bg-bg/80 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
        }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6"
      >
        <a
          href="#home"
          onClick={(e) => go(e, '#home')}
          aria-label="Aayush Neupane — home"
          className="flex items-end gap-0 font-mono text-sm font-bold uppercase leading-none tracking-[0.2em] text-text transition-colors hover:text-accent"
        >
          <img
            src={withBase('/assets/images/profile/logotrp.png')}
            alt=""
            width={40}
            height={40}
            decoding="async"
            draggable={false}
            className="brand-mark block h-[40px] w-[40px] shrink-0 translate-y-[8px] object-contain"
          />
          <span className="-ml-[4px] inline-flex items-baseline gap-[9px] pb-[3px] leading-none">
            <span
              aria-hidden="true"
              className="inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-accent"
            />
            <span className="leading-none">Neupane</span>
          </span>
        </a>

        <div className="hidden items-center gap-5 md:flex lg:gap-8">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              aria-current={isActive(item) ? 'page' : undefined}
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
        className={`overflow-hidden border-b transition-[max-height] duration-200 ease-out md:hidden ${open ? 'max-h-96 border-border bg-bg/95 backdrop-blur-md' : 'max-h-0 border-transparent'
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
