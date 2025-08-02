
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
import { useEffect, useState, useRef } from 'react';
import { Button } from './ui/button';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { MediaItem as MediaItemType } from '@/lib/file-utils';
import { useSession } from '@/hooks/use-session';
import { cn } from '@/lib/utils';

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
  const [zoom, setZoom] = useState(1);
  const [panning, setPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!api) return;
 
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    });
  }, [api]);

  useEffect(() => {
    if(isOpen && api) {
        api.scrollTo(startIndex, true);
    }
  }, [isOpen, api, startIndex]);
  
  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setTimeout(() => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      }, 200); // delay to allow for closing animation
    }
  }, [isOpen]);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[current-1];

  const getMediaUrl = (item: MediaItemType) => {
    if (!item || !user) return '';
    return `/api/media?path=${encodeURIComponent(item.path)}&file=${encodeURIComponent(item.name)}&user=${encodeURIComponent(user.email)}`;
  }
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setPanning(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseUp = () => {
    setPanning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!panning) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl w-full h-[90vh] bg-black/80 backdrop-blur-sm border-0 p-0 flex flex-col"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <DialogHeader className="p-4 text-white flex-row flex justify-between items-center z-10 shrink-0">
          <DialogTitle>{currentItem?.name}</DialogTitle>
           {currentItem?.type === 'image' && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setZoom(z => z + 0.2)}>
                <ZoomIn className="h-5 w-5" />
              </Button>
               <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setZoom(z => Math.max(1, z - 0.2))}>
                <ZoomOut className="h-5 w-5" />
              </Button>
               <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white" onClick={() => { setZoom(1); setPosition({x: 0, y: 0})}}>
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
           )}
          <div className="flex items-center gap-4">
            <div className="text-center text-sm text-muted-foreground">
              {current > 0 ? `${current} of ${count}` : ''}
            </div>
            <DialogClose asChild>
               <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 hover:text-white">
                  <X className="h-6 w-6" />
               </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center min-h-0 relative">
          <Carousel setApi={setApi} className="w-full h-full" opts={{
            startIndex: startIndex,
            loop: items.length > 1,
            draggable: zoom <= 1,
          }}>
            <CarouselContent className="h-full">
              {items.map((item, index) => (
                <CarouselItem key={index} className="h-full w-full flex items-center justify-center p-6">
                    {item.type === 'image' && (
                        <div 
                          className="w-full h-full flex items-center justify-center overflow-hidden" 
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                        >
                          <img
                              src={getMediaUrl(item)}
                              alt={item.name}
                              className={cn(
                                "object-contain max-w-full max-h-full transition-transform duration-200",
                                zoom > 1 && panning && 'cursor-grabbing',
                                zoom > 1 && !panning && 'cursor-grab'
                              )}
                              style={{
                                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                                transformOrigin: 'center center',
                              }}
                              data-ai-hint="gallery full"
                          />
                        </div>
                    )}
                    {item.type === 'video' && (
                        <div className="w-full h-full flex items-center justify-center">
                            <video
                                src={getMediaUrl(item)}
                                controls
                                autoPlay
                                className="object-contain max-w-full max-h-full"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                </CarouselItem>
              ))}
            </CarouselContent>
            {items.length > 1 && (
                <>
                    <CarouselPrevious className="absolute left-4 text-white bg-black/50 hover:bg-black/80 border-0 disabled:opacity-30" />
                    <CarouselNext className="absolute right-4 text-white bg-black/50 hover:bg-black/80 border-0 disabled:opacity-30" />
                </>
            )}
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
