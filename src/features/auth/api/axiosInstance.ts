import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

/**
 * Axios instance configured for authentication with http-only cookies.
 * - Uses withCredentials to send cookies with every request
 * - Automatically handles 401 errors with token refresh and retry
 * - Implements mutex to prevent concurrent refresh requests
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
 * Response interceptor - handles 401 errors with automatic token refresh.
 * Uses mutex pattern to ensure only one refresh happens for concurrent requests.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Avoid refresh endpoint itself from triggering refresh
      if (originalRequest.url?.includes("/api/Auth/refresh")) {
        return Promise.reject(error);
      }

      try {
        // Implement mutex: if refresh is already in progress, wait for it
        if (!isRefreshing) {
          isRefreshing = true;

          // Dynamic import to avoid circular dependency
          refreshPromise = import("../services/authService").then((module) =>
            module.default.refresh()
          );
        }

        // Wait for refresh to complete
        const refreshSuccess = await refreshPromise;

        if (refreshSuccess) {
          // Retry original request with new tokens (sent via cookies)
          return apiClient(originalRequest);
        } else {
          // Refresh failed - redirect to login or clear auth state
          return Promise.reject(error);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
