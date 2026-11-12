export const MAX_LECTURE_SIZE = 4 * 1024 * 1024; // 4MB: Vercel serverless functions reject request bodies above 4.5MB

export const ALLOWED_LECTURE_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function lectureMimeFromName(name: string): string | null {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return ALLOWED_LECTURE_TYPES[ext] || null;
}

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
