import { useEffect, useRef, useState } from 'react';
import { Check, Download, Facebook, Link2, Share2 } from 'lucide-react';

/**
 * Share menu used by project pages and the gallery lightbox.
 * - System share attaches the image file when the platform allows it —
 *   that attachment is what surfaces Instagram / Facebook in the sheet
 *   (stories open with the photo ready).
 * - Facebook posts via the sharer with the pretty link, which unfurls with
 *   the item's own card (title + image).
 * - Copy link + download image cover manual story/post uploads.
 * `layout`: "link" (detail pages) or "icon" (gallery lightbox).
 */
export default function ShareMenu({ title, text, url, imageSrc, layout = 'link' }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState(null);
  const [dlUrl, setDlUrl] = useState(null);
  const rootRef = useRef(null);
  const prepared = useRef(false);
  const supported = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const absImage = (() => {
    try {
      return imageSrc ? new URL(imageSrc, window.location.origin).href : '';
    } catch {
      return '';
    }
  })();

  // Fetch the image once (on first open) for file-share + download.
  const prepare = async () => {
    if (prepared.current || !absImage) return;
    prepared.current = true;
    try {
      const res = await fetch(absImage);
      if (!res.ok) return;
      const blob = await res.blob();
      const ext = (blob.type.split('/')[1] || 'jpg').split('+')[0];
      const f = new File([blob], `aayush-${Date.now()}.${ext}`, { type: blob.type });
      setDlUrl(URL.createObjectURL(blob));
      if (typeof navigator.canShare === 'function') {
        try {
          if (navigator.canShare({ files: [f] })) setFile(f);
        } catch {
          /* files unsupported — text share still works */
        }
      }
    } catch {
      /* offline or blocked — text-only sharing still works */
    }
  };

  useEffect(() => () => {
    if (dlUrl) {
      try {
        URL.revokeObjectURL(dlUrl);
      } catch {
        /* already gone */
      }
    }
  }, [dlUrl]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open ]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) prepare();
  };

  const systemShare = async () => {
    if (!supported) {
      fallbackCopy();
      return;
    }
    try {
      await navigator.share({
        title,
        text,
        url,
        ...(file ? { files: [file] } : {}),
      });
      setOpen(false);
    } catch {
      /* dismissed — stay quiet */
    }
  };

  const fallbackCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const openFacebook = () => {
    window.open(fbHref, '_blank', 'noopener,width=640,height=560');
    setOpen(false);
  };

  const itemCls =
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-text transition-colors hover:bg-subtle';

  return (
    <span ref={rootRef} className="relative inline-block">
      {layout === 'icon' ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          aria-label="Share photo"
          aria-expanded={open}
          aria-haspopup="menu"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-accent hover:text-accent"
        >
          <Share2 className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-haspopup="menu"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share
        </button>
      )}
      {open && (
        <span
          role="menu"
          aria-label="Share options"
          className="absolute right-0 top-full z-[70] mt-2 w-60 rounded-xl border border-border bg-elevated p-1.5 text-text shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {supported && (
            <button type="button" role="menuitem" onClick={systemShare} className={itemCls}>
              <Share2 className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                Share…
                <span className="block text-xs font-normal text-muted">
                  {file ? 'Story, post or app with photo' : 'Story, post or app'}
                </span>
              </span>
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={openFacebook}
            className={itemCls}
          >
            <Facebook className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              Facebook post
              <span className="block text-xs font-normal text-muted">Unfurls with its card</span>
            </span>
          </button>
          <button type="button" role="menuitem" onClick={fallbackCopy} className={itemCls}>
            {copied ? (
              <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            ) : (
              <Link2 className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            )}
            <span>
              {copied ? 'Copied!' : 'Copy link'}
              <span className="block text-xs font-normal text-muted">Paste anywhere</span>
            </span>
          </button>
          {absImage && (
            <a
              role="menuitem"
              href={dlUrl || absImage}
              download
              onClick={() => setOpen(false)}
              className={itemCls}
            >
              <Download className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                Save image
                <span className="block text-xs font-normal text-muted">Upload to story manually</span>
              </span>
            </a>
          )}
        </span>
      )}
    </span>
  );
}
