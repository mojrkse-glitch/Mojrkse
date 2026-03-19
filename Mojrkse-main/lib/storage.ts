import type { SupabaseClient } from "@supabase/supabase-js";

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
export const ALLOWED_UPLOAD_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ._-]+/gi, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export function validateUploadedFile(file?: File | null, required = false) {
  if (!file) {
    if (required) throw new Error("الملف المطلوب غير مرفق.");
    return;
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("حجم الملف يتجاوز الحد المسموح وهو 5 ميغابايت.");
  }
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
    throw new Error("نوع الملف غير مدعوم. الأنواع المسموحة: JPG, PNG, WEBP, PDF.");
  }
}

export async function uploadPrivateFile({ admin, bucket, file, ownerId, prefix }: { admin: SupabaseClient; bucket: string; file: File; ownerId: string; prefix: string; }) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `${ownerId}/${prefix}-${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await admin.storage.from(bucket).upload(path, buffer, {
    contentType: file.type,
    upsert: false
  });
  if (error) throw new Error(error.message || "فشل رفع الملف.");
  return { path, fileName: file.name, mimeType: file.type, fileSize: file.size };
}

export async function resolvePrivateFileUrl(admin: SupabaseClient | null, bucket: string, storedValue?: string | null) {
  if (!storedValue) return null;
  if (/^https?:\/\//i.test(storedValue)) return storedValue;
  if (!admin) return null;
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(storedValue, 60 * 60);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
