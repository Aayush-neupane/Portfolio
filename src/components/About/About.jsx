import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DETAILS = [
  { label: 'Location', value: 'Jhapa, Nepal' },
  { label: 'Focus', value: 'Full-Stack Web' },
  { label: 'Currently', value: 'Building & Shipping' },
  { label: 'Available', value: 'Freelance & Collab' },
];

const SOCIALS = [
  { key: 'ig', cls: 'social-ig', label: 'Instagram', href: 'https://www.instagram.com/dynamic_aayush38', Icon: Instagram },
  { key: 'fb', cls: 'social-fb', label: 'Facebook', href: 'https://www.facebook.com/khatra.manxey.071129', Icon: Facebook },
  { key: 'wa', cls: 'social-wa', label: 'WhatsApp', href: 'https://wa.me/9779862862023', Icon: MessageCircle },
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
            src="/assets/images/profile/me.JPG"
            alt="Portrait of Aayush Neupane"
            loading="lazy"
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

export default function About({ profile }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
            cares about craft.
          </h2>

          <Portrait />

          <nav data-reveal aria-label="Social profiles" className="mt-7">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              Elsewhere
            </p>

            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
              {SOCIALS.map(({ key, cls, label, href, Icon }) => (
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
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <p data-reveal className="text-base leading-[1.6] text-muted md:text-lg">
            I&apos;m Aayush, an 18-year-old developer from Jhapa, Nepal. I started
            building for the web in 2022 and never looked back. Today I work across
            React apps and Unity games, with the occasional deep dive in between.
          </p>
          <p data-reveal className="mt-5 text-base leading-[1.6] text-muted md:text-lg">
            I care about the unglamorous details: spacing, timing, error states,
            the words on the buttons. Away from the keyboard, I&apos;m usually out
            with my camera, or learning how systems break so the ones I build hold
            up.
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
          <span className="sr-only">{profile?.location || ''}</span>
        </div>
      </div>
    </section>
  );
}
