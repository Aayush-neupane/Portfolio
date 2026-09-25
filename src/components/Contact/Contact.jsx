import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Instagram, Linkedin, Loader2, Mail, MapPin, Send, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

gsap.registerPlugin(ScrollTrigger);

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name (min 2 characters).'),
  email: z.string().trim().email('Please enter a valid email address.'),
  message: z.string().trim().min(10, 'Tell me a little more (min 10 characters).'),
});

const inputClass =
  'w-full rounded-lg border border-border bg-elevated px-4 py-3 text-text placeholder:text-muted/70 text-base transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40';

export default function Contact({ profile, social, whatsapp }) {
  const rootRef = useRef(null);
  const formRef = useRef(null);
  const closeRef = useRef(null);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lastSent, setLastSent] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched' });

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

  const onValid = async (data) => {
    setFailed(false);
    const to = social?.email || profile?.email || 'theghostoftheuchiha38@gmail.com';
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          _subject: `Portfolio inquiry from ${data.name}`,
          _autoresponse: `Hi ${data.name}, thanks for reaching out through my portfolio! I've received your message and will personally reply within 24 hours. — Aayush Neupane`,
          _honey: '',
          _captcha: 'false',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLastSent({ name: data.name, email: data.email, message: data.message });
      setSent(true);
      reset();
    } catch {
      // Backend unreachable (or first-time FormSubmit activation) — surface mailto fallback.
      setFailed(true);
    }
  };

  const onInvalid = () => {
    // Restart the shake without remounting — a key-change would wipe typed input.
    const form = formRef.current;
    if (!form) return;
    form.classList.remove('shake');
    void form.offsetWidth;
    form.classList.add('shake');
  };

  const email = social?.email || profile?.email || '';
  const showReply = sent && lastSent;

  useEffect(() => {
    if (!showReply) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSent(false);
        setLastSent(null);
      }
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [showReply]);

  const closeReply = () => {
    setSent(false);
    setLastSent(null);
  };
  const waNumber = whatsapp?.phoneNumber || '9779862862023';
  const waText = whatsapp?.defaultMessage || 'Hi Aayush, I found your portfolio and want to chat.';
  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}` : '';
  // Deep link carrying the visitor's actual brief (truncated for URL safety).
  const briefText = lastSent
    ? `Hi Aayush, I'm ${lastSent.name} (${lastSent.email}). My project brief: ${lastSent.message.slice(0, 600)}`
    : '';
  const briefWaLink = waNumber && lastSent
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(briefText)}`
    : '';
  const briefMailLink = lastSent
    ? `mailto:${email}?subject=${encodeURIComponent(`Project brief from ${lastSent.name}`)}&body=${encodeURIComponent(`${lastSent.message}\n\n— ${lastSent.name} (${lastSent.email})`)}`
    : '';
  const socials = [
    { label: 'GitHub', href: 'https://github.com/aayush-neupane', Icon: Github },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aayush-neupane-38a9b7240/', Icon: Linkedin },
    { label: 'Instagram', href: 'https://www.instagram.com/dynamic_aayush38', Icon: Instagram },
  ];

  return (
    <section id="contact" ref={rootRef} className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 md:py-32 lg:grid-cols-2">
        <div>
          <p
            data-reveal
            className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent"
          >
            Contact
          </p>
          <h2
            data-reveal
            className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-text"
          >
            Let&apos;s work <em className="italic">together.</em>
          </h2>
          <p data-reveal className="mt-5 max-w-md leading-[1.6] text-muted">
            Got a project, a question, or just want to say hi? My inbox is
            always open. I read everything myself and usually reply within a day
            or so.
          </p>

          <div data-reveal className="mt-8 space-y-4 text-sm">
            {email && (
              <a
                href={`mailto:${email}?subject=${encodeURIComponent('Project inquiry from your portfolio')}`}
                className="inline-flex items-center gap-2.5 text-text transition-colors hover:text-accent"
              >
                <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
                {email}
              </a>
            )}
            <p className="flex items-center gap-2.5 text-muted">
              <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
              Jhapa, Nepal · working worldwide
            </p>
          </div>

          <div data-reveal className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>

          <ol data-reveal className="mt-10 space-y-0 rounded-xl border border-border bg-elevated">
            {[
              { step: '01', title: 'You describe the project', text: 'Goals, references, deadline — a few lines are enough.' },
              { step: '02', title: 'Fixed quote in 48 hours', text: 'Scope, timeline, and price upfront. No hourly fog.' },
              { step: '03', title: 'Build in weekly demos', text: 'You see progress early and steer before it costs.' },
            ].map((s, i, arr) => (
              <li
                key={s.step}
                className={`flex gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}
              >
                <span className="font-mono text-xs text-accent">{s.step}</span>
                <div>
                  <p className="text-sm font-semibold text-text">{s.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-6 space-y-2">
            <details className="rounded-xl border border-border bg-elevated px-5 py-3.5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-text [&::-webkit-details-marker]:hidden">
                How fast do you reply?
              </summary>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Within 24 hours — fastest on WhatsApp. Based in Jhapa (UTC+5:45), working worldwide async.
              </p>
            </details>
            <details className="rounded-xl border border-border bg-elevated px-5 py-3.5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-text [&::-webkit-details-marker]:hidden">
                How long does a landing page take?
              </summary>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Typically 1–2 weeks from content to launch, including mobile polish and basic SEO.
              </p>
            </details>
          </div>
        </div>

        <div data-reveal>
          <form
            ref={formRef}
            onSubmit={handleSubmit(onValid, onInvalid)}
            noValidate
            className="rounded-xl border border-border bg-elevated p-6 md:p-8"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-text">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className={inputClass}
                  {...register('name')}
                />
                {errors.name && (
                  <p role="alert" className="mt-1.5 text-sm text-accent">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-text">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  className={inputClass}
                  {...register('email')}
                />
                {errors.email && (
                  <p role="alert" className="mt-1.5 text-sm text-accent">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-text">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell me about your project…"
                  aria-invalid={!!errors.message}
                  className={`${inputClass} resize-y`}
                  {...register('message')}
                />
                {errors.message && (
                  <p role="alert" className="mt-1.5 text-sm text-accent">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-deep hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 pt-1" aria-hidden="true">
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
                  OR
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <a
                  href="https://www.instagram.com/dynamic_aayush38"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fa-btn fa-ig inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-bg px-4 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:-translate-y-px"
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-base leading-none" />
                  <span className="fa-label">Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/khatra.manxey.071129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fa-btn fa-fb inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-bg px-4 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:-translate-y-px"
                >
                  <FontAwesomeIcon icon={faFacebookF} className="text-base leading-none" />
                  <span className="fa-label">Facebook</span>
                </a>
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fa-btn fa-wa inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-bg px-4 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:-translate-y-px"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="text-base leading-none" />
                    <span className="fa-label">WhatsApp</span>
                  </a>
                )}
              </div>

              <div aria-live="polite" className="min-h-6 space-y-2">
                {sent && !lastSent && (
                  <p className="rounded-lg border border-accent/40 bg-accent-soft px-4 py-2.5 text-center text-sm font-medium text-accent">
                    Message sent. I&apos;ll get back to you within 24 hours.
                  </p>
                )}
                {failed && (
                  <p className="rounded-lg border border-border bg-subtle px-4 py-2.5 text-center text-sm leading-relaxed text-muted">
                    Couldn&apos;t send automatically.{' '}
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent('Portfolio inquiry')}`}
                      className="font-semibold text-accent underline underline-offset-2 hover:text-accent-deep"
                    >
                      Email me directly
                    </a>{' '}
                    instead — I reply within a day.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {showReply && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Message sent — thanks ${lastSent.name}`}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeReply();
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-elevated p-6 text-sm shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">
                Auto-reply
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={closeReply}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-colors hover:border-linestrong hover:text-text"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <h3 className="mt-3 font-display text-3xl leading-tight text-text">
              Thanks {lastSent.name}!
            </h3>
            <p className="mt-2 leading-relaxed text-muted">
              Your brief is in my inbox — I personally reply within 24 hours.
              Want it faster? Continue where you left off:
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {briefWaLink && (
                <a
                  href={briefWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-deep"
                >
                  <FontAwesomeIcon icon={faWhatsapp} aria-hidden="true" />
                  WhatsApp it over
                </a>
              )}
              {briefMailLink && (
                <a
                  href={briefMailLink}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-5 py-2.5 text-xs font-medium text-text transition-all duration-200 hover:-translate-y-px hover:border-linestrong hover:text-accent"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  Email instead
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
