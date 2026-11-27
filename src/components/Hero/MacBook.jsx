import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Briefcase, Clock, Layers, Rocket, Terminal } from 'lucide-react';

const ICONS = { ship: Rocket, build: Layers, now: Clock, work: Briefcase, term: Terminal };

/* The site mark, inlined so the lid can wear it without a second request. */
const LOGO_PATH =
  'M826.5 704.3C821.2 705.5 813.7 699.0 809.1 696.4C793.8 688.0 778.5 679.7 763.1 671.4C747.9 663.2 732.6 655.2 717.5 647C700 637.5 683.3 628.5 668.3 615.1C648.1 597.0 635.2 573.1 621.4 550.1C615.6 540.3 609.4 530.6 603.8 520.7C591.0 498.0 577.4 475.8 564.1 453.4C561.1 448.3 554.6 433.0 548.5 432.7C540.9 432.3 534.5 448.7 531.0 454.4C516.5 478.1 503 502.4 488.9 526.4C471.0 556.9 454.7 590.6 429.0 615.5C402.8 640.9 364.6 655.2 332.5 672.0C317.2 680.1 301.9 688.0 286.7 696.2C282.2 698.6 273.2 705.1 268.5 704.5C266.4 700.6 269 698.0 271.0 694.5C274.3 688.7 277.4 682.8 280.4 676.9C294.6 649.7 309.4 622.7 324.4 595.9C374.1 506.9 422.9 417.3 472.9 328.4C480.1 315.6 487.4 302.8 494.4 289.9C498.6 282.3 502.2 273.8 507.2 266.7C515.8 254.4 530.6 246.1 545.6 245.4C584.0 243.8 595.1 280.5 610.6 307.9C638.5 357.1 666.5 406.3 693.6 455.9C704.8 476.3 716.6 496.5 727.4 517.1C738.1 537.2 749.5 557.0 760.5 577C775.2 603.7 789.4 630.7 804.0 657.5C810.2 668.7 816.2 680.0 822.3 691.2C824.5 695.2 828.9 699.9 826.5 704.3ZM865.5 805.8C859.9 804.9 846.4 792.6 840.8 788.7C824.0 776.7 806.4 766.0 788.2 756.3C735.8 728.0 677.5 710.1 618.5 702.1C522.8 689.2 422.3 702.8 334.2 742.6C308.8 754.1 284.2 767.9 261.2 783.7C254.0 788.7 246.7 793.9 239.7 799.2C236.5 801.6 233.4 804.9 229.5 805.9C228.2 801.9 230.4 798.2 231.7 794.3C235.2 784.5 240.1 774.9 245.7 766.2C269.9 729.1 309.4 704.3 349.3 686.8C479 630.0 634.7 629.8 761.7 694.8C796.4 712.5 831.4 735.7 851.4 770.1C856.0 777.9 860.0 785.9 863.1 794.4C864.5 798.2 866.5 801.8 865.5 805.8Z';

