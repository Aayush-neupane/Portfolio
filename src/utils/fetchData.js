import useSWR from 'swr';

export function useFetchData(url, setter) {
  const { data, error, mutate } = useSWR(url, fetcher, {
    dedupingInterval: 60000,
    refreshInterval: 0
  });

  if (error) {
    console.error(`Error fetching ${url}:`, error);
  }

  return { data, error, mutate };
}

async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}
