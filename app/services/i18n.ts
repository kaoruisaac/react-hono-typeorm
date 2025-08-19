import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import ChainedBackend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

i18n
  .use(initReactI18next)
  .use(ChainedBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en-US',
    supportedLngs: ['en-US', 'zh-TW'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    backend: {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [{
        expirationTime: 24 * 60 * 60 * 1000,
        prefix: `app-${APP_VERSION}-`,
      }, {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      }],
    },
    initImmediate: true,
  });

export default i18n;