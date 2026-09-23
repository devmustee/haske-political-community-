"use client";

/** Wraps children in a div that stops clicks from bubbling to an ancestor
 * row navigator (see PostRowLink). Needed because Server Components can't
 * attach inline event handlers to JSX. */
export function StopClick({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  );
}
