"use client";

import { Pencil } from "lucide-react";
import type { Program } from "@prisma/client";
import { ProgramFormDialog } from "@/components/admin/program-form-dialog";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { deleteProgram } from "@/lib/actions/admin-cms";
import { Button } from "@/components/ui/button";

export function ProgramRowActions({ program, payoutConfigured }: { program: Program; payoutConfigured: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <ProgramFormDialog
        initial={{ ...program, applicationDeadline: program.applicationDeadline?.toISOString() ?? "" }}
        trigger={<Button variant="ghost" size="icon" aria-label={`Edit ${program.name}`}><Pencil className="size-4" /></Button>}
        payoutConfigured={payoutConfigured}
      />
      <DeleteConfirmButton onDelete={() => deleteProgram(program.id)} label="program" />
    </div>
  );
}
