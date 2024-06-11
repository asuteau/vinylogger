import {useLoaderData, Await, NavLink} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import CollectionItems from '~/components/CollectionItems';
import {getAllFromWantlist} from '~/services/discogs';
import {getUser, getClient} from '~/utils/session.server';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - User wantlist'}];
};

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await getUser(request);
  if (!user) return json({user: null, wants: null});

  const client = await getClient(request);
  const wants = getAllFromWantlist(client, user.username, {
    per_page: 20,
  });

  return defer({user, wants});
};

// Renders the UI
const WantlistRoute = () => {
  const {user, wants} = useLoaderData<typeof loader>();

  return (
    <>
      {user ? (
        <section id="collection" className="space-y-8 md:space-y-16">
          <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
            <Await resolve={wants}>{(wants) => <CollectionItems lastPurchases={wants} />}</Await>
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
