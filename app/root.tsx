import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LinksFunction,
  type LoaderFunction,
} from 'react-router';
import i18next from 'i18next';
import { serverI18nMap } from '~/services/serverI18nMap';
import { HeroUIProvider } from '@heroui/react';
import { I18nextProvider } from 'react-i18next';
import { ServerContextProvider } from './containers/serverContext';
import PopUpProvider from './containers/PopUp/PopUpProvider';
import { LANGUAGES } from './constants';
import './app.css';

export const loader: LoaderFunction = ({ context, params, request }) => {
  const { locale } = params;
  const { defaultLocale } = context;
  const language = LANGUAGES[locale];
  if (!language) {
    const url = new URL(request.url);
    throw redirect(`/${defaultLocale}${url.pathname}${url.search || ''}`);
  }
  return { ...context, locale, language };
};

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="version" content={APP_VERSION} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const context = useLoaderData<any>();
  const { language } = context;
  const isServer = typeof window === 'undefined';
  return (
    <>
      <I18nextProvider i18n={isServer ? serverI18nMap.get(language) : i18next}>
        <ServerContextProvider context={context}>
          <HeroUIProvider>
            <PopUpProvider>
              <Outlet />
            </PopUpProvider>
          </HeroUIProvider>
        </ServerContextProvider>
      </I18nextProvider>
      {isServer && <script>{`window.storedLanguage = '${language}';`}</script>}
    </>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
};
