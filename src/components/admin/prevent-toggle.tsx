"use client";

/**
 * Wraps a control placed inside a <summary> so clicking it doesn't also
 * expand/collapse the surrounding <details>.
 */
export function PreventToggle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} onClick={(e) => e.preventDefault()}>
      {children}
    </div>
  );
}
