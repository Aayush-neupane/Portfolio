import { ACCENTS, useSettings } from '../../context/SettingsContext.jsx';

// Trial: each accent is a tiny orbit — a planet dot with a faint ring that
// turns into a spinning dashed orbit with a satellite when active. Reuses
// the loader's orbit animation (already reduced-motion safe). Self-contained:
// delete this file, its Navbar imports, and the ACCENTS block in
// SettingsContext to remove the experiment.
export default function AccentPicker() {
  const { accent, setAccent } = useSettings();

  return (
    <div
      role="group"
      aria-label="Accent color (trial)"
      className="flex items-center gap-0.5 rounded-full border border-border bg-elevated px-1.5 py-1"
      title="Accent color — trial"
    >
      {Object.entries(ACCENTS).map(([name, def]) => {
        const active = accent === name;
        const dot = name === 'crimson' ? '#e85854' : def.swatch;
        return (
          <button
            key={name}
            type="button"
            onClick={() => setAccent(name)}
            aria-label={`${name} accent`}
            aria-pressed={active}
            title={name}
            className="relative grid h-7 w-7 place-items-center rounded-full transition-transform duration-150 hover:scale-110"
          >
            <span
              aria-hidden="true"
              className="block h-2.5 w-2.5 rounded-full"
              style={{
                background: dot,
                boxShadow: active ? `0 0 10px ${dot}` : undefined,
              }}
            />
            {active ? (
              <span aria-hidden="true" className="loader-orbit-spin absolute inset-[3px]">
                <span
                  className="absolute -top-[2px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full"
                  style={{ background: dot }}
                />
                <span
                  className="absolute inset-0 rounded-full border border-dashed"
                  style={{ borderColor: dot }}
                />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="absolute inset-[5px] rounded-full border border-border/60"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
