import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import initI18n from './services/i18n';

startTransition(() => {
  initI18n(window.storedLanguage);
  hydrateRoot(
    document,
    <HydratedRouter />,
  );
});
