import {LoaderFunctionArgs, MetaFunction, json} from '@vercel/remix';
import {Form, NavLink, useLoaderData, useNavigation} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {Tag} from '@phosphor-icons/react/dist/icons/Tag';
import {Star} from '@phosphor-icons/react/dist/icons/Star';
import {Badge} from '@/components/ui/badge';
import {authenticator} from '@/services/auth.server';
import {search} from '@/services/discogs.api.database';
import {useDebounceSubmit} from 'remix-utils/use-debounce-submit';
import SearchBar from '@/components/SearchBar';

export const meta: MetaFunction = () => {
  return [{title: 'Vinylogger'}, {name: 'description', content: 'Vinylogger - Search'}];
};

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  const url = new URL(request.url);
  const searchTerm = url.searchParams.get('q');
  if (!searchTerm) return json({searchResults: null, q: null});

  const searchResults = await search(user, searchTerm);
  return json({searchResults, q: searchTerm});
};

const SearchRoute = () => {
  const {searchResults, q} = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  let submit = useDebounceSubmit();
  const navigation = useNavigation();

  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');
  const hasSearchResults = searchResults !== null && searchResults.length > 0;
  const hasNoSearchResults = searchResults !== null && searchResults.length === 0;

  useEffect(() => {
    const searchField = document.getElementById('q');
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || '';
    }
  }, [q]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const isFirstSearch = q === null;
    submit(e.currentTarget, {replace: !isFirstSearch, debounceTimeout: 500});
  };

  return (
    <section id="search">
      <div className="p-8 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
        <Form id="search-form" className="w-full" onChange={handleSubmit} role="search">
          <SearchBar
            q={q || ''}
            searching={searching || false}
            placeholder="What vinyl are you looking for?"
            onChange={handleChange}
          />
        </Form>
      </div>

      <div className="px-8 pb-8 flex flex-col gap-4">
        {navigation.state === 'idle' &&
          hasSearchResults &&
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
                    isActive
                      ? 'bg-gray-200/50 dark:bg-gray-700/50 rounded-md'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md'
                  }
                  preventScrollReset
                >
                  <div className="flex justify-start items-center gap-4">
                    <img src={result.thumb} alt={result.title} className="h-24 md:h-24 aspect-square shadow-lg" />
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-sm md:text-lg font-bold line-clamp-2 text-slate-900 dark:text-slate-50">
                        {result.title}
                      </span>
                      <span className="text-xs md:text-base line-clamp-2 text-slate-600 dark:text-slate-400">
                        {result.year}
                      </span>
                      {result.isInCollection && (
                        <Badge variant="secondary">
                          <Tag className="h-4 w-4" />
                        </Badge>
                      )}
                      {result.isInWantlist && (
                        <Badge variant="secondary">
                          <Star className="h-4 w-4" />
                        </Badge>
                      )}
                    </div>
                  </div>
                </NavLink>
              );
            })}

        {navigation.state === 'idle' && hasNoSearchResults && <h3>Oops! No vinyl records match your search.</h3>}
      </div>
    </section>
  );
};

export default SearchRoute;
