import {Await, NavLink, useLoaderData, useNavigation} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import {getClient} from '~/utils/session.server';
import {getReleaseById} from '~/services/discogs';
import ReleaseDetails from '~/components/ReleaseDetails';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - User collection - Release'}];
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
  const navigation = useNavigation();

  return (
    <>
      {release ? (
        <>
          {navigation.state === 'loading' && (
            <div className="mx-auto w-full max-w-xs md:max-w-sm 2xl:max-w-lg aspect-square bg-gray-50 rounded-lg" />
          )}

          {navigation.state === 'idle' && (
            <Suspense
              fallback={
                <div className="mx-auto w-full max-w-xs md:max-w-sm 2xl:max-w-lg aspect-square bg-gray-50 rounded-lg" />
              }
            >
              <Await resolve={release}>{(release) => <ReleaseDetails release={release} />}</Await>
            </Suspense>
          )}
        </>
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
