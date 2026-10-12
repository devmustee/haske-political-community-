"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/**
 * Shows `value`, counting up to it when it scrolls into view.
 *
 * The real number is rendered on the server, so slow phones (before the
 * JavaScript arrives), link previews, search engines and screen readers all
 * see it, never "0". The count-up only runs for counters still below the
 * screen once JavaScript starts; one already in view is left alone rather
 * than reset to 0. Nothing animates under prefers-reduced-motion.
 * Uses tabular figures (`font-tnum`) to eliminate layout jitter.
 */
export function AnimatedCounter({
  value,
  duration = 1400,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already seen at its final value

    // Off screen, so resetting to 0 is invisible; count up when it arrives.
    const reset = requestAnimationFrame(() => setDisplay(0));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(value * easeOutExpo(progress));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      cancelAnimationFrame(reset);
      observer.disconnect();
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={cn("font-tnum inline-block tabular-nums", className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
