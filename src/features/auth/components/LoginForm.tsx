import React, { useState, type FormEvent, type JSX } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

/**
 * Login form component with username and password inputs.
 * Handles form submission and displays loading/error states.
 */
export function LoginForm(): JSX.Element {
  const { t } = useTranslation();
  const { signIn, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError(t('errors.requiredFields'));
      return;
    }

    const success = await signIn(username, password);

    if (!success) {
      setError(t('errors.invalidCredentials'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-foreground">{t('pages.login.title')}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-foreground"
            >
              {t('pages.login.usernameLabel')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-foreground"
            >
              {t('pages.login.passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-base font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('pages.login.signingInButton') : t('pages.login.signInButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
