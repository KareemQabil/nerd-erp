You are an AI code generator. Generate a feature-first TypeScript React authentication feature as separate files in the file tree below.

Requirements / assumptions:

- Backend auth endpoints:
  - POST /api/Auth/login (body: { username, password }) — server sets http-only cookies: access_token, refresh_jti, refresh_token and also sets a frontend-readable JWT cookie containing user info.
  - POST /api/Auth/refresh — server uses http-only cookies to refresh access token.
  - POST /api/Auth/logout — server clears cookies.
- All network requests that must include http-only cookies must use axios with `withCredentials: true`.
- Frontend-readable cookie name: default `user_data`.
- Use TypeScript + React. Use React Router v6 style route guard (ProtectedRoute).
- Do **not** attempt to read http-only cookies from JS — only the refresh/refresh_jti flow should rely on cookies sent by the browser via `withCredentials`.
- Implement safe refresh logic with a mutex to avoid concurrent refresh requests.
- Provide detailed file list and full source for each file.

Project file tree to create (generate each file with exact path and content):

src/
features/
auth/
api/
axiosInstance.ts
services/
authService.ts
hooks/
useAuth.ts
useProvideAuth.ts
context/
AuthProvider.tsx
components/
LoginForm.tsx
ProtectedRoute.tsx
utils/
cookie.ts
jwt.ts
types/
auth.ts
index.ts

For each file implement the following (TypeScript):

1. src/features/auth/api/axiosInstance.ts

- Create an Axios instance with:
  - baseURL from `import.meta.env.VITE_API_BASE_URL ?? ''`
  - `withCredentials: true`
  - JSON headers
- Add request interceptor to attach any frontend-accessible info (if needed).
- Add response interceptor that:
  - On 401 invokes a refresh flow (call a refresh function exposed by authService) and retries the original request with the new access.
  - Uses a mutex to avoid concurrent refresh requests.
- Export `apiClient`.

2. src/features/auth/services/authService.ts

- Export a default `AuthService` object with methods:
  - `login(username: string, password: string): Promise<User | null>` — sends POST /api/Auth/login with credentials, server should set cookies; after success parse frontend JWT cookie or call /api/Auth/me to get user and return it.
  - `refresh(): Promise<boolean>` — POST /api/Auth/refresh with `withCredentials: true` to let server rotate tokens; returns true if refresh succeeded.
  - `logout(): Promise<void>` — POST /api/Auth/logout to clear cookies and return.
  - `getFrontendUserFromCookie(): User | null` — reads frontend-accessible cookie (`user_data` constant) and parses JWT to User object.
  - `getCurrentUser(): Promise<User | null>` — uses cookie parser or a GET /api/Auth/me fallback.
- Use `ApiResponse<T>` and `ApiError` types from the provided shapes.
- Implement safe error handling and comments explaining cookie privacy.

3. src/features/auth/hooks/useProvideAuth.ts

- Implements the core logic that manages `user`, `loading`, `isAuthenticated`, and exposes actions:
  - `signIn(username, password)`
  - `signOut()`
  - `silentRefresh()` (calls AuthService.refresh)
  - `reloadUser()` (re-reads frontend cookie or calls /me)
- On mount attempt to read user from cookie and set state. Optionally attempt a silentRefresh when cookie absent but desired — keep it conservative: if cookie present parse it; if not present try refresh once.
- Export `useProvideAuth()` hook that returns auth state and methods.

4. src/features/auth/hooks/useAuth.ts

- Simple hook that returns context value (useContext(AuthContext)). Throw helpful error if used outside provider.

5. src/features/auth/context/AuthProvider.tsx

- Create `AuthContext` with types and `AuthProvider` component that uses `useProvideAuth`.
- Wrap children and expose context.

6. src/features/auth/components/LoginForm.tsx

- Basic Login form (username/password) with controlled inputs.
- On submit call `signIn` from `useAuth`.
- Show simple errors and loading state. Keep UI minimal and typesafe.

7. src/features/auth/components/ProtectedRoute.tsx

- React Router v6 component that checks `isAuthenticated` and either renders `Outlet`/children or navigates to `/login` (use `<Navigate to="/login" replace />`).
- While `loading` show a minimal placeholder.

8. src/features/auth/utils/cookie.ts

- Utilities:
  - `getCookie(name: string): string | null`
  - `parseCookieJwt(name: string): any | null` — reads a cookie value and base64-decode / JSON parse JWT payload. Do not verify signature; only decode.
- `FRONTEND_USER_COOKIE = 'user_data'` constant at top .

9. src/features/auth/utils/jwt.ts

- `decodeJwt<T>(token: string): T | null` — safely split ".", base64-decode payload, JSON.parse in try/catch and return typed payload or null.

10. src/features/auth/types/auth.ts

- Export `User` interface that matches payload fields shown:
  - `fullNameAr: string`
  - `fullNameEn: string`
  - `profilePhotoKey?: string`
  - `roles: string[]`
  - plus optional `exp?: number` `iat?: number` `sub?: string` for typical JWT fields.
- Export `ApiError` and `ApiResponse<T>` exactly as provided.

11. src/features/auth/index.ts

- Re-export commonly used functions/components: `AuthProvider`, `useAuth`, `LoginForm`, `ProtectedRoute`, and `AuthService`.

Implementation details & best-practices to follow in generated files:

- Use TypeScript types, explicit return types, and `async/await`.
- Use axios `withCredentials: true` globally for `apiClient`.
- Interceptor refresh logic must use a mutex/promise-queue approach so only one refresh happens when multiple requests get 401 concurrently; other failed requests should wait for refresh result and then retry.
- Avoid reading http-only cookies in JS; only frontend cookie parser should decode the separate readable JWT cookie.
- Provide good comments above each exported function explaining purpose and security notes.
- Keep UI components minimal (no styling libraries needed) but typed.
- Use environment variable for API base URL and explain how to override `FRONTEND_USER_COOKIE` constant if server uses another name.
- Include helpful console.error or thrown errors for unexpected conditions.
- Use `localStorage` only for non-sensitive client flags if needed, but prefer cookie-based approach since backend sets tokens in http-only cookies (avoid storing tokens in localStorage).
- When refreshing, call POST /api/Auth/refresh (no body) and rely on server to use cookies; handle 401 from refresh by clearing auth state.

Output format required:

- For each file path listed above, output a header `### <file-path>` followed by a fenced TypeScript code block containing the full file contents.
- Do NOT create any extra files beyond the list.
- Make every file compile as-is (assume React + TS + axios installed).
- Keep code self-contained within this feature; do not assume app-level Redux or other global stores.
- At the top of the full output include a very short 2–3 line summary of what was generated.

Generate now.
