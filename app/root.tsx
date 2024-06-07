import {cssBundleHref} from '@remix-run/css-bundle';
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData} from '@remix-run/react';
import {Analytics} from '@vercel/analytics/react';

import tailwind from '~/styles/tailwind.css';
import fonts from './styles/fonts.css';
import type {LinksFunction, LoaderFunctionArgs} from '@vercel/remix';
import Navbar from './components/Navbar';
import Header from './components/Header';
import {useState} from 'react';
import {UserContextProvider} from './contexts/user-context';
import {getClient, getUser} from './utils/session.server';
import {json} from '@vercel/remix';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: fonts},
  {rel: 'stylesheet', href: tailwind},
  ...(cssBundleHref ? [{rel: 'stylesheet', href: cssBundleHref}] : []),
];

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return json({profile: null});
  const client = await getClient(request);
  const profile = await client.user().getProfile(user.username);
  return json({profile});
};

const App = () => {
  const {profile} = useLoaderData<typeof loader>();
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
        {/* <UserContextProvider value={isAuthenticated}> */}
        <div className="layout bg-slate-50">
          <Navbar />
          <Header profile={profile?.data} />
          <section className="layout-main p-8 space-y-4">
            <Outlet />
          </section>
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
        {/* </UserContextProvider> */}
      </body>
    </html>
  );
};

export default App;
