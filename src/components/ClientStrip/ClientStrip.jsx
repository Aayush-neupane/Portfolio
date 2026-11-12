import { withBase } from '../../utils/paths.js';

// Commercial projects shown as the home-page client strip. `logo` comes from
// projects.json; the client's live URL is used when there is one.
const CLIENT_IDS = new Set(['1', '3', '11', '12', '13']);

export default function ClientStrip({ projects = [], onOpen }) {
  const clients = projects.filter((p) => CLIENT_IDS.has(String(p.id)));
  if (clients.length === 0) return null;

  return (
    <section aria-label="Selected clients" className="border-y border-border bg-bg">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-5 px-6 py-7 md:gap-x-12">
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
              title={client.title}
              {...(external
                ? {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    'aria-label': `${client.title} (opens in a new tab)`,
                  }
                : {
                    'aria-label': client.title,
                    onClick: (e) => {
                      e.preventDefault();
                      onOpen?.(client.id);
                    },
                  })}
              className="inline-flex items-center text-muted opacity-80 transition-opacity duration-200 hover:opacity-100"
            >
              {client.logo && (
                <img
                  src={withBase(client.logo)}
                  alt=""
                  aria-hidden="true"
                  className="h-9 w-auto max-w-[6.5rem] object-contain md:h-10 md:max-w-[7.5rem]"
                />
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
