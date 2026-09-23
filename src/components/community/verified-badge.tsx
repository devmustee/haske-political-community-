import { BadgeCheck, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function VerifiedBadge({ status, className }: { status?: string | null; className?: string }) {
  if (!status || status === "NONE") return null;

  const isOrg = status === "ORGANIZATION";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("inline-flex text-primary", className)}>
          {isOrg ? <Building2 className="size-4 fill-primary/15" /> : <BadgeCheck className="size-4 fill-primary/15" />}
        </span>
      </TooltipTrigger>
      <TooltipContent>{isOrg ? "Verified organization account" : "Official account"}</TooltipContent>
    </Tooltip>
  );
}
