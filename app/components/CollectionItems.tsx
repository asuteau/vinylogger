import Release from '~/entities/release';
import {groupBy} from '~/utils/array';

type CollectionItemsProps = {
  lastPurchases: Release[];
};

const CollectionItem = ({release}: {release: Release}) => {
  return (
    <div className="flex justify-start items-center gap-6">
      <img src={release.coverImage} className="rounded-md h-32 md:h-48 aspect-square shadow-lg" />
      <div className="flex flex-col gap-2">
        <span className="font-bold line-clamp-1 text-slate-950">{release.title}</span>
        <span className="text-sm line-clamp-1 text-slate-950">{release.artist}</span>
        <span className="text-xs text-slate-600 line-clamp-1">{release.format}</span>
      </div>
    </div>
  );
};

const CollectionItems = ({lastPurchases}: CollectionItemsProps) => {
  const groupedByDate = groupBy(lastPurchases, (release) => release.addedOn);

  return (
    <div className="space-y-16">
      {Object.entries(groupedByDate).map(([addedOn, releases]) => (
        <div className="space-y-8" key={addedOn}>
          <h2>{addedOn}</h2>
          <ul className="flex flex-col gap-6">
            {releases.map((release) => (
              <CollectionItem key={release.id} release={release} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CollectionItems;
