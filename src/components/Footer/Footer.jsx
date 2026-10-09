import { ArrowUp, Codepen, Facebook, Github, Instagram, Linkedin, Youtube } from 'lucide-react';
import { scrollToTarget, scrollToTop } from '../../utils/scroll.js';
import { withBase } from '../../utils/paths.js';

const SITEMAP = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Resume', href: '#resume' },
  { label: 'Gallery', href: '#/gallery', route: true },
  { label: 'Contact', href: '#contact' },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/aayush-neupane', Icon: Github, brand: 'social-github' },
  { label: 'YouTube', href: 'https://www.youtube.com/c/AayushNeupane', Icon: Youtube, brand: 'social-youtube' },
  { label: 'CodePen', href: 'https://codepen.io/aayush-neupane', Icon: Codepen, brand: 'social-codepen' },
  { label: 'Instagram', href: 'https://www.instagram.com/dynamic_aayush38', Icon: Instagram, brand: 'social-instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/khatra.manxey.071129', Icon: Facebook, brand: 'social-facebook' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aayush-neupane-38a9b7240/', Icon: Linkedin, brand: 'social-linkedin' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            aria-label="Aayush Neupane — back to top"
            className="flex items-end gap-0 font-mono text-sm font-bold uppercase leading-none tracking-[0.2em] text-text transition-colors hover:text-accent"
          >
            <img
              src={withBase('/assets/images/profile/logotrp.png')}
              alt=""
              width={36}
              height={36}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="brand-mark block h-9 w-9 shrink-0 translate-y-[7px] object-contain"
            />
            <span className="-ml-[4px] inline-flex items-baseline gap-[9px] pb-[3px] leading-none">
              <span
                aria-hidden="true"
                className="inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-accent"
              />
              <span className="leading-none">Neupane</span>
            </span>
          </a>
          <ul aria-label="Social links" className="flex items-center gap-2">
            {SOCIALS.map(({ label, href, Icon, brand }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Aayush Neupane on ${label}`}
                  className={`social-btn ${brand} grid h-10 w-10 place-items-center rounded-full border border-border bg-elevated text-muted transition-colors duration-200`}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav
          aria-label="Sitemap"
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-6 text-sm"
        >
          {SITEMAP.map(({ label, href, route }) =>
            route ? (
              <a
                key={label}
                href={href}
                className="text-muted transition-colors hover:text-accent"
              >
                {label}
              </a>
            ) : (
              <a
                key={label}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(href);
                }}
                className="text-muted transition-colors hover:text-accent"
              >
                {label}
              </a>
            )
          )}
        </nav>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            © {year}{' '}
            <a
              href="https://aayush38.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text underline-offset-4 hover:underline"
            >
              Aayush Neupane
            </a>
            . All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-4 py-2.5 text-xs font-medium text-muted transition-colors duration-200 hover:border-linestrong hover:text-accent"
          >
            Top
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
