# Developer Guide

This document outlines the architecture, core principles, and development guidelines for this React application. It aims to provide developers with a clear understanding of the project structure and how to effectively contribute to it.

## 1. Project Overview

This is a modern React application built with TypeScript and Vite, designed for scalability and maintainability. It incorporates a feature-first directory structure, multi-role authentication, multi-theme support, and multi-language capabilities using `i18next`. Key technologies include `react-router-dom` for routing, Radix UI for accessible components, and Tailwind CSS for a utility-first styling approach.

## 2. Core Principles

-   **Feature-First Architecture:** Code is organized by feature rather than by type (e.g., all authentication-related files reside within the `auth` feature folder).
-   **Absolute Imports:** All internal imports use absolute paths starting with `@/` (e.g., `import { Button } from '@/components/ui/button'`), enhancing readability and simplifying refactoring.
-   **Lazy Loading:** Pages are lazy-loaded to optimize initial bundle size and improve application performance.
-   **Type Safety:** Strict TypeScript configurations are enforced to ensure type safety and reduce runtime errors.
-   **Code Quality:** ESLint is configured with comprehensive rules for TypeScript and React to maintain consistent code style and identify potential issues.

## 3. Directory Structure

The `src` directory is the heart of the application, organized as follows:

```
src/
├── assets/                 # Static assets like images, icons, etc.
├── components/             # Reusable UI components
│   ├── guards/             # Route guards (e.g., RoleGuard)
│   ├── layout/             # Application layout components (e.g., AppLayout)
│   ├── shared/             # General-purpose, shared components
│   └── ui/                 # UI primitives (e.g., button, card, dialog) from Radix UI/Tailwind
├── constants/              # Application-wide constants (e.g., roles-constant)
├── contexts/               # React Contexts for global state management (e.g., AuthProvider, ThemeProvider)
├── features/               # Feature-specific modules (e.g., auth, i18n)
│   ├── [feature-name]/     # Each feature has its own directory
│   │   ├── components/     # Feature-specific components
│   │   ├── contexts/       # Feature-specific contexts
│   │   ├── hooks/          # Feature-specific hooks
│   │   ├── locales/        # Feature-specific translation files
│   │   ├── services/       # Feature-specific API services
│   │   ├── types/          # Feature-specific TypeScript types
│   │   └── *.routes.tsx    # Feature-specific route definitions
│   └── ...
├── hooks/                  # Reusable React hooks
├── lib/                    # Utility functions and helper libraries (e.g., cookie, jwt, utils)
├── pages/                  # Top-level page components, typically lazy-loaded
├── routes/                 # Centralized routing configuration
│   ├── AppRouter.tsx       # Main router component, consumes `routes.tsx`
│   └── routes.tsx          # Centralized route definitions for the application
├── services/               # API service integrations (e.g., alert, api, auth)
│   └── api/                # Axios instance and API types
├── styles/                 # Global styles and Tailwind CSS configuration
├── types/                  # Global TypeScript type definitions
├── App.css                 # Global application styles
├── App.tsx                 # Main application component, sets up providers and router
├── index.css               # Entry point for global CSS
└── main.tsx                # Application entry point, renders the root React component
```

## 4. Implementing a New Feature

Follow these steps to add a new feature to the application:

### 4.1. Create Feature Folder

Create a new folder under `src/features/` for your feature (e.g., `src/features/products`). This folder will encapsulate all related logic, components, and assets.

### 4.2. Develop Components

Place any UI components specific to your feature within `src/features/[feature-name]/components/`. For shared or generic UI elements, consider adding them to `src/components/shared/` or `src/components/ui/`.

### 4.3. Define Routes

If your feature requires new routes, create a `[feature-name].routes.tsx` file within your feature folder (e.g., `src/features/products/products.routes.tsx`). Define your feature's routes as `RouteObject` arrays and export them. Remember to use lazy loading for page components:

```typescript
// src/features/products/products.routes.tsx
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const LazyProductsPage = lazy(() => import('./pages/ProductsPage'));

export const productsRoutes: RouteObject[] = [
  {
    path: '/products',
    element: <LazyProductsPage />,
  },
];
```

Then, import and integrate these routes into the main `src/routes/routes.tsx` file:

```typescript
// src/routes/routes.tsx
import { productsRoutes } from '@/features/products/products.routes';

export const routes: RouteObject[] = [
  // ... existing routes
  ...productsRoutes,
];
```

### 4.4. Implement Services (API Calls)

For API interactions, create service files under `src/features/[feature-name]/services/` (e.g., `src/features/products/services/productService.ts`). Utilize the `axios` instance configured in `src/services/api/axios.ts`.

### 4.5. Manage State

For feature-specific state, consider using React's `useState` and `useReducer` hooks. For global state that needs to be shared across multiple features, create a new React Context under `src/contexts/` or a feature-specific context under `src/features/[feature-name]/contexts/`.

### 4.6. Add Internationalization (i18n)

If your feature requires multi-language support, add translation keys and values to the appropriate JSON files under `src/features/i18n/locales/` (e.g., `en.json`, `ar.json`). You can also create feature-specific locale files within `src/features/[feature-name]/locales/` and configure `i18next` to load them.

### 4.7. Styling

Leverage Tailwind CSS for styling components. For custom styles or global overrides, use `src/styles/global.css` or create feature-specific CSS files if necessary, ensuring they are imported correctly.

## 5. Multi-Role, Multi-Theme, Multi-Language Support

-   **Multi-Role:** Utilize the `RoleGuard` component (`src/components/guards/role-guard.tsx`) in your route definitions (`src/routes/routes.tsx` or feature-specific route files) to restrict access based on user roles defined in `src/constants/roles-constant.ts`.
-   **Multi-Theme:** The `ThemeProvider` (`src/contexts/ThemeProvider.tsx`) manages the application's theme. Components should consume the theme context to adapt their appearance. Ensure new components are theme-aware.
-   **Multi-Language:** The `I18nProvider` (`src/features/i18n/contexts/I18nProvider.tsx`) provides internationalization capabilities. Use the `useTranslation` hook from `react-i18next` in your components to access translated strings.

## 6. Code Conventions

-   **TypeScript:** Always use TypeScript for new files and ensure all code adheres to the configured type-checking rules.
-   **ESLint:** Run `npm run lint` regularly to catch and fix linting errors. Adhere to the established code style.
-   **Absolute Imports:** Consistently use `@/` for all internal imports.
-   **Meaningful Naming:** Use clear and descriptive names for variables, functions, components, and files.
-   **Comments:** Add comments to explain complex logic or non-obvious implementations, focusing on *why* rather than *what*.
