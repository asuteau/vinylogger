import {CalendarDots} from '@phosphor-icons/react/dist/icons/CalendarDots';
import {NavLink} from '@remix-run/react';
import {Button} from './ui/button';
import {timeFromNow} from '~/utils/dates';
import Release from '~/entities/release';

type DashboardLastPurchasesProps = {
  totalItems: number;
  lastPurchases: Release[];
};

const DashboardLastPurchasesItem = ({release}: {release: Release}) => {
  return (
    <div className="flex-none flex flex-col justify-start w-32 md:w-auto">
      <div className="overflow-hidden shadow-lg">
        <img
          src={release.coverImage}
          className="w-full h-32 md:h-auto aspect-square hover:brightness-90 hover:scale-110 transition-all duration-300 ease-out"
        />
      </div>
      <span className="font-bold line-clamp-1 text-slate-950 mt-2">{release.title}</span>
      <span className="text-sm line-clamp-1 text-slate-950">{release.artist}</span>
      <span className="text-xs text-slate-600 line-clamp-1">{release.format}</span>
      <span className="hidden md:block text-xs text-slate-500 line-clamp-1">Purchased {release.addedOn}</span>
      <span className="md:hidden text-xs text-slate-500 line-clamp-1">
        <CalendarDots className="w-4 h-4 mr-1 text-slate-500 inline-block" />
        {release.addedOn}
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
          return <DashboardLastPurchasesItem key={release.id} release={release} />;
        })}
      </div>
    </section>
  );
};

export default DashboardLastPurchases;
