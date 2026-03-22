import type { Attachment, Collection, Snowflake } from 'discord.js';

const MAX_FILE_SIZE = 100_000; // 100 KB
const MAX_EXTRACTED_CHARS = 50_000; // ~12K tokens
const MAX_FILES = 3;

const TEXT_EXTENSIONS = new Set([
  // Plain text
  '.txt', '.md', '.csv', '.log', '.env',
  // Code
  '.js', '.ts', '.tsx', '.jsx', '.py', '.rs', '.go', '.java',
  '.c', '.cpp', '.h', '.rb', '.php', '.swift', '.kt',
  '.sh', '.bash', '.zsh', '.sql', '.html', '.css', '.scss',
  '.xml', '.toml', '.ini', '.cfg',
  // Data
  '.json', '.yaml', '.yml',
]);

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot).toLowerCase();
}

function isSupportedAttachment(attachment: Attachment): boolean {
  return TEXT_EXTENSIONS.has(getExtension(attachment.name ?? ''));
}

async function fetchAttachmentText(attachment: Attachment): Promise<string | null> {
  if (attachment.size > MAX_FILE_SIZE) return null;

  try {
    const res = await fetch(attachment.url);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Extract text from supported Discord message attachments and format
 * them for prepending to the user's query.
 *
 * Returns an empty string if no attachments are supported/readable.
 */
export async function extractAttachments(
  attachments: Collection<Snowflake, Attachment>,
): Promise<string> {
  const supported = attachments.filter(isSupportedAttachment);
  if (supported.size === 0) return '';

  const toProcess = supported.first(MAX_FILES);
  const parts: string[] = [];
  let totalChars = 0;

  for (const att of toProcess) {
    const text = await fetchAttachmentText(att);
    if (!text) continue;

    const remaining = MAX_EXTRACTED_CHARS - totalChars;
    if (remaining <= 0) break;

    const truncated = text.length > remaining;
    const content = truncated ? text.slice(0, remaining) : text;
    totalChars += content.length;

    const sizeLabel = att.size < 1024
      ? `${att.size} B`
      : `${(att.size / 1024).toFixed(1)} KB`;

    parts.push(
      `<attached_file name="${att.name}" size="${sizeLabel}"${truncated ? ' truncated="true"' : ''}>\n${content}\n</attached_file>`,
    );
  }

  return parts.length > 0 ? parts.join('\n\n') + '\n\n' : '';
}
