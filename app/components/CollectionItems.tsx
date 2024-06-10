import {CalendarDots} from '@phosphor-icons/react/dist/icons/CalendarDots';
import {NavLink} from '@remix-run/react';
import {Button} from './ui/button';

type CollectionItemsProps = {
  lastPurchases: any[];
};

const CollectionItem = ({release}: {release: any}) => {
  return (
    <div className="flex justify-start items-center gap-6">
      <img src={release.basic_information.cover_image} className="rounded-md h-32 md:h-48 aspect-square" />
      <div className="flex flex-col flex-grow-0 gap-2">
        <span className="font-bold line-clamp-1 text-slate-950 mt-2">{release.basic_information.title}</span>
        <span className="text-sm line-clamp-1 text-slate-950">
          {release.basic_information.artists.map((artist) => artist.name).join(', ')}
        </span>
        <span className="text-xs text-slate-600 line-clamp-1">
          {release.basic_information.formats.map((format) => format.name).join(', ')}
        </span>
        <span className="hidden md:block text-xs text-slate-500 line-clamp-1">
          Purchased on {new Date(release.date_added).toLocaleDateString()}
        </span>
        <span className="md:hidden text-xs text-slate-500 line-clamp-1">
          <CalendarDots className="w-4 h-4 mr-1 text-slate-500 inline-block" />
          {new Date(release.date_added).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const CollectionItems = ({lastPurchases}: CollectionItemsProps) => {
  return (
    <div className="flex flex-col gap-6">
      {lastPurchases.map((release) => {
        return <CollectionItem key={release.basic_information.id} release={release} />;
      })}
    </div>
  );
};

export default CollectionItems;
