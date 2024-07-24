import type {MetaFunction} from '@vercel/remix';
import {defer} from '@vercel/remix';
import type {LoaderFunctionArgs} from '@vercel/remix';
import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import DashboardLastPurchases from '@/components/DashboardLastPurchases';
import DashboardLastWanted from '@/components/DashboardLastWanted';
import {authenticator} from '@/services/auth.server';
import {getReleasesFromCollection, getReleasesFromWantlist} from '@/services/discogs.api.user';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - User dashboard'}];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const latestFromCollection = getReleasesFromCollection(user, 1, 10);
  const latestFromWantlist = getReleasesFromWantlist(user, 1, 10);

  return defer({latestFromCollection, latestFromWantlist});
};

const Dashboard = () => {
  const {latestFromCollection, latestFromWantlist} = useLoaderData<typeof loader>();

  return (
    <>
      <section id="dashboard" className="space-y-8 md:space-y-16">
        <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
          <Await resolve={latestFromCollection}>
            {(latestFromCollection) => <DashboardLastPurchases lastPurchases={latestFromCollection.releases} />}
          </Await>
        </Suspense>

        <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
          <Await resolve={latestFromWantlist}>
            {(latestFromWantlist) => <DashboardLastWanted lastWanted={latestFromWantlist.wants} />}
          </Await>
        </Suspense>
      </section>
    </>
  );
};

export default Dashboard;
