import {useLoaderData, Await, NavLink} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import CollectionItems from '~/components/CollectionItems';
import {useUserContext} from '~/contexts/user-context';
import {getUser, getClient} from '~/utils/session.server';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - User wantlist'}];
};

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return json({user: null, latestFromWantlist: null});

  const client = await getClient(request);
  const latestFromWantlist = client.user().wantlist().getReleases(user.username, {per_page: 10});

  return defer({user, latestFromWantlist});
};

// Renders the UI
const WantlistRoute = () => {
  const {user, latestFromWantlist} = useLoaderData<typeof loader>();

  return (
    <>
      {user ? (
        <section id="collection" className="space-y-8 md:space-y-16">
          <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
            <Await resolve={latestFromWantlist}>
              {(latestFromWantlist) => <CollectionItems lastPurchases={latestFromWantlist.data.wants} />}
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

export default WantlistRoute;
