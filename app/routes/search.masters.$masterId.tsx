import {Await, NavLink, useLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import {getClient} from '~/utils/session.server';
import {getMasterReleaseVersions} from '~/services/discogs';
import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Search - Masters'}];
};

// Provides data to the component
export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const masterId = params.masterId;
  if (!masterId) return json({releases: null, masterId: null});
  const client = await getClient(request);
  const releases = getMasterReleaseVersions(client, masterId, {per_page: 20});

  // releases.then((releases) => {
  //   releases.versions.forEach((release) => {
  //     const result = getReleaseById(client, release.id.toString());
  //     result.then((r) => {
  //       console.log('>>>>>>>>>>', r.formats.map((format) => format.text).join(', '));
  //     });
  //   });
  // });

  return defer({releases, masterId});
};

// Renders the UI
const SearchByMasterIdRoute = () => {
  const {releases, masterId} = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full justify-center items-start gap-4">
      {releases ? (
        <>
          <Suspense
            fallback={
              <div className="mx-auto w-full max-w-xs md:max-w-sm 2xl:max-w-lg aspect-square bg-gray-50 rounded-lg" />
            }
          >
            <Await resolve={releases}>
              {(releases) =>
                releases.versions
                  .sort((a, b) => (parseInt(a.released as string) > parseInt(b.released as string) ? -1 : 1))
                  .map((version) => {
                    return (
                      <NavLink
                        to={`/search/versions/${version.id}`}
                        prefetch="none"
                        className={({isActive}) =>
                          isActive ? 'bg-gray-200/50 rounded-md' : 'hover:bg-gray-100 rounded-md'
                        }
                      >
                        <div key={version.id} className="flex justify-start items-center gap-4">
                          {version.thumb ? (
                            <div
                              className="bg-cover bg-center w-24 aspect-square shadow-lg"
                              style={{
                                backgroundImage: `url(${version.thumb})`,
                              }}
                            />
                          ) : (
                            <div className="w-24 aspect-square shadow-lg bg-gray-100 border border-gray-300 flex items-center justify-center">
                              <VinylRecord size={32} weight="duotone" className="fill-slate-900" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            {version.major_formats && (
                              <h3 className="text-gray-950 line-clamp-1">{version.major_formats[0]}</h3>
                            )}
                            {version.format && <p className="text-gray-600">{version.format}</p>}
                            <p className="text-gray-600">
                              <span>{version.released}</span> • <span>{version.country}</span>
                            </p>
                          </div>
                        </div>
                      </NavLink>
                    );
                  })
              }
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
    </div>
  );
};

// Updates persistent data
export const action = async () => {};

export default SearchByMasterIdRoute;
