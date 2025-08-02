'use client';

import { useState } from 'react';
import MediaItem from './media-item';
import MediaViewer from './media-viewer';
import { FileQuestion, Trash2 } from 'lucide-react';
import { MediaItem as MediaItemType } from '@/lib/file-utils';

interface MediaGridProps {
  items: MediaItemType[];
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
  onFolderClick: (folderName: string) => void;
  allItems: MediaItemType[];
}

export default function MediaGrid({ items, selectedItems, onSelect, onFolderClick, allItems }: MediaGridProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const mediaOnlyItems = items.filter(item => item.type === 'image' || item.type === 'video');

  const openViewer = (id: string) => {
    const itemIndex = mediaOnlyItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        setCurrentItemIndex(itemIndex);
        setViewerOpen(true);
    }
  };

  if (items.length === 0) {
    const inTrashView = allItems.some(i => i.isTrashed);
    if(inTrashView && allItems.filter(i => i.isTrashed).length === 0) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Trash2 className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-semibold">Trash is Empty</h3>
          <p>Deleted files will appear here.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <FileQuestion className="w-16 h-16 mb-4" />
        <h3 className="text-xl font-semibold">Empty Folder</h3>
        <p>Upload files or create a new folder.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {items.map((item) => (
          <MediaItem
            key={item.id}
            item={item}
            isSelected={selectedItems.has(item.id)}
            onSelect={onSelect}
            onDoubleClick={
              item.type === 'folder'
                ? () => onFolderClick(item.name)
                : () => openViewer(item.id)
            }
          />
        ))}
      </div>
      <MediaViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        items={mediaOnlyItems}
        startIndex={currentItemIndex}
      />
    </>
  );
}
