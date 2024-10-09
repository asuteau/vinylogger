import {CollectionRelease} from '@/services/discogs.api.user';
import {CalendarDots} from '@phosphor-icons/react/dist/icons/CalendarDots';
import {useEffect, useState} from 'react';
import {Carousel, CarouselApi, CarouselContent, CarouselItem} from './ui/carousel';

type DashboardLastPurchasesProps = {
  lastPurchases: CollectionRelease[];
};

const DashboardLastPurchasesItem = ({release}: {release: CollectionRelease}) => {
  return (
    <div className="flex-none flex flex-col gap-1 justify-start w-32 md:w-auto">
      <div className="overflow-hidden shadow-lg">
        <img
          src={release.coverImage}
          alt="cover"
          className="w-full h-32 md:h-auto aspect-square hover:brightness-90 hover:scale-110 transition-all duration-300 ease-out"
        />
      </div>
      <span className="text-xs md:text-base font-bold line-clamp-2 text-slate-900 dark:text-slate-50 mt-2">
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

const DashboardLastPurchases = ({lastPurchases}: DashboardLastPurchasesProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [currentRelease, setCurrentRelease] = useState<CollectionRelease>(lastPurchases[current]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCurrentRelease(lastPurchases[api.selectedScrollSnap()]);
    });
  }, [api, lastPurchases]);

  return (
    <div className="flex flex-col h-full items-center justify-center md:justify-start">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
        }}
        orientation="vertical"
        className="aspect-square overflow-hidden w-full max-w-md"
      >
        <CarouselContent className="h-[400px] items-center">
          {lastPurchases.map((release) => {
            return (
              <CarouselItem key={release.id} className="pt-14">
                <div className="backlight" style={{backgroundImage: `url(${release.coverImage})`}}></div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <div className="px-4 flex flex-col gap-2 text-center items-center">
        <span className="text-2xl font-bold line-clamp-1">{currentRelease.title}</span>
        <span className="text-base text-muted-foreground line-clamp-1">{currentRelease.artist}</span>
        <div className="flex gap-2 items-center mt-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">{currentRelease.addedOn}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardLastPurchases;
