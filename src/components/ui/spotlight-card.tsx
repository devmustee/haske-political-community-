"use client";

import React, { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  /** Kept for existing callers; merged into className (children sit directly in the card). */
  contentClassName?: string;
  spotlightColor?: "gold" | "primary" | "emerald" | "white";
  radius?: number;
}

const COLORS = {
  gold: "oklch(0.78 0.145 88 / 0.16)",
  primary: "oklch(0.28 0.085 152 / 0.18)",
  emerald: "oklch(0.68 0.14 152 / 0.2)",
  white: "oklch(1 0 0 / 0.12)",
};

/**
 * A card with a soft glow that follows the cursor.
 *
 * Children are direct children of the card, so layout classes in `className`
 * (grid, flex, gap…) apply to them as written. The glow is part of the card's
 * own background, so it sits beneath the content, and it moves through CSS
 * variables rather than React state, so pointer movement doesn't re-render.
 */
export function SpotlightCard({
  children,
  className,
  contentClassName,
  spotlightColor = "gold",
  radius = 320,
  style,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glow = COLORS[spotlightColor] ?? COLORS.gold;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      card.style.setProperty("--spot-color", glow);
    },
    [glow]
  );

  const handleMouseLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--spot-color", "transparent");
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "spotlight-card group relative overflow-hidden rounded-2xl border border-card-border bg-card transition-all duration-300 ease-out",
        "shadow-ambient hover:shadow-hover hover:-translate-y-0.5",
        // Specular highlight along the top edge.
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:opacity-80",
        className,
        contentClassName
      )}
      style={{
        backgroundImage: `radial-gradient(${radius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--spot-color), transparent 80%)`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
