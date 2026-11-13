import data from './poems.json';

export const POEMS = data.poems;

export function findPoem(slug) {
  return POEMS.find((poem) => poem.slug === slug) || null;
}
