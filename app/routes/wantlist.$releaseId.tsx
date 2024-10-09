import ReleaseDetails from '@/components/ReleaseDetails';
import {Button} from '@/components/ui/button';
import {authenticator} from '@/services/auth.server';
import {getReleaseById} from '@/services/discogs.api.database';
import {removeReleaseFromWantlist} from '@/services/discogs.api.user';
import {Heart} from '@phosphor-icons/react/dist/icons/Heart';
import {Await, Form, NavLink, useLoaderData, useNavigation} from '@remix-run/react';
import {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, defer, json, redirect} from '@vercel/remix';
import {Suspense} from 'react';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Wantlist - Release'}];
};

// Provides data to the component
export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const releaseId = params.releaseId;
  if (!releaseId) return json({release: null});

  const release = getReleaseById(user, releaseId);
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
              <Await resolve={release}>
                {(release) => (
                  <div className="flex flex-col items-center gap-4 p-4">
                    <ReleaseDetails release={release} />

                    <Form method="post">
                      <Button className="flex gap-2" variant="default" type="submit">
                        <Heart className="h-4 w-4" />
                        Remove from wantlist
                      </Button>
                    </Form>
                  </div>
                )}
              </Await>
            </Suspense>
          )}
        </>
      ) : (
        <ul>
          <li>
            <NavLink to="/" className="underline">
              Back to dashboard
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
};

// Updates persistent data
export const action = async ({params, request}: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const releaseId = params.releaseId;
  if (!releaseId) return redirect('/');

  await removeReleaseFromWantlist(user, releaseId);
  return redirect('/wantlist');
};

export default CollectionRoute;
