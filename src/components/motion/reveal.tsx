"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  /** HTML tag to render as. Defaults to "div". */
  as?: keyof HTMLElementTagNameMap;
  /** Stagger delay in ms, applied as a transition-delay. */
  delay?: number;
  variant?: "up" | "scale";
  className?: string;
};

/**
 * Fades/slides an element in once it scrolls into view, using the `.reveal`
 * CSS in globals.css. No-ops (renders already-visible) under
 * prefers-reduced-motion, or if IntersectionObserver isn't available.
 */
export function Reveal({ children, as = "div", delay = 0, variant = "up", className }: RevealProps) {
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
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as "div";
  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("reveal", variant === "scale" && "reveal-scale", visible && "visible", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
