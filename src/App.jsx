import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar/Navbar.jsx';
import ScrollProgress from './components/ScrollProgress/ScrollProgress.jsx';
import Hero from './components/Hero/Hero.jsx';
import About from './components/About/About.jsx';
import Skills from './components/Skills/Skills.jsx';
import TextReveal3D from './components/TextReveal3D/TextReveal3D.jsx';
import Projects from './components/Projects/Projects.jsx';
import Resume from './components/Resume/Resume.jsx';
import Gallery from './components/Gallery/Gallery.jsx';
import GalleryPage from './components/Gallery/GalleryPage.jsx';
import ProjectsPage from './components/Projects/ProjectsPage.jsx';
import Contact from './components/Contact/Contact.jsx';
import Footer from './components/Footer/Footer.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import { scrollToTarget } from './utils/scroll.js';

gsap.registerPlugin(ScrollTrigger);

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'resume', 'gallery', 'contact'];
const GALLERY_ROUTE = '#/gallery';
const PROJECTS_ROUTE = '#/projects';

function routeFromHash() {
  return typeof window !== 'undefined' && window.location.hash.startsWith('#/')
    ? window.location.hash
    : '';
}

const LOADER_WORDS = ['brewing milk tea', 'aligning pixels', 'chasing good light', 'warming up the server'];

function LoadingScreen({ leaving }) {
  const [pct, setPct] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPct(100);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 1700;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const words = setInterval(() => setWord((w) => w + 1), 450);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(words);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-bg ${
        leaving ? 'loader-lift' : ''
      }`}
    >
      <svg viewBox="0 0 320 60" className="h-14 w-72" role="presentation">
        <text x="50%" y="40" textAnchor="middle" className="loader-word">
          AAYUSH
        </text>
      </svg>
      <div className="flex w-64 items-center gap-3 font-mono text-[0.7rem] lowercase tracking-[0.08em] text-muted">
        <span className="inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent" />
        <span className="truncate">{LOADER_WORDS[word % LOADER_WORDS.length]}…</span>
        <span className="ml-auto shrink-0 uppercase tabular-nums tracking-[0.2em] text-text">
          {pct}%
        </span>
      </div>
    </div>
  );
}

async function fetchJson(path, fallback) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return fallback;
  }
}

function scrollTopImmediate() {
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

export default function App() {
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [archive, setArchive] = useState([]);
  const [social, setSocial] = useState(null);
  const [resume, setResume] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [route, setRoute] = useState(routeFromHash);

  const isGallery = route === GALLERY_ROUTE;
  const isProjects = route === PROJECTS_ROUTE;

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useLayoutEffect(() => {
    document.title = isGallery
      ? 'Gallery — Aayush Neupane'
      : isProjects
        ? 'Projects — Aayush Neupane'
        : 'Aayush Neupane';
    if (!ready) return;
    scrollTopImmediate();
    ScrollTrigger.refresh();
  }, [isGallery, isProjects, ready]);

  const settleRoute = useCallback(() => {
    requestAnimationFrame(() => {
      scrollTopImmediate();
      ScrollTrigger.refresh();
    });
  }, []);

  const killTriggers = useCallback(() => {
    try {
      ScrollTrigger.getAll().forEach((t) => {
        try {
          t.kill();
        } catch {
          /* already gone */
        }
      });
    } catch {
      /* scroll system unavailable */
    }
  }, []);

  const handleNav = useCallback(
    (href) => {
      if (href.startsWith('#/')) {
        killTriggers();
        scrollTopImmediate();
        setRoute(href);
        if (window.location.hash !== href) window.location.hash = href;
        settleRoute();
        return;
      }
      if (route !== '') {
        killTriggers();
        setRoute('');
        if (window.location.hash) window.location.hash = '';
        setTimeout(() => {
          ScrollTrigger.refresh();
          scrollToTarget(href);
        }, 160);
        return;
      }
      scrollToTarget(href);
    },
    [route, settleRoute, killTriggers]
  );

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();
    Promise.all([
      fetchJson('/data/config.json', { navigation: [] }),
      fetchJson('/data/profile.json', { profile: {}, hero: {} }),
      fetchJson('/data/projects.json', { projects: [] }),
      fetchJson('/data/social.json', {}),
      fetchJson('/data/resume.json', null),
      fetchJson('/data/gallery.json', { photos: [] }),
    ]).then(([cfg, prof, proj, soc, res, gal]) => {
      if (cancelled) return;
      setConfig(cfg);
      setProfile(prof.profile || prof.hero || {});
      setProjects(proj.featured || proj.projects || []);
      setArchive(proj.archive || []);
      setSocial(soc);
      setResume(res);
      setGallery(gal.photos || []);
      setFeatured(gal.featured || []);
      const wait = Math.max(0, 1900 - (Date.now() - started));
      setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        setTimeout(() => !cancelled && setReady(true), 750);
      }, wait);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    window.__lenis = lenis;
    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || isGallery || isProjects) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ready, isGallery, isProjects]);

  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <LoadingScreen leaving={leaving} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg font-sans text-text">
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          handleNav('#home');
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="grad-ig" gradientUnits="userSpaceOnUse" x1="2" y1="22" x2="22" y2="2">
            <stop offset="0" stopColor="#f09433" />
            <stop offset="0.35" stopColor="#dc2743" />
            <stop offset="0.65" stopColor="#bc1888" />
            <stop offset="1" stopColor="#6e1fd9" />
          </linearGradient>
          <linearGradient id="grad-fb" gradientUnits="userSpaceOnUse" x1="2" y1="22" x2="22" y2="2">
            <stop offset="0" stopColor="#1877f2" />
            <stop offset="0.55" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      <ScrollProgress />
      <Navbar
        links={config?.navigation}
        activeSection={isGallery || isProjects ? '' : activeSection}
        onNavClick={handleNav}
        isGallery={isGallery}
      />
      <ErrorBoundary key={route || 'home'}>
      {isGallery ? (
        <main>
          <GalleryPage photos={[...featured, ...gallery]} onBack={() => handleNav('#home')} />
        </main>
      ) : isProjects ? (
        <main>
          <ProjectsPage projects={archive} onBack={() => handleNav('#home')} />
        </main>
      ) : (
        <main>
          <Hero profile={profile} projectCount={projects.length} />
          <About profile={profile} />
          <Skills />
          <TextReveal3D
            eyebrow="Philosophy"
            text="Details most people scroll past are the whole product."
            emphasis={['scroll', 'past']}
            support="It is why I obsess over spacing, timing, and the states nobody screenshots. Every project on this page was held to it."
          />
          <Projects projects={projects} onViewAll={() => handleNav(PROJECTS_ROUTE)} />
          <Resume data={resume} />
          <Gallery photos={featured.length > 0 ? featured : gallery.slice(0, 6)} onViewAll={() => handleNav(GALLERY_ROUTE)} />
          <Contact profile={profile} social={social} />
        </main>
      )}
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
