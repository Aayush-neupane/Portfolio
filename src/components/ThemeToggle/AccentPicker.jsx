import { ACCENTS, useSettings } from '../../context/SettingsContext.jsx';

// Trial: a circular spinner dial — four planet dots at compass points on a
// slow-spinning dashed orbit (reuses the loader's reduced-motion-safe
// animation). Clicking a planet selects that accent; the satellite rides the
// active color. Self-contained: delete this file, its Navbar imports, and
// the ACCENTS block in SettingsContext to remove the experiment.
const ORDER = ['crimson', 'amber', 'emerald', 'indigo'];
const SPOTS = {
  crimson: 'left-1/2 top-0 -translate-x-1/2',
  amber: 'right-0 top-1/2 -translate-y-1/2',
  emerald: 'left-1/2 bottom-0 -translate-x-1/2',
  indigo: 'left-0 top-1/2 -translate-y-1/2',
};

export default function AccentPicker() {
  const { accent, setAccent } = useSettings();
  const activeDot = accent === 'crimson' ? '#e85854' : ACCENTS[accent]?.swatch;

  return (
    <div
      role="group"
      aria-label="Accent color (trial)"
      title="Accent color — trial"
      className="relative h-[52px] w-[52px] shrink-0"
    >
      {/* spinning orbit rail */}
      <span aria-hidden="true" className="loader-orbit-spin absolute inset-[3px]">
        <span
          className="absolute -top-[2px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          style={{ background: activeDot, boxShadow: `0 0 6px ${activeDot}` }}
        />
        <span className="absolute inset-0 rounded-full border border-dashed border-border/60" />
      </span>
      {/* planets */}
      {ORDER.map((name) => {
        const def = ACCENTS[name];
        const isActive = accent === name;
        const dot = name === 'crimson' ? '#e85854' : def.swatch;
        return (
          <button
            key={name}
            type="button"
            onClick={() => setAccent(name)}
            aria-label={`${name} accent`}
            aria-pressed={isActive}
            title={name}
            className={`absolute grid h-[22px] w-[22px] place-items-center rounded-full transition-transform duration-150 hover:scale-125 ${SPOTS[name]}`}
          >
            <span
              aria-hidden="true"
              className="block rounded-full"
              style={{
                width: isActive ? 11 : 9,
                height: isActive ? 11 : 9,
                background: dot,
                boxShadow: isActive ? `0 0 10px ${dot}` : undefined,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
