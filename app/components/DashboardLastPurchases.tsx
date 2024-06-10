import {CalendarDots} from '@phosphor-icons/react/dist/icons/CalendarDots';
import {NavLink} from '@remix-run/react';
import {Button} from './ui/button';
import {timeFromNow} from '~/utils/dates';

type DashboardLastPurchasesProps = {
  totalItems: number;
  lastPurchases: any[];
};

const DashboardLastPurchasesItem = ({release}: {release: any}) => {
  return (
    <div className="flex-none flex flex-col justify-start w-32 md:w-auto">
      <div className="overflow-hidden rounded-md">
        <img
          src={release.basic_information.cover_image}
          className="w-full h-32 md:h-auto aspect-square hover:scale-110 transition-transform duration-300 ease-out"
        />
      </div>
      <span className="font-bold line-clamp-1 text-slate-950 mt-2">{release.basic_information.title}</span>
      <span className="text-sm line-clamp-1 text-slate-950">
        {release.basic_information.artists.map((artist) => artist.name).join(', ')}
      </span>
      <span className="text-xs text-slate-600 line-clamp-1">
        {release.basic_information.formats.map((format) => format.name).join(', ')}
      </span>
      <span className="hidden md:block text-xs text-slate-500 line-clamp-1">
        Purchased {timeFromNow(release.date_added)}
      </span>
      <span className="md:hidden text-xs text-slate-500 line-clamp-1">
        <CalendarDots className="w-4 h-4 mr-1 text-slate-500 inline-block" />
        {timeFromNow(release.date_added)}
      </span>
    </div>
  );
};

const DashboardLastPurchases = ({totalItems, lastPurchases}: DashboardLastPurchasesProps) => {
  return (
    <section className="last-purchases w-full">
      <div className="flex items-end mb-6">
        <h2 className="font-bold text-slate-800">Recently purchased</h2>
        <Button variant="link" className="hidden md:block ml-auto" asChild>
          <NavLink to="/collection" prefetch="intent">
            Show collection
          </NavLink>
        </Button>
      </div>
      {/* <h3 className="text-slate-600 pb-4">
        <b>{totalItems}</b> releases in collection
      </h3> */}

      <div className="flex flex-nowrap md:grid md:grid-cols-[repeat(auto-fit,_minmax(192px,_1fr))] md:auto-rows-[0] md:grid-rows-[auto] gap-6 md:gap-x-6 md:gap-y-0 overflow-x-auto no-scrollbar md:overflow-hidden">
        {lastPurchases.map((release) => {
          return <DashboardLastPurchasesItem key={release.basic_information.id} release={release} />;
        })}
      </div>
    </section>
  );
};

export default DashboardLastPurchases;
