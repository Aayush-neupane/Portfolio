import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
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
const GalleryPage = lazy(() => import('./components/Gallery/GalleryPage.jsx'));
const ProjectsPage = lazy(() => import('./components/Projects/ProjectsPage.jsx'));
const ProjectDetail = lazy(() => import('./components/Projects/ProjectDetail.jsx'));
const LinksPage = lazy(() => import('./components/Links/LinksPage.jsx'));
import Playground from './components/Playground/Playground.jsx';

function RouteFallback() {
  return (
    <main className="min-h-svh bg-bg" aria-label="Loading page">
      <RouteSkeleton />
      <SlowBadge active label="loading page" />
    </main>
  );
}
import Contact from './components/Contact/Contact.jsx';
import Services from './components/Services/Services.jsx';
import Footer from './components/Footer/Footer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat/WhatsAppFloat.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import NotFoundPage from './components/NotFound/NotFoundPage.jsx';
import OfflineGate from './components/Loader/OfflineGate.jsx';
import { OrbitCluster, TrackLine } from './components/Loader/Orbit.jsx';
import RouteSkeleton from './components/Loader/RouteSkeleton.jsx';
import SlowBadge, { ImageSlowBadge } from './components/Loader/SlowBadge.jsx';
import RouteVeil, { routeLabel } from './components/Loader/RouteVeil.jsx';
import { scrollToTarget } from './utils/scroll.js';
import { withBase } from './utils/paths.js';
import { projectCount, startYear, yearsSince } from './utils/stats.js';

gsap.registerPlugin(ScrollTrigger);

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'services', 'resume', 'gallery', 'contact'];
const GALLERY_ROUTE = '#/gallery';
const PROJECTS_ROUTE = '#/projects';
const LINKS_ROUTE = '#/links';
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

/** Optional photo id on gallery routes: `#/gallery` or `#/gallery/<id>`. */
function galleryPhotoIdFromRoute(route) {
  if (route === GALLERY_ROUTE) return null;
  if (route.startsWith(`${GALLERY_ROUTE}/`)) {
    const id = decodeURIComponent(route.slice(GALLERY_ROUTE.length + 1));
    return id || null;
  }
  return null;
}

const LOADER_WORDS = ['brewing milk tea', 'aligning pixels', 'chasing good light', 'warming up the server'];

