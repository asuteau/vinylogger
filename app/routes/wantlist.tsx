import {useLoaderData, Await, NavLink, Outlet} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer} from '@vercel/remix';
import {Suspense, useState} from 'react';
import CollectionItems from '~/components/CollectionItems';
import {Drawer, DrawerContent} from '~/components/ui/drawer';
import useMediaQuery from '~/hooks/use-media-query';
import {authenticator} from '~/services/auth.server';
import {getReleasesFromWantlist} from '~/services/discogs.api';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - User wantlist'}];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const wants = getReleasesFromWantlist(user);
  return defer({user, wants});
};

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
              className="hidden md:flex items-center justify-center border-l border-slate-300 dark:border-slate-600 fixed top-0 right-0 h-full mt-20"
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
            <NavLink to="/" className="underline">
              Back to dashboard
            </NavLink>
          </li>
        </ul>
      )}
    </>
  );
};

export default WantlistRoute;
