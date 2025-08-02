'use client';

import Image from 'next/image';
import { Folder, Film, FileImage, CheckCircle2, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { MediaItem as MediaItemType } from '@/lib/data';

interface MediaItemProps {
  item: MediaItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: () => void;
}

export default function MediaItem({ item, isSelected, onSelect, onDoubleClick }: MediaItemProps) {
  const Icon = item.type === 'folder' ? Folder : item.type === 'image' ? FileImage : Film;

  return (
    <Card
      className={cn(
        'group relative cursor-pointer transition-all duration-200 ease-in-out',
        isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'ring-0'
      )}
      onClick={() => onSelect(item.id)}
      onDoubleClick={onDoubleClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square w-full relative overflow-hidden rounded-t-lg">
          {item.type === 'folder' ? (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Folder className="h-16 w-16 text-muted-foreground/50" />
            </div>
          ) : item.type === 'image' ? (
            <Image
              src={item.url || 'https://placehold.co/400x400.png'}
              alt={item.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              data-ai-hint="gallery photo"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Film className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          {isSelected && (
             <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <CheckCircle2 className="h-4 w-4" />
             </div>
          )}
          {item.isFavorite && !isSelected && (
             <div className="absolute top-2 right-2 bg-transparent text-yellow-400">
                <Star className="h-5 w-5" fill="currentColor" />
             </div>
          )}
        </div>
        <div className="p-2 text-sm truncate">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{item.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
