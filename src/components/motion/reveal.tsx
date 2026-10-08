"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "up" | "scale" | "blur" | "left" | "right";

type RevealProps = {
  children: ReactNode;
  /** HTML tag to render as. Defaults to "div". */
  as?: keyof HTMLElementTagNameMap;
  /** Custom delay in ms, applied as a transition-delay. */
  delay?: number;
  /** Optional index multiplier for automatic staggered cascades (delay = index * 70ms). */
  staggerIndex?: number;
  variant?: RevealVariant;
  className?: string;
  threshold?: number;
};

/**
 * High-performance fluid scroll-reveal primitive with spring easing.
 * Respects `prefers-reduced-motion` and no-ops gracefully without lag.
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  staggerIndex,
  variant = "up",
  className,
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const Tag = as as "div";
  const calculatedDelay = staggerIndex !== undefined ? Math.min(staggerIndex * 70, 700) : delay;
  const style: CSSProperties | undefined = calculatedDelay ? { transitionDelay: `${calculatedDelay}ms` } : undefined;

  const variantClass =
    variant === "scale"
      ? "reveal-scale"
      : variant === "blur"
        ? "reveal-blur"
        : variant === "left"
          ? "reveal-left"
          : variant === "right"
            ? "reveal-right"
            : undefined;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("reveal", variantClass, visible && "visible", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
