/**
 * Name of the frontend-readable cookie containing user JWT data.
 * Change this constant if your backend uses a different cookie name.
 */
export const FRONTEND_USER_COOKIE = "user_data";

/**
 * Retrieves a cookie value by name.
 *
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const [cookieName, ...cookieValue] = cookie.split("=");
    const trimmedName = cookieName.trim();

    if (trimmedName === name) {
      return decodeURIComponent(cookieValue.join("="));
    }
  }

  return null;
}

/**
 * Parses a JWT cookie and returns the decoded payload.
 * This is ONLY for frontend-readable cookies, not http-only tokens.
 *
 * @param name - Cookie name containing JWT
 * @returns Decoded JWT payload or null
 */
export function parseCookieJwt<T = any>(name: string): T | null {
  const cookieValue = getCookie(name);

  if (!cookieValue) {
    return null;
  }

  // Import decodeJwt inline to avoid circular dependencies
  try {
    const parts = cookieValue.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as T;
  } catch (error) {
    console.error(`Failed to parse JWT from cookie "${name}":`, error);
    return null;
  }
}
