import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Download, GraduationCap } from 'lucide-react';
import { withBase } from '../../utils/paths.js';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK = { summary: '', experience: [], education: [], certifications: [], resumeFile: {} };

export default function Resume({ data }) {
  const rootRef = useRef(null);
  const d = data || FALLBACK;
  const file = d.resumeFile || {};
  const viewUrl = withBase(file.viewUrl || '/assets/resume.pdf');
  const downloadUrl = withBase(file.downloadUrl || '/assets/resume.pdf');

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
    <section id="resume" ref={rootRef} className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-24 md:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p
            data-reveal
            className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent"
          >
            Résumé
          </p>
          <h2
            data-reveal
            className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-text"
          >
            Experience,
            <br />
            distilled.
          </h2>
          {d.summary && (
            <p data-reveal className="mt-5 max-w-md leading-[1.6] text-muted">
              {d.summary}
            </p>
          )}
          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-accent-deep hover:shadow-lg"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download PDF
            </a>
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-6 py-2.5 text-sm font-semibold text-accent transition-all duration-200 hover:-translate-y-px hover:bg-accent hover:text-white"
            >
              View Résumé
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <dl data-reveal className="mt-8 flex gap-8 border-t border-border pt-5 font-mono">
            <div>
              <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-muted">Since</dt>
              <dd className="mt-1 text-lg text-text">2022</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-muted">Roles</dt>
              <dd className="mt-1 text-lg text-text">{d.experience?.length || '-'}</dd>
            </div>
            <div>
              <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-muted">Awards</dt>
              <dd className="mt-1 text-lg text-text">{d.certifications?.length || '-'}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3
            data-reveal
            className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted"
          >
            Experience
          </h3>
          <ol className="mt-5 space-y-0">
            {(d.experience || []).map((job) => (
              <li key={job.id} data-reveal className="group relative border-l border-border pb-9 pl-7 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-bg bg-muted transition-colors duration-200 group-hover:bg-accent"
                />
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
                  {job.startDate} - {job.endDate}
                </p>
                <h4 className="mt-2 font-display text-2xl leading-snug text-text">
                  {job.title}
                </h4>
                <p className="mt-1 text-sm text-muted">
                  {job.website ? (
                    <a
                      href={job.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent-deep hover:decoration-accent"
                    >
                      {job.company}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    job.company
                  )}
                  {job.location ? ` · ${job.location}` : ''}
                </p>
                {job.description && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {job.description}
                  </p>
                )}
                {job.achievements && job.achievements.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {job.achievements.map((a, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-muted">
                        <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          <h3
            data-reveal
            className="mt-12 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted"
          >
            Education
          </h3>
          <ul className="mt-5 space-y-4">
            {(d.education || []).map((ed) => (
              <li
                key={ed.id}
                data-reveal
                className="flex items-start gap-4 rounded-xl border border-border bg-elevated p-5 transition-colors duration-200 hover:border-linestrong"
              >
                <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="font-medium text-text">{ed.degree}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {ed.institution}
                    {ed.graduationYear ? ` · ${ed.graduationYear}` : ''}
                    {ed.gpa ? ` · GPA ${ed.gpa}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {(d.certifications || []).length > 0 && (
            <>
              <h3
                data-reveal
                className="mt-12 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted"
              >
                Awards & Certifications
              </h3>
              <ul data-reveal className="mt-5 flex flex-wrap gap-2">
                {d.certifications.map((c, i) => (
                  <li
                    key={i}
                    title={c.issuer ? `${c.issuer}${c.year ? ` · ${c.year}` : ''}` : undefined}
                    className="rounded-lg border border-border bg-subtle px-3.5 py-1.5 text-sm text-text transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
                  >
                    {c.name}
                    {c.year ? ` · ${c.year}` : ''}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
