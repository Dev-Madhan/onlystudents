import { env } from "@/lib/env";

/**
 * Build a direct public URL for a T3 Storage object.
 * The bucket is publicly readable; we just need to encode the key correctly.
 */
export function constructUrl(key: string): string {
    if (!key) return "";
    if (key.startsWith("http")) return key;
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${encodeURIComponent(key)}`;
}
