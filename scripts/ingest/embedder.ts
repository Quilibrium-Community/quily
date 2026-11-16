import { embedMany } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import type { ChunkWithContext, DocumentChunk } from './types.js';

// Batch size for embedding requests (stay under token limits)
const BATCH_SIZE = 50;

// Embedding model - BGE-M3 produces 1024 dimensions
// Chosen for: better retrieval quality (MTEB 63.0 vs 55.8), open source (MIT),
// and compatibility with both OpenRouter and Chutes providers
const EMBEDDING_MODEL = 'baai/bge-m3';

const MAX_RETRIES = 5;
const RETRY_BASE_DELAY_MS = 2000;

async function withRetry<T>(
  fn: () => Promise<T>,
  batchNum: number,
  totalBatches: number
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
        console.error(
          `\n  ⚠ Batch ${batchNum}/${totalBatches} attempt ${attempt} failed (${error instanceof Error ? error.message : String(error)}), retrying in ${delay / 1000}s...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(
    `Embedding batch ${batchNum}/${totalBatches} failed after ${MAX_RETRIES} attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`
  );
}

/**
 * Format chunk content with heading context for better embeddings
 */
export function formatForEmbedding(chunk: ChunkWithContext): string {
  const text = chunk.metadata.heading_path
    ? `${chunk.metadata.heading_path}\n\n${chunk.content}`
    : chunk.content;
  return maskHashLikeStrings(text);
}

// 64 hex chars (optionally 0x-prefixed) are transaction hashes, coin addresses and
// grant IDs in our docs, but they have the exact shape of an Ethereum private key.
// The OpenRouter provider rejects the whole batch with "blocked by content filter"
// when it sees one, which failed the daily ingestion. A hash carries no semantic
// signal for an embedding, so we mask it. Only the embedded text is changed; the
// stored chunk content keeps the original value.
const HEX_64 = /\b(?:0x)?[0-9a-fA-F]{64}\b/g;

export function maskHashLikeStrings(text: string): string {
  return text.replace(HEX_64, '[hash]');
}

/**
 * Generate embeddings for chunks in batches
 * @param chunks - Chunks with content and metadata
 * @param apiKey - OpenRouter API key
 * @param onProgress - Optional callback for progress updates
 * @returns Chunks with embeddings attached
 */
export async function generateEmbeddings(
  chunks: ChunkWithContext[],
  apiKey: string,
  onProgress?: (completed: number, total: number) => void
): Promise<DocumentChunk[]> {
  const openrouter = createOpenRouter({
    apiKey,
  });

  const results: DocumentChunk[] = [];
  const total = chunks.length;

  // Process in batches
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map(formatForEmbedding);

    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);

    const { embeddings } = await withRetry(
      () =>
        embedMany({
          model: openrouter.textEmbeddingModel(EMBEDDING_MODEL),
          values: texts,
          maxRetries: 0,
        }),
      batchNum,
      totalBatches
    );

    // Attach embeddings to chunks
    for (let j = 0; j < batch.length; j++) {
      results.push({
        ...batch[j],
        embedding: embeddings[j],
      });
    }

    // Report progress
    if (onProgress) {
      onProgress(Math.min(i + BATCH_SIZE, total), total);
    }

    // Small delay between batches to avoid rate limits
    if (i + BATCH_SIZE < chunks.length) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  return results;
}
