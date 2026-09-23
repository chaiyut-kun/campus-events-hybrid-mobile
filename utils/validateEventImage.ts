const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic'];

/**
 * Validates an event photo before draft save/upload.
 * Checks for:
 * - Empty/null image
 * - Maximum file size limit (5MB)
 * - Supported file extension
 */
export function validateEventImage(
  uri: string | null,
  fileSize?: number,
): { valid: boolean; error?: string } {
  if (!uri) {
    return { valid: false, error: 'กรุณาเลือกหรือถ่ายภาพประกอบกิจกรรม' };
  }

  if (fileSize !== undefined && fileSize > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'ขนาดไฟล์ภาพต้องไม่เกิน 5 MB' };
  }

  // Check file extension if available in URI
  const cleanUri = uri.split('?')[0];
  const extensionMatch = cleanUri.match(/\.([a-zA-Z0-9]+)$/);
  if (extensionMatch) {
    const ext = extensionMatch[1].toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        error: `รูปแบบไฟล์ .${ext} ไม่รองรับ (รองรับเฉพาะ JPG, PNG, WEBP, HEIC)`,
      };
    }
  }

  return { valid: true };
}
