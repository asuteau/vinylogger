import {cssBundleHref} from '@remix-run/css-bundle';
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react';
import {Analytics} from '@vercel/analytics/react';
import type {MetaFunction} from '@vercel/remix';
import type {LinksFunction} from '@vercel/remix';

import tailwind from '~/styles/tailwind.css';
import fonts from './styles/fonts.css';

export const meta: MetaFunction = () => [
  {
    charset: 'utf-8',
    title: 'New Remix App',
    viewport: 'width=device-width,initial-scale=1',
  },
];

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: fonts},
  {rel: 'stylesheet', href: tailwind},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
