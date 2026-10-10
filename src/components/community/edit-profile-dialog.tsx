"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { updateProfile } from "@/lib/actions/profile";
import { uploadFile } from "@/lib/actions/upload";
import { initials } from "@/lib/utils";
import { runAction } from "@/lib/run-action";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    name: string;
    username: string;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
    coverImageUrl: string | null;
  };
}

export function EditProfileDialog({ open, onOpenChange, user }: Props) {
  const router = useRouter();
  const avatarInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(user.coverImageUrl ?? "");
  const [uploading, setUploading] = useState<"avatar" | "cover" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleFile(kind: "avatar" | "cover", file: File | undefined) {
    if (!file) return;
    setUploading(kind);
    const formData = new FormData();
    formData.append("file", file);
    const result = await runAction(() => uploadFile(formData, kind === "avatar" ? "avatars" : "covers"));
    setUploading(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    if (kind === "avatar") setAvatarUrl(result.data.url);
    else setCoverImageUrl(result.data.url);
  }

  async function handleSave() {
    setSubmitting(true);
    const result = await runAction(() => updateProfile({ name, bio, location, avatarUrl, coverImageUrl }));
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Profile updated");
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          <div className="relative h-36 w-full bg-gradient-to-br from-primary to-primary/70">
            {coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="" className="h-full w-full object-cover" />
            )}
            <button
              onClick={() => coverInput.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100"
            >
              {uploading === "cover" ? <Loader2 className="size-6 animate-spin" /> : <Camera className="size-6" />}
            </button>
            <input ref={coverInput} type="file" accept="image/*" hidden onChange={(e) => handleFile("cover", e.target.files?.[0])} />

            <div className="absolute -bottom-8 left-5">
              <div className="relative">
                <Avatar className="size-20 border-4 border-background">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-xl">{initials(name)}</AvatarFallback>
                </Avatar>
                <button
                  onClick={() => avatarInput.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity hover:opacity-100"
                >
                  {uploading === "avatar" ? <Loader2 className="size-5 animate-spin" /> : <Camera className="size-5" />}
                </button>
                <input ref={avatarInput} type="file" accept="image/*" hidden onChange={(e) => handleFile("avatar", e.target.files?.[0])} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5 pt-12">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea id="edit-bio" value={bio} onChange={(e) => setBio(e.target.value.slice(0, 280))} maxLength={280} />
              <p className="text-right text-xs text-muted-foreground">{280 - bio.length}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Yola, Adamawa" maxLength={80} />
            </div>
          </div>
        </div>

        <DialogFooter className="p-5 pt-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={submitting || !name.trim()}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
