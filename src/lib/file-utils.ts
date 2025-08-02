import fs from 'fs/promises';
import path from 'path';
import { STORAGE_DIR, TRASH_DIR, METADATA_FILE } from './config';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv'];

export interface MediaItem {
  id: string; // File path relative to STORAGE_DIR
  name: string;
  type: 'folder' | 'image' | 'video' | 'file';
  path: string; // Path for breadcrumbs, relative to "My Files"
  createdAt: string;
  isFavorite?: boolean;
  isTrashed?: boolean;
  originalPath?: string;
  owner: string; // User email
}

export type Metadata = Omit<MediaItem, 'name' | 'type' | 'path' | 'createdAt'>;

export async function readMetadata(): Promise<Metadata[]> {
  try {
    const data = await fs.readFile(METADATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

export async function updateMetadata(newMetadata: Metadata[]) {
  const existingMetadata = await readMetadata();
  const updated = [...existingMetadata];

  for (const newItem of newMetadata) {
      const index = updated.findIndex(item => item.id === newItem.id);
      if (index !== -1) {
          updated[index] = { ...updated[index], ...newItem };
      } else {
          updated.push(newItem);
      }
  }

  await fs.writeFile(METADATA_FILE, JSON.stringify(updated, null, 2), 'utf-8');
}


export function getResolvedPath(relativePath: string, user: string): string {
  const userStorageDir = path.join(STORAGE_DIR, user);
  if (relativePath === 'My Files') {
    return userStorageDir;
  }
  const cleanRelativePath = relativePath.replace(/^My Files\/?/, '');
  return path.join(userStorageDir, cleanRelativePath);
}

function getBreadcrumbPath(resolvedPath: string, user: string): string {
    const userStorageDir = path.join(STORAGE_DIR, user);
  if (resolvedPath === userStorageDir) {
    return 'My Files';
  }
  const relative = path.relative(userStorageDir, resolvedPath);
  return path.join('My Files', relative);
}

export async function createFolder(folderPath: string) {
  await fs.mkdir(folderPath, { recursive: true });
}

export async function getAllFiles(user: string): Promise<MediaItem[]> {
  const metadata = await readMetadata();
  const allItems: MediaItem[] = [];
  const userStorageDir = path.join(STORAGE_DIR, user);
  const userTrashDir = path.join(TRASH_DIR, user);

  await fs.mkdir(userStorageDir, { recursive: true });
  await fs.mkdir(userTrashDir, { recursive: true });

  async function crawl(directory: string) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      const stats = await fs.stat(fullPath);
      const id = path.relative(userStorageDir, fullPath);
      const meta = metadata.find(m => m.id === id && m.owner === user);

      const item: MediaItem = {
        id: id,
        name: entry.name,
        type: 'file',
        path: getBreadcrumbPath(directory, user),
        createdAt: stats.birthtime.toISOString(),
        isFavorite: meta?.isFavorite || false,
        isTrashed: false,
        originalPath: meta?.originalPath,
        owner: user,
      };

      if (entry.isDirectory()) {
        item.type = 'folder';
        await crawl(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          item.type = 'image';
        } else if (VIDEO_EXTENSIONS.includes(ext)) {
          item.type = 'video';
        }
      }
      allItems.push(item);
    }
  }

  await crawl(userStorageDir);
  
  try {
    const trashedEntries = await fs.readdir(userTrashDir);
    for (const entryName of trashedEntries) {
        const trashedFilePath = path.join(userTrashDir, entryName);
        const id = path.relative(userStorageDir, trashedFilePath);
        const meta = metadata.find(m => m.id === id && m.owner === user);

        if (meta) {
           const stats = await fs.stat(trashedFilePath);
           allItems.push({
               ...meta,
               id: id,
               name: path.basename(meta.id),
               type: 'file',
               path: 'Trash',
               createdAt: stats.birthtime.toISOString(),
               isTrashed: true,
           });
        }
    }
  } catch (e) {
      // Ignore if trash is empty or doesn't exist
  }

  return allItems.filter(item => item.owner === user);
}

export async function moveItems(sources: string[], destinationDir: string, isTrash: boolean, user: string) {
    const metadata = await readMetadata();
    const userStorageDir = path.join(STORAGE_DIR, user);

    for (const sourcePath of sources) {
        await fs.mkdir(destinationDir, {recursive: true});
        const destPath = path.join(destinationDir, path.basename(sourcePath));
        await fs.rename(sourcePath, destPath);

        const oldId = path.relative(userStorageDir, sourcePath);
        const newId = path.relative(userStorageDir, destPath);
        
        const metaIndex = metadata.findIndex(m => m.id === oldId && m.owner === user);

        if (metaIndex !== -1) {
            metadata[metaIndex].id = newId;
            if (isTrash) {
                metadata[metaIndex].isTrashed = true;
                metadata[metaIndex].originalPath = getBreadcrumbPath(path.dirname(sourcePath), user);
            } else {
                 metadata[metaIndex].isTrashed = false;
                 delete metadata[metaIndex].originalPath;
            }
        } else {
            metadata.push({
                id: newId,
                isFavorite: false,
                isTrashed: isTrash,
                owner: user,
                originalPath: isTrash ? getBreadcrumbPath(path.dirname(sourcePath), user) : undefined,
            });
        }
    }
    await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2), 'utf-8');
}


export async function deleteItems(itemPaths: string[], user: string) {
    const metadata = await readMetadata();
    const userStorageDir = path.join(STORAGE_DIR, user);

    for (const itemPath of itemPaths) {
        await fs.rm(itemPath, { recursive: true, force: true });
        const id = path.relative(userStorageDir, itemPath);
        const index = metadata.findIndex(m => m.id === id && m.owner === user);
        if (index !== -1) {
            metadata.splice(index, 1);
        }
    }
    await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2), 'utf-8');
}
