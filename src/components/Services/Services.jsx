import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Globe, LayoutGrid, Wrench } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const OFFERS = [
  {
    Icon: Globe,
    tier: 'Starter',
    title: 'Landing Pages',
    text: 'For businesses that need to look legit and get calls.',
    points: ['Copy polish + mobile-first layout', 'Contact flow + basic SEO', 'Launch + handover walkthrough'],
    meta: '1–2 weeks · fixed quote upfront',
    cta: 'Start a landing page',
    draft: {
      subject: 'Landing page inquiry (Starter)',
      message:
        'Hi Aayush,\n\nI need a landing page for my business:\n\n- What I do:\n- Pages/sections I need:\n- My timeline:\n\nThanks!',
    },
  },
  {
    Icon: LayoutGrid,
    tier: 'Standard',
    title: 'Web Apps',
    text: 'Dashboards, bookings, classrooms — full builds, not templates.',
    points: ['React + Supabase, auth to deploy', 'Weekly demos you can click', 'Scope locked in 48 hours'],
    meta: '3–6 weeks · scoped in 48 hours',
    cta: 'Scope my app',
    popular: true,
    draft: {
      subject: 'Web app inquiry (Standard)',
      message:
        'Hi Aayush,\n\nI want to build a web app:\n\n- What it should do:\n- Must-have features:\n- My timeline:\n- My budget range:\n\nThanks!',
    },
  },
  {
    Icon: Wrench,
    tier: 'Custom',
    title: 'Fixes & Care',
    text: 'Slow site, broken form, half-finished build? Stabilized and shipped properly.',
    points: ['Rescue + ship half-finished builds', 'Speed, form and bug fixes', 'Async updates that fit your week'],
    meta: 'Async · quote in 48 hours',
    cta: 'Get a fix quote',
    draft: {
      subject: 'Fix / care inquiry (Custom)',
      message:
        'Hi Aayush,\n\nSomething needs fixing:\n\n- Site or project URL:\n- What is broken or slow:\n- How urgent is it:\n\nThanks!',
    },
  },
];

export default function Services({ onContact, onInquire }) {
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
          {OFFERS.map(({ Icon, tier, title, text, points, meta, cta, popular }, i) => (
            <article
              key={title}
              data-reveal
              className={`group relative flex flex-col rounded-xl border bg-elevated p-6 transition-all duration-200 hover:-translate-y-1 ${
                popular ? 'border-accent/60' : 'border-border hover:border-linestrong'
              }`}
            >
              {popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
                  Most popular
                </span>
              )}
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-subtle text-accent transition-colors duration-200 group-hover:border-accent/50">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                {tier} · {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-1.5 font-display text-2xl text-text">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{text}</p>
              <ul className="mt-4 flex-1 space-y-2">
                {points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-text">
                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-border pt-4 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent">
                {meta}
              </p>
              <button
                type="button"
                onClick={() => onInquire?.(OFFERS[i])}
                className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-px ${
                  popular
                    ? 'bg-accent text-white hover:bg-accent-deep'
                    : 'border border-border text-text hover:border-accent hover:text-accent'
                }`}
              >
                {cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
        <p data-reveal className="mt-6 text-sm text-muted">
          Questions about timing or pricing?{' '}
          <button
            type="button"
            onClick={() => onContact?.('faq')}
            className="font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-deep"
          >
            Read the quick answers
          </button>
        </p>
      </div>
    </section>
  );
}
