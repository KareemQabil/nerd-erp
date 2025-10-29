import React, { useState, useEffect, useCallback } from "react";
import type { AlertMessage, AlertType } from "@/services/alert/types";

// Simple styling for the alert. You can replace this with your UI library (e.g., shadcn, MUI)
const alertStyles: Record<AlertType, string> = {
  success: "bg-green-100 border-green-400 text-green-700",
  error: "bg-red-100 border-red-400 text-red-700",
  warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
  info: "bg-blue-100 border-blue-400 text-blue-700",
};

const AlertItem: React.FC<{
  alert: AlertMessage & { id: number };
  onDismiss: (id: number) => void;
}> = ({ alert, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(alert.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [alert.id, onDismiss]);

  return (
    <div
      className={`border px-4 py-3 rounded-md relative shadow-md ${
        alertStyles[alert.type]
      }`}
      role="alert"
    >
      <span className="block sm:inline">{alert.message}</span>
      <button
        onClick={() => onDismiss(alert.id)}
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        aria-label="Close"
      >
        <svg
          className="fill-current h-6 w-6 text-current opacity-50 hover:opacity-100"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.697l-2.651 2.651a1.2 1.2 0 1 1-1.697-1.697L8.303 10 5.651 7.349a1.2 1.2 0 1 1 1.697-1.697L10 8.303l2.651-2.651a1.2 1.2 0 1 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.698z" />
        </svg>
      </button>
    </div>
  );
};

/**
 * AlertDisplay component
 * Listens for 'showAlert' events from the alertService and displays them.
 * Place this component at the root of your application (e.g., in App.tsx).
 */
export const AlertDisplay: React.FC = () => {
  const [alerts, setAlerts] = useState<(AlertMessage & { id: number })[]>([]);

  const handleShowAlert = useCallback((event: Event) => {
    const detail = (event as CustomEvent<AlertMessage>).detail;
    setAlerts((prevAlerts) => [...prevAlerts, { ...detail, id: Date.now() }]);
  }, []);

  const dismissAlert = useCallback((id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  }, []);

  useEffect(() => {
    document.addEventListener("showAlert", handleShowAlert);
    return () => {
      document.removeEventListener("showAlert", handleShowAlert);
    };
  }, [handleShowAlert]);

  return (
    <div className="fixed top-5 right-5 z-50 space-y-3 w-full max-w-sm">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onDismiss={dismissAlert} />
      ))}
    </div>
  );
};
