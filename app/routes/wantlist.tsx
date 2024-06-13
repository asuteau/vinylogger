import {useLoaderData, Await, NavLink, Outlet} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense, useState} from 'react';
import CollectionItems from '~/components/CollectionItems';
import {Drawer, DrawerContent} from '~/components/ui/drawer';
import useMediaQuery from '~/hooks/use-media-query';
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
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery();

  return (
    <>
      {user ? (
        <div className="relative">
          <section id="wantlist" className="space-y-16 w-full md:w-1/2 pr-8">
            <Suspense fallback={<div className="h-72 w-full bg-slate-100 rounded-lg" />}>
              <Await resolve={wants}>
                {(wants) => <CollectionItems lastPurchases={wants} onClick={() => setOpen(true)} />}
              </Await>
            </Suspense>
          </section>

          {isMobile ? (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent>
                <Outlet />
              </DrawerContent>
            </Drawer>
          ) : (
            <section
              id="release-details"
              className="hidden md:flex items-center justify-center bg-gray-100 border-l border-gray-300 fixed top-0 right-0 h-full mt-20"
              style={{
                width: 'calc(50% - 200px)',
              }}
            >
              <Outlet />
            </section>
          )}
        </div>
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
