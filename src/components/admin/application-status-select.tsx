"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApplicationStatus } from "@prisma/client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateApplicationStatus } from "@/lib/actions/admin-cms";

const STATUSES = Object.values(ApplicationStatus);

export function ApplicationStatusSelect({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      onValueChange={(v) =>
        startTransition(async () => {
          const result = await updateApplicationStatus(applicationId, v as ApplicationStatus);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          router.refresh();
        })
      }
    >
      <SelectTrigger className="h-8 w-40 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {s.replaceAll("_", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
