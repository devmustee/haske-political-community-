"use client";

import { Pencil } from "lucide-react";
import type { Program } from "@prisma/client";
import { ProgramFormDialog } from "@/components/admin/program-form-dialog";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { deleteProgram } from "@/lib/actions/admin-cms";
import { Button } from "@/components/ui/button";

export function ProgramRowActions({ program }: { program: Program }) {
  return (
    <div className="flex items-center gap-1">
      <ProgramFormDialog
        initial={{ ...program, applicationDeadline: program.applicationDeadline?.toISOString() ?? "" }}
        trigger={<Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>}
      />
      <DeleteConfirmButton onDelete={() => deleteProgram(program.id)} label="program" />
    </div>
  );
}
