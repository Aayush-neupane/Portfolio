import { ArrowUpRight } from 'lucide-react';
import { withBase } from '../../utils/paths.js';

const WA_HIRE = 'https://wa.me/9779862862023?text=Hi%20Aayush%2C%20I%20found%20your%20links%20page%20and%20want%20to%20discuss%20a%20project.';

const LINKS = [
  { label: 'Latest work: Damak Store', sub: 'Full-stack e-commerce', href: '#/project/8', internal: true, hot: true },
  { label: 'Hire me on WhatsApp', sub: 'Replies within a day', href: WA_HIRE, internal: false },
  { label: 'Photography', sub: 'Streets, skies, gardens', href: '#/gallery', internal: true },
  { label: 'Selected work', sub: 'Featured projects', href: '#projects', internal: true },
  { label: 'GitHub', sub: '@aayush-neupane', href: 'https://github.com/aayush-neupane', internal: false },
  { label: 'YouTube', sub: '@AayushNeupane', href: 'https://www.youtube.com/c/AayushNeupane', internal: false },
  { label: 'Contact', sub: 'Project inquiries', href: '#contact', internal: true },
  { label: 'Full portfolio', sub: 'Start from the top', href: '#home', internal: true },
];

/**
 * Links — the single page behind the Instagram bio link. Deliberately
 * unlisted: nothing in the nav, footer, or sitemap points here.
 */
export default function LinksPage({ onNav }) {
  const go = (e, link) => {
    if (!link.internal) return;
    e.preventDefault();
    onNav(link.href);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 pb-16 pt-24 md:pt-32">
      <img
        src={withBase('/assets/images/profile/me.JPG')}
        alt="Aayush Neupane"
        width={96}
        height={96}
        loading="eager"
        decoding="async"
        draggable={false}
        className="h-24 w-24 rounded-full border-2 border-linestrong object-cover"
      />
      <h1 className="mt-5 font-display text-3xl text-text">Aayush Neupane</h1>
      <p className="mt-2 text-center text-sm leading-relaxed text-muted">
        I build websites &amp; games from Jhapa, Nepal.
      </p>

      <nav aria-label="Quick links" className="mt-8 w-full">
        <ul className="space-y-3">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={link.internal ? (e) => go(e, link) : undefined}
                target={link.internal ? undefined : '_blank'}
                rel={link.internal ? undefined : 'noopener noreferrer'}
                className={`group flex items-center justify-between gap-4 rounded-2xl border bg-elevated p-4 transition-all duration-200 hover:-translate-y-0.5 ${
                  link.hot
                    ? 'border-accent/60 hover:border-accent'
                    : 'border-border hover:border-linestrong'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-text">
                    {link.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {link.sub}
                  </span>
                </span>
                <ArrowUpRight
                  className={`h-5 w-5 shrink-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                    link.hot ? 'text-accent' : 'text-muted group-hover:text-accent'
                  }`}
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="mt-8 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted/70">
        dynamic_aayush38
      </p>
    </div>
  );
}
