import type {MetaFunction} from '@vercel/remix';
import {defer, json} from '@vercel/remix';
import type {LoaderFunctionArgs} from '@vercel/remix';
import {Await, NavLink, useLoaderData} from '@remix-run/react';
import {getClient, getUser} from '~/utils/session.server';
import {Suspense} from 'react';
import DashboardLogout from '~/components/DashboardLogout';
import DashboardLastPurchases from '~/components/DashboardLastPurchases';
import DashboardLastWanted from '~/components/DashboardLastWanted';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Welcome to Vinylogger!'}];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return json({user: null, lastPurchases: null, latestFromWantlist: null});

  const client = await getClient(request);
  const profile = client.user().getProfile(user.username);
  const latestReleases = client.user().collection().getReleases(user.username, 0, {
    per_page: 10,
    sort: 'added',
    sort_order: 'desc',
  });

  const latestFromWantlist = client.user().wantlist().getReleases(user.username, {per_page: 10});
  const lastPurchases = Promise.all([profile, latestReleases]);

  // const nbReleases = userProfile.data.num_collection;
  // const collectionValue = await client.user().collection().getValue(userName);

  // return defer({
  //   id,
  //   name: userName,
  //   nbReleases: userProfile.data.num_collection,
  //   collectionMin: collectionValue.data.minimum,
  //   collectionMedian: collectionValue.data.median,
  //   collectionMax: collectionValue.data.maximum,
  //   lastPurchased: collection.data.releases.map((release) => {
  //     return {
  //       artist: release.basic_information.artists.map((artist) => artist.name).join(', '),
  //       title: release.basic_information.title,
  //       thumbnail: release.basic_information.thumb,
  //       releaseType: release.basic_information.formats.map((format) => format.name).join(', '),
  //       dateAdded: new Date(release.date_added).toLocaleDateString(),
  //     };
  //   }),
  // });

  return defer({user, lastPurchases, latestFromWantlist});
};

const DashboardRoute = () => {
  const {user, lastPurchases, latestFromWantlist} = useLoaderData<typeof loader>();

  return (
    <>
      {user ? (
        <section id="dashboard" className="space-y-16">
          <h1>Welcome back🤘</h1>
          <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
            <Await resolve={lastPurchases}>
              {([profile, latestReleases]) => (
                <DashboardLastPurchases
                  lastPurchases={latestReleases.data.releases}
                  totalItems={profile.data.num_collection}
                />
              )}
            </Await>
          </Suspense>

          <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
            <Await resolve={latestFromWantlist}>
              {(latestFromWantlist) => <DashboardLastWanted lastWanted={latestFromWantlist.data.wants} />}
            </Await>
          </Suspense>

          {/* <section className="flex flex-col gap-4 p-4 bg-slate-100 rounded-xl max-h-60 overflow-auto overflow-x-hidden">
                {user.lastPurchased.map((release) => {
                  return (
                    <div className="flex items-center gap-4">
                      <img src={release.thumbnail} className="w-24 h-24 rounded-lg shadow-sm" />
                      <div className="flex flex-col text-xs text-slate-950">
                        <span className="font-bold">{release.artist}</span>
                        <span>{release.title}</span>
                        <span className="text-slate-600">{release.releaseType}</span>
                        <span className="text-slate-500">Purchased on {release.dateAdded}</span>
                      </div>
                    </div>
                  );
                })}
              </section> */}

          {/* <div className="space-y-1">
              <h3 className="font-bold text-slate-950 mb-4">Collection value</h3>
              <section className="grid grid-cols-3 divide-x self-stretch bg-slate-100 rounded-xl">
                <div className="flex flex-col gap-2 p-2 items-center">
                  <span className="text-slate-700 text-sm">Min</span>{' '}
                  <span className="text-slate-800 font-bold">{user.collectionMin}</span>
                </div>
                <div className="flex flex-col gap-2 p-2 items-center">
                  <span className="text-slate-700 text-sm">Median</span>{' '}
                  <span className="text-slate-800 font-bold">{user.collectionMedian}</span>
                </div>
                <div className="flex flex-col gap-2 p-2 items-center">
                  <span className="text-slate-700 text-sm">Max</span>{' '}
                  <span className="text-slate-800 font-bold">{user.collectionMax}</span>
                </div>
              </section>
            </div> */}
          <DashboardLogout />
        </section>
      ) : (
        <ul>
          <li>
            <NavLink to="/auth" className="underline">
              Login with Discogs
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
};

export default DashboardRoute;
