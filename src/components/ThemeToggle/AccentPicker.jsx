import { ACCENTS, useSettings } from '../../context/SettingsContext.jsx';

// Trial: four accent dots beside the theme toggle. Self-contained — delete
// this file, its Navbar imports, and the ACCENTS block in SettingsContext
// to remove the experiment.
export default function AccentPicker() {
  const { accent, setAccent } = useSettings();

  return (
    <div
      role="group"
      aria-label="Accent color (trial)"
      className="flex items-center gap-1.5 rounded-lg border border-border bg-elevated px-2.5 py-2"
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
            className={`grid h-6 w-6 place-items-center rounded-full transition-transform duration-150 hover:scale-110 ${
              active ? 'ring-2 ring-offset-2 ring-offset-elevated' : ''
            }`}
            style={active ? { ['--tw-ring-color']: dot } : undefined}
          >
            <span
              aria-hidden="true"
              className="block h-3.5 w-3.5 rounded-full"
              style={{ background: dot }}
            />
          </button>
        );
      })}
    </div>
  );
}
