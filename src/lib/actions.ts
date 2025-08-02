'use server';

import path from 'path';
import { revalidatePath } from 'next/cache';
import { STORAGE_DIR, TRASH_DIR } from './config';
import {
  createFolder as utilCreateFolder,
  getAllFiles,
  getResolvedPath,
  moveItems,
  deleteItems as utilDeleteItems,
  updateMetadata,
  readMetadata,
} from './file-utils';

export async function getFiles() {
  return await getAllFiles();
}

export async function createFolder(currentPath: string, folderName: string) {
  const resolvedPath = getResolvedPath(currentPath);
  await utilCreateFolder(path.join(resolvedPath, folderName));
  revalidatePath('/');
}

export async function deleteItems(itemPaths: string[], permanently: boolean) {
  if (permanently) {
    const resolvedPaths = itemPaths.map(getResolvedPath);
    await utilDeleteItems(resolvedPaths);
  } else {
    const sourcePaths = itemPaths.map(getResolvedPath);
    const destinationPath = TRASH_DIR;
    await moveItems(sourcePaths, destinationPath, true);
  }
  revalidatePath('/');
}

export async function restoreItems(itemPaths: string[]) {
    const metadata = await readMetadata();
    const itemsToRestore = itemPaths.map(p => metadata.find(m => m.id === p)).filter(Boolean) as { id: string; originalPath: string }[];
    
    for (const item of itemsToRestore) {
        const source = path.join(TRASH_DIR, path.basename(item.id));
        const destinationDir = getResolvedPath(item.originalPath);
        await utilCreateFolder(destinationDir); // Ensure destination exists
        await moveItems([source], destinationDir, false);
    }
    revalidatePath('/');
}

export async function toggleFavorite(itemPaths: string[]) {
    const metadata = await readMetadata();
    const updatedMetadata = metadata.map(item => {
        if (itemPaths.includes(item.id)) {
            return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
    });
    await updateMetadata(updatedMetadata);
    revalidatePath('/');
}
