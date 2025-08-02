'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { MediaItem as MediaItemType } from '@/lib/file-utils';
import { useSession } from '@/hooks/use-session';

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  items: MediaItemType[];
  startIndex?: number;
}

export default function MediaViewer({ isOpen, onClose, items, startIndex = 0 }: MediaViewerProps) {
  const { user } = useSession();
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  useEffect(() => {
    if(isOpen && api) {
        api.scrollTo(startIndex, true);
    }
  }, [isOpen, api, startIndex])

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[current-1];

  const getMediaUrl = (item: MediaItemType) => {
    if (!item || !user) return '';
    return `/api/media?path=${encodeURIComponent(item.path)}&file=${encodeURIComponent(item.name)}&user=${encodeURIComponent(user.email)}`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-full max-h-[90vh] bg-black/80 backdrop-blur-sm border-0 p-0 flex flex-col">
        <DialogHeader className="p-4 text-white flex-row flex justify-between items-center">
          <DialogTitle>{currentItem?.name}</DialogTitle>
          <div className="text-center text-sm text-muted-foreground">
            {current} of {count}
          </div>
          <DialogClose asChild>
             <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 hover:text-white">
                <X className="h-6 w-6" />
             </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center min-h-0">
          <Carousel setApi={setApi} className="w-full h-full" opts={{
            startIndex: startIndex,
            loop: true,
          }}>
            <CarouselContent className="h-full">
              {items.map((item, index) => (
                <CarouselItem key={index} className="flex items-center justify-center">
                    {item.type === 'image' && (
                        <Image
                            src={getMediaUrl(item)}
                            alt={item.name}
                            width={1920}
                            height={1080}
                            className="object-contain max-w-full max-h-full"
                            data-ai-hint="gallery full"
                            unoptimized
                        />
                    )}
                    {item.type === 'video' && (
                        <video
                            src={getMediaUrl(item)}
                            controls
                            autoPlay
                            className="object-contain max-w-full max-h-full"
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 text-white bg-black/50 hover:bg-black/80 border-0" />
            <CarouselNext className="absolute right-4 text-white bg-black/50 hover:bg-black/80 border-0" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
