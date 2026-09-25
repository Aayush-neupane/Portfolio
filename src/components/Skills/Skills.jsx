import { useEffect, useRef, useState } from 'react';
import { isReducedMotion } from '../../utils/motion.js';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlaskConical } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CATS = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React', note: 'My home base. Almost everything starts here.' },
      { name: 'TypeScript', note: 'For catching my mistakes before users do.' },
      { name: 'Next.js', note: 'When a project needs SEO, speed, or both.' },
      { name: 'Tailwind CSS', note: 'I think in utilities now.' },
      { name: 'Framer Motion', note: 'The reason buttons on this site feel alive.' },
      { name: 'GSAP', note: 'Scroll choreography and the fancy stuff.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js', note: 'APIs, scripts, and weekend experiments.' },
      { name: 'Express', note: 'Small, fast servers without the ceremony.' },
      { name: 'Supabase', note: 'Auth and Postgres without babysitting infra.' },
      { name: 'PostgreSQL', note: 'Where my data actually lives. Safely.' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git', note: 'Commit early, commit often.' },
      { name: 'Vite', note: 'Instant reloads changed how I work.' },
      { name: 'Figma', note: 'Where layouts happen before code does.' },
      { name: 'Linux', note: 'My daily driver. The terminal is home.' },
      { name: 'Docker', note: 'Works on my machine, and yours too.' },
    ],
  },
  {
    id: 'beyond',
    label: 'Beyond the web',
    skills: [
      { name: 'Unity / C#', note: 'My game-dev era. Still love it.' },
      { name: 'Python', note: 'Scripts, automation, quick ideas.' },
      { name: 'ESP32 / IoT', note: 'Making hardware blink since 2024.' },
    ],
  },
];

export default function Skills() {
  const rootRef = useRef(null);
  const [tab, setTab] = useState(CATS[0].id);
  const reduce =
    typeof window !== 'undefined' &&
    isReducedMotion();
  const active = CATS.find((c) => c.id === tab) || CATS[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduce) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="skills" ref={rootRef} className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-[40%_60%] lg:gap-14">
        <div>
          <p
            data-reveal
            className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent"
          >
            Capabilities
          </p>
          <h2
            data-reveal
            className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-text"
          >
            Skills &amp; <em className="italic">tools.</em>
          </h2>
          <p data-reveal className="mt-5 leading-[1.6] text-muted">
            No progress bars or percentages, just an honest list of the tools I
            reach for and what I use each one for.
          </p>
          <div
            data-reveal
            className="mt-8 rounded-xl border border-accent/30 bg-accent-soft p-5"
          >
            <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              Currently exploring
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text">
              Offensive security basics and film photography. The first teaches me
              how things break, the second teaches me how to look.
            </p>
          </div>
        </div>

        <div data-reveal>
          <div role="tablist" aria-label="Skill categories" className="flex flex-wrap gap-2">
            {CATS.map((c) => {
              const selected = c.id === tab;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={selected}
                  type="button"
                  onClick={() => setTab(c.id)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    selected ? 'text-white' : 'text-muted hover:text-text'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="skill-tab"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-accent"
                    />
                  )}
                  <span className="relative">{c.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.ul
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mt-6 divide-y divide-border rounded-xl border border-border bg-elevated"
            >
              {active.skills.map((s, i) => (
                <li
                  key={s.name}
                  className="group flex items-baseline gap-4 px-5 py-4 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl hover:bg-subtle"
                >
                  <span className="font-mono text-xs text-muted transition-colors group-hover:text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-text">{s.name}</p>
                    <p className="mt-0.5 truncate text-sm text-muted sm:whitespace-normal">
                      {s.note}
                    </p>
                  </div>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
          <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            {active.skills.length} tools · {active.label.toLowerCase()}
          </p>
        </div>
      </div>
    </section>
  );
}
