export default function Portrait({ className = '' }) {
  return (
    <div className={`portrait ${className}`.trim()}>
      <img
        src="/images/avatar.webp"
        alt="Alshan Rijal"
        width="720"
        height="900"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
