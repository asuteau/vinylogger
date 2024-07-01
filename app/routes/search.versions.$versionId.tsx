import {Await, NavLink, useLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import {getClient} from '~/utils/session.server';
import {getReleaseById} from '~/services/discogs';
import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Search - Versions'}];
};

// Provides data to the component
export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const versionId = params.versionId;
  if (!versionId) return json({release: null, versionId: null});
  const client = await getClient(request);
  const release = getReleaseById(client, versionId);

  // release.then((r) => console.log('>>>>>>>>>>', r));

  return defer({release, versionId});
};

// Renders the UI
const SearchByVersionIdRoute = () => {
  const {release, versionId} = useLoaderData<typeof loader>();

  return (
    <>
      {release ? (
        <>
          <Suspense
            fallback={
              <div className="mx-auto w-full max-w-xs md:max-w-sm 2xl:max-w-lg aspect-square bg-gray-50 rounded-lg" />
            }
          >
            <Await resolve={release}>
              {(release) => (
                <div key={release.id} className="flex justify-start items-center gap-4">
                  {release.images ? (
                    <div
                      className="bg-cover bg-center w-48 aspect-square shadow-lg"
                      style={{
                        backgroundImage: `url(${release.images[0].uri})`,
                      }}
                    />
                  ) : (
                    <div className="w-48 aspect-square shadow-lg bg-gray-100 border border-gray-300 flex items-center justify-center">
                      <VinylRecord size={32} weight="duotone" className="fill-slate-900" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    {release.formats && <h3 className="text-gray-950 line-clamp-1">{release.formats[0].name}</h3>}
                    {release.formats && <p className="text-gray-600">{release.formats[0].text}</p>}
                    <p className="text-gray-600">
                      <span>{release.year}</span> • <span>{release.country}</span>
                    </p>
                  </div>
                </div>
              )}
            </Await>
          </Suspense>
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

export default SearchByVersionIdRoute;
