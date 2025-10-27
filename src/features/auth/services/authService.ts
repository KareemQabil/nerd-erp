import apiClient from "../api/axiosInstance";
import type { User, ApiResponse } from "../types/auth";
import { FRONTEND_USER_COOKIE, parseCookieJwt } from "@/lib/cookie";

/**
 * Authentication service handling all auth-related API calls.
 * Uses http-only cookies for secure token storage.
 *
 * Security notes:
 * - access_token, refresh_token, refresh_jti are http-only (JS cannot access)
 * - user_data cookie contains non-sensitive user info as JWT (JS can read)
 * - All requests use withCredentials to send cookies automatically
 */
class AuthService {
  /**
   * Authenticates user with username and password.
   * Server sets http-only cookies and returns user data.
   *
   * @param username - User's username
   * @param password - User's password
   * @returns User object or null if login failed
   */
  async login(username: string, password: string): Promise<User | null> {
    try {
      const response = await apiClient.post<ApiResponse<User>>(
        "/api/Auth/login",
        { username, password }
      );

      if (response.data) {
        // After successful login, server has set cookies
        // Parse the frontend-readable user_data cookie
        const user = this.getFrontendUserFromCookie();

        if (!user) {
          console.error("Login succeeded but user cookie not found");
          // Fallback: try to get user from server
          return this.getCurrentUser();
        }

        return user;
      }

      return null;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  }

  /**
   * Refreshes access token using http-only refresh_token cookie.
   * Server rotates tokens and sets new cookies.
   *
   * @returns True if refresh succeeded, false otherwise
   */
  async refresh(): Promise<boolean> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        "/api/Auth/refresh"
      );

      // If refresh succeeds, server has set new cookies
      return response.data.success;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  /**
   * Logs out user by clearing all auth cookies on the server.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/Auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
      // Even if request fails, cookies may be cleared on server
    }
  }

  /**
   * Reads and parses the frontend-readable user_data cookie.
   * This cookie contains non-sensitive user information as JWT.
   *
   * @returns User object or null if cookie not found/invalid
   */
  getFrontendUserFromCookie(): User | null {
    return parseCookieJwt<User>(FRONTEND_USER_COOKIE);
  }

  /**
   * Gets current user from cookie or falls back to API call.
   * Prefer cookie parsing for performance.
   *
   * @returns User object or null
   */
  async getCurrentUser(): Promise<User | null> {
    // First try to get from cookie
    const userFromCookie = this.getFrontendUserFromCookie();
    if (userFromCookie) {
      return userFromCookie;
    }

    return null;
  }
}

// Export singleton instance
export default new AuthService();
