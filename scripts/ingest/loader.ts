import { glob } from 'glob';
import { readFile } from 'fs/promises';
import { join, relative } from 'path';
import type { LoadedDocument } from './types.js';

/**
 * Parse frontmatter from markdown content
 * Returns content without frontmatter and parsed frontmatter object
 */
function parseFrontmatter(content: string): {
  content: string;
  frontmatter: Record<string, unknown> | undefined;
} {
  // Handle both Unix (\n) and Windows (\r\n) line endings
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { content, frontmatter: undefined };
  }

  // Simple YAML-like parsing (key: value pairs)
  const frontmatter: Record<string, unknown> = {};
  // Handle both Unix (\n) and Windows (\r\n) line endings
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      // Remove quotes if present
      frontmatter[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  return {
    content: content.slice(match[0].length),
    frontmatter,
  };
}

// Supported file extensions for ingestion
const SUPPORTED_EXTENSIONS = ['md', 'txt'];

/**
 * Load all document files from a directory
 * Supports: .md (markdown) and .txt (plain text/transcriptions)
 *
 * Files with no body content are skipped. Upstream docs repos carry empty
 * placeholders for unwritten pages (e.g. QKMS `_02-data-types/01-general.md`,
 * a 0-byte stub for a page that 404s on docs.quilibrium.com), and the sync
 * mirrors them faithfully. Chunking one yields nothing, so it never reaches the
 * database and `ingest status` reports it as perpetually "not ingested" — a
 * phantom that looks like a broken pipeline. Skipping them here keeps the status
 * report honest, and the warning means a doc that becomes empty by accident is
 * still visible rather than silently dropped.
 *
 * @param docsPath - Path to documentation directory
 * @returns Array of loaded documents with path and content
 */
export async function loadDocuments(docsPath: string): Promise<LoadedDocument[]> {
  // Find all supported files recursively
  // Use forward slashes for glob (works on all platforms)
  const basePath = docsPath.replace(/\\/g, '/');
  const pattern = `${basePath}/**/*.{${SUPPORTED_EXTENSIONS.join(',')}}`;
  const files = await glob(pattern, { nodir: true });

  if (files.length === 0) {
    throw new Error(`No document files found in ${docsPath} (supported: ${SUPPORTED_EXTENSIONS.join(', ')})`);
  }

  const documents: LoadedDocument[] = [];
  const emptyFiles: string[] = [];

  for (const filePath of files) {
    const rawContent = await readFile(filePath, 'utf-8');
    // Normalize to forward slashes for cross-platform consistency
    const relativePath = relative(docsPath, filePath).replace(/\\/g, '/');
    const isMarkdown = filePath.endsWith('.md');

    // Only parse frontmatter for markdown files
    if (isMarkdown) {
      const { content, frontmatter } = parseFrontmatter(rawContent);
      if (content.trim().length === 0) {
        emptyFiles.push(relativePath);
        continue;
      }
      documents.push({
        path: relativePath,
        content,
        frontmatter,
      });
    } else {
      // Plain text files (e.g., transcriptions) - use as-is
      if (rawContent.trim().length === 0) {
        emptyFiles.push(relativePath);
        continue;
      }
      documents.push({
        path: relativePath,
        content: rawContent,
        frontmatter: undefined,
      });
    }
  }

  if (emptyFiles.length > 0) {
    console.warn(
      `\n⚠️  Skipped ${emptyFiles.length} empty file(s) with no content to ingest:`
    );
    for (const path of emptyFiles) {
      console.warn(`    - ${path}`);
    }
    console.warn('');
  }

  return documents;
}
