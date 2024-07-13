import {Await, Form, NavLink, useLoaderData, useMatches, useNavigate} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Suspense} from 'react';
import {getClient} from '~/utils/session.server';
import {getReleaseById} from '~/services/discogs';
import {VinylRecord} from '@phosphor-icons/react/dist/icons/VinylRecord';
import {Button} from '~/components/ui/button';
import {CaretLeft} from '@phosphor-icons/react/dist/icons/CaretLeft';
import {Tag} from '@phosphor-icons/react/dist/icons/Tag';
import {Star} from '@phosphor-icons/react/dist/icons/Star';
import {extractColors} from '~/lib/utils';

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
  const navigate = useNavigate();
  // const matches = useMatches();
  // console.log(matches);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-8">
      <Button variant="default" size="icon" onClick={handleBack}>
        <CaretLeft className="h-4 w-4" />
      </Button>

      {release ? (
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-xs md:max-w-sm 2xl:max-w-lg aspect-square bg-gray-50 rounded-lg" />
          }
        >
          <Await resolve={release}>
            {(release) => (
              <div key={release.id} className="flex flex-col md:flex-row justify-start items-center gap-4">
                {release.images ? (
                  <div
                    className="bg-cover bg-center w-64 aspect-square shadow-lg"
                    style={{
                      backgroundImage: `url(${release.images[0].uri})`,
                    }}
                  />
                ) : (
                  <div className="w-64 aspect-square shadow-lg bg-gray-100 border border-gray-300 flex items-center justify-center">
                    <VinylRecord size={32} weight="duotone" className="fill-slate-900" />
                  </div>
                )}

                <div className="flex flex-col items-center md:items-start gap-4">
                  <div className="flex flex-col items-center md:items-start gap-2">
                    {release.formats && <h3 className="text-gray-950 line-clamp-1">{release.formats[0].name}</h3>}
                    {release.formats &&
                      release.formats[0].text &&
                      (() => {
                        const colors = [...new Set(extractColors(release.formats[0].text))];
                        return (
                          <div className="flex flex-col md:flex-row gap-0 md:gap-1">
                            <span className="text-gray-600 line-clamp-1">{release.formats[0].text}</span>
                            <div className="flex justify-center md:justify-start">
                              {colors.map((color) => (
                                <VinylRecord key={color} size={24} weight="duotone" color={color.toLowerCase()} />
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    <span className="text-gray-600 line-clamp-1">
                      <span>{release.year}</span> • <span>{release.country}</span>
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <Form action="have" method="post">
                      <Button className="md:hidden" variant="outline" size="icon" type="submit">
                        <Tag className="h-4 w-4" />
                      </Button>

                      <Button className="hidden md:flex gap-2" variant="outline" type="submit">
                        <Tag className="h-4 w-4" />
                        Add to collection
                      </Button>
                    </Form>

                    <Form action="want" method="post">
                      <Button className="md:hidden" variant="outline" size="icon" type="submit">
                        <Star className="h-4 w-4" />
                      </Button>

                      <Button className="hidden md:flex gap-2" variant="outline" type="submit">
                        <Star className="h-4 w-4" />
                        Add to wantlist
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          </Await>
        </Suspense>
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
  );
};

// Updates persistent data
export const action = async () => {};

export default SearchByVersionIdRoute;
