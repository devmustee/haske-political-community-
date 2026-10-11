"use server";

import { requireUserResult } from "@/lib/session";
import { getStorageService, validateUpload } from "@/lib/services/storage";
import { rateLimit } from "@/lib/rate-limit";
import { sniffFileType, typeFamily } from "@/lib/file-type";

export type UploadedFile = { url: string; contentType: string };

// What each destination accepts: profile pictures and covers are images only.
const FOLDER_FAMILIES: Record<string, string[]> = {
  posts: ["image", "video"],
  avatars: ["image"],
  covers: ["image"],
};

export async function uploadFile(formData: FormData, folder: string): Promise<{ ok: true; data: UploadedFile } | { ok: false; error: string }> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;

  const allowedFamilies = FOLDER_FAMILIES[folder];
  if (!allowedFamilies) return { ok: false, error: "Invalid upload destination." };

  const limited = await rateLimit(`upload:${user.id}`, 30, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "Too many uploads. Slow down a little." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file provided." };

  const buffer = Buffer.from(await file.arrayBuffer());
  // Trust the file's bytes, not its name or the type the browser reports:
  // otherwise an HTML page renamed to .png could be stored and served from
  // this site as a page.
  const sniffed = sniffFileType(buffer);
  if (!sniffed || !allowedFamilies.includes(typeFamily(sniffed.contentType))) {
    return { ok: false, error: allowedFamilies.includes("video") ? "Please upload a JPG, PNG, WebP or GIF image, or an MP4, MOV or WebM video." : "Please upload a JPG, PNG, WebP or GIF image." };
  }

  const validation = validateUpload(sniffed.contentType, buffer.length);
  if (!validation.ok) return { ok: false, error: validation.error };

  const storage = getStorageService();

  try {
    const result = await storage.upload(buffer, {
      ext: sniffed.ext,
      contentType: sniffed.contentType,
      folder: `${folder}/${user.id}`,
    });
    return { ok: true, data: { url: result.url, contentType: sniffed.contentType } };
  } catch (err) {
    console.error("Upload failed:", err);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
