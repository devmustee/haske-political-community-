"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBox({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/community/explore?q=${encodeURIComponent(value)}`);
      }}
      className="relative"
    >
      <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search Haske Community"
        className="rounded-full bg-secondary/60 pl-10"
      />
    </form>
  );
}
