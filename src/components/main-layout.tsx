'use client';

import {
  Folder,
  Home,
  Star,
  Trash2,
  Settings,
  Cloud,
  Upload,
  FolderPlus,
  PanelLeft,
  ListFilter,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserNav from '@/components/user-nav';
import MediaGrid from '@/components/media-grid';
import { MOCK_DATA, type MediaItem as MediaItemType } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from './ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type SortOrder = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc';

export default function MainLayout() {
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState<string[]>(['My Files']);
  const [mediaItems, setMediaItems] = useState<MediaItemType[]>(MOCK_DATA);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');

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

  const currentMedia = useMemo(() => {
    const items = mediaItems.filter(
      (item) => item.path === currentPath.join('/')
    );
    
    return [...items].sort((a, b) => {
      switch (sortOrder) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  }, [mediaItems, currentPath, sortOrder]);

  const handleCreateFolder = () => {
    if (newFolderName.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Folder name cannot be empty.',
      });
      return;
    }
    const newFolder: MediaItemType = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: 'folder',
      path: currentPath.join('/'),
      createdAt: new Date().toISOString(),
    };
    setMediaItems((prev) => [...prev, newFolder]);
    setIsCreateFolderDialogOpen(false);
    setNewFolderName('');
    toast({
      title: 'Success',
      description: `Folder "${newFolderName}" created.`,
    });
  };

  const handleDelete = () => {
    const newMediaItems = mediaItems.filter(
      (item) => !selectedItems.has(item.id)
    );
    setMediaItems(newMediaItems);
    setSelectedItems(new Set());
    setIsDeleteDialogOpen(false);
    toast({
      title: 'Success',
      description: `${selectedItems.size} item(s) deleted.`,
    });
  };
  
  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 90) {
                return prev;
            }
            return prev + 10;
        });
    }, 200);

    setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        const newFiles: MediaItemType[] = Array.from(files).map((file, index) => ({
            id: `file-${Date.now()}-${index}`,
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            path: currentPath.join('/'),
            url: URL.createObjectURL(file),
            createdAt: new Date().toISOString(),
        }));
        setMediaItems(prev => [...prev, ...newFiles]);
        setTimeout(() => {
            setIsUploading(false);
            setIsUploadDialogOpen(false);
            toast({
                title: 'Upload complete',
                description: `${files.length} file(s) added successfully.`,
            });
        }, 500);
    }, 2000);
};

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Cloud className="h-6 w-6 text-primary" />
              <span className="">PiCloudStorage</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                My Files
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Star className="h-4 w-4" />
                Favorites
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Trash2 className="h-4 w-4" />
                Trash
              </a>
            </nav>
          </div>
          <div className="mt-auto p-4">
             <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Cloud className="h-6 w-6" />
                  <span className="sr-only">PiCloudStorage</span>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  My Files
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Star className="h-5 w-5" />
                  Favorites
                </a>
                 <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-5 w-5" />
                  Trash
                </a>
              </nav>
               <div className="mt-auto">
                 <a
                    href="#"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </a>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             {/* Breadcrumbs */}
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {currentPath.map((p, i) => (
                    <React.Fragment key={p}>
                        <button
                            onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
                            className="hover:text-foreground disabled:cursor-text disabled:hover:text-muted-foreground"
                            disabled={i === currentPath.length -1}
                        >
                            {p}
                        </button>
                        {i < currentPath.length -1 && <span>/</span>}
                    </React.Fragment>
                ))}
            </div>
          </div>
           <div className="flex items-center gap-2">
            {selectedItems.size > 0 && (
                <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete ({selectedItems.size})
                </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                  <DropdownMenuRadioItem value="name-asc">Name (A-Z)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-desc">Name (Z-A)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="date-desc">Date (Newest)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="date-asc">Date (Oldest)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
             <Button variant="outline" size="sm" onClick={() => setIsCreateFolderDialogOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
             </Button>
            <Button size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload
            </Button>
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          <MediaGrid
            items={currentMedia}
            selectedItems={selectedItems}
            onSelect={handleSelect}
            onFolderClick={(folderName) => setCurrentPath([...currentPath, folderName])}
            allItems={mediaItems}
          />
        </main>
      </div>

       {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedItems.size} item(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Folder Dialog */}
        <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        id="name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder name"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setIsCreateFolderDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateFolder}>Create</Button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                </DialogHeader>
                <div 
                    className="mt-4 flex justify-center items-center w-full"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleUpload(e.dataTransfer.files);
                    }}
                >
                    {isUploading ? (
                        <div className="w-full space-y-2">
                            <p>Uploading...</p>
                            <Progress value={uploadProgress} />
                        </div>
                    ) : (
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">Images or Videos</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" multiple onChange={(e) => handleUpload(e.target.files)} />
                        </label>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}
