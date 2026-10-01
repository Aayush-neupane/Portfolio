/**
 * Single source for the headline numbers shown across Hero, About and Resume.
 * Everything derives from the same data JSONs, so the counts can never drift
 * apart when resume.json or projects.json gains entries.
 */

function startYears(experience) {
  return (experience || [])
    .map((e) => {
      const m = String(e?.startDate || '').match(/(\d{4})/);
      return m ? parseInt(m[1], 10) : NaN;
    })
    .filter((y) => Number.isFinite(y));
}

/** Earliest experience start year, e.g. 2022. Null when unknown. */
export function startYear(experience) {
  const years = startYears(experience);
  return years.length ? Math.min(...years) : null;
}

/** Full years since the earliest experience start. Null when unknown. */
export function yearsSince(experience, now = new Date()) {
  const start = startYear(experience);
  if (start === null) return null;
  return Math.max(0, now.getFullYear() - start);
}

/** Total shipped projects across featured + archive lists. */
export function projectCount(featured, archive) {
  return (featured || []).length + (archive || []).length;
}
