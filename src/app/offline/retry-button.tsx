"use client";

import { Button } from "@/components/ui/button";

export function RetryButton() {
  return (
    <Button variant="gold-shimmer" size="lg" className="mt-8 min-w-40" onClick={() => window.location.reload()}>
      Try again
    </Button>
  );
}
