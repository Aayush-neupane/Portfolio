import { ArrowUpRight } from 'lucide-react';

// Commercial projects shown as the home-page client strip. Add a `logo` path
// to any of these entries in projects.json to swap the wordmark for an image.
const CLIENT_IDS = new Set(['1', '3', '12', '13']);

export default function ClientStrip({ projects = [], onOpen }) {
  const clients = projects.filter((p) => CLIENT_IDS.has(String(p.id)));
  if (clients.length === 0) return null;

  return (
    <section aria-label="Selected clients" className="border-y border-border bg-bg">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 py-7 md:gap-x-12">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
          Selected clients
        </p>
        {clients.map((client) => (
          <a
            key={client.id}
            href={`#/project/${client.id}`}
            onClick={(e) => {
              e.preventDefault();
              onOpen?.(client.id);
            }}
            className="group inline-flex items-center gap-1.5 text-muted transition-colors duration-200 hover:text-text"
          >
            {client.logo ? (
              <img
                src={client.logo}
                alt={client.title}
                className="h-6 w-auto max-w-[9rem] object-contain opacity-70 transition-opacity duration-200 group-hover:opacity-100"
              />
            ) : (
              <span className="font-display text-xl leading-none">{client.title}</span>
            )}
            <ArrowUpRight
              className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
