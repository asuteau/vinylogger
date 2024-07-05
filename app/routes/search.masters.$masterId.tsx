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
import {Badge} from '~/components/ui/badge';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Search - Masters'}];
};

// Provides data to the component
export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const masterId = params.masterId;
  if (!masterId) return json({releases: null, masterId: null});
  const client = await getClient(request);
  const releases = getMasterReleaseVersions(client, masterId, {per_page: 20});
  // releases.then((r) => console.log('>>>>>>>>>>', r.versions));

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
    <div className="flex flex-col w-full justify-center items-start gap-8">
      <Button variant="default" size="icon" onClick={handleBack}>
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
                          key={version.id}
                          to={`/search/versions/${version.id}`}
                          prefetch="none"
                          className={({isActive}) =>
                            isActive ? 'bg-gray-200/50 rounded-md' : 'hover:bg-gray-100 rounded-md'
                          }
                          preventScrollReset
                        >
                          <div className="flex justify-start items-center gap-4">
                            {version.thumb ? (
                              <img className="bg-cover bg-center w-24 aspect-square shadow-lg" src={version.thumb} />
                            ) : (
                              <div className="w-24 aspect-square shadow-lg bg-gray-100 border border-gray-300 flex items-center justify-center">
                                <VinylRecord size={32} weight="duotone" className="fill-slate-900 opacity-50" />
                              </div>
                            )}

                            <div className="flex flex-col items-start">
                              {version.major_formats && (
                                <h3 className="text-gray-950 line-clamp-1">{version.major_formats[0]}</h3>
                              )}
                              {version.format && (
                                <span className="text-gray-600 line-clamp-1">
                                  {version.format.replaceAll(', ', ' • ')}
                                </span>
                              )}
                              <span className="text-gray-600 line-clamp-1">
                                <span>{version.released}</span> • <span>{version.country}</span>
                              </span>
                              {version.stats.user.in_collection > 0 && (
                                <Badge variant="secondary">
                                  <Tag className="h-4 w-4" />
                                </Badge>
                              )}
                              {version.stats.user.in_wantlist > 0 && (
                                <Badge variant="secondary">
                                  <Star className="h-4 w-4" />
                                </Badge>
                              )}
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
