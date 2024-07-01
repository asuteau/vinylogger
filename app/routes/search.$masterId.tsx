import {Await, NavLink, useLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import {getClient} from '~/utils/session.server';
import {getMasterReleaseVersions, getReleaseById} from '~/services/discogs';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Search - Releases'}];
};

// Provides data to the component
export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const masterId = params.masterId;
  if (!masterId) return json({releases: null});
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

  return defer({releases});
};

// Renders the UI
const SearchByMasterIdRoute = () => {
  const {releases} = useLoaderData<typeof loader>();

  return (
    <>
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
                      <div key={version.id} className="flex justify-start items-center gap-4">
                        <img src={version.thumb} alt={version.title} className="w-24 aspect-square shadow-lg" />
                        <div className="flex flex-col">
                          {version.major_formats && (
                            <h3 className="text-gray-950 line-clamp-1">
                              {version.major_formats[0]} {version.format && <>({version.format})</>}
                            </h3>
                          )}
                          <p className="text-gray-600 flex items-center">{version.released}</p>
                        </div>
                      </div>
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
    </>
  );
};

// Updates persistent data
export const action = async () => {};

export default SearchByMasterIdRoute;
