import path from 'path';
import fs from 'fs/promises';

// Important: This path is relative to the project root when running in development mode.
// In a production environment (like on the Pi), you might want to use an absolute path.
export const STORAGE_DIR = path.resolve(process.cwd(), 'pimedia');
export const TRASH_DIR = path.join(STORAGE_DIR, '.trash');
export const METADATA_FILE = path.join(STORAGE_DIR, '.metadata.json');

// Function to ensure base directories exist on startup
export async function initializeStorage() {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.mkdir(TRASH_DIR, { recursive: true });
    
    // Create metadata file if it doesn't exist
    try {
        await fs.access(METADATA_FILE);
    } catch (error) {
        await fs.writeFile(METADATA_FILE, JSON.stringify([]), 'utf-8');
    }

  } catch (error) {
    console.error("Failed to initialize storage directories:", error);
    // Exit or handle error appropriately
    process.exit(1);
  }
}

// Initialize storage when this module is loaded
initializeStorage();
