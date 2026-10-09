import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import AccentPicker from '../ThemeToggle/AccentPicker.jsx';
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    setOpen(false);
    if (onNavClick) onNavClick(href);
  };

  const isActive = (item) => {
    if (item.href.startsWith('#/')) {
      if (!route) return isGallery || activeSection === item.id;
      return item.href === '#/gallery' ? isGallery : item.href === route;
    }
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
            src={withBase('/assets/images/profile/logo-trp.png')}
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
          <AccentPicker />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <AccentPicker />
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

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-bg/95 px-6 pb-10 pt-24 backdrop-blur-md md:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {items.map((item, i) => {
              const active = isActive(item);
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  aria-current={active ? 'page' : undefined}
                  className="route-loader-in group flex items-baseline gap-4 border-b border-border/60 py-3.5"
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs tabular-nums text-muted"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-display text-4xl tracking-[-0.01em] transition-colors ${
                      active ? 'text-accent' : 'text-text group-hover:text-accent'
                    }`}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                    />
                  )}
                </a>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={(e) => go(e, '#contact')}
            className="route-loader-in mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
            style={{ animationDelay: `${items.length * 55}ms` }}
          >
            Get in touch
          </button>
        </div>
      )}
    </header>
  );
}
