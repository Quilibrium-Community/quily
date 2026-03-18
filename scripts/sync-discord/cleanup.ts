// scripts/sync-discord/cleanup.ts
import { readdir, unlink, rmdir } from 'fs/promises';
import { join } from 'path';

const ROLLING_WINDOW_DAYS = 28;

/**
 * Delete announcement markdown files older than the rolling window.
 * Returns list of deleted file paths.
 */
export async function cleanOldAnnouncements(destPath: string): Promise<string[]> {
  const cutoffDate = new Date();
  cutoffDate.setUTCDate(cutoffDate.getUTCDate() - ROLLING_WINDOW_DAYS);
  const cutoffStr = cutoffDate.toISOString().split('T')[0]; // YYYY-MM-DD

  const deleted: string[] = [];

  // Read channel directories
  let channelDirs: string[];
  try {
    channelDirs = await readdir(destPath);
  } catch {
    return []; // Directory doesn't exist yet
  }

  for (const channelDir of channelDirs) {
    const channelPath = join(destPath, channelDir);

    let files: string[];
    try {
      files = await readdir(channelPath);
    } catch {
      continue;
    }

    for (const file of files) {
      // Files are named YYYY-MM-DD.md
      const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
      if (!dateMatch) continue;

      const fileDate = dateMatch[1];
      if (fileDate < cutoffStr) {
        const filePath = join(channelPath, file);
        await unlink(filePath);
        deleted.push(filePath);
      }
    }

    // Remove empty channel directories
    try {
      const remaining = await readdir(channelPath);
      if (remaining.length === 0) {
        await rmdir(channelPath);
      }
    } catch {
      // Ignore
    }
  }

  return deleted;
}
