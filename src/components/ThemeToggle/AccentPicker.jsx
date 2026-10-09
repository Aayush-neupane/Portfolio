import { useRef } from 'react';
import { ACCENTS, useSettings } from '../../context/SettingsContext.jsx';

// Trial: a circular spinner dial — five planet dots on a slow-spinning
// dashed orbit (reuses the loader's reduced-motion-safe animation). Proper
// radio semantics: arrow keys move between accents, Home/End jump to the
// ends, and each option carries a visible focus ring in its own color.
// Self-contained: delete this file, its Navbar imports, and the ACCENTS
// block in SettingsContext to remove the experiment.
const ORDER = ['crimson', 'pink', 'gold', 'yellow', 'teal'];
const RADIUS = 20;
const SPOTS = Object.fromEntries(
  ORDER.map((name, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return [name, { x: Math.round(Math.cos(a) * RADIUS), y: Math.round(Math.sin(a) * RADIUS) }];
  })
);

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
      className="relative h-[60px] w-[60px] shrink-0"
    >
      {/* static hairline track for structure */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-border/50"
      />
      {/* spinning orbit rail + satellite in the active color */}
      <span aria-hidden="true" className="loader-orbit-spin absolute inset-[9px]">
        <span
          className="absolute -top-[2px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          style={{ background: activeDot, boxShadow: `0 0 6px ${activeDot}` }}
        />
        <span className="absolute inset-0 rounded-full border border-dashed border-border/70" />
      </span>
      {/* center mark: the official logo, tinted by the active accent */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[color] duration-300"
        style={{ color: activeDot }}
      >
        <svg viewBox="0 0 1095 1095" fill="none" className="h-[22px] w-[22px]">
          <path d="M826.5 704.3C821.2 705.5 813.7 699.0 809.1 696.4C793.8 688.0 778.5 679.7 763.1 671.4C747.9 663.2 732.6 655.2 717.5 647C700 637.5 683.3 628.5 668.3 615.1C648.1 597.0 635.2 573.1 621.4 550.1C615.6 540.3 609.4 530.6 603.8 520.7C591.0 498.0 577.4 475.8 564.1 453.4C561.1 448.3 554.6 433.0 548.5 432.7C540.9 432.3 534.5 448.7 531.0 454.4C516.5 478.1 503 502.4 488.9 526.4C471.0 556.9 454.7 590.6 429.0 615.5C402.8 640.9 364.6 655.2 332.5 672.0C317.2 680.1 301.9 688.0 286.7 696.2C282.2 698.6 273.2 705.1 268.5 704.5C266.4 700.6 269 698.0 271.0 694.5C274.3 688.7 277.4 682.8 280.4 676.9C294.6 649.7 309.4 622.7 324.4 595.9C374.1 506.9 422.9 417.3 472.9 328.4C480.1 315.6 487.4 302.8 494.4 289.9C498.6 282.3 502.2 273.8 507.2 266.7C515.8 254.4 530.6 246.1 545.6 245.4C584.0 243.8 595.1 280.5 610.6 307.9C638.5 357.1 666.5 406.3 693.6 455.9C704.8 476.3 716.6 496.5 727.4 517.1C738.1 537.2 749.5 557.0 760.5 577C775.2 603.7 789.4 630.7 804.0 657.5C810.2 668.7 816.2 680 822.3 691.2C824.5 695.2 828.9 699.9 826.5 704.3ZM865.5 805.8C859.9 804.9 846.4 792.6 840.8 788.7C824.0 776.7 806.4 766.0 788.2 756.3C735.8 728.0 677.5 710.1 618.5 702.1C522.8 689.2 422.3 702.8 334.2 742.6C308.8 754.1 284.2 767.9 261.2 783.7C254.0 788.7 246.7 793.9 239.7 799.2C236.5 801.6 233.4 804.9 229.5 805.9C228.2 801.9 230.4 798.2 231.7 794.3C235.2 784.5 240.1 774.9 245.7 766.2C269.9 729.1 309.4 704.3 349.3 686.8C479 630.0 634.7 629.8 761.7 694.8C796.4 712.5 831.4 735.7 851.4 770.1C856.0 777.9 860.0 785.9 863.1 794.4C864.5 798.2 866.5 801.8 865.5 805.8Z" transform="matrix(1.6 0 0 1.7 -325.2 -366.9)" fill="currentColor" fillRule="evenodd" />
        </svg>
      </span>
      {/* planets */}
      {ORDER.map((name) => {
        const def = ACCENTS[name];
        const isActive = accent === name;
        const dot = name === 'crimson' ? '#e85854' : def.swatch;
        const { x, y } = SPOTS[name];
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
            className={`absolute grid h-[22px] w-[22px] place-items-center rounded-full transition-all duration-150 hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-[3px] ${
              isActive ? '' : 'opacity-60 hover:opacity-100'
            }`}
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
              outlineColor: dot,
            }}
          >
            <span
              aria-hidden="true"
              className="block rounded-full"
              style={{
                width: isActive ? 11 : 8,
                height: isActive ? 11 : 8,
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
