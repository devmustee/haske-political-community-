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
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Already revealed by the inline script (see reveal-script.tsx).
    if (node.classList.contains("visible")) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

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
      // No percentage threshold: an element taller than the screen might
      // never reach it and would stay hidden.
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
      // The inline reveal script may add "visible" before hydration.
      suppressHydrationWarning
      style={style}
    >
      {children}
    </Tag>
  );
}
