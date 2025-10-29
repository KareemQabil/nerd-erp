/**
 * A simple event-based alert service.
 * This avoids complex state management or prop drilling for alerts.
 * Any component can listen for the 'showAlert' event.
 */

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertMessage {
  message: string;
  type: AlertType;
}
