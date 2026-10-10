"use server";

import { requireUserResult } from "@/lib/session";
import { getStorageService, validateUpload } from "@/lib/services/storage";
import { rateLimit } from "@/lib/rate-limit";

export type UploadedFile = { url: string; contentType: string };

const ALLOWED_FOLDERS = new Set(["posts", "avatars", "covers"]);

export async function uploadFile(formData: FormData, folder: string): Promise<{ ok: true; data: UploadedFile } | { ok: false; error: string }> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;

  if (!ALLOWED_FOLDERS.has(folder)) return { ok: false, error: "Invalid upload destination." };

  const limited = rateLimit(`upload:${user.id}`, 30, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "Too many uploads. Slow down a little." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file provided." };

  const validation = validateUpload(file.type, file.size);
  if (!validation.ok) return { ok: false, error: validation.error };

  const buffer = Buffer.from(await file.arrayBuffer());
  const storage = getStorageService();

  try {
    const result = await storage.upload(buffer, {
      filename: file.name,
      contentType: file.type,
      folder: `${folder}/${user.id}`,
    });
    return { ok: true, data: { url: result.url, contentType: file.type } };
  } catch (err) {
    console.error("Upload failed:", err);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