function LoadingScreen({ leaving }) {
  const [pct, setPct] = useState(0);
  const [word, setWord] = useState(0);

  // Progress eases toward 90% while booting, then snaps to 100 as the
  // loader dissolves — the bar never sits full while work remains, and
  // never lags behind the exit.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPct(100);
      return;
    }
    if (leaving) {
      setPct(100);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 950;
    const tick = (t) => {
      const e = Math.min(1, (t - t0) / dur);
      setPct(Math.round(90 * (1 - Math.pow(1 - e, 2))));
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const words = setInterval(() => setWord((w) => w + 1), 350);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(words);
    };
  }, [leaving]);

  // One orbit loader for both themes — the mark, rings and grid all resolve
  // through theme vars (the logo inverts to ink on paper in light mode).
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-bg ${
        leaving ? 'loader-exit' : ''
      }`}
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="route-loader-in relative grid w-full max-w-sm justify-items-center px-6 text-center">
        <OrbitCluster />
        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.2em] text-accent-deep">
          aayush / working
        </p>
        <p className="mt-3 min-h-[2.6em] font-display text-3xl tracking-[-0.03em] text-text sm:text-4xl">
          {LOADER_WORDS[word % LOADER_WORDS.length]}…
        </p>
        <div className="mt-6 w-full">
          <TrackLine />
        </div>
        <p className="mt-4 font-mono text-[9px] uppercase tabular-nums tracking-[0.2em] text-muted">
          {pct}%
        </p>
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
  const [contactDraft, setContactDraft] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [route, setRoute] = useState(routeFromHash);

  const isGallery = route === GALLERY_ROUTE || route.startsWith(`${GALLERY_ROUTE}/`);
  const galleryPhotoId = isGallery ? galleryPhotoIdFromRoute(route) : null;
  const isProjects = route === PROJECTS_ROUTE;
  const isLinks = route === LINKS_ROUTE;
  const detailId = detailIdFromRoute(route);
  const isDetail = detailId !== null;
  /** A `#/…` route that matches no page (bare `#/` still counts as home). */
  const isUnknown =
    route.startsWith('#/') &&
    route !== '#/' &&
    !isGallery &&
    !isProjects &&
    !isLinks &&
    !isDetail;
  // Headline numbers, derived once from data so Hero/About/Resume agree.
  const stats = useMemo(() => {
    const since = startYear(resume?.experience);
    return {
      since: since ?? 2022,
      years: yearsSince(resume?.experience) ?? 4,
      projects: projectCount(projects, archive) || 20,
    };
  }, [resume, projects, archive]);
  const allProjects = [...projects, ...archive];
  // Stable identity: GalleryPage resets page/lightbox whenever this changes,
  // so it must only change when the data actually does.
  const galleryPhotos = useMemo(() => [...featured, ...gallery], [featured, gallery]);
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
        : isLinks
          ? 'Links — Aayush Neupane'
          : isDetail
            ? `${detailProject?.title || 'Project'} — Aayush Neupane`
            : isUnknown
              ? 'Lost — Aayush Neupane'
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
    } else if (isLinks) {
      syncHead({
        description: 'Quick links to the work, photography and contact of Aayush Neupane.',
        url: `${origin}${basePath}`,
      });
      setHeadText('property', 'og:title', headTitle);
      setHeadText('name', 'twitter:title', headTitle);
      syncProjectJsonLd(null);
    } else if (isUnknown) {
      syncHead({
        description: 'That page doesn’t exist — but the work does.',
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
    if (!dataReady) return undefined;
    // Home-route scrolling is owned by section nav / back-to-card flows.
    // Sub-routes always open at the very top — and stay there: re-assert
    // briefly to beat any late layout settling or async scroll restoration.
    if (!(isGallery || isProjects || isLinks || isDetail || isUnknown)) return undefined;
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
  }, [isGallery, isProjects, isLinks, isDetail, isUnknown, detailId, dataReady]);

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

  // Prefill the contact form, then take the visitor to it.
  const inquireAbout = useCallback(
    (project) => {
      if (project?.title) {
        setContactDraft({
          subject: `Project inquiry: ${project.title}`,
          message: `Hi Aayush,\n\nI came across your "${project.title}" project and I'd like to discuss something similar.\n\nA bit about what I need:\n- \n\nThanks!`,
          nonce: Date.now(),
        });
      } else {
        setContactDraft({
          subject: 'New project inquiry',
          message: `Hi Aayush,\n\nI have an idea I'd like to build:\n\n- \n\nMy timeline:\nMy budget range:\n\nThanks!`,
          nonce: Date.now(),
        });
      }
      handleNav('#contact');
    },
    [handleNav]
  );

  // Prefill the contact form from a service tier, then take the visitor to it.
  const inquireService = useCallback(
    (tier) => {
      if (tier?.draft) {
        setContactDraft({
          subject: tier.draft.subject,
          message: tier.draft.message,
          nonce: Date.now(),
        });
      }
      handleNav('#contact');
    },
    [handleNav]
  );

  // Services CTAs: plain link goes to contact, 'faq' jumps to the answers.
  const contactFromServices = useCallback(
    (target) => {
      handleNav(target === 'faq' ? '#contact-faq' : '#contact');
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
      // Mount the page behind the loader the moment data lands, so the
      // exit dissolves over settled layout instead of hard-cutting to it.
      setDataReady(true);
      let seen = false;
      try {
        seen = sessionStorage.getItem('an-seen') === '1';
      } catch {
        seen = false;
      }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // One full orbit beat on first visit, a short one on return — then the
      // page is already mounted behind the loader, which dissolves over it.
      const minWait = reduced ? 0 : seen ? 400 : 950;
      const exitMs = reduced ? 0 : 650;
      const wait = Math.max(0, minWait - (Date.now() - started));
      setTimeout(() => {
        if (cancelled) return;
        try {
          sessionStorage.setItem('an-seen', '1');
        } catch {
          /* private mode */
        }
        setReady(true);
        if (reduced) {
          setEntered(true);
          return;
        }
        setTimeout(() => !cancelled && setEntered(true), exitMs);
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
    if (!dataReady || isGallery || isProjects || isLinks || isDetail || isUnknown) return;
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
  }, [dataReady, isGallery, isProjects, isLinks, isDetail, isUnknown, route]);

  useEffect(() => {
    if (dataReady) ScrollTrigger.refresh();
  }, [dataReady]);

  if (!dataReady) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <LoadingScreen leaving={false} />
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
      <RouteVeil routeKey={route} label={isDetail ? detailProject?.title || 'project' : routeLabel(route)} />
      <Navbar
        links={config?.navigation}
        activeSection={isGallery || isProjects || isLinks || isDetail || isUnknown ? '' : activeSection}
        onNavClick={handleNav}
        isGallery={isGallery}
        route={route}
      />
      <ErrorBoundary key={route || 'home'}>
      <Suspense fallback={<RouteFallback />}>
      {isGallery ? (
        <main>
          <GalleryPage photos={galleryPhotos} deepPhotoId={galleryPhotoId} onBack={() => handleNav('#home')} />
        </main>
      ) : isProjects ? (
        <main>
          <ProjectsPage
            projects={[...archive].reverse()}
            onBack={() => handleNav('#home')}
            onOpen={openProject}
          />
        </main>
      ) : isLinks ? (
        <main>
          <LinksPage onNav={handleNav} />
        </main>
      ) : isUnknown ? (
        <main>
          <NotFoundPage onHome={() => handleNav('#home')} onGallery={() => handleNav(GALLERY_ROUTE)} />
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
            onInquire={inquireAbout}
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
          <Hero profile={profile} now={nowStatus} onProject={openProject} stats={stats} />
          <About profile={profile} whatsapp={whatsapp} sinceYear={stats.since} />
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
            onInquire={inquireAbout}
          />
          <Playground />
          <Services onContact={contactFromServices} onInquire={inquireService} />
          <Resume data={resume} />
          <Gallery photos={featured.length > 0 ? featured : gallery.slice(0, 6)} onViewAll={() => handleNav(GALLERY_ROUTE)} />
          <Contact profile={profile} social={social} whatsapp={whatsapp} draft={contactDraft} onSentClear={() => setContactDraft(null)} />
        </main>
      )}
      </Suspense>
      </ErrorBoundary>
      <Footer />
      <WhatsAppFloat whatsapp={whatsapp} />
      <OfflineGate />
      <ImageSlowBadge />
      {!entered && <LoadingScreen leaving={ready} />}
    </div>
  );
}
