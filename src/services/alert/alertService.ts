import type { AlertMessage, AlertType } from "./types";

class AlertService {
  /**
   * Dispatches a global 'showAlert' event.
   * @param message The message to display.
   * @param type The type of alert (e.g., 'error', 'success').
   */
  private showAlert(message: string, type: AlertType) {
    const event = new CustomEvent<AlertMessage>("showAlert", {
      detail: { message, type },
    });
    document.dispatchEvent(event);
  }

  // --- Public methods ---

  success(message: string) {
    this.showAlert(message, "success");
  }

  error(message: string) {
    this.showAlert(message, "error");
  }

  warn(message: string) {
    this.showAlert(message, "warning");
  }

  info(message: string) {
    this.showAlert(message, "info");
  }
}

// Export a singleton instance
const alertService = new AlertService();
export default alertService;
