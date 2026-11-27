const LOGO_PATHS = {
  left: 'M471 0 L383 0 L380 3 L109 505 L110 510 L120 508 L331 418 L465 164 L471 156 Z',
  right: 'M471 0 L471 156 L568 351 L571 354 L748 445 L747 447 L602 445 L601 471 L722 713 L727 717 L905 716 L907 714 L907 710 L808 516 L552 3 L548 0 Z',
  swoosh: 'M554 353 L550 351 L102 530 L92 545 L0 709 L0 713 L3 716 L213 716 L220 708 L286 603 L599 470 L601 471 L602 445 L600 444 Z',
}

export function BrandMark({ pieceClass = '', ids = false }) {
  return (
    <svg viewBox="0 0 908 718" aria-hidden="true">
      <path className={pieceClass} id={ids ? 'pL' : undefined} d={LOGO_PATHS.left} />
      <path className={pieceClass} id={ids ? 'pR' : undefined} d={LOGO_PATHS.right} />
      <path className={pieceClass} id={ids ? 'pB' : undefined} d={LOGO_PATHS.swoosh} />
    </svg>
  )
}

export default function BrandLogo() {
  return (
    <>
      <BrandMark />
      <span className="word">Alshan Rijal</span>
    </>
  )
}
