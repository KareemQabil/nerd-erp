/**
 * Standard API error response structure.
 */
export interface ApiError {
  message: string;
  messageKey: string;
  details?: Record<string, any>;
}

/**
 * Generic API response wrapper.
 */
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
