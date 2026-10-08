"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  spotlightColor?: "gold" | "primary" | "emerald" | "white";
  radius?: number;
}

export function SpotlightCard({
  children,
  className,
  contentClassName,
  spotlightColor = "gold",
  radius = 320,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  const colorMap = {
    gold: "oklch(0.78 0.145 88 / 0.16)",
    primary: "oklch(0.28 0.085 152 / 0.18)",
    emerald: "oklch(0.68 0.14 152 / 0.2)",
    white: "oklch(1 0 0 / 0.12)",
  };

  const glowColor = colorMap[spotlightColor] ?? colorMap.gold;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-card-border bg-card transition-all duration-300 ease-out",
        "shadow-ambient hover:shadow-hover hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {/* Specular Inner Edge Highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80"
      />

      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 ease-out"
        style={{
          opacity,
          background: position
            ? `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 80%)`
            : "transparent",
        }}
      />

      {/* Content */}
      <div className={cn("relative z-10 h-full", contentClassName)}>{children}</div>
    </div>
  );
}
