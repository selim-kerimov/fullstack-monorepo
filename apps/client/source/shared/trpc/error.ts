export function getErrorMessage(error: { message: string }): string {
  try {
    const parsed = JSON.parse(error.message);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((e: { message?: string }) => e.message).join(". ");
    }
  } catch {
    // not JSON, use as-is
  }
  return error.message;
}
