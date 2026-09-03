import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { encode } from 'gpt-tokenizer';
import { createHash } from 'crypto';
import type { LoadedDocument, ChunkWithContext, ChunkMetadata } from './types.js';

/**
 * Count tokens using cl100k_base tokenizer (matches text-embedding-3-small)
 */
function countTokens(text: string): number {
  return encode(text).length;
}

/**
 * Generate MD5 hash of content for deduplication
 */
function hashContent(content: string): string {
  return createHash('md5').update(content).digest('hex');
}

/**
 * Character ranges covered by fenced code blocks, as [start, end) offsets into the
 * original content. Offsets are preserved rather than stripping the fences, because
 * buildHeadingMap keys its results by position in the untouched string.
 */
function fencedRanges(content: string): [number, number][] {
  const ranges: [number, number][] = [];
  let fence: string | null = null;
  let fenceStart = 0;
  let offset = 0;
  for (const line of content.split('\n')) {
    const m = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence === null) {
      if (m) {
        fence = m[1];
        fenceStart = offset;
      }
    } else if (m && m[1][0] === fence[0] && m[1].length >= fence.length) {
      ranges.push([fenceStart, offset + line.length + 1]);
      fence = null;
    }
    offset += line.length + 1; // +1 for the newline consumed by split
  }
  // An unterminated fence runs to the end of the document.
  if (fence !== null) ranges.push([fenceStart, content.length]);
  return ranges;
}

/**
 * Extract heading hierarchy from markdown content
 * Returns a map of content position -> heading path
 */
function buildHeadingMap(content: string): Map<number, string> {
  const headingMap = new Map<number, string>();
  const headingStack: { level: number; text: string }[] = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const fenced = fencedRanges(content);

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    // A `# comment` inside a shell block is not a heading. Without this, the stored
    // heading_path for Cluster-Configuration-Guide.md read "On each worker machine,
    // start the worker with --core > Important Notes". prompt.ts falls back to
    // heading_path for a chunk's source label when frontmatter has no title, so this
    // is user-visible for any doc lacking one.
    if (fenced.some(([start, end]) => match!.index >= start && match!.index < end)) continue;

    const level = match[1].length;
    const text = match[2].trim();

    // Pop headings that are same level or higher
    while (headingStack.length > 0 && headingStack[headingStack.length - 1].level >= level) {
      headingStack.pop();
    }

    headingStack.push({ level, text });

    // Build path from current stack
    const path = headingStack.map((h) => h.text).join(' > ');
    headingMap.set(match.index, path);
  }

  return headingMap;
}

/**
 * Find the heading path for a given chunk based on its position
 */
function findHeadingPath(
  chunkStart: number,
  content: string,
  headingMap: Map<number, string>
): string {
  // Find the closest heading before this chunk
  let closestHeading = '';
  let closestPosition = -1;

  for (const [position, path] of headingMap) {
    if (position <= chunkStart && position > closestPosition) {
      closestPosition = position;
      closestHeading = path;
    }
  }

  return closestHeading;
}

/**
 * Chunk documents with semantic boundaries and heading context
 * @param documents - Loaded markdown documents
 * @param version - Version tag for this ingestion run
 * @returns Array of chunks with metadata
 */
export async function chunkDocuments(
  documents: LoadedDocument[],
  version: string
): Promise<ChunkWithContext[]> {
  // Configure splitter for markdown with token-based sizing
  const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown', {
    chunkSize: 800, // Target 500-1000 tokens
    chunkOverlap: 100, // ~10-15% overlap
    lengthFunction: countTokens,
  });

  const allChunks: ChunkWithContext[] = [];

  for (const doc of documents) {
    // Build heading map for this document
    const headingMap = buildHeadingMap(doc.content);

    // Split the document
    const textChunks = await splitter.splitText(doc.content);

    // Track position in original content for heading lookup
    let searchPosition = 0;

    for (let i = 0; i < textChunks.length; i++) {
      const chunkContent = textChunks[i];

      // Find where this chunk starts in the original content
      const chunkStart = doc.content.indexOf(chunkContent.slice(0, 50), searchPosition);
      if (chunkStart !== -1) {
        searchPosition = chunkStart;
      }

      // Find the heading path for this chunk
      const headingPath = findHeadingPath(chunkStart, doc.content, headingMap);

      // Extract metadata from frontmatter
      const sourceUrl = (doc.frontmatter?.source_url || doc.frontmatter?.youtube_url) as string | undefined;
      const title = doc.frontmatter?.title as string | undefined;
      const docType = doc.frontmatter?.type as string | undefined;
      // Handle date as string (YAML dates may be parsed as Date objects or strings)
      const rawDate = doc.frontmatter?.date;
      const publishedDate = rawDate
        ? rawDate instanceof Date
          ? rawDate.toISOString().split('T')[0]
          : String(rawDate)
        : undefined;
      const metadata: ChunkMetadata = {
        source_file: doc.path,
        heading_path: headingPath,
        chunk_index: i,
        token_count: countTokens(chunkContent),
        version,
        content_hash: hashContent(chunkContent),
        source_url: sourceUrl,
        published_date: publishedDate,
        title,
        doc_type: docType,
      };

      allChunks.push({
        content: chunkContent,
        metadata,
      });
    }
  }

  return allChunks;
}
