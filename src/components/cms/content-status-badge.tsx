import { ContentStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, FileText, Sparkles, Users, Newspaper, PenLine, Archive } from "lucide-react";

const CONFIG: Record<
  ContentStatus,
  { label: string; className: string; icon: React.ElementType; helpText: string }
> = {
  OFFICIAL: {
    label: "Official",
    className: "border-primary/15 bg-primary/10 text-primary",
    icon: CheckCircle2,
    helpText: "Published by the official Haske Community account or campaign team.",
  },
  DOCUMENTED: {
    label: "Documented Record",
    className: "border-emerald-500/15 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: FileText,
    helpText: "Something Haske has already done or that is publicly documented.",
  },
  PROPOSED: {
    label: "Proposed Agenda",
    className: "border-accent/25 bg-accent/15 text-amber-800 dark:text-accent",
    icon: Sparkles,
    helpText: "A proposal for what Haske intends to do if elected — not yet delivered.",
  },
  COMMUNITY: {
    label: "Community Content",
    className: "border-border bg-secondary text-secondary-foreground",
    icon: Users,
    helpText: "Posted by a member of the public community, not the campaign.",
  },
  THIRD_PARTY: {
    label: "Third-Party Source",
    className: "border-border text-foreground",
    icon: Newspaper,
    helpText: "Reported or described by an external, third-party source.",
  },
  DRAFT: {
    label: "Draft",
    className: "border-dashed border-border text-muted-foreground",
    icon: PenLine,
    helpText: "Not yet published — visible to admins only.",
  },
  ARCHIVED: {
    label: "Archived",
    className: "border-border text-muted-foreground",
    icon: Archive,
    helpText: "Superseded or no longer current, kept for the public record.",
  },
};

export function ContentStatusBadge({
  status,
  className,
  showIcon = true,
}: {
  status: ContentStatus;
  className?: string;
  showIcon?: boolean;
}) {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge title={cfg.helpText} className={cn(cfg.className, className)}>
      {showIcon && <Icon className="size-3" />}
      {cfg.label}
    </Badge>
  );
}

export { CONFIG as CONTENT_STATUS_CONFIG };
