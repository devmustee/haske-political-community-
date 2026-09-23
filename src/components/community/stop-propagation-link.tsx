"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** A next/link that stops click events from bubbling to an ancestor row
 * navigator (see PostRowLink). Needed because Server Components can't pass
 * inline event handlers to Client Component props. */
export function StopPropagationLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} onClick={(e) => e.stopPropagation()} />;
}
