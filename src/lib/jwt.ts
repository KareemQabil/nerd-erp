/**
 * Safely decodes a JWT token payload without verification.
 * Only use for frontend-readable cookies - never for http-only tokens.
 *
 * @param token - The JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJwt<T = any>(token: string): T | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format: expected 3 parts");
      return null;
    }

    const payload = parts[1];

    // Base64 decode (handle URL-safe base64)
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

    // Parse JSON
    return JSON.parse(decoded) as T;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}
