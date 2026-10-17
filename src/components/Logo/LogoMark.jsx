import { withBase } from '../../utils/paths.js';

const SRC = '/assets/images/profile/logo.svg';

/** Brand mark that melts into the active accent on hover. The overlay is
 *  the logo silhouette as a mask filled with the accent — exact color, no
 *  filter hacks. Must sit inside a `group` parent. `imgClassName` keeps
 *  working (e.g. `brand-mark` for the light-theme treatment). */
export default function LogoMark({ className = '', imgClassName = '', eager = false }) {
  const src = withBase(SRC);
  const mask = {
    background: 'var(--color-accent)',
    WebkitMaskImage: `url("${src}")`,
    maskImage: `url("${src}")`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  };
  return (
    <span aria-hidden="true" className={`relative block shrink-0 ${className}`}>
      <img
        src={src}
        alt=""
        decoding="async"
        draggable={false}
        loading={eager ? 'eager' : 'lazy'}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 group-hover:opacity-0 ${imgClassName}`}
      />
      <span
        className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={mask}
      />
    </span>
  );
}
