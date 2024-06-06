import {CalendarDots} from '@phosphor-icons/react/dist/icons/CalendarDots';
import {NavLink} from '@remix-run/react';

type DashboardLastWantedProps = {
  lastWanted: any[];
};

const DashboardLastPurchasesItem = ({release}: {release: any}) => {
  return (
    <div className="flex-none flex flex-col justify-start w-32 md:w-auto">
      <img
        src={release.basic_information.cover_image}
        className="w-full h-32 md:h-auto rounded-md shadow-sm aspect-square"
      />
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

      <div className="flex flex-nowrap md:grid md:grid-cols-[repeat(auto-fit,_minmax(192px,_1fr))] md:auto-rows-[0] md:grid-rows-[auto] gap-6 md:gap-x-6 md:gap-y-0 overflow-x-auto md:overflow-hidden">
        {lastWanted.map((release) => {
          return <DashboardLastPurchasesItem key={release.basic_information.id} release={release} />;
        })}
      </div>
    </section>
  );
};

export default DashboardLastWanted;
