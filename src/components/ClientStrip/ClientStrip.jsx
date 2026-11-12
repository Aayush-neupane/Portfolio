import { ArrowUpRight } from 'lucide-react';
import { withBase } from '../../utils/paths.js';

// Commercial projects shown as the home-page client strip. `logo` comes from
// projects.json; the client's live URL is used when there is one.
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
        {clients.map((client) => {
          const external = /^https?:\/\//.test(client.liveUrl || '');
          const href = external ? client.liveUrl : `#/project/${client.id}`;
          return (
            <a
              key={client.id}
              href={href}
              {...(external
                ? {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    'aria-label': `${client.title} (opens in a new tab)`,
                  }
                : {
                    onClick: (e) => {
                      e.preventDefault();
                      onOpen?.(client.id);
                    },
                  })}
              className="group inline-flex items-center gap-2.5 text-muted transition-colors duration-200 hover:text-text"
            >
              {client.logo && (
                <img
                  src={withBase(client.logo)}
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8 shrink-0 object-contain md:h-9 md:w-9"
                />
              )}
              <span className="font-display text-xl leading-none">{client.title}</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
