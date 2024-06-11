import {Await, NavLink, useLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import {getUser, getClient} from '~/utils/session.server';
import CollectionItems from '~/components/CollectionItems';
import {getAllFromCollection} from '~/services/discogs';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - User collection'}];
};

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return json({user: null, releases: null});

  const client = await getClient(request);
  const releases = getAllFromCollection(client, user.username, {
    per_page: 20,
    sort: 'added',
    sort_order: 'desc',
  });

  return defer({user, releases});
};

// Renders the UI
const CollectionRoute = () => {
  const {user, releases} = useLoaderData<typeof loader>();

  return (
    <>
      {user ? (
        <section id="collection" className="space-y-8 md:space-y-16">
          <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
            <Await resolve={releases}>{(releases) => <CollectionItems lastPurchases={releases} />}</Await>
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
