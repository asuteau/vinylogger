import {NavLink, useLocation} from '@remix-run/react';
import {CollectionRelease} from '~/services/discogs.api.user';
import {groupBy} from '~/utils/array';

type CollectionItemsProps = {
  lastPurchases: CollectionRelease[];
  onClick?: () => void;
};

type CollectionItemProps = {
  release: CollectionRelease;
  onClick?: () => void;
};

const CollectionItem = ({release, onClick}: CollectionItemProps) => {
  const location = useLocation();

  return (
    <NavLink
      to={`/${location.pathname.split('/')[1]}/${release.id}`}
      className={({isActive}) => (isActive ? 'bg-gray-200/50 rounded-md' : 'hover:bg-gray-100 rounded-md')}
      onClick={onClick}
    >
      <li className="flex justify-start items-center gap-6">
        <img src={release.coverImage} className="h-24 md:h-48 aspect-square shadow-lg" />
        <div className="flex flex-col gap-1">
          <span className="text-sm md:text-lg font-bold line-clamp-2">{release.title}</span>
          <span className="text-xs md:text-base line-clamp-2 text-slate-600 dark:text-slate-400">
            {release.format} • {release.artist}
          </span>
        </div>
      </li>
    </NavLink>
  );
};

const CollectionItems = ({lastPurchases, onClick}: CollectionItemsProps) => {
  const groupedByDate = groupBy(lastPurchases, (release) => release.addedOn);

  return (
    <>
      {Object.entries(groupedByDate).map(([addedOn, releases]) => (
        <div className="space-y-8" key={addedOn}>
          <h2>{addedOn}</h2>
          <ol className="flex flex-col gap-6">
            {releases.map((release) => (
              <CollectionItem key={release.id} release={release} onClick={onClick} />
            ))}
          </ol>
        </div>
      ))}
    </>
  );
};

export default CollectionItems;
