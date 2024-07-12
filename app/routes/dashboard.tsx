import type {MetaFunction} from '@vercel/remix';
import {defer, json} from '@vercel/remix';
import type {LoaderFunctionArgs} from '@vercel/remix';
import {Await, Form, NavLink, useLoaderData} from '@remix-run/react';
import {getClient, getUser} from '~/utils/session.server';
import {Suspense} from 'react';
import DashboardLastPurchases from '~/components/DashboardLastPurchases';
import DashboardLastWanted from '~/components/DashboardLastWanted';
import {getAllFromCollection, getAllFromWantlist} from '~/services/discogs';
import {Button} from '~/components/ui/button';
import {authenticator} from '~/services/auth.server';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - User dashboard'}];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  // get the user data or redirect to /login if it failed
  let authenticatedUser = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });
  console.log('authenticatedUser', authenticatedUser);

  const user = await getUser(request);
  if (!user) return json({user: null, lastPurchases: null, latestFromWantlist: null});

  const client = await getClient(request);
  const profile = client.user().getProfile(user.username);
  const latestFromCollection = getAllFromCollection(client, user.username, {
    per_page: 10,
    sort: 'added',
    sort_order: 'desc',
  });
  const latestFromWantlist = getAllFromWantlist(client, user.username, {
    per_page: 10,
  });
  const lastPurchases = Promise.all([profile, latestFromCollection]);

  return defer({user, lastPurchases, latestFromWantlist});
};

const DashboardRoute = () => {
  const {user, lastPurchases, latestFromWantlist} = useLoaderData<typeof loader>();

  return (
    <>
      {user ? (
        <section id="dashboard" className="space-y-8 md:space-y-16">
          <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
            <Await resolve={lastPurchases}>
              {([profile, latestReleases]) => (
                <DashboardLastPurchases lastPurchases={latestReleases} totalItems={profile.data.num_collection} />
              )}
            </Await>
          </Suspense>

          <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
            <Await resolve={latestFromWantlist}>
              {(latestFromWantlist) => <DashboardLastWanted lastWanted={latestFromWantlist} />}
            </Await>
          </Suspense>
        </section>
      ) : (
        <ul>
          <li>
            <Form action="/login" method="post">
              <Button variant="link">Login with Discogs</Button>
            </Form>
          </li>
        </ul>
      )}
    </>
  );
};

export default DashboardRoute;
