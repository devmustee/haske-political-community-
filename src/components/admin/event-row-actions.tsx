"use client";

import { Pencil } from "lucide-react";
import type { Event } from "@prisma/client";
import { EventFormDialog } from "@/components/admin/event-form-dialog";
import { DeleteConfirmButton } from "@/components/admin/delete-confirm-button";
import { deleteEvent } from "@/lib/actions/admin-cms";
import { Button } from "@/components/ui/button";

export function EventRowActions({ event }: { event: Event }) {
  return (
    <div className="flex items-center gap-1">
      <EventFormDialog
        initial={{ ...event, date: event.date.toISOString() }}
        trigger={<Button variant="ghost" size="icon"><Pencil className="size-4" /></Button>}
      />
      <DeleteConfirmButton onDelete={() => deleteEvent(event.id)} label="event" />
    </div>
  );
}
