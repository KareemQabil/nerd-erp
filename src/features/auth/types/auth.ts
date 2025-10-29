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
