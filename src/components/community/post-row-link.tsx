"use client";

import { useRouter } from "next/navigation";

/** Makes the whole post row clickable to open the post, without nesting
 * interactive controls inside an <a> — children that should not trigger
 * navigation call stopPropagation() in their own handlers. */
export function PostRowLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(href);
      }}
      className={className}
    >
      {children}
    </div>
  );
}