function BrandMark({ className }) {
  return (
    <svg viewBox="0 0 1095 1095" className={className} aria-hidden="true" focusable="false">
      <path
        d={LOGO_PATH}
        transform="matrix(1.2 0 0 1.2 -86 -134.7)"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

/* A real keycap layout: every key is its own button, and the widths add up per
 * row so the block keeps the staggered look of an actual MacBook keyboard. */
const cap = (label, value = label.toLowerCase(), w = 1) => ({ label, value, w });
const plain = (label, w = 1) => ({ label, value: null, w });
const letter = (c) => cap(c.toUpperCase(), c);

const KEY_ROWS = [
  {
    h: 0.62,
    keys: [
      plain('esc', 1.2),
      ...Array.from({ length: 12 }, (_, i) => plain(`F${i + 1}`)),
      { label: 'power', value: 'power', w: 1.2 },
    ],
  },
  {
    keys: [
      cap('`'),
      ...'1234567890'.split('').map((c) => cap(c, c)),
      cap('-'),
      cap('='),
      { label: 'delete', value: 'back', w: 1.4 },
    ],
  },
  {
    keys: [
      { label: 'tab', value: 'tab', w: 1.4 },
      ...'qwertyuiop'.split('').map(letter),
      cap('['),
      cap(']'),
      cap('\\'),
    ],
  },
  {
    keys: [
      { label: 'caps', value: 'caps', w: 1.7, led: true },
      ...'asdfghjkl'.split('').map(letter),
      cap(';'),
      cap("'"),
      { label: 'return', value: 'enter', w: 1.7 },
    ],
  },
  {
    keys: [
      plain('shift', 2.2),
      ...'zxcvbnm'.split('').map(letter),
      cap(','),
      cap('.'),
      cap('/'),
      plain('shift', 2.2),
    ],
  },
  {
    keys: [
      plain('fn'),
      plain('ctrl'),
      plain('alt'),
      plain('cmd', 1.2),
      { label: 'space', value: ' ', w: 4.8 },
      plain('cmd', 1.2),
      plain('alt'),
      {
        /* the inverted-T arrow cluster, which is two half-height rows */
        w: 3,
        cluster: [
          [null, { label: '↑', value: 'up' }, null],
          [plain('←', 1), { label: '↓', value: 'down' }, plain('→', 1)],
        ],
      },
    ],
  },
];

function Keycap({ k, lit, onPress }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={`hero-laptop-key${k.label.length > 1 ? ' is-word' : ''}`}
      style={{ '--key-w': k.w ?? 1 }}
      onClick={() => onPress(k.value)}
      aria-label={k.label}
    >
      <span>{k.label === 'space' ? '' : k.label}</span>
      {k.led ? <i className={`hero-laptop-led${lit ? ' is-on' : ''}`} /> : null}
    </button>
  );
}

function WindowBar({ title, count, onClose, onNext, onZoom }) {
  return (
    <div className="hero-window-bar">
      <span className="hero-window-lights">
        <button type="button" className="is-close" aria-label="Close the window" title="Close" onClick={onClose}>
          <i />
        </button>
        <button type="button" className="is-next" aria-label="Next window" title="Next" onClick={onNext}>
          <i />
        </button>
        <button type="button" className="is-zoom" aria-label="Zoom the window" title="Zoom" onClick={onZoom}>
          <i />
        </button>
      </span>
      <span className="hero-window-title">{title}</span>
      <span aria-hidden="true" className="hero-window-count">
        {count}
      </span>
    </div>
  );
}

/**
 * The hero's MacBook, built the way the reference device is built: a shell
 * with the UI laid inside it, measured in container units (cqw) instead of
 * photo pixels, so the machine keeps its proportions from a narrow phone up
 * to the hero column.
 *
 * It opens and shuts: the lid folds down onto the deck, its aluminium back
 * (with the site mark on it) becomes the top face, and clicking that lid or
 * the latch below brings it back up. The screen runs three data windows plus
 * a terminal, the window lights close/step/zoom, and the dock switches apps.
 * The keycaps are real buttons: they type into that terminal, return runs the
 * command, the arrows walk the history, caps lock really locks.
 */
export default function MacBook({
  available,
  reply,
  nowText,
  nowSub,
  nowProjectId,
  onProject,
  projects = [],
}) {
  const frames = useMemo(
    () => [
      {
        key: 'ship',
        label: 'Ship',
        file: 'ship.md',
        title: 'Ship.',
        rows: [
          { label: 'Focus', value: 'Full-stack web' },
          { label: 'Stack', value: 'React · TS' },
          {
            label: 'Status',
            value: available ? 'Open' : 'Booked',
            accent: available,
          },
        ],
      },
      {
        key: 'build',
        label: 'Build',
        file: 'stack.md',
        title: 'Build.',
        rows: [
          { label: 'Web', value: 'React · Tailwind' },
          { label: 'Data', value: 'Supabase' },
          { label: 'Games', value: 'Unity · C#' },
        ],
      },
      {
        key: 'now',
        label: 'Now',
        file: 'now.md',
        title: 'Now.',
        rows: [
          nowProjectId != null && onProject
            ? { label: 'Project', value: nowText, action: () => onProject({ id: nowProjectId }) }
            : { label: 'Project', value: nowText },
          { label: 'Kind', value: nowSub || 'In progress' },
          { label: 'Replies', value: reply },
        ],
      },
      {
        key: 'work',
        label: 'Work',
        file: 'work.md',
        title: 'Work.',
        list: projects.slice(0, 3).map((p) => ({
          id: p.id,
          title: p.title || 'Project',
          kind: (p.techStack && p.techStack[0]) || 'build',
        })),
      },
    ],
    [available, reply, nowText, nowSub, nowProjectId, onProject, projects]
  );

  const [open, setOpen] = useState(() => {
    try {
      const v = localStorage.getItem('lap-open');
      return v === null ? false : v === '1';
    } catch {
      return false;
    }
  });
  const [view, setView] = useState('ship');
  const [win, setWin] = useState('open');
  const [zoom, setZoom] = useState(false);
  const [caps, setCaps] = useState(false);
  const [cmd, setCmd] = useState('');
  const [log, setLog] = useState([{ tone: 'dim', text: 'type "help", then return' }]);
  const [history, setHistory] = useState([]);
  const [histAt, setHistAt] = useState(-1);
  const [clock, setClock] = useState(timeNow);
  const bootedAt = useRef(Date.now());
  /* pointer is over the machine, and the display's own pointer is showing */
  const [engaged, setEngaged] = useState(false);
  const [cursorOn, setCursorOn] = useState(false);
  const cursorRef = useRef(null);
  const pressRef = useRef(null);

  const frame = frames.find((f) => f.key === view) || frames[0];
  const frameIndex = Math.max(0, frames.findIndex((f) => f.key === view));
  const dock = useMemo(
    () => [
      ...frames.map((f) => ({ key: f.key, label: f.label, Icon: ICONS[f.key] })),
      { key: 'term', label: 'Term', Icon: Terminal },
    ],
    [frames]
  );

  /* the lid opens shortly after the hero lands, unless motion is off or the
   * visitor left it shut last time */
  useEffect(() => {
    let persisted = null;
    try { persisted = localStorage.getItem('lap-open'); } catch { /* ignore */ }
    if (persisted !== null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpen(true);
      return;
    }
    const t = setTimeout(() => setOpen(true), 450);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClock(timeNow()), 20_000);
    return () => clearInterval(id);
  }, []);

  const run = (raw) => {
    const text = raw.trim();
    const next = [...log];
    const push = (t, tone = 'out') => next.push({ text: t, tone });
    const parts = text.toLowerCase().split(/\s+/);
    const aliases = { ll: 'ls', cls: 'clear', h: 'help', q: 'exit' };
    if (parts[0] && aliases[parts[0]]) parts[0] = aliases[parts[0]];
    const [name, ...args] = parts;
    push(text, 'cmd');

    if (!name) {
      push('type "help" and press return', 'dim');
    } else if (name === 'help') {
      push('ls       files in this folder', 'dim');
      push('cat      read a file', 'dim');
      push('whoami   who is this', 'dim');
      push('hostname this machine', 'dim');
      push('env      environment vars', 'dim');
      push('top      running processes', 'dim');
      push('greet    say hello', 'dim');
      push('banner   ascii art', 'dim');
      push('fortune  a small truth', 'dim');
      push('ping     check a host', 'dim');
      push('version  build info', 'dim');
      push('cal      this month', 'dim');
      push('now      what is happening', 'dim');
      push('stack    tools and languages', 'dim');
      push('projects list recent work', 'dim');
      push('open     open ship / build / now / work', 'dim');
      push('date     current date and time', 'dim');
      push('echo     print text', 'dim');
      push('pwd      working directory', 'dim');
      push('history  previous commands', 'dim');
      push('uptime   how long this session', 'dim');
      push('neofetch system summary', 'dim');
      push('theme     dark / light mode', 'dim');
      push('clear    wipe the screen', 'dim');
      push('reset    restore defaults', 'dim');
      push('man      help for a command', 'dim');
      push('tab      complete a command', 'dim');
    } else if (name === 'ls') {
      push('ship.md    stack.md    now.md');
    } else if (name === 'cat') {
      const file = args[0];
      if (file === 'ship.md') {
        push('Focus: Full-stack web');
        push('Stack: React · TS');
        push(`Status: ${available ? 'Open' : 'Booked'}`);
      } else if (file === 'stack.md') {
        push('Web: React · Tailwind');
        push('Data: Supabase');
        push('Games: Unity · C#');
      } else if (file === 'now.md') {
        push(nowText, 'accent');
        push(nowSub || 'in progress', 'dim');
        push(available ? `open for work · replies in ${reply}` : 'fully booked right now', available ? 'accent' : 'dim');
      } else {
        push('cat: no such file', 'dim');
      }
    } else if (name === 'whoami') {
      push('aayush neupane · dev · jhapa, np');
    } else if (name === 'hostname') {
      push('aayushnp.com');
    } else if (name === 'env') {
      push('USER=aayush', 'dim');
      push('SHELL=/bin/zsh', 'dim');
      push('LANG=en_US.UTF-8', 'dim');
      push('TERM=xterm-256color', 'dim');
      push('PWD=/Users/aayush/portfolio', 'dim');
    } else if (name === 'top') {
      push('PID   COMMAND        CPU  MEM', 'dim');
      push('1     WindowServer   4.2  3.1', 'dim');
      push('42    zsh            0.1  0.4', 'dim');
      push('108   node (vite)    2.8  6.2', 'dim');
      push('203   portfolio      1.1  2.0', 'dim');
    } else if (name === 'greet') {
      const h = new Date().getHours();
      const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
      push(`${g}, visitor.`, 'accent');
      push('welcome to the dev console.', 'dim');
    } else if (name === 'banner') {
      push('   _   _                  _     ', 'accent');
      push('  /_\\ | |__   __ _ _   _| |__  ', 'accent');
      push(' //_\\\\| \'_ \\ / _` | | | | \'_ \\ ', 'accent');
      push('/  _  \\ | | | (_| | |_| | |_) |', 'accent');
      push('\\_/ \\_/_| |_|\\__,_|\\__,_|_.__/ ', 'accent');
      push('aayush neupane · dev · jhapa', 'dim');
    } else if (name === 'version') {
      push('portfolio 1.0.0', 'accent');
      push('built with react + vite', 'dim');
    } else if (name === 'cal') {
      const d = new Date();
      const y = d.getFullYear();
      const m = d.getMonth();
      const first = new Date(y, m, 1).getDay();
      const days = new Date(y, m + 1, 0).getDate();
      push(d.toLocaleString(undefined, { month: 'long', year: 'numeric' }), 'accent');
      push('Su Mo Tu We Th Fr Sa', 'dim');
      let row = '   '.repeat(first);
      for (let day = 1; day <= days; day++) {
        row += String(day).padStart(2, ' ') + ' ';
        if ((first + day) % 7 === 0 || day === days) {
          push(row);
          row = '';
        }
      }
    } else if (name === 'now') {
      push(nowText, 'accent');
      push(nowSub || 'in progress', 'dim');
      push(
        available ? `open for work · replies in ${reply}` : 'fully booked right now',
        available ? 'accent' : 'dim'
      );
    } else if (name === 'stack') {
      push('react · typescript · tailwind');
      push('supabase · node · unity · c#');
    } else if (name === 'open') {
      const target = args[0];
      if (!target) {
        push('ship · build · now · work', 'dim');
        if (projects.length) push('or: open <project name>', 'dim');
      } else if (frames.some((f) => f.key === target)) {
        setView(target);
        push(`opening ${target}.md`, 'dim');
      } else {
        const proj = projects.find((p) =>
          (p.title || '').toLowerCase().includes(target.toLowerCase())
        );
        if (proj) {
          onProject?.({ id: proj.id });
          push(`opening ${proj.title}`, 'accent');
        } else {
          push('open ship | build | now | work | <project>', 'dim');
        }
      }
    } else if (name === 'projects') {
      if (!projects.length) {
        push('no projects yet', 'dim');
      } else {
        projects.slice(0, 5).forEach((p) => {
          push(`${p.title || 'Project'} · ${(p.techStack && p.techStack[0]) || 'build'}`);
        });
      }
    } else if (name === 'date') {
      push(new Date().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' }));
    } else if (name === 'echo') {
      push(args.join(' '));
    } else if (name === 'pwd') {
      push('/Users/aayush/portfolio');
    } else if (name === 'history') {
      if (!history.length) push('no history yet', 'dim');
      else history.forEach((h, i) => push(`${String(i + 1).padStart(2, ' ')}  ${h}`));
    } else if (name === 'uptime') {
      const s = Math.round((Date.now() - bootedAt.current) / 1000);
      push(`up ${Math.floor(s / 60)}m ${s % 60}s · 1 user`);
    } else if (name === 'neofetch') {
      push('       .--.        aayush@portfolio', 'accent');
      push('      |o_o |       ---------------', 'dim');
      push('      |:_/ |       OS: macOS (web)');
      push('     //   \\ \\      Host: hero section');
      push('    (|     | )     Shell: zsh 5.9');
      push('   /\'\\_   _/`\\    Theme: ' + (document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
      push('   \\___)=(___/     Projects: ' + projects.length);
    } else if (name === 'theme') {
      const arg = args[0];
      const isDark = document.documentElement.classList.contains('dark');
      if (!arg) {
        push(isDark ? 'dark' : 'light');
      } else if (arg === 'dark' && !isDark) {
        document.querySelector('button[aria-label*="Switch to dark"]')?.click();
        push('switched to dark', 'accent');
      } else if (arg === 'light' && isDark) {
        document.querySelector('button[aria-label*="Switch to light"]')?.click();
        push('switched to light', 'accent');
      } else {
        push('theme dark | light', 'dim');
      }
    } else if (name === 'sudo') {
      push('nice try.');
    } else if (name === 'ping') {
      const host = args[0] || 'aayushnp.com';
      push(`PING ${host}: 56 data bytes`, 'dim');
      push(`64 bytes from ${host}: time=12.4 ms`, 'dim');
      push(`64 bytes from ${host}: time=11.8 ms`, 'dim');
      push(`--- ${host} ping statistics ---`, 'dim');
      push('2 packets transmitted, 2 received, 0% loss', 'accent');
    } else if (name === 'fortune') {
      const quotes = [
        'ship small, ship often.',
        'the best code is no code.',
        'make it work, then make it right.',
        'simplicity is the ultimate sophistication.',
        'done is better than perfect.',
      ];
      push(quotes[Math.floor(Math.random() * quotes.length)], 'accent');
    } else if (name === 'rm') {
      push('rm: permission denied (and a good thing too)', 'dim');
    } else if (name === 'exit') {
      push('closing the lid…', 'dim');
      setOpen(false);
    } else if (name === 'man') {
      const topic = args[0];
      const docs = {
        ls: 'ls — list files in this folder',
        cat: 'cat <file> — read a file',
        open: 'open <app|project> — switch window or open a project',
        clear: 'clear — wipe the screen',
        theme: 'theme dark|light — switch colour mode',
      };
      if (topic && docs[topic]) push(docs[topic], 'dim');
      else push('man <command>', 'dim');
    } else if (name === 'clear') {
      setLog([]);
      setCmd('');
      setHistory((h) => {
        if (!text) return h;
        if (h.length && h[h.length - 1] === text) return h;
        return [...h, text];
      });
      setHistAt(-1);
      return;
    } else if (name === 'reset') {
      setView('ship');
      setWin('open');
      setZoom(false);
      setCmd('');
      setLog([{ tone: 'dim', text: 'type "help", then return' }, { text: 'reset complete', tone: 'accent' }]);
      setHistory((h) => {
        if (!text) return h;
        if (h.length && h[h.length - 1] === text) return h;
        return [...h, text];
      });
      setHistAt(-1);
      return;
    } else {
      push(`zsh: command not found: ${name}`, 'dim');
    }

    setLog(next.slice(-8));
    setCmd('');
    setHistory((h) => {
      if (!text) return h;
      if (h.length && h[h.length - 1] === text) return h;
      return [...h, text];
    });
    setHistAt(-1);
  };

  const stepHistory = (dir) => {
    if (!history.length) return;
    const from = histAt === -1 ? history.length : histAt;
    const at = Math.max(0, Math.min(history.length - 1, from + dir));
    setHistAt(at);
    setCmd(history[at] ?? '');
  };

  const press = (value, raw = false) => {
    if (value == null) return;
    if (value === 'power') {
      setOpen((o) => !o);
      return;
    }
    if (!open) return;
    setWin('open');
    setView('term');
    switch (value) {
      case 'back':
        setCmd((c) => c.slice(0, -1));
        return;
      case 'enter':
        run(cmd);
        return;
      case 'esc':
        setCmd('');
        return;
      case 'caps':
        setCaps((c) => !c);
        return;
      case 'tab': {
        /* tab-completion for command names, falling back to two spaces */
        const cmds = ['help', 'ls', 'cat', 'whoami', 'hostname', 'env', 'top', 'ping', 'greet', 'banner', 'fortune', 'version', 'cal', 'now', 'stack', 'projects', 'open', 'date', 'echo', 'pwd', 'history', 'uptime', 'neofetch', 'theme', 'rm', 'man', 'clear', 'reset', 'sudo', 'exit'];
        const trimmed = cmd.trim();
        const parts = trimmed ? trimmed.split(/\s+/) : [];
        const last = parts.length ? parts[parts.length - 1] : '';
        const match = last ? cmds.find((c) => c.startsWith(last) && c !== last) : null;
        if (match && parts.length <= 1) {
          setCmd(match);
        } else {
          setCmd((c) => `${c}  `.slice(-30));
        }
        return;
      }
      case 'up':
        stepHistory(-1);
        return;
      case 'down':
        stepHistory(1);
        return;
      default:
        setCmd((c) => (c + (raw ? value : caps ? value.toUpperCase() : value)).slice(-30));
    }
  };

  useEffect(() => {
    try { localStorage.setItem('lap-open', open ? '1' : '0'); } catch { /* ignore */ }
  }, [open]);

  useLayoutEffect(() => {
    pressRef.current = press;
  });
  /* The visitor's own keyboard drives the machine while the pointer is on it:
   * the same press() the keycaps call, so both inputs stay identical. */
  useEffect(() => {
    if (!engaged) return undefined;
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
      const named = {
        Backspace: 'back',
        Enter: 'enter',
        Tab: 'tab',
        Escape: 'esc',
        ArrowUp: 'up',
        ArrowDown: 'down',
        CapsLock: 'caps',
      }[event.key];
      const single = event.key.length === 1 ? event.key : null;
      const value = named ?? single;
      if (value == null) return;
      event.preventDefault();
      pressRef.current(value, single != null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [engaged]);

  /* the display gets its own pointer, drawn flat over the glass, so it never
   * fights the machine's 3D projection */
  const moveCursor = (event) => {
    const el = cursorRef.current;
    if (!el) return;
    const host = el.offsetParent || el.parentElement;
    if (!host) return;
    const box = host.getBoundingClientRect();
    el.style.transform = `translate3d(${event.clientX - box.left}px, ${event.clientY - box.top}px, 0)`;
  };

  const showFrame = (key) => {
    setView(key);
    setWin('open');
  };

  const nextFrame = () => {
    setView(frames[(frameIndex + 1) % frames.length].key);
    setWin('open');
  };

  const title = view === 'term' ? 'term — zsh' : frame.file;
  const count =
    view === 'term'
      ? `${String(frames.length + 1).padStart(2, '0')}/${String(frames.length + 1).padStart(2, '0')}`
      : `${String(frameIndex + 1).padStart(2, '0')}/${String(frames.length).padStart(2, '0')}`;

  return (
    <>
      <div
        className={`hero-laptop${open ? ' is-open' : ' is-closed'}${engaged ? ' is-engaged' : ''}`}
        onPointerEnter={() => setEngaged(true)}
        onPointerLeave={() => setEngaged(false)}
      >
        <div className="hero-laptop-lid hero-device-face">
          <div className="hero-laptop-bezel">
            <div
              className="hero-laptop-screen"
              onPointerEnter={() => setCursorOn(true)}
              onPointerLeave={() => setCursorOn(false)}
              onPointerMove={moveCursor}
            >
              <span className="hero-laptop-wall" aria-hidden="true" />

              <div className="hero-laptop-ui">
                <div className="hero-menubar">
                  <span className="hero-menubar-id">
                    <BrandMark className="hero-menubar-mark" />
                    aayushnp.com
                  </span>
                  <span className="hero-menubar-meta">
                    <span className="hero-menubar-status">
                      <span
                        aria-hidden="true"
                        className={`hero-laptop-blink${available ? ' is-on' : ''}`}
                      />
                      {available ? 'open' : 'booked'}
                    </span>
                    <span aria-hidden="true" className="hero-battery">
                      <i className={available ? '' : 'is-low'} />
                    </span>
                    <span className="hero-menubar-clock">{clock}</span>
                  </span>
                </div>

                <div className={`hero-desktop${zoom ? ' is-zoom' : ''}`}>
                  {win === 'closed' ? (
                    <div className="hero-idle">
                      <BrandMark className="hero-idle-mark" />
                      <p className="hero-idle-name">aayush neupane</p>
                      <p className="hero-idle-hint">window closed — pick an app in the dock</p>
                    </div>
                  ) : view === 'term' ? (
                    <div className="hero-window hero-window-term">
                      <WindowBar
                        title={title}
                        count={count}
                        onClose={() => setWin('closed')}
                        onNext={nextFrame}
                        onZoom={() => setZoom((z) => !z)}
                      />
                      <div className="hero-term-body" role="log" aria-live="polite" aria-atomic="false">
                        {log.map((line, i) => (
                          <p key={`${i}-${line.text}`} className={`hero-term-line is-${line.tone}`}>
                            {line.text}
                          </p>
                        ))}
                        <p className="hero-term-line is-live">
                          <span className="hero-term-prompt" aria-hidden="true">
                            ~ %
                          </span>
                          <span className="hero-term-cmd">{cmd}</span>
                          <span aria-hidden="true" className="hero-laptop-caret" />
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="hero-window">
                      <WindowBar
                        title={title}
                        count={count}
                        onClose={() => setWin('closed')}
                        onNext={nextFrame}
                        onZoom={() => setZoom((z) => !z)}
                      />
                      <div key={frame.key} className="hero-window-body">
                        <p className="hero-window-head">{frame.title}</p>
                        {frame.list ? (
                          frame.list.length ? (
                            <ul className="hero-work-list">
                              {frame.list.map((item) => (
                                <li key={item.id}>
                                  <button
                                    type="button"
                                    className="hero-work-item"
                                    onClick={() => onProject?.({ id: item.id })}
                                    aria-label={`Open ${item.title}`}
                                  >
                                    <span className="hero-work-name">{item.title}</span>
                                    <span className="hero-work-meta">{item.kind}</span>
                                    <ArrowUpRight aria-hidden="true" className="hero-work-go" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="hero-window-hint">no projects yet — check back soon</p>
                          )
                        ) : (
                          <dl className="hero-window-rows">
                            {frame.rows.map((row, i) => (
                              <div key={`${frame.key}-${i}`} className="hero-window-row">
                                <dt>{row.label}</dt>
                                <dd
                                  className={row.accent ? 'is-accent' : undefined}
                                  title={row.value}
                                >
                                  {row.action ? (
                                    <button
                                      type="button"
                                      onClick={row.action}
                                      className="hero-window-link"
                                    >
                                      {row.value}
                                    </button>
                                  ) : (
                                    row.value
                                  )}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        <p className={`hero-window-hint${engaged ? ' is-live' : ''}`}>
                          <span aria-hidden="true" className="hero-laptop-caret" />
                          {engaged ? 'keyboard connected — type away' : 'hover, then use your keyboard'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="hero-dock" role="group" aria-label="Switch the open window">
                    {dock.map(({ key, label, Icon }) => (
                      <button
                        key={key}
                        type="button"
                        className={`hero-dock-btn${key === view ? ' is-on' : ''}`}
                        aria-pressed={key === view}
                        aria-label={`Show ${label}`}
                        title={label}
                        data-label={label}
                        onClick={() => showFrame(key)}
                      >
                        <Icon aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <span aria-hidden="true" className="hero-laptop-notch">
                <i />
              </span>
            </div>
          </div>
          <button
            type="button"
            className="hero-laptop-lid-back"
            onClick={() => setOpen((o) => !o)}
            tabIndex={open ? -1 : 0}
            aria-label={open ? 'Close the laptop' : 'Open the laptop'}
          >
            <BrandMark className="hero-laptop-logo" />
          </button>
          <span aria-hidden="true" className="hero-laptop-lid-wall" />
        </div>

        <div className="hero-laptop-base">
          <span aria-hidden="true" className="hero-laptop-hinge" />
          <span aria-hidden="true" className="hero-laptop-grille is-left" />
          <span aria-hidden="true" className="hero-laptop-grille is-right" />

          <div aria-hidden="true" className="hero-laptop-well">
            <div className="hero-laptop-keys">
              {KEY_ROWS.map((row, r) => (
                <div
                  key={`row-${r}`}
                  className="hero-laptop-keyrow"
                  style={{ '--row-h': row.h ?? 1 }}
                >
                  {row.keys.map((k, i) =>
                    k.cluster ? (
                      <div
                        key={`cluster-${i}`}
                        className="hero-laptop-cluster"
                        style={{ flex: k.w }}
                      >
                        {k.cluster.map((sub, si) => (
                          <div key={si} className="hero-laptop-keyrow">
                            {sub.map((kk, ki) =>
                              kk ? (
                                <Keycap key={ki} k={kk} onPress={press} />
                              ) : (
                                <span key={ki} className="hero-laptop-spacer" />
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Keycap key={`${r}-${i}-${k.label}`} k={k} lit={k.led && caps} onPress={press} />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          <span aria-hidden="true" className="hero-laptop-pad" />
          <span aria-hidden="true" className="hero-laptop-lip" />
          <span aria-hidden="true" className="hero-laptop-groove" />
        </div>
      </div>

      <span
        ref={cursorRef}
        className={`hero-laptop-cursor${cursorOn ? ' is-on' : ''}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 12 18" focusable="false">
          <path
            d="M1 1.2 1 15.2 4.3 11.8 6.4 16.6 8.5 15.7 6.5 11 11 11Z"
            fill="#fff"
            stroke="#111"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <button
        type="button"
        className="hero-laptop-latch"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close the laptop lid' : 'Open the laptop lid'}
      >
        {open ? 'close lid' : 'open lid'}
      </button>

      <p className="sr-only" role="status" aria-live="polite">
        Laptop {open ? 'open' : 'closed'}. Window {view === 'term' ? 'terminal' : `${frameIndex + 1} of ${frames.length}: ${frame.title}`}.
      </p>
    </>
  );
}
