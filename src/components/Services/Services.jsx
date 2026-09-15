import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Globe, LayoutGrid, Wrench } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const OFFERS = [
  {
    Icon: Globe,
    title: 'Landing Pages',
    text: 'For businesses that need to look legit and get calls. Copy polish, mobile layout, contact flow, basic SEO.',
    meta: '1–2 weeks · fixed quote upfront',
  },
  {
    Icon: LayoutGrid,
    title: 'Web Apps',
    text: 'Dashboards, bookings, classrooms. React + Supabase from auth to deploy, with weekly demos you can click.',
    meta: '3–6 weeks · scoped in 48 hours',
  },
  {
    Icon: Wrench,
    title: 'Fixes & Care',
    text: 'Slow site, broken form, half-finished build? I stabilize it, clean it up, and ship it properly.',
    meta: 'Async · quote in 48 hours',
  },
];

export default function Services({ onContact }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
  }, []);

  return (
    <section id="services" ref={rootRef} className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        <p
          data-reveal
          className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent"
        >
          Services
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <h2
            data-reveal
            className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-text"
          >
            What I can <em className="italic">build for you.</em>
          </h2>
          <button
            data-reveal
            type="button"
            onClick={onContact}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-deep"
          >
            Tell me about your project
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {OFFERS.map(({ Icon, title, text, meta }, i) => (
            <article
              key={title}
              data-reveal
              className="group flex flex-col rounded-xl border border-border bg-elevated p-6 transition-all duration-200 hover:-translate-y-1 hover:border-linestrong"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-subtle text-accent transition-colors duration-200 group-hover:border-accent/50">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-1.5 font-display text-2xl text-text">{title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{text}</p>
              <p className="mt-5 border-t border-border pt-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
                {meta}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
