import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { i18nService } from "../services/i18nService";

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * I18n Provider Component
 * Initializes i18n service and provides i18next context to the app
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    i18nService.initialize().then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    // Optional: Show a loading spinner while i18n initializes
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18nService.getInstance()}>
      {children}
    </I18nextProvider>
  );
};
