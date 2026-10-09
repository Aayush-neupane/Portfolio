/** Generic page skeleton for slow route-chunk loads: shimmer blocks in the
 *  center of the screen while the mini orbit badge holds the bottom-right
 *  corner (see SlowBadge). Theme-aware through the portfolio tokens. */
export default function RouteSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto grid w-full max-w-6xl content-start gap-4 px-6 pb-24 pt-28 md:pt-36"
    >
      <div className="skeleton h-3.5 w-36" />
      <div className="skeleton h-10 w-2/3 max-w-md" />
      <div className="skeleton mt-2 h-4 w-1/2 max-w-sm" />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="skeleton h-52 md:h-60" />
        <div className="skeleton hidden h-52 md:block md:h-60" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="skeleton h-28" />
        <div className="skeleton hidden h-28 md:block" />
        <div className="skeleton hidden h-28 md:block" />
      </div>
    </div>
  );
}
