import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import type { AuthState } from "@/hooks/useProvideAuth";

/**
 * Hook to access authentication context.
 * Must be used within AuthProvider.
 *
 * @throws Error if used outside AuthProvider
 * @returns Auth state and methods
 *
 * @example
 * const { user, signIn, signOut } = useAuth();
 */
export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
        "Wrap your app with <AuthProvider> to use authentication."
    );
  }

  return context;
}
