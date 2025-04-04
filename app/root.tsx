import type {LinksFunction, LoaderFunctionArgs} from '@remix-run/node';
import {json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError} from '@remix-run/react';
import {Analytics} from '@vercel/analytics/react';
import clsx from 'clsx';
import 'swiper/css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import {PWAAssets} from './components/PWAAssets';
import PWABadge from './components/PWABadge';
import {ThemeProvider, useTheme} from './contexts/theme-context';
import {authenticator} from './services/auth.server';
import './tailwind.css';

export const links: LinksFunction = () => [
  {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
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

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  return json({user});
};

const App = () => {
  const {user} = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PWAAssets />
        <Links />
      </head>
      <body>
        {user ? (
          <div className="layout">
            <Navbar totalInCollection={user.itemsInCollection} totalInWantlist={user.itemsInWantlist} />
            <Header avatar={user.avatar} username={user.username} />
            <main className="layout-main">
              <Outlet />
            </main>
          </div>
        ) : (
          <Outlet />
        )}

        <ScrollRestoration />
        <Scripts />
        <PWABadge />
        <Analytics />
      </body>
    </html>
  );
};

const AppWithProviders = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Oh no!</h1>
        <p>Something went wrong.</p>
        <pre>{error.message}</pre>
        <Scripts />
      </body>
    </html>
  );
};

export default AppWithProviders;
