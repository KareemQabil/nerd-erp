import React, { createContext, type JSX, type ReactNode } from "react";
import { useProvideAuth, type AuthState } from "@/hooks/useProvideAuth";

/**
 * Auth context - provides authentication state and methods to entire app.
 */
export const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider component.
 * Wraps app to provide auth context to all child components.
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
