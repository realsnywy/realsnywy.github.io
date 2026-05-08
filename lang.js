(function () {
  const STORAGE_KEY = 'portfolioLanguage';
  const SUPPORTED_LANGUAGES = ['en', 'pt'];

  function normalizeLanguage(language) {
    if (!language || typeof language !== 'string') {
      return null;
    }

    const short = language.trim().toLowerCase().split('-')[0];
    return SUPPORTED_LANGUAGES.includes(short) ? short : null;
  }

  function getLanguageFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return normalizeLanguage(params.get('lang'));
  }

  function getStoredLanguage() {
    try {
      return normalizeLanguage(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function detectDefaultLanguage() {
    const browserLanguage = normalizeLanguage(window.navigator.language);
    return browserLanguage || 'en';
  }

  function getCurrentLanguage() {
    return getLanguageFromUrl() || getStoredLanguage() || detectDefaultLanguage();
  }

  function setCurrentLanguage(language) {
    const normalized = normalizeLanguage(language) || 'en';

    try {
      window.localStorage.setItem(STORAGE_KEY, normalized);
    } catch {
      // Ignore storage failures.
    }

    return normalized;
  }

  function updateDocumentLanguage(language) {
    document.documentElement.lang = language;
  }

  function translateElement(element, value) {
    if (typeof value === 'undefined' || value === null) {
      return;
    }

    if (element.hasAttribute('data-i18n-html')) {
      element.innerHTML = value;
      return;
    }

    element.textContent = value;
  }

  function applyTranslations(dictionary, language) {
    const langMap = dictionary[language] || {};

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      translateElement(element, langMap[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const key = element.getAttribute('data-i18n-title');
      const value = langMap[key];
      if (typeof value !== 'undefined') {
        element.setAttribute('title', value);
      }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const key = element.getAttribute('data-i18n-aria-label');
      const value = langMap[key];
      if (typeof value !== 'undefined') {
        element.setAttribute('aria-label', value);
      }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
      const key = element.getAttribute('data-i18n-alt');
      const value = langMap[key];
      if (typeof value !== 'undefined') {
        element.setAttribute('alt', value);
      }
    });

    const titleKey = document.body ? document.body.getAttribute('data-i18n-title') : null;
    if (titleKey && typeof langMap[titleKey] !== 'undefined') {
      document.title = langMap[titleKey];
    }

    updateDocumentLanguage(language);
  }

  function initPageLanguage(dictionary) {
    const language = getCurrentLanguage();
    applyTranslations(dictionary, language);
  }

  window.PortfolioLanguage = {
    supportedLanguages: SUPPORTED_LANGUAGES.slice(),
    normalizeLanguage,
    getCurrentLanguage,
    setCurrentLanguage,
    applyTranslations,
    initPageLanguage,
  };
})();
