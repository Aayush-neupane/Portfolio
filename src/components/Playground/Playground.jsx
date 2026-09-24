import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Eraser, RotateCcw } from 'lucide-react';

const TYPE_TEXT = 'great work is just tiny deliberate keystrokes';
const TYPE_HREF = 'https://auroratype.netlify.app/';
const SIGN_HREF = 'https://signature38.netlify.app/';

function useElapsed(running, finishedAt, startedAt) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => force((n) => n + 1), 250);
    return () => clearInterval(id);
  }, [running]);
  if (!startedAt) return 0;
  return ((finishedAt || Date.now()) - startedAt) / 1000;
}

function TypingWidget() {
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const inputRef = useRef(null);
  const done = typed.length >= TYPE_TEXT.length;
  const secs = useElapsed(!done && startedAt !== null, finishedAt, startedAt);

  const correct = [...typed].filter((ch, i) => ch === TYPE_TEXT[i]).length;
  const wpm = secs > 1 ? Math.round(correct / 5 / (secs / 60)) : 0;
  const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;

  const onChange = (e) => {
    const v = e.target.value.slice(0, TYPE_TEXT.length);
    if (startedAt === null && v.length > 0) setStartedAt(Date.now());
    setTyped(v);
    if (v.length >= TYPE_TEXT.length && finishedAt === null) setFinishedAt(Date.now());
  };

  const restart = () => {
    setTyped('');
    setStartedAt(null);
    setFinishedAt(null);
    inputRef.current?.focus();
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        className="block w-full cursor-text rounded-lg border border-border bg-subtle p-5 text-left"
        aria-label="Focus the typing test"
      >
        <p aria-hidden="true" className="font-mono text-lg leading-relaxed tracking-wide">
          {TYPE_TEXT.split('').map((ch, i) => {
            const t = typed[i];
            return (
              <span
                key={i}
                className={
                  t == null
                    ? 'text-muted'
                    : t === ch
                      ? 'text-text'
                      : 'rounded bg-red-500/20 text-red-400'
                }
              >
                {i === typed.length && !done && (
                  <span aria-hidden="true" className="animate-pulse text-accent">
                    ▍
                  </span>
                )}
                {ch}
              </span>
            );
          })}
          {done && <span aria-hidden="true" className="text-accent"> ✓</span>}
        </p>
        <span className="sr-only" aria-live="polite">
          {done ? `Done. ${wpm} words per minute, ${acc} percent accuracy.` : 'Type the sentence above.'}
        </span>
        <input
          ref={inputRef}
          value={typed}
          onChange={onChange}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Type the sentence shown above"
          className="sr-only"
        />
      </button>
      <div className="mt-4 flex items-center gap-6 font-mono text-xs tabular-nums">
        <span className="text-text">
          <span className="text-2xl font-bold">{done ? wpm : secs > 1 ? wpm : 0}</span>{' '}
          <span className="uppercase tracking-[0.14em] text-muted">wpm</span>
        </span>
        <span className="text-text">
          <span className="text-2xl font-bold">{acc}</span>
          <span className="uppercase tracking-[0.14em] text-muted">% acc</span>
        </span>
        <button
          type="button"
          onClick={restart}
          className="ml-auto inline-flex items-center gap-1.5 uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </button>
      </div>
    </div>
  );
}

function SignatureWidget() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [stroked, setStroked] = useState(false);

  const pos = (e) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width / dpr,
      y: ((e.clientY - r.top) / r.height) * canvas.height / dpr,
      w: canvas.width / dpr,
      h: canvas.height / dpr,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
  }, []);

  const stroke = (from, to) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#e85854';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  };

  const down = (e) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
    setStroked(true);
  };
  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const p = pos(e);
    if (last.current) stroke(last.current, p);
    last.current = p;
  };
  const up = () => {
    drawing.current = false;
    last.current = null;
  };
  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setStroked(false);
  };

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-border bg-subtle">
        <canvas
          ref={canvasRef}
          className="block h-44 w-full cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          aria-label="Draw your signature here with mouse or finger"
          role="img"
        />
      </div>
      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={clear}
          disabled={!stroked}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent disabled:opacity-40"
        >
          <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
          Clear
        </button>
      </div>
    </div>
  );
}

export default function Playground() {
  return (
    <section id="playground" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Playground
        </p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-text">
          Don&apos;t just look — <em className="italic">play.</em>
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">
          Live slices of two shipped apps, running right here. No screenshots,
          no mockups — the real interaction.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-border bg-elevated p-5 transition-colors duration-200 hover:border-linestrong md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl text-text">Type test</h3>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                Aurora Type
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              One sentence. Click in and type — speed and accuracy update live.
            </p>
            <div className="mt-5">
              <TypingWidget />
            </div>
            <a
              href={TYPE_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-deep"
            >
              Open the full test
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>

          <article className="rounded-xl border border-border bg-elevated p-5 transition-colors duration-200 hover:border-linestrong md:p-7">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl text-text">Signature pad</h3>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                Signature
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Sign with mouse or finger — a teaser of the stroke engine.
            </p>
            <div className="mt-5">
              <SignatureWidget />
            </div>
            <a
              href={SIGN_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-deep"
            >
              Open the full app
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
