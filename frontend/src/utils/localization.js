// Simple localization utility
const defaultLanguage = "en";

// Default translations
const translations = {
  en: {
    auth: {
      register: {
        title: "Create your account",
        submit: "Create account",
        loading: "Creating account...",
        success: "Account created successfully!",
        error: "An error occurred during registration",
      },
      login: {
        title: "Sign in to your account",
        submit: "Sign in",
        loading: "Signing in...",
        success: "Signed in successfully!",
        error: "Invalid credentials",
      },
    },
  },
};

// Get the current language (defaulting to English)
const getCurrentLanguage = () => {
  return defaultLanguage;
};

// Get a translation by key path
const getTranslation = (keyPath, lang = getCurrentLanguage()) => {
  const keys = keyPath.split(".");
  let result = translations[lang];

  for (const key of keys) {
    if (!result || !result[key]) {
      // Fallback to English if translation is missing
      if (lang !== defaultLanguage) {
        return getTranslation(keyPath, defaultLanguage);
      }
      return keyPath; // Return the key path if translation is missing
    }
    result = result[key];
  }

  return result;
};

export { getTranslation, getCurrentLanguage, translations };
