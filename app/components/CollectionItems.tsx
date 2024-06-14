import {NavLink, useLocation} from '@remix-run/react';
import Release from '~/entities/release';
import {groupBy} from '~/utils/array';

type CollectionItemsProps = {
  lastPurchases: Release[];
  onClick?: () => void;
};

type CollectionItemProps = {
  release: Release;
  onClick?: () => void;
};

const CollectionItem = ({release, onClick}: CollectionItemProps) => {
  const location = useLocation();

  return (
    <NavLink
      to={`/${location.pathname.split('/')[1]}/${release.id}`}
      prefetch="none"
      className={({isActive}) => (isActive ? 'bg-gray-200/50 rounded-md' : 'hover:bg-gray-100 rounded-md')}
      onClick={onClick}
    >
      <li className="flex justify-start items-center gap-6">
        <img src={release.coverImage} className="h-32 md:h-48 aspect-square shadow-lg" />
        <div className="flex flex-col gap-2">
          <span className="font-bold line-clamp-1 text-slate-950">{release.title}</span>
          <span className="text-sm line-clamp-1 text-slate-950">{release.artist}</span>
          <span className="text-xs text-slate-600 line-clamp-1">{release.format}</span>
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
