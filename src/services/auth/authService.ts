import apiClient from "@/services/api/axios"; // Make sure path is correct
import type { User } from "../../features/auth/types/auth"; // Make sure path is correct
import type { ApiResponse } from "@/services/api/types"; // Make sure path is correct
import { FRONTEND_USER_COOKIE, parseCookieJwt } from "@/lib/cookie"; // Make sure path is correct

/**
 * Authentication service handling all auth-related API calls.
 * Uses http-only cookies for secure token storage.
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
      // The interceptor will reject on error, so we only handle success here
      const response = await apiClient.post<ApiResponse<User>>(
        "/api/Auth/login",
        { username, password }
      );

      // On success, response.data.error is guaranteed to be null by the interceptor.
      // We can safely check for response.data.data.
      if (response.data.data) {
        // After successful login, server has set cookies
        // Parse the frontend-readable user_data cookie
        const user = this.getFrontendUserFromCookie();

        if (!user) {
          console.warn(
            "Login succeeded but user cookie not found; using response data."
          );
          // Fallback to data from response
          return response.data.data;
        }

        return user;
      }

      return null;
    } catch (error) {
      // Errors are now pre-handled and translated by the interceptor.
      // We just need to log it and return null.
      console.error("Login failed:", (error as Error).message);
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
      const response = await apiClient.get<ApiResponse<any>>(
        "/api/Auth/refresh"
      );
      // The interceptor handles errors, so if we get here, it's a success
      return !!response.data.data;
    } catch (error) {
      console.error("Token refresh failed:", (error as Error).message);
      return false;
    }
  }

  /**
   * Logs out user by clearing all auth cookies on the server.
   */
  async logout(): Promise<void> {
    try {
      await apiClient.get("/api/Auth/logout");
    } catch (error) {
      console.error("Logout request failed:", (error as Error).message);
      // Even if request fails, we can proceed with client-side cleanup
    }
  }

  /**
   * Reads and parses the frontend-readable user_data cookie.
   * This cookie contains non-sensitive user information as JWT.
   *
   * @returns User object or null if cookie not found/invalid
   */
  getFrontendUserFromCookie(): User | null {
    // Assuming parseCookieJwt exists and works as intended
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

    // You might want to add an API call here as a fallback
    // e.g., return this.fetchProfile();
    return null;
  }
}

// Export singleton instance
export default new AuthService();
