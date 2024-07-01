import { Suspense, useEffect } from "react";
import { getMasterReleaseVersions } from "~/services/discogs";
import { getClient } from "~/utils/session.server";

type SearchResultsProps = {
  masterId: string;
};

const SearchResults = ({masterId}: SearchResultsProps) => {
  useEffect(() => {
    const client = await getClient(request);
    const releases = getMasterReleaseVersions(client, masterId, {per_page: 20});
    


  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-xs md:max-w-sm 2xl:max-w-lg aspect-square bg-gray-50 rounded-lg" />
      }
    >
      <Await resolve={releases}>
        {(releases) => (
          <ResponsiveDialog>
            <>
              {releases.versions.map((version) => {
                return (
                  <div key={version.id} className="flex justify-start items-center gap-4">
                    <img src={version.thumb} alt={version.title} className="w-24 aspect-square shadow-lg" />
                    <div className="flex flex-col">
                      <h3>{version.title}</h3>
                    </div>
                  </div>
                );
              })}
            </>
          </ResponsiveDialog>
        )}
      </Await>
    </Suspense>
  );
};

export default SearchResults;
