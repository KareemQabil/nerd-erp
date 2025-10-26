/**
 * User interface matching the JWT payload structure from the backend.
 * Contains user identity and authorization information.
 */
export interface User {
  fullNameAr: string;
  fullNameEn: string;
  profilePhotoKey?: string;
  roles: string[];
  // Standard JWT claims
  exp?: number;
  iat?: number;
  sub?: string;
}

/**
 * Standard API error response structure.
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Generic API response wrapper.
 */
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}
