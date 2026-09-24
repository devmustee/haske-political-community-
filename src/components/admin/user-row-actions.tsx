"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminRoleName } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { moderateUser } from "@/lib/actions/admin-moderation";
import { grantAdminRole, revokeAdminRole } from "@/lib/actions/admin-roles";
import { ADMIN_ROLE_LABELS } from "@/lib/permissions";
import type { ActionResult } from "@/lib/actions/auth";

const ALL_ROLES = Object.values(AdminRoleName);

export function UserRowActions({
  userId,
  status,
  verification,
  currentRoles,
  canManageRoles,
}: {
  userId: string;
  status: string;
  verification: string;
  currentRoles: AdminRoleName[];
  canManageRoles: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const roleSet = new Set(currentRoles);

  function run(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Updated");
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={pending}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status !== "SUSPENDED" ? (
          <DropdownMenuItem onClick={() => run(() => moderateUser(userId, "SUSPEND_USER", { suspendDays: 7 }))}>
            Suspend (7 days)
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => run(() => moderateUser(userId, "UNSUSPEND_USER"))}>Unsuspend</DropdownMenuItem>
        )}
        {status !== "BANNED" ? (
          <DropdownMenuItem variant="destructive" onClick={() => run(() => moderateUser(userId, "BAN_USER"))}>
            Ban user
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => run(() => moderateUser(userId, "UNBAN_USER"))}>Unban</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {verification === "NONE" ? (
          <>
            <DropdownMenuItem onClick={() => run(() => moderateUser(userId, "VERIFY_USER", { verification: "OFFICIAL" }))}>
              Verify as Official
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => run(() => moderateUser(userId, "VERIFY_USER", { verification: "ORGANIZATION" }))}>
              Verify as Organization
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => run(() => moderateUser(userId, "UNVERIFY_USER"))}>Remove verification</DropdownMenuItem>
        )}
        {canManageRoles && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Admin roles</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {ALL_ROLES.map((role) => (
                  <DropdownMenuCheckboxItem
                    key={role}
                    checked={roleSet.has(role)}
                    onCheckedChange={(checked) =>
                      run(() => (checked ? grantAdminRole(userId, role) : revokeAdminRole(userId, role)))
                    }
                  >
                    {ADMIN_ROLE_LABELS[role]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
