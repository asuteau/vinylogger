import {Await, NavLink, useLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import {getUser, getClient} from '~/utils/session.server';
import CollectionItems from '~/components/CollectionItems';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - User collection'}];
};

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return json({user: null, latestReleases: null});

  const client = await getClient(request);
  const latestReleases = client.user().collection().getReleases(user.username, 0, {
    per_page: 10,
    sort: 'added',
    sort_order: 'desc',
  });

  return defer({user, latestReleases});
};

// Renders the UI
const CollectionRoute = () => {
  const {user, latestReleases} = useLoaderData<typeof loader>();

  return (
    <>
      {user ? (
        <section id="collection" className="space-y-8 md:space-y-16">
          <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
            <Await resolve={latestReleases}>
              {(latestReleases) => <CollectionItems lastPurchases={latestReleases.data.releases} />}
            </Await>
          </Suspense>
        </section>
      ) : (
        <ul>
          <li>
            <NavLink to="/dashboard" className="underline">
              Back to dashboard
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
};

// Updates persistent data
export const action = async () => {};

export default CollectionRoute;
