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
import ProjectDetail from './components/Projects/ProjectDetail.jsx';
import StatsPage from './components/Stats/StatsPage.jsx';
import Playground from './components/Playground/Playground.jsx';
import Contact from './components/Contact/Contact.jsx';
import Services from './components/Services/Services.jsx';
import Footer from './components/Footer/Footer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat/WhatsAppFloat.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import { scrollToTarget } from './utils/scroll.js';
import { recordProject, recordRoute } from './utils/analytics.js';
import { withBase } from './utils/paths.js';

gsap.registerPlugin(ScrollTrigger);

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'services', 'resume', 'gallery', 'contact'];
const GALLERY_ROUTE = '#/gallery';
const PROJECTS_ROUTE = '#/projects';
const STATS_ROUTE = '#/stats';
const PROJECT_DETAIL_PREFIX = '#/project/';

function routeFromHash() {
  return typeof window !== 'undefined' && window.location.hash.startsWith('#/')
    ? window.location.hash
    : '';
}

function detailIdFromRoute(route) {
  return route.startsWith(PROJECT_DETAIL_PREFIX)
    ? decodeURIComponent(route.slice(PROJECT_DETAIL_PREFIX.length))
    : null;
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
    const dur = 1200;
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
      <div className="flex flex-col items-center gap-1">
        <div className="flex w-full justify-center">
          <img
            src={withBase('/assets/images/profile/logotrp.png')}
            alt=""
            width={144}
            height={144}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="loader-logo block h-32 w-32 object-contain md:h-36 md:w-36"
          />
        </div>
        <svg viewBox="0 0 320 60" className="block h-14 w-72 overflow-visible" role="presentation">
          <text x="50%" y="40" dx="0.2em" textAnchor="middle" className="loader-word">
            AAYUSH
          </text>
        </svg>
      </div>
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

/** Rewrite root-absolute asset paths from data JSONs for the deploy base. */
function withImages(items, key) {
  return (items || []).map((item) => ({ ...item, [key]: withBase(item[key]) }));
}

/** Find-or-create a head tag, then set/remove the given attributes. */
function upsertHead(tag, keyAttr, keyValue, attrs) {
  let el = document.head.querySelector(`${tag}[${keyAttr}="${keyValue}"]`);
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(keyAttr, keyValue);
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) el.removeAttribute(k);
    else el.setAttribute(k, v);
  }
}

/**
 * Keep document head in sync with the route (title, description, canonical,
 * OG/Twitter tags). URLs are made absolute from the live origin, so they
 * stay correct on every host (Pages, Netlify, custom domain).
 */
function syncHead({ description, url, image, type }) {
  if (description != null) {
    upsertHead('meta', 'name', 'description', { content: description });
  }
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
  upsertHead('meta', 'property', 'og:url', { content: url });
  upsertHead('meta', 'property', 'og:type', { content: type || 'website' });
  if (image != null) {
    upsertHead('meta', 'property', 'og:image', { content: image });
    upsertHead('meta', 'name', 'twitter:image', { content: image });
  }
}

/** Per-project CreativeWork structured data (or removed off detail pages). */
function syncProjectJsonLd(project, url, image) {
  const key = 'project-jsonld';
  const el = document.head.querySelector(`script[data-jsonld="${key}"]`);
  if (!project) {
    el?.remove();
    return;
  }
  const node =
    el ||
    (() => {
      const s = document.createElement('script');
      s.setAttribute('type', 'application/ld+json');
      s.setAttribute('data-jsonld', key);
      document.head.appendChild(s);
      return s;
    })();
  node.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url,
    image,
    author: {
      '@type': 'Person',
      name: 'Aayush Neupane',
      url: 'https://aayush38.com.np/',
    },
    keywords: (project.techStack || []).join(', '),
  });
}

function setHeadText(kind, key, value) {
  // kind: 'property' (og:) or 'name' (twitter:) — mirrors title into tags.
  if (value == null) return;
  upsertHead('meta', kind, key, { content: value });
}

