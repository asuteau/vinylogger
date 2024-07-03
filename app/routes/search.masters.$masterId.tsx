import {Await, NavLink, useLoaderData, useNavigate} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import {getClient} from '~/utils/session.server';
import {getMasterReleaseVersions} from '~/services/discogs';
import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
import {Tag} from '@phosphor-icons/react/dist/icons/Tag';
import {Star} from '@phosphor-icons/react/dist/icons/Star';
import {CaretLeft} from '@phosphor-icons/react/dist/icons/CaretLeft';
import {Button} from '~/components/ui/button';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Search - Masters'}];
};

// Provides data to the component
export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const masterId = params.masterId;
  if (!masterId) return json({releases: null, masterId: null});
  const client = await getClient(request);
  const releases = getMasterReleaseVersions(client, masterId, {per_page: 20});
  releases.then((r) => console.log('>>>>>>>>>>', r.versions));

  return defer({releases, masterId});
};

// Renders the UI
const SearchByMasterIdRoute = () => {
  const {releases, masterId} = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col w-full justify-center items-start gap-4">
      <Button variant="outline" size="icon" onClick={handleBack}>
        <CaretLeft className="h-4 w-4" />
      </Button>

      {releases ? (
        <>
          <Suspense
            fallback={
              <div className="mx-auto w-full max-w-xs md:max-w-sm 2xl:max-w-lg aspect-square bg-gray-50 rounded-lg" />
            }
          >
            <Await resolve={releases}>
              {(releases) => {
                return releases.versions.length ? (
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
                              {version.format && (
                                <p className="text-gray-600 line-clamp-1">{version.format.replaceAll(', ', ' • ')}</p>
                              )}
                              <p className="text-gray-600 line-clamp-1">
                                <span>{version.released}</span> • <span>{version.country}</span>
                              </p>
                              {version.stats.user.in_collection > 0 && <Tag weight="bold" className="h-5 w-5" />}
                              {version.stats.user.in_wantlist > 0 && <Star weight="bold" className="h-5 w-5" />}
                            </div>
                          </div>
                        </NavLink>
                      );
                    })
                ) : (
                  <>No vinyl version for this release</>
                );
              }}
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
