import { useEffect, useRef, useState } from 'react';
import { isReducedMotion } from '../../utils/motion.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { withBase } from '../../utils/paths.js';

gsap.registerPlugin(ScrollTrigger);

const DETAILS = [
  { label: 'Base', value: 'Jhapa, Nepal · UTC+5:45' },
  { label: 'Stack', value: 'React · TypeScript · Supabase' },
  { label: 'Experience', value: 'Building for the web since 2022' },
  { label: 'Open to', value: 'Freelance' },
];

const SOCIALS_BASE = [
  { key: 'ig', cls: 'social-ig', label: 'Instagram', href: 'https://www.instagram.com/dynamic_aayush38', Icon: Instagram },
  { key: 'fb', cls: 'social-fb', label: 'Facebook', href: 'https://www.facebook.com/khatra.manxey.071129', Icon: Facebook },
];

function Portrait() {
  const [failed, setFailed] = useState(false);
  return (
    <figure data-reveal className="group relative mt-9 max-w-xs">
      <div
        aria-hidden="true"
        className="absolute -bottom-3 -right-3 h-full w-full rounded-xl border border-border transition-colors duration-200 group-hover:border-accent/50"
      />
      <div className="relative overflow-hidden rounded-xl border border-border bg-subtle transition-colors duration-200 group-hover:border-linestrong">
        {!failed ? (
          <img
            src={withBase('/assets/images/profile/me.JPG')}
            alt="Portrait of Aayush Neupane"
            loading="lazy" decoding="async"
            onError={() => setFailed(true)}
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid aspect-[4/5] w-full place-items-center">
            <span className="font-display text-7xl text-muted/60">A</span>
          </div>
        )}
      </div>
      <figcaption className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">
        Aayush Neupane, Jhapa, Nepal
      </figcaption>
    </figure>
  );
}

export default function About({ profile, whatsapp }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (isReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: (i % 4) * 0.06,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={rootRef} className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[40%_60%] lg:gap-14">
        <div>
          <p
            data-reveal
            className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent"
          >
            About
          </p>
          <h2
            data-reveal
            className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-text"
          >
            Developer who
            <br />
            cares about <em className="italic">craft.</em>
          </h2>

          <Portrait />

          <nav data-reveal aria-label="Social profiles" className="mt-7">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              Elsewhere
            </p>

            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
              {(() => {
                const waNumber = whatsapp?.phoneNumber || '';
                const waText = whatsapp?.defaultMessage || 'Hi Aayush, I found your portfolio and want to chat.';
                const socials = waNumber
                  ? [...SOCIALS_BASE, { key: 'wa', cls: 'social-wa', label: 'WhatsApp', href: `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`, Icon: MessageCircle }]
                  : SOCIALS_BASE;
                return socials.map(({ key, cls, label, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} profile`}
                    className={`social-link ${cls} inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-text`}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    <span className="social-platform social-label">{label}</span>
                  </a>
                </li>
              ))
              })()}
            </ul>
          </nav>
        </div>

        <div>
          <p data-reveal className="text-base leading-[1.6] text-muted md:text-lg">
            I&apos;m Aayush, a web developer from Jhapa, Nepal. Since 2022
            I&apos;ve been turning ideas into sites people actually use — a
            booking site for a Canadian detailing business, a virtual classroom
            platform, and a hardware control deck for a real RC build.
          </p>
          <p data-reveal className="mt-5 text-base leading-[1.6] text-muted md:text-lg">
            My bar is the unglamorous stuff: spacing, timing, error states, the
            words on the buttons. Every project on this page was held to it.
          </p>

          <p data-reveal className="mt-6 font-mono text-xs tracking-[0.08em] text-muted">
            <span className="uppercase text-accent">Now — </span>
            <span className="text-text">{profile?.now || 'Shipping freelance web apps.'}</span>
          </p>

          <dl data-reveal className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DETAILS.map((d) => (
              <div
                key={d.label}
                className="rounded-xl border border-border bg-elevated p-5 transition-colors duration-200 hover:border-linestrong"
              >
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                  {d.label}
                </dt>
                <dd className="mt-1.5 font-medium text-text">{d.value}</dd>
              </div>
            ))}
          </dl>

          <div data-reveal className="mt-4 rounded-xl border border-border bg-elevated">
            <p className="border-b border-border px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              Recognition
            </p>
            <ul>
              <li className="flex items-baseline gap-3 border-b border-border px-5 py-3.5">
                <span className="font-mono text-xs text-accent">01</span>
                <p className="text-sm text-text">
                  2nd place, Webathon{' '}
                  <span className="text-muted">— Madan Bhandari Memorial College, 2026</span>
                </p>
              </li>
              <li className="flex items-baseline gap-3 border-b border-border px-5 py-3.5">
                <span className="font-mono text-xs text-accent">02</span>
                <p className="text-sm text-text">
                  Web development hackathon{' '}
                  <span className="text-muted">— Madan Bhandari Memorial College, 2025</span>
                </p>
              </li>
              <li className="flex items-baseline gap-3 px-5 py-3.5">
                <span className="font-mono text-xs text-accent">03</span>
                <p className="text-sm text-text">
                  Hackathon participant{' '}
                  <span className="text-muted">— White House College, Birtamode, 2026</span>
                </p>
              </li>
            </ul>
          </div>
          <span className="sr-only">{profile?.location || ''}</span>
        </div>
      </div>
    </section>
  );
}
