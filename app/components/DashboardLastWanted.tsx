import {CalendarDots} from '@phosphor-icons/react/dist/icons/CalendarDots';
import {NavLink} from '@remix-run/react';
import {Button} from '@/components/ui/button';
import {Want} from '@/services/discogs.api.user';

type DashboardLastWantedProps = {
  lastWanted: Want[];
};

const DashboardLastPurchasesItem = ({release}: {release: Want}) => {
  return (
    <div className="flex-none flex flex-col gap-1 justify-start w-32 md:w-auto">
      <div className="overflow-hidden shadow-lg">
        <img
          src={release.coverImage}
          className="w-full h-32 md:h-auto aspect-square hover:brightness-90 hover:scale-110 transition-all duration-300 ease-out"
        />
      </div>
      <span className="text-xs md:text-base font-bold line-clamp-2 mt-2 text-slate-900 dark:text-slate-50">
        {release.title}
      </span>
      <span className="text-xs md:text-base text-slate-600 dark:text-slate-400 line-clamp-2">
        {release.format} • {release.artist}
      </span>
      <div className="flex items-center text-xs md:text-base text-slate-600 dark:text-slate-400 line-clamp-2">
        <CalendarDots className="md:hidden w-4 h-4 mr-1 text-slate-600 dark:text-slate-400 inline-block" />
        {release.addedOn}
      </div>
    </div>
  );
};

const DashboardLastWanted = ({lastWanted}: DashboardLastWantedProps) => {
  return (
    <section className="last-wanted w-full">
      <div className="flex items-end mb-6">
        <h2>Recently added to wantlist</h2>
        <Button variant="link" className="hidden md:block ml-auto" asChild>
          <NavLink to="/wantlist" prefetch="intent" className="ml-auto">
            Show wantlist
          </NavLink>
        </Button>
      </div>

      <div className="flex flex-nowrap md:grid md:grid-cols-[repeat(auto-fit,_minmax(192px,_1fr))] md:auto-rows-[0] md:grid-rows-[auto] gap-6 md:gap-x-6 md:gap-y-0 overflow-x-auto no-scrollbar md:overflow-hidden">
        {lastWanted.map((release) => {
          return <DashboardLastPurchasesItem key={release.id} release={release} />;
        })}
      </div>
    </section>
  );
};

export default DashboardLastWanted;
