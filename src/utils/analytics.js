/**
 * Privacy-friendly analytics: page-view + project-open counters kept in
 * localStorage on the visitor's own device. Nothing is sent anywhere.
 */
const KEY = 'an-stats-v1';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && typeof raw === 'object') {
      return { routes: raw.routes || {}, projects: raw.projects || {} };
    }
  } catch {
    /* private mode — stay ephemeral */
  }
  return { routes: {}, projects: {} };
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode — stay ephemeral */
  }
}

export function recordRoute(route) {
  const state = load();
  const key = route || '#home';
  state.routes[key] = (state.routes[key] || 0) + 1;
  save(state);
}

export function recordProject(id, title) {
  if (id == null) return;
  const state = load();
  const key = String(id);
  const entry = state.projects[key] || { title: title || key, views: 0 };
  entry.views += 1;
  if (title) entry.title = title;
  state.projects[key] = entry;
  save(state);
}

export function readStats() {
  return load();
}

export function resetStats() {
  save({ routes: {}, projects: {} });
}
