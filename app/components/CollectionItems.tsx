import {CalendarDots} from '@phosphor-icons/react/dist/icons/CalendarDots';
import Release from '~/entities/release';
import {groupBy} from '~/utils/array';

type CollectionItemsProps = {
  lastPurchases: Release[];
};

const CollectionItem = ({release}: {release: Release}) => {
  return (
    <div className="flex justify-start items-center gap-6">
      <img src={release.coverImage} className="rounded-md h-32 md:h-48 aspect-square" />
      <div className="flex flex-col gap-2">
        <span className="font-bold line-clamp-1 text-slate-950">{release.title}</span>
        <span className="text-sm line-clamp-1 text-slate-950">{release.artist}</span>
        <span className="text-xs text-slate-600 line-clamp-1">{release.format}</span>
        <span className="hidden md:block text-xs text-slate-500 line-clamp-1">Added {release.addedOn}</span>
        <span className="md:hidden text-xs text-slate-500 line-clamp-1">
          <CalendarDots className="w-4 h-4 mr-1 text-slate-500 inline-block" />
          {release.addedOn}
        </span>
      </div>
    </div>
  );
};

const CollectionItems = ({lastPurchases}: CollectionItemsProps) => {
  const groupedByDate = groupBy(lastPurchases, (release) => release.addedOn);

  return (
    <div className="space-y-16">
      {Object.entries(groupedByDate).map(([addedOn, releases]) => (
        <div className="space-y-8">
          <h2>{addedOn}</h2>
          <ul className="flex flex-col gap-6">
            {releases.map((release) => (
              <CollectionItem key={release.id} release={release} />
            ))}
          </ul>
        </div>
      ))}

      {/* {lastPurchases.map((release) => {
        return <CollectionItem key={release.id} release={release} />;
      })} */}
    </div>
  );
};

export default CollectionItems;
