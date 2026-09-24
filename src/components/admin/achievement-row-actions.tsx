"use client";

import { Pencil } from "lucide-react";
import type { Achievement } from "@prisma/client";
import { AchievementFormDialog } from "@/components/admin/achievement-form-dialog";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { deleteAchievement } from "@/lib/actions/admin-cms";
import { Button } from "@/components/ui/button";

export function AchievementRowActions({ achievement }: { achievement: Achievement }) {
  return (
    <div className="flex items-center gap-1">
      <AchievementFormDialog
        initial={achievement}
        trigger={
          <Button variant="ghost" size="icon">
            <Pencil className="size-4" />
          </Button>
        }
      />
      <DeleteConfirmButton onDelete={() => deleteAchievement(achievement.id)} label="achievement" />
    </div>
  );
}
