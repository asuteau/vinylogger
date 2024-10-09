import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {authenticator} from '@/services/auth.server';
import {getMasterReleaseVersions} from '@/services/discogs.api.database';
import {CaretLeft} from '@phosphor-icons/react/dist/icons/CaretLeft';
import {Heart} from '@phosphor-icons/react/dist/icons/Heart';
import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
import {Await, NavLink, useLoaderData, useNavigate} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Search - Masters'}];
};

// Provides data to the component
export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const masterId = params.masterId;
  if (!masterId) return json({versions: null, masterId: null});

  const versions = getMasterReleaseVersions(user, masterId);
  return defer({versions, masterId});
};

// Renders the UI
const SearchByMasterIdRoute = () => {
  const {versions, masterId} = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section id="search-by-master">
      <div className="p-8 sticky top-0 bg-slate-50/90 dark:bg-slate-700/90 backdrop-blur-sm">
        <Button variant="outline" size="icon" onClick={handleBack}>
          <CaretLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col w-full gap-4 px-8 pb-8">
        {versions ? (
          <>
            <Suspense
              fallback={
                <div className="mx-auto w-full max-w-xs md:max-w-sm 2xl:max-w-lg aspect-square bg-gray-50 rounded-lg" />
              }
            >
              <Await resolve={versions}>
                {(versions) => {
                  return versions.length ? (
                    versions.map((version) => {
                      return (
                        <NavLink
                          key={version.id}
                          to={`/search/versions/${version.id}`}
                          prefetch="none"
                          className={({isActive}) =>
                            isActive
                              ? 'bg-gray-200/50 dark:bg-gray-700/50 rounded-md'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md'
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
                              {version.majorFormat && (
                                <span className="text-sm md:text-lg font-bold line-clamp-2">{version.majorFormat}</span>
                              )}
                              {version.format && (
                                <span className="text-xs md:text-base line-clamp-2 text-slate-600 dark:text-slate-400">
                                  {version.format}
                                </span>
                              )}
                              <span className="text-xs md:text-base line-clamp-2 text-slate-600 dark:text-slate-400">
                                <span>{version.released}</span> • <span>{version.country}</span>
                              </span>
                              {version.isInCollection && (
                                <Badge variant="secondary">
                                  <VinylRecord className="h-4 w-4" />
                                </Badge>
                              )}
                              {version.isInWantlist && (
                                <Badge variant="secondary">
                                  <Heart className="h-4 w-4" />
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
              <NavLink to="/" className="underline">
                Back to dashboard
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
};

// Updates persistent data
export const action = async () => {};

export default SearchByMasterIdRoute;
