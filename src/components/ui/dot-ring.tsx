type DotRingProps = {
  count: number;
  size?: number;
  className?: string;
  dotClassName?: string;
};

/**
 * A ring of `count` small dots — a literal, accurate way to give a stat
 * number (e.g. "21 LGAs") visual weight without fabricating a map.
 */
export function DotRing({ count, size = 64, className, dotClassName }: DotRingProps) {
  const radius = size / 2 - 3;
  const center = size / 2;
  const dots = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className={className}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={1.6} className={dotClassName ?? "fill-primary/40"} />
      ))}
    </svg>
  );
}
