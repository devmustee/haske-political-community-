"use client";

import { Pencil } from "lucide-react";
import type { MediaCenterItem } from "@prisma/client";
import { MediaFormDialog } from "@/components/admin/media-form-dialog";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { deleteMediaItem } from "@/lib/actions/admin-cms";
import { Button } from "@/components/ui/button";

export function MediaRowActions({ item }: { item: MediaCenterItem }) {
  return (
    <div className="flex items-center gap-1">
      <MediaFormDialog
        initial={{ ...item, date: item.date.toISOString() }}
        trigger={<Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>}
      />
      <DeleteConfirmButton onDelete={() => deleteMediaItem(item.id)} label="media item" />
    </div>
  );
}
