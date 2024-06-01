import {cssBundleHref} from '@remix-run/css-bundle';
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react';
import {Analytics} from '@vercel/analytics/react';

import tailwind from '~/styles/tailwind.css';
import fonts from './styles/fonts.css';
import type {LinksFunction} from '@vercel/remix';
import Navbar from './components/Navbar';
import Header from './components/Header';
import {useState} from 'react';
import {UserContextProvider} from './contexts/user-context';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: fonts},
  {rel: 'stylesheet', href: tailwind},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <UserContextProvider value={isAuthenticated}>
          <div className="layout bg-gray-50">
            <Navbar />
            <Header />
            <section className="layout-main p-8 space-y-4">
              <Outlet />
            </section>
          </div>

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
          <Analytics />
        </UserContextProvider>
      </body>
    </html>
  );
}