function scrollTopImmediate() {  const lenis = window.__lenis;
  if (lenis) {
    try {
      // force:true bypasses stopped/locked guards; immediate cancels in-flight tweens.
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.reset();
    } catch {
      /* older lenis — fall through to native */
    }
  }
  // Native belt-and-suspenders: covers no-lenis, reduced-motion, and any
  // async scroll-restoration the smooth scroller might apply afterwards.
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function App() {
  const [config, setConfig] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [archive, setArchive] = useState([]);
  const [social, setSocial] = useState(null);
  const [whatsapp, setWhatsapp] = useState(null);
  const [resume, setResume] = useState(null);
  const [nowStatus, setNowStatus] = useState(null);
  const [zoom, setZoom] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [route, setRoute] = useState(routeFromHash);

  const isGallery = route === GALLERY_ROUTE;
  const isProjects = route === PROJECTS_ROUTE;
  const isStats = route === STATS_ROUTE;
  const detailId = detailIdFromRoute(route);
  const isDetail = detailId !== null;
  const allProjects = [...projects, ...archive];
  const detailIndex = isDetail
    ? allProjects.findIndex((p) => String(p.id) === detailId)
    : -1;
  const detailProject = detailIndex >= 0 ? allProjects[detailIndex] : null;

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useLayoutEffect(() => {
    const headTitle = isGallery
      ? 'Gallery — Aayush Neupane'
      : isProjects
        ? 'Projects — Aayush Neupane'
        : isStats
          ? 'Stats — Aayush Neupane'
          : isDetail
            ? `${detailProject?.title || 'Project'} — Aayush Neupane`
            : 'Aayush Neupane';
    document.title = headTitle;
    const origin = window.location.origin;
    const basePath = window.location.pathname.replace(/\/$/, '');
    const abs = (p) => (/^https?:\/\//.test(p) ? p : `${origin}${p}`);
    if (isDetail) {
      const desc = detailProject?.description || 'A project by Aayush Neupane.';
      const pageUrl = `${origin}${basePath}/project/${detailId}`;
      const pageImg = abs(detailProject?.image || '/assets/images/profile/logo.jpg');
      syncHead({
        description: desc,
        url: pageUrl,
        image: pageImg,
        type: 'article',
      });
      setHeadText('property', 'og:title', headTitle);
      setHeadText('property', 'og:description', desc);
      setHeadText('name', 'twitter:title', headTitle);
      setHeadText('name', 'twitter:description', desc);
      syncProjectJsonLd(detailProject, pageUrl, pageImg);
    } else if (isGallery) {
      syncHead({
        description: 'Photo gallery of Aayush Neupane — streets, skies, gardens, heritage and night frames.',
        url: `${origin}${basePath}`,
      });
      setHeadText('property', 'og:title', headTitle);
      setHeadText('name', 'twitter:title', headTitle);
      syncProjectJsonLd(null);
    } else if (isProjects) {
      syncHead({
        description: 'Every experiment by Aayush Neupane — games, tools and weekend builds.',
        url: `${origin}${basePath}`,
      });
      setHeadText('property', 'og:title', headTitle);
      setHeadText('name', 'twitter:title', headTitle);
      syncProjectJsonLd(null);
    } else {
      syncHead({
        description: 'Aayush Neupane builds websites and games from Jhapa, Nepal. React, TypeScript, Supabase, Unity. Open for freelance web projects.',
        url: `${origin}${basePath}`,
        image: abs('/assets/images/profile/logo.jpg'),
        type: 'website',
      });
      syncProjectJsonLd(null);
    }
    if (!ready) return undefined;
    recordRoute(route);
    // Home-route scrolling is owned by section nav / back-to-card flows.
    // Sub-routes always open at the very top — and stay there: re-assert
    // briefly to beat any late layout settling or async scroll restoration.
    if (!(isGallery || isProjects || isStats || isDetail)) return undefined;
    scrollTopImmediate();
    ScrollTrigger.refresh();
    let n = 0;
    const id = setInterval(() => {
      if (window.scrollY <= 0 || n++ >= 2) {
        clearInterval(id);
        return;
      }
      scrollTopImmediate();
    }, 100);
    return () => clearInterval(id);
  }, [isGallery, isProjects, isStats, isDetail, detailId, ready]);

  // Late image/font settling after a full document load can shift scroll on
  // sub-routes; pin it back to top once everything has arrived.
  useEffect(() => {
    if (document.readyState === 'complete') return undefined;
    const onLoad = () => {
      if (window.location.hash.startsWith('#/')) scrollTopImmediate();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

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

  const openProject = useCallback(
    (p, el) => {
      recordProject(p?.id, p?.title);
      // Capture the card thumbnail geometry for the shared-element zoom.
      let from = null;
      try {
        const img = el && el.querySelector ? el.querySelector('img') : null;
        const node = img || el;
        if (node && node.getBoundingClientRect) {
          const r = node.getBoundingClientRect();
          if (r.width > 2 && r.height > 2) {
            from = {
              id: String(p?.id),
              src: (img && (img.currentSrc || img.src)) || null,
              rect: { left: r.left, top: r.top, width: r.width, height: r.height },
            };
          }
        }
      } catch {
        /* zoom is decorative — fall back to a plain mount */
      }
      setZoom(from);
      handleNav(`${PROJECT_DETAIL_PREFIX}${p?.id}`);
    },
    [handleNav]
  );

  // Back from a detail page: land on the card/row that was just viewed.
  // Retries while the fresh page mounts (slow devices), then falls back.
  const backFromDetail = useCallback(
    (id) => {
      const inArchive = archive.some((p) => String(p.id) === String(id));
      const land = (tries = 0) => {
        const sel = inArchive ? `#project-row-${id}` : `#project-card-${id}`;
        const el = document.getElementById(sel.slice(1));
        if (!el) {
          if (tries < 4) {
            setTimeout(() => land(tries + 1), 150);
          } else if (inArchive) {
            scrollTopImmediate();
          } else {
            scrollToTarget('#projects');
          }
          return;
        }
        scrollToTarget(sel);
      };
      killTriggers();
      if (inArchive) {
        setRoute(PROJECTS_ROUTE);
        if (window.location.hash !== PROJECTS_ROUTE) window.location.hash = PROJECTS_ROUTE;
        setTimeout(() => {
          ScrollTrigger.refresh();
          land();
        }, 250);
        return;
      }
      setRoute('');
      if (window.location.hash) window.location.hash = '';
      setTimeout(() => {
        ScrollTrigger.refresh();
        land();
      }, 250);
    },
    [archive, killTriggers]
  );

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();
    Promise.all([
      fetchJson(withBase('/data/config.json'), { navigation: [] }),
      fetchJson(withBase('/data/profile.json'), { profile: {}, hero: {} }),
      fetchJson(withBase('/data/projects.json'), { projects: [] }),
      fetchJson(withBase('/data/social.json'), {}),
      fetchJson(withBase('/data/resume.json'), null),
      fetchJson(withBase('/data/now.json'), null),
      fetchJson(withBase('/data/gallery.json'), { photos: [] }),
      fetchJson(withBase('/data/whatsapp.json'), {}),
    ]).then(([cfg, prof, proj, soc, res, nowSt, gal, wa]) => {
      if (cancelled) return;
      setConfig(cfg);
      setProfile({
        ...(prof.profile || prof.hero || {}),
        tagline: prof.hero?.tagline || prof.profile?.tagline,
      });
      setProjects(withImages(proj.featured || proj.projects || [], 'image'));
      setArchive(withImages(proj.archive || [], 'image'));
      setSocial(soc);
      setWhatsapp(wa);
      setResume(res);
      setNowStatus(nowSt);
      setGallery(withImages(gal.photos || [], 'src'));
      setFeatured(withImages(gal.featured || [], 'src'));
      let seen = false;
      try {
        seen = sessionStorage.getItem('an-seen') === '1';
      } catch {
        seen = false;
      }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const baseWait = reduced ? 0 : seen ? 500 : 1400;
      const liftMs = reduced ? 0 : 750;
      const wait = Math.max(0, baseWait - (Date.now() - started));
      setTimeout(() => {
        if (cancelled) return;
        try {
          sessionStorage.setItem('an-seen', '1');
        } catch {
          /* private mode */
        }
        if (reduced) {
          setReady(true);
          return;
        }
        setLeaving(true);
        setTimeout(() => !cancelled && setReady(true), liftMs);
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
    if (!ready || isGallery || isProjects || isStats || isDetail) return;
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
  }, [ready, isGallery, isProjects, isStats, isDetail, route]);

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
        activeSection={isGallery || isProjects || isStats || isDetail ? '' : activeSection}
        onNavClick={handleNav}
        isGallery={isGallery}
        route={route}
      />
      <ErrorBoundary key={route || 'home'}>
      {isGallery ? (
        <main>
          <GalleryPage photos={[...featured, ...gallery]} onBack={() => handleNav('#home')} />
        </main>
      ) : isProjects ? (
        <main>
          <ProjectsPage
            projects={archive}
            onBack={() => handleNav('#home')}
            onOpen={openProject}
          />
        </main>
      ) : isStats ? (
        <main>
          <StatsPage onBack={() => handleNav('#home')} />
        </main>
      ) : isDetail ? (
        <main>
          <ProjectDetail
            project={detailProject}
            prev={
              detailProject && allProjects.length > 1
                ? allProjects[(detailIndex - 1 + allProjects.length) % allProjects.length]
                : null
            }
            next={
              detailProject && allProjects.length > 1
                ? allProjects[(detailIndex + 1) % allProjects.length]
                : null
            }
            index={detailIndex}
            total={allProjects.length}
            all={allProjects}
            enterFrom={zoom}
            onEntered={() => setZoom(null)}
            onBack={() => backFromDetail(detailId)}
            backLabel={
              archive.some((p) => String(p.id) === detailId)
                ? 'Back to all projects'
                : 'Back to selected work'
            }
            onOpen={openProject}
          />
        </main>
      ) : (
        <main>
          <Hero profile={profile} now={nowStatus} onProject={openProject} />
          <About profile={profile} whatsapp={whatsapp} />
          <Skills />
          <TextReveal3D
            eyebrow="Philosophy"
            text="Details most people scroll past are the whole product."
            emphasis={['scroll', 'past']}
            support="It is why I obsess over spacing, timing, and the states nobody screenshots. Every project on this page was held to it."
          />
          <Projects
            projects={projects}
            onViewAll={() => handleNav(PROJECTS_ROUTE)}
            onOpen={openProject}
          />
          <Playground />
          <Services onContact={() => handleNav('#contact')} />
          <Resume data={resume} />
          <Gallery photos={featured.length > 0 ? featured : gallery.slice(0, 6)} onViewAll={() => handleNav(GALLERY_ROUTE)} />
          <Contact profile={profile} social={social} whatsapp={whatsapp} />
        </main>
      )}
      </ErrorBoundary>
      <Footer />
      <WhatsAppFloat whatsapp={whatsapp} />
    </div>
  );
}
