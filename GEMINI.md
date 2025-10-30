## Project Overview

This is a React application built with TypeScript and Vite. It features a feature-first directory structure, multi-role authentication, multi-theme support, and multi-language capabilities using `i18next`. The project utilizes `react-router-dom` for routing, Radix UI for components, and Tailwind CSS for styling.

## Building and Running

- **Development Server:**
  ```bash
  npm run dev
  ```
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Linting:**
  ```bash
  npm run lint
  ```
- **Preview Production Build:**
  ```bash
  npm run preview
  ```

## Development Conventions

- **TypeScript:** The project is configured with strict TypeScript settings, including path aliases (`@/*` for `src/*`).
- **ESLint:** ESLint is used for code quality and consistency, with configurations for TypeScript and React.
- **Feature-First Structure:** The application follows a feature-first directory structure, organizing code by feature rather than by type.
- **Routing:** Centralized routing configuration is managed in `src/routes/routes.tsx` and consumed by `src/routes/AppRouter.tsx`.
- **Theming:** Theme management is handled via `src/contexts/ThemeProvider.tsx`.
- **Internationalization:** `i18next` is used for multi-language support, with configurations in `src/features/i18n/`.
- **Authentication:** Authentication logic is managed through `src/contexts/AuthProvider.tsx` and role-based access control is implemented using `src/components/guards/role-guard.tsx`.
