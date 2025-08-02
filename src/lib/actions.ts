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
  MediaItem,
} from './file-utils';

export async function getFiles(user: string) {
  return await getAllFiles(user);
}

export async function createFolder(currentPath: string, folderName: string, user: string) {
  const resolvedPath = getResolvedPath(currentPath, user);
  await utilCreateFolder(path.join(resolvedPath, folderName));
  revalidatePath('/');
}

export async function deleteItems(itemPaths: string[], permanently: boolean, user: string) {
  if (permanently) {
    const resolvedPaths = itemPaths.map(p => getResolvedPath(p, user));
    await utilDeleteItems(resolvedPaths, user);
  } else {
    const sourcePaths = itemPaths.map(p => getResolvedPath(p, user));
    const destinationPath = path.join(TRASH_DIR, user);
    await moveItems(sourcePaths, destinationPath, true, user);
  }
  revalidatePath('/');
}

export async function restoreItems(itemPaths: string[], user: string) {
    const metadata = await readMetadata();
    const userTrashDir = path.join(TRASH_DIR, user);

    const itemsToRestore = itemPaths
        .map(p => metadata.find(m => m.id === p && m.owner === user))
        .filter(Boolean) as (MediaItem & { originalPath: string })[];
    
    for (const item of itemsToRestore) {
        const source = path.join(userTrashDir, path.basename(item.id));
        const destinationDir = getResolvedPath(item.originalPath, user);
        await utilCreateFolder(destinationDir); // Ensure destination exists
        await moveItems([source], destinationDir, false, user);
    }
    revalidatePath('/');
}

export async function toggleFavorite(itemPaths: string[], user: string) {
    const metadata = await readMetadata();
    const updatedMetadata = metadata.map(item => {
        if (item.owner === user && itemPaths.includes(item.id)) {
            return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
    });
    await updateMetadata(updatedMetadata);
    revalidatePath('/');
}
