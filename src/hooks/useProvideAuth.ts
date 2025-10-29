import { useState, useEffect, useCallback } from "react";
import authService from "../services/auth/authService";
import type { User } from "../features/auth/types/auth";

/**
 * Auth state and methods returned by useProvideAuth hook.
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  silentRefresh: () => Promise<boolean>;
  reloadUser: () => Promise<void>;
}

/**
 * Core authentication logic hook.
 * Manages user state, loading state, and auth actions.
 *
 * On mount:
 * - Attempts to read user from frontend cookie
 * - Optionally performs silent refresh if no cookie present
 *
 * @returns Auth state and methods
 */
export function useProvideAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Reloads user data from cookie or API.
   */
  const reloadUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to reload user:", error);
      setUser(null);
    }
  }, []);

  /**
   * Silent refresh - attempts to refresh tokens in background.
   */
  const silentRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const success = await authService.refresh();
      if (success) {
        await reloadUser();
      }
      return success;
    } catch (error) {
      console.error("Silent refresh failed:", error);
      return false;
    }
  }, [reloadUser]);

  /**
   * Initialize auth state on mount.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First try to get user from cookie
        const cookieUser = authService.getFrontendUserFromCookie();

        if (cookieUser) {
          setUser(cookieUser);
        } else {
          // No cookie present - try silent refresh once
          // This handles cases where http-only cookies exist but user_data cookie expired
          const refreshed = await silentRefresh();

          if (!refreshed) {
            // No valid session
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [silentRefresh]);

  /**
   * Sign in with username and password.
   */
  const signIn = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        setLoading(true);
        const loggedInUser = await authService.login(username, password);

        if (loggedInUser) {
          setUser(loggedInUser);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Sign in failed:", error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Sign out and clear auth state.
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: user !== null,
    signIn,
    signOut,
    silentRefresh,
    reloadUser,
  };
}
