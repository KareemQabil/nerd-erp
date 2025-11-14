# i18n Feature - Internationalization

This feature provides multi-language support for the application using i18next and react-i18next.

## Features

- **English and Arabic** language support
- **RTL (Right-to-Left)** automatic handling for Arabic
- **Language persistence** using localStorage
- **Feature-first structure** with generic services
- **Easy to extend** with additional languages

## Structure

```
i18n/
├── components/
│   └── LanguageSwitcher.tsx    # Language toggle button
├── contexts/
│   └── I18nProvider.tsx        # i18n context provider
├── hooks/
│   └── useLanguage.ts          # Custom hook for language management
├── locales/
│   ├── en.json                 # English translations
│   └── ar.json                 # Arabic translations
├── services/
│   └── i18nService.ts          # Generic i18n service
├── types/
│   └── i18n.ts                 # Type definitions
└── index.ts                    # Public API exports
```

## Usage

### 1. Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('pages.dashboard.title')}</h1>
      <p>{t('pages.dashboard.description')}</p>
    </div>
  );
};
```

### 2. Using the Language Hook

```tsx
import { useLanguage } from '@/features/i18n';

const MyComponent = () => {
  const { 
    currentLanguage,      // Current language code ('en' | 'ar')
    currentLanguageConfig, // Full language configuration
    changeLanguage,       // Function to change language
    toggleLanguage,       // Function to toggle between languages
    availableLanguages,   // Array of all available languages
    isRTL                 // Boolean indicating RTL mode
  } = useLanguage();
  
  return (
    <div>
      <p>Current Language: {currentLanguage}</p>
      <button onClick={toggleLanguage}>Toggle Language</button>
    </div>
  );
};
```

### 3. Using the Language Switcher Component

```tsx
import { LanguageSwitcher } from '@/features/i18n';

const Navbar = () => {
  return (
    <nav>
      <LanguageSwitcher />
    </nav>
  );
};
```

## Adding New Translations

1. Add translation keys to `locales/en.json`:
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}
```

2. Add corresponding Arabic translations to `locales/ar.json`:
```json
{
  "myFeature": {
    "title": "ميزتي",
    "description": "هذه هي ميزتي"
  }
}
```

3. Use in your component:
```tsx
const { t } = useTranslation();
<h1>{t('myFeature.title')}</h1>
```

## Adding New Languages

1. Create a new locale file (e.g., `locales/fr.json`)
2. Add the language to `types/i18n.ts`:
```typescript
export type Language = 'en' | 'ar' | 'fr';

export const LANGUAGES: Record<Language, LanguageConfig> = {
  // ... existing languages
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
  },
};
```

3. Import and add to `services/i18nService.ts`:
```typescript
import frTranslations from '../locales/fr.json';

// In the initialize method:
resources: {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
  fr: { translation: frTranslations },
}
```

## RTL Support

The i18n service automatically handles RTL (Right-to-Left) layout for Arabic:
- Sets `document.documentElement.dir` to 'rtl' or 'ltr'
- Sets `document.documentElement.lang` to the current language code
- Updates automatically when language changes

## Language Detection

The application uses the following order to detect user language:
1. **localStorage** - Previously selected language
2. **Browser settings** - User's browser language preference
3. **Fallback** - English (default)

## API Reference

### i18nService

Generic service for managing i18n functionality:

- `initialize()` - Initialize i18next
- `changeLanguage(language)` - Change the current language
- `getCurrentLanguage()` - Get the current language code
- `getInstance()` - Get the i18next instance

### useLanguage Hook

Returns:
- `currentLanguage` - Current language code
- `currentLanguageConfig` - Full language configuration object
- `changeLanguage(language)` - Change to a specific language
- `toggleLanguage()` - Toggle between English and Arabic
- `availableLanguages` - Array of all available language configs
- `isRTL` - Boolean indicating if current language is RTL
