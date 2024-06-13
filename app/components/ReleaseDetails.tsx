import {GetReleaseResponse} from '@lionralfs/discogs-client';
import {Card, CardContent} from './ui/card';
import {Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselApi} from './ui/carousel';
import {useState, useEffect} from 'react';
import useMediaQuery from '~/hooks/use-media-query';

type ReleaseDetailsProps = {
  release: GetReleaseResponse;
};

const ReleaseDetails = ({release}: ReleaseDetailsProps) => {
  const isMobile = useMediaQuery();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.reInit();
    api.scrollTo(0);
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
  }, [release.images]);

  return (
    <div className="flex flex-col gap-4 justify-start items-center">
      <Carousel setApi={setApi} className="w-full max-w-xs md:max-w-sm 2xl:max-w-lg aspect-square">
        <CarouselContent>
          {release.images.map((image) => (
            <CarouselItem key={image.uri}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <img src={image.uri} className="object-contain max-h-xs md:max-h-sm 2xl:max-h-lg aspect-square" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {!isMobile && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      <div className="py-2 text-center text-sm text-muted-foreground">
        {current}/{count}
      </div>
    </div>
  );
};

export default ReleaseDetails;
