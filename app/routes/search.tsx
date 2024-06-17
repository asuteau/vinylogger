import {ActionFunctionArgs, LoaderFunctionArgs, defer, json} from '@vercel/remix';
import {Await, useLoaderData, useNavigate, useNavigation, useSubmit} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import {Input} from '~/components/ui/input';
import useDebounce from '~/hooks/use-debounce';
import {getClient, getUser} from '~/utils/session.server';
import {getSearchResults} from '~/services/discogs';

// Provides data to the component
export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await getUser(request);
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('search');
  if (!user || !searchTerm) return json({searchResults: null});

  const client = await getClient(request);
  const searchResults = getSearchResults(client, searchTerm, {per_page: 20});
  return defer({searchResults});
};

// Renders the UI
const SearchRoute = () => {
  const {searchResults} = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const submit = useSubmit();
  const navigation = useNavigation();

  useEffect(() => {
    submit({search: debouncedSearchTerm});
  }, [debouncedSearchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative flex flex-col w-full justify-center items-start gap-8">
      <Input
        className="sticky top-0 backdrop-blur-xl"
        placeholder="What do you want to add to your collection?"
        onChange={handleChange}
      />

      {navigation.state === 'loading' && <h3>Loading...</h3>}

      {navigation.state === 'idle' && (
        <Suspense fallback={<h3>Loading...</h3>}>
          <Await resolve={searchResults}>
            {(searchResults) =>
              searchResults ? (
                searchResults
                  .filter((result) => result.thumb)
                  .map((result) => (
                    <div key={result.id} className="flex justify-start items-center gap-4">
                      <img src={result.thumb} alt={result.title} className="w-16 h-16" />
                      <div>
                        <h3>{result.title}</h3>
                        <p>{result.year}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <h3>No results</h3>
              )
            }
          </Await>
        </Suspense>
      )}

      {/* {searchResults && (
      searchResults.map((result) => (
        <div key={result.id} className="flex items-center space-x-4">
          <img src={result.thumb} alt={result.title} className="w-16 h-16" />
          <div>
            <h2>{result.title}</h2>
            <p>{result.year}</p>
          </div>
        </div>
      ))} */}
    </div>
  );
};

// Updates persistent data
export const action = async ({request}: ActionFunctionArgs) => {};

export default SearchRoute;
