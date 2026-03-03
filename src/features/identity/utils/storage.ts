import fs from 'fs/promises';
import path from 'path';

export async function ensureStorageDirectory(userId: string): Promise<string> {
  const rootDir = process.cwd();
  const storagePath = path.join(rootDir, 'storage', 'kyb-documents', userId);

  try {
    await fs.access(storagePath);
  } catch {
    await fs.mkdir(storagePath, { recursive: true });
  }

  return storagePath;
}