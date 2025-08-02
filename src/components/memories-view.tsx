'use client';

import { useMemo, useState } from 'react';
import type { MediaItem as MediaItemType } from '@/lib/data';
import MediaGrid from './media-grid';
import { Sparkles } from 'lucide-react';
import { format, subYears, getDate, getMonth } from 'date-fns';

interface MemoriesViewProps {
  allItems: MediaItemType[];
}

interface Memory {
  date: string;
  items: MediaItemType[];
}

export default function MemoriesView({ allItems }: MemoriesViewProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const memories = useMemo(() => {
    const today = new Date();
    const currentDay = getDate(today);
    const currentMonth = getMonth(today);

    const memoryItems: MediaItemType[] = allItems.filter(item => {
      if (item.type === 'folder') return false;
      const itemDate = new Date(item.createdAt);
      const itemDay = getDate(itemDate);
      const itemMonth = getMonth(itemDate);
      const itemYear = itemDate.getFullYear();
      
      return itemDay === currentDay && itemMonth === currentMonth && itemYear < today.getFullYear();
    });

    // Group by year
    const groupedByYear = memoryItems.reduce((acc, item) => {
      const year = new Date(item.createdAt).getFullYear();
      const yearDiff = today.getFullYear() - year;
      let label = `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`;

      if(yearDiff === 1) label = "On this day last year";

      if (!acc[label]) {
        acc[label] = [];
      }
      acc[label].push(item);
      return acc;
    }, {} as Record<string, MediaItemType[]>);

    return Object.entries(groupedByYear).map(([label, items]) => ({
      date: label,
      items: items.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    })).sort((a,b) => b.items[0].createdAt.localeCompare(a.items[0].createdAt));

  }, [allItems]);

  const handleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Sparkles className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold">No Memories Today</h3>
        <p>Check back tomorrow for new memories!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {memories.map((memory) => (
        <div key={memory.date}>
          <h2 className="text-2xl font-bold tracking-tight mb-4">{memory.date}</h2>
          <MediaGrid
             items={memory.items}
             selectedItems={selectedItems}
             onSelect={handleSelect}
             onFolderClick={() => {}} // No folders in memories view
             allItems={allItems}
          />
        </div>
      ))}
    </div>
  );
}
