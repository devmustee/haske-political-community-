import { StopPropagationLink } from "@/components/community/stop-propagation-link";
import { ExternalLink } from "lucide-react";

// One pass over the text: URLs first (so a "#" or "@" inside a URL isn't
// split out), then @mentions not preceded by a word char (skips emails),
// then #hashtags.
const TOKEN_RE = /(https?:\/\/[^\s<]+[^\s<.,:;!?)\]'"])|((?<![\w@])@[a-zA-Z0-9_]{3,24}\b)|(#[a-zA-Z][a-zA-Z0-9_]{1,49})/g;

function displayUrl(raw: string) {
  try {
    const url = new URL(raw);
    const rest = url.pathname === "/" ? "" : url.pathname;
    const text = url.hostname.replace(/^www\./, "") + rest;
    return text.length > 40 ? `${text.slice(0, 39)}…` : text;
  } catch {
    return raw;
  }
}

/** Renders post text with #hashtags, @mentions and URLs linked. */
export function PostContent({ content, className }: { content: string; className?: string }) {
  const nodes: React.ReactNode[] = [];
  let last = 0;

  for (const match of content.matchAll(TOKEN_RE)) {
    const [token, url, mention, hashtag] = match;
    const start = match.index;
    if (start > last) nodes.push(content.slice(last, start));

    if (url) {
      nodes.push(
        <StopPropagationLink
          key={start}
          href={url}
          target="_blank"
          rel="noopener noreferrer nofollow ugc"
          prefetch={false}
          title={url}
          className="inline-flex items-center gap-0.5 break-all text-primary hover:underline"
        >
          {displayUrl(url)}
          <ExternalLink className="inline size-3 shrink-0" />
        </StopPropagationLink>
      );
    } else if (mention) {
      nodes.push(
        <StopPropagationLink
          key={start}
          href={`/community/user/${mention.slice(1).toLowerCase()}`}
          className="font-medium text-primary hover:underline"
        >
          {mention}
        </StopPropagationLink>
      );
    } else if (hashtag) {
      nodes.push(
        <StopPropagationLink
          key={start}
          href={`/community/explore?q=${encodeURIComponent(hashtag)}`}
          className="text-primary hover:underline"
        >
          {hashtag}
        </StopPropagationLink>
      );
    }
    last = start + token.length;
  }
  if (last < content.length) nodes.push(content.slice(last));

  return <p className={className}>{nodes}</p>;
}
