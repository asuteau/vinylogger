import {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, defer, json} from '@vercel/remix';
import {Await, Form, NavLink, useLoaderData, useNavigation, useSubmit} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import {Input} from '~/components/ui/input';
import useDebounce from '~/hooks/use-debounce';
import {getClient, getUser} from '~/utils/session.server';
import {getSearchResults} from '~/services/discogs';
import {Tag} from '@phosphor-icons/react/dist/icons/Tag';
import {Star} from '@phosphor-icons/react/dist/icons/Star';
import {Badge} from '~/components/ui/badge';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Search'}];
};

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await getUser(request);
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('search');
  if (!user || !searchTerm) return json({searchResults: null, lastSearch: null});

  const client = await getClient(request);
  const searchResults = getSearchResults(client, searchTerm, {per_page: 20});
  return defer({searchResults, lastSearch: searchTerm});
};

// Renders the UI
const SearchRoute = () => {
  const {searchResults, lastSearch} = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const submit = useSubmit();
  const navigation = useNavigation();

  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('search');

  // useEffect(() => {
  //   const searchField = document.getElementById('search');
  //   if (searchField instanceof HTMLInputElement) {
  //     searchField.value = lastSearch || '';
  //   }
  // }, [lastSearch]);

  useEffect(() => {
    submit({search: debouncedSearchTerm});
  }, [debouncedSearchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative flex flex-col w-full justify-center items-start gap-4">
      <Form
        id="search-form"
        className="w-full"
        onChange={(event) => {
          const isFirstSearch = lastSearch === null;
          submit(event.currentTarget, {replace: !isFirstSearch});
        }}
        role="search"
      >
        <Input
          className="sticky top-0 backdrop-blur-xl"
          placeholder="What do you want to add to your collection?"
          defaultValue={lastSearch || ''}
          id="search"
          name="search"
          onChange={handleChange}
        />
      </Form>

      {navigation.state === 'loading' && <h3>Loading...</h3>}

      {navigation.state === 'idle' && (
        <Suspense fallback={<h3>Loading...</h3>}>
          <Await resolve={searchResults}>
            {(searchResults) =>
              searchResults ? (
                searchResults
                  .filter((result) => {
                    const title = result.title.toLowerCase();
                    return searchTerm
                      .toLowerCase()
                      .split(' ')
                      .every((word) => title.includes(word));
                  })
                  .sort((a, b) => (parseInt(a.year as string) > parseInt(b.year as string) ? -1 : 1))
                  .map((result) => {
                    return (
                      <NavLink
                        key={result.id}
                        to={`/search/masters/${result.id}`}
                        prefetch="none"
                        className={({isActive}) =>
                          isActive ? 'bg-gray-200/50 rounded-md' : 'hover:bg-gray-100 rounded-md'
                        }
                      >
                        <div className="flex justify-start items-center gap-4">
                          <img src={result.thumb} alt={result.title} className="w-24 aspect-square shadow-lg" />
                          <div className="flex flex-col items-start">
                            <h3 className="line-clamp-1">{result.title}</h3>
                            <span className="flex items-center">{result.year}</span>
                            {result.user_data.in_collection && (
                              <Badge variant="secondary">
                                <Tag className="h-4 w-4" />
                              </Badge>
                            )}
                            {result.user_data.in_wantlist && (
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
                <h3>No results</h3>
              )
            }
          </Await>
        </Suspense>
      )}
    </div>
  );
};

// Updates persistent data
export const action = async ({request}: ActionFunctionArgs) => {};

export default SearchRoute;
