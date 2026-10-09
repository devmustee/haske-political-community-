/**
 * Client-side image downscaling before upload. Phone photos are often 3–8MB;
 * re-encoding them at a sane max dimension cuts that to a few hundred KB,
 * which matters on slow mobile networks and keeps uploads under the Server
 * Action body limit. GIFs are passed through untouched (animation).
 */
export interface PreparedImage {
  file: File;
  width?: number;
  height?: number;
}

const SKIP_BELOW_BYTES = 400 * 1024;

export async function compressImage(file: File, { maxDimension = 2048, quality = 0.82 } = {}): Promise<PreparedImage> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return { file };

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return { file };
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  if (scale === 1 && file.size < SKIP_BELOW_BYTES) {
    bitmap.close();
    return { file, width, height };
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Browsers without WebP encoding silently fall back to PNG, so check the
  // result type and retry as JPEG.
  let blob = await toBlob(canvas, "image/webp", quality);
  if (!blob || blob.type !== "image/webp") blob = await toBlob(canvas, "image/jpeg", quality);
  if (!blob || (scale === 1 && blob.size >= file.size)) return { file, width, height };

  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const name = `${file.name.replace(/\.[^.]+$/, "") || "image"}.${ext}`;
  return { file: new File([blob], name, { type: blob.type }), width, height };
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}
