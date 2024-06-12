import {Await, NavLink, useLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import {getClient} from '~/utils/session.server';
import {getReleaseById} from '~/services/discogs';
import ReleaseDetails from '~/components/ReleaseDetails';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Wantlist - Release'}];
};

// Provides data to the component
export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const releaseId = params.releaseId;
  if (!releaseId) return json({release: null});
  const client = await getClient(request);
  const release = getReleaseById(client, releaseId);

  return defer({release});
};

// Renders the UI
const CollectionRoute = () => {
  const {release} = useLoaderData<typeof loader>();

  return (
    <>
      {release ? (
        <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
          <Await resolve={release}>{(release) => <ReleaseDetails release={release} />}</Await>
        </Suspense>
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
