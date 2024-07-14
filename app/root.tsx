import {cssBundleHref} from '@remix-run/css-bundle';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {Analytics} from '@vercel/analytics/react';

import tailwind from '~/styles/tailwind.css';
import fonts from './styles/fonts.css';
import type {LinksFunction, LoaderFunctionArgs} from '@vercel/remix';
import Navbar from './components/Navbar';
import Header from './components/Header';
import {json} from '@vercel/remix';
import {ThemeProvider, useTheme} from './contexts/theme-context';
import clsx from 'clsx';
import {authenticator} from './services/auth.server';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: fonts},
  {rel: 'stylesheet', href: tailwind},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
];

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  return json({user});
};

// export function ErrorBoundary() {
//   const error = useRouteError();
//   console.error(error);
//   return (
//     <html>
//       <head>
//         <title>Oh no!</title>
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         {/* add the UI you want your users to see */}
//         <Scripts />
//       </body>
//     </html>
//   );
// }

const App = () => {
  const {user} = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {user ? (
          <div className="layout">
            <Navbar totalInCollection={user.itemsInCollection} totalInWantlist={user.itemsInWantlist} />
            <Header avatar={user.avatar} username={user.username} />
            <section className="layout-main m-7 p-1 space-y-4">
              <Outlet />
            </section>
          </div>
        ) : (
          <Outlet />
        )}

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
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

export default AppWithProviders;
