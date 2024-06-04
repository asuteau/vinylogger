import {CalendarDots} from '@phosphor-icons/react/dist/icons/CalendarDots';
import {NavLink} from '@remix-run/react';

type DashboardLastWantedProps = {
  lastWanted: any[];
};

const DashboardLastPurchasesItem = ({release}: {release: any}) => {
  return (
    <div className="flex-none flex flex-col justify-start w-32 md:w-48">
      <img src={release.basic_information.cover_image} className="w-full h-32 md:h-48 rounded-md shadow-sm" />
      <span className="font-bold line-clamp-1 text-gray-950 mt-2">{release.basic_information.title}</span>
      <span className="text-sm line-clamp-1 text-gray-950">
        {release.basic_information.artists.map((artist) => artist.name).join(', ')}
      </span>
      <span className="text-xs text-gray-600 line-clamp-1">
        {release.basic_information.formats.map((format) => format.name).join(', ')}
      </span>
      <span className="hidden md:block text-xs text-gray-500 line-clamp-1">
        Added on {new Date(release.date_added).toLocaleDateString()}
      </span>
      <span className="md:hidden text-xs text-gray-500 line-clamp-1">
        <CalendarDots className="w-4 h-4 mr-1 text-gray-500 inline-block" />
        {new Date(release.date_added).toLocaleDateString()}
      </span>
    </div>
  );
};

const DashboardLastWanted = ({lastWanted}: DashboardLastWantedProps) => {
  return (
    <section className="last-wanted w-full">
      <div className="flex items-end mb-6">
        <h2 className="font-bold text-gray-800">Recently added to wantlist</h2>
        <NavLink to="/wantlist" prefetch="intent" className="hidden md:block text-sm text-gray-600 ml-auto">
          Show wantlist
        </NavLink>
      </div>

      <div className="flex flex-nowrap gap-6 overflow-x-auto">
        {lastWanted.map((release) => {
          return <DashboardLastPurchasesItem key={release.basic_information.id} release={release} />;
        })}
      </div>
    </section>
  );
};

export default DashboardLastWanted;
