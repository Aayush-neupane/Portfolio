import { useRef } from 'react';
import { ACCENTS, useSettings } from '../../context/SettingsContext.jsx';

// Trial: a circular spinner dial — four planet dots at compass points on a
// slow-spinning dashed orbit (reuses the loader's reduced-motion-safe
// animation). Proper radio semantics: arrow keys move between accents,
// Home/End jump to the ends, and each option carries a visible focus ring
// in its own color. Self-contained: delete this file, its Navbar imports,
// and the ACCENTS block in SettingsContext to remove the experiment.
const ORDER = ['crimson', 'amber', 'teal', 'plum'];
const SPOTS = {
  crimson: 'left-1/2 top-0 -translate-x-1/2',
  amber: 'right-0 top-1/2 -translate-y-1/2',
  teal: 'left-1/2 bottom-0 -translate-x-1/2',
  plum: 'left-0 top-1/2 -translate-y-1/2',
};

export default function AccentPicker() {
  const { accent, setAccent } = useSettings();
  const btnRefs = useRef({});

  const move = (from, dir) => {
    const i = ORDER.indexOf(from);
    const next = ORDER[(i + dir + ORDER.length) % ORDER.length];
    setAccent(next);
    btnRefs.current[next]?.focus();
  };

  const onKeyDown = (e) => {
    const cur = ORDER.includes(document.activeElement?.dataset?.accent)
      ? document.activeElement.dataset.accent
      : accent;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      move(cur, 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      move(cur, -1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setAccent(ORDER[0]);
      btnRefs.current[ORDER[0]]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setAccent(ORDER[ORDER.length - 1]);
      btnRefs.current[ORDER[ORDER.length - 1]]?.focus();
    }
  };

  const activeDot = accent === 'crimson' ? '#e85854' : ACCENTS[accent]?.swatch;

  return (
    <div
      role="radiogroup"
      aria-label="Accent color (trial)"
      title="Accent color — trial"
      onKeyDown={onKeyDown}
      className="relative h-14 w-14 shrink-0"
    >
      {/* static hairline track for structure */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-border/50"
      />
      {/* spinning orbit rail + satellite in the active color */}
      <span aria-hidden="true" className="loader-orbit-spin absolute inset-[7px]">
        <span
          className="absolute -top-[2px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          style={{ background: activeDot, boxShadow: `0 0 6px ${activeDot}` }}
        />
        <span className="absolute inset-0 rounded-full border border-dashed border-border/70" />
      </span>
      {/* planets */}
      {ORDER.map((name) => {
        const def = ACCENTS[name];
        const isActive = accent === name;
        const dot = name === 'crimson' ? '#e85854' : def.swatch;
        return (
          <button
            key={name}
            ref={(el) => {
              btnRefs.current[name] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${name} accent`}
            data-accent={name}
            tabIndex={isActive ? 0 : -1}
            onClick={() => setAccent(name)}
            title={name}
            className={`absolute grid h-6 w-6 place-items-center rounded-full transition-all duration-150 hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-[3px] ${
              SPOTS[name]
            } ${isActive ? '' : 'opacity-60 hover:opacity-100'}`}
            style={{ outlineColor: dot }}
          >
            <span
              aria-hidden="true"
              className="block rounded-full"
              style={{
                width: isActive ? 12 : 9,
                height: isActive ? 12 : 9,
                background: dot,
                boxShadow: isActive ? `0 0 12px ${dot}` : undefined,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
