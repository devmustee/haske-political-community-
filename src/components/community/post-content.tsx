import { StopPropagationLink } from "@/components/community/stop-propagation-link";

/** Renders post text with #hashtags linked to explore search. */
export function PostContent({ content, className }: { content: string; className?: string }) {
  const parts = content.split(/(#[a-zA-Z][a-zA-Z0-9_]{1,49})/g);
  return (
    <p className={className}>
      {parts.map((part, i) =>
        part.startsWith("#") ? (
          <StopPropagationLink
            key={i}
            href={`/community/explore?q=${encodeURIComponent(part)}`}
            className="text-primary hover:underline"
          >
            {part}
          </StopPropagationLink>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}
