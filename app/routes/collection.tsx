import {Outlet, useFetcher, useLoaderData, useRouteLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, json} from '@vercel/remix';
import {useEffect, useState} from 'react';
import CollectionItems from '@/components/CollectionItems';
import useMediaQuery from '@/hooks/use-media-query';
import {Drawer, DrawerContent} from '@/components/ui/drawer';
import {authenticator} from '@/services/auth.server';
import {getReleasesFromCollection, CollectionRelease, CollectionReleasesResponse} from '@/services/discogs.api.user';
import {useInView} from 'react-intersection-observer';
import {User} from '@/services/discogs.strategy';
import {Sheet, SheetContent} from '@/components/ui/sheet';

type Data = {
  user: User;
  items: CollectionReleasesResponse;
};

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - User collection'}];
};

const getPage = (searchParams: URLSearchParams) => ({
  page: Number(searchParams.get('page') || '1'),
});

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const {page} = getPage(new URL(request.url).searchParams);
  const items: CollectionReleasesResponse = await getReleasesFromCollection(user, page);

  const data: Data = {
    user,
    items,
  };
  return json(data);
};

export const useCollectionLoaderData = () => {
  return useRouteLoaderData<typeof loader>('routes/collection');
};

const Collection = () => {
  const {items: initialItems} = useLoaderData<typeof loader>();
  const [items, setItems] = useState<CollectionRelease[]>(initialItems.releases);
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery();
  const fetcher = useFetcher<Data>();
  const {ref, inView} = useInView();

  useEffect(() => {
    if (fetcher.data) {
      const newItems = fetcher.data.items.releases;
      setItems((prevItems) => [...prevItems, ...newItems]);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (inView) {
      loadNext();
    }
  }, [inView]);

  const loadNext = () => {
    const page = fetcher.data ? fetcher.data.items.pagination.page + 1 : initialItems.pagination.page + 1;
    const query = `/collection?page=${page}`;
    fetcher.load(query);
  };

  const hasNextPage = fetcher.data ? fetcher.data.items.pagination.pages > fetcher.data.items.pagination.page : true;

  return (
    <>
      <div className="relative">
        <section id="collection" className="space-y-16 w-full">
          <CollectionItems lastPurchases={items} onClick={() => setOpen(true)} />
        </section>

        {fetcher.state === 'loading' && <div className="bg-red-100">Loading...</div>}
        {hasNextPage && <div id="collection-infinite-scroll" ref={ref} />}

        {isMobile ? (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
              <Outlet />
            </DrawerContent>
          </Drawer>
        ) : (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
              <Outlet />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </>
  );
};

export default Collection;
