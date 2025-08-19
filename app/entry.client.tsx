import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import './services/i18n';

startTransition(() => {
  hydrateRoot(
    document,
    <HydratedRouter />
  );
});
