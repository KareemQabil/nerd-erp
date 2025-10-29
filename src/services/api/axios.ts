import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { ApiResponse, ApiError } from "./types"; // Assuming types.ts is in the same folder
import alertService from "@/services/alert/alertService"; // Import the new alert service
import { i18nService } from "@/features/i18n/services/i18nService"; // Import i18n config
import { t } from "i18next";

/**
 * Axios instance configured for authentication with http-only cookies.
 * - Uses withCredentials to send cookies with every request
 * - Automatically handles 401 errors with token refresh and retry
 * - Implements mutex to prevent concurrent refresh requests
 * - Intercepts all responses to handle generic error structure
 */

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  withCredentials: true, // Critical: sends http-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Mutex state for refresh logic
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Request interceptor - can be used to attach additional headers if needed.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Additional headers can be added here if needed
    // Note: We do NOT manually attach tokens - they're sent via http-only cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handles translating and alerting for a given ApiError.
 * @param apiError The error object from the backend response
 */
const handleApiError = (apiError: ApiError) => {
  const translationKey = i18nService.mapKeyToTranslation(apiError.messageKey);
  // i18n.t() will use the messageKey as a fallback if the key isn't found
  const translatedMessage = t(translationKey, apiError.message);

  alertService.error(translatedMessage);

  // Return a new error with the translated message
  return new Error(translatedMessage);
};

/**
 * Response interceptor - handles:
 * 1. 2xx responses that contain a backend error.
 * 2. 401 errors with automatic token refresh.
 * 3. 4xx/5xx errors that contain a backend error.
 * 4. Generic network errors.
 */
apiClient.interceptors.response.use(
  /**
   * This handler catches successful (2xx) responses.
   * We check if the response body contains our generic error structure.
   */
  (response: AxiosResponse<ApiResponse<any>>) => {
    const apiResponse = response.data;

    // Check for backend-formatted errors in a 2xx response
    // e.g., a 200 OK with validation errors
    if (apiResponse && apiResponse.error) {
      const error = handleApiError(apiResponse.error);
      // Reject the promise to stop .then() chains and trigger .catch()
      return Promise.reject(error);
    }

    // This is a true success, pass the original response along
    return response;
  },
  /**
   * This handler catches failed (non-2xx) responses.
   */
  async (error: AxiosError<ApiResponse<any>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Avoid refresh endpoint itself from triggering refresh
      if (originalRequest.url?.includes("/api/Auth/refresh")) {
        // We might want to trigger a logout here
        alertService.error("Session expired. Please log in again.");
        return Promise.reject(error);
      }

      try {
        // Implement mutex: if refresh is already in progress, wait for it
        if (!isRefreshing) {
          isRefreshing = true;

          // Dynamic import to avoid circular dependency
          refreshPromise = import("@/services/auth/authService").then(
            (module) => module.default.refresh()
          );
        }

        // Wait for refresh to complete
        const refreshSuccess = await refreshPromise;

        if (refreshSuccess) {
          // Retry original request with new tokens (sent via cookies)
          return apiClient(originalRequest);
        } else {
          // Refresh failed - redirect to login or clear auth state
          alertService.error("Session expired. Please log in again.");
          return Promise.reject(error);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Handle other errors (400, 403, 404, 500, etc.)
    // Check if the error response body contains our generic error structure
    const apiResponse = error.response?.data;
    if (apiResponse && apiResponse.error) {
      handleApiError(apiResponse.error);
    } else {
      // Handle generic network/server errors
      const genericMessage = t(
        "errors.NETWORK_ERROR",
        "A network error occurred."
      );
      alertService.error(genericMessage);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
