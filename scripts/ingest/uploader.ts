import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { DocumentChunk } from './types.js';

// Batch size for database inserts
const UPLOAD_BATCH_SIZE = 100;

// Table name for document chunks (unified BGE-M3 embeddings)
// Note: 'document_chunks' table was removed - only 'document_chunks_chutes' exists now
export type EmbeddingTable = 'document_chunks_chutes';

/**
 * Create Supabase client with service role key
 */
function getSupabaseClient(url: string, serviceKey: string): SupabaseClient {
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Upload document chunks with embeddings to Supabase
 * Uses upsert to handle re-ingestion without duplicates.
 *
 * By default, deletes all existing chunks for each touched source file before
 * inserting the new ones (delete-before-insert). This is required for correctness:
 * a plain upsert on (source_file, chunk_index) only OVERWRITES colliding rows, so
 * when a re-synced file produces FEWER chunks than before, the old high-index chunks
 * survive in the DB with stale content and stale source_url values. Those leftover
 * chunks get retrieved by the RAG pipeline and surface as dead citation links
 * (see .agents/tasks/2026-06-20-stale-discord-citation-links.md). Deleting per-file
 * first guarantees the DB chunks for a file always exactly match its current content.
 *
 * @param chunks - Document chunks with embeddings
 * @param supabaseUrl - Supabase project URL
 * @param supabaseKey - Supabase service role key
 * @param tableName - Target table (document_chunks for OpenRouter, document_chunks_chutes for Chutes)
 * @param onProgress - Optional callback for progress updates
 * @param replaceFiles - Delete existing chunks for each touched file before inserting (default true)
 */
export async function uploadChunks(
  chunks: DocumentChunk[],
  supabaseUrl: string,
  supabaseKey: string,
  tableName: EmbeddingTable = 'document_chunks_chutes',
  onProgress?: (completed: number, total: number) => void,
  replaceFiles: boolean = true
): Promise<{ inserted: number; errors: string[] }> {
  const supabase = getSupabaseClient(supabaseUrl, supabaseKey);
  const total = chunks.length;
  let inserted = 0;
  const errors: string[] = [];

  // Delete-before-insert: remove existing chunks for every source file we're about to
  // re-ingest, so shrunk files don't leave stale trailing chunks behind.
  if (replaceFiles) {
    const touchedFiles = [...new Set(chunks.map((c) => c.metadata.source_file))];
    for (const sourceFile of touchedFiles) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('source_file', sourceFile);

      if (error) {
        errors.push(`Delete (replace) for ${sourceFile}: ${error.message}`);
      }
    }
  }

  // Process in batches
  for (let i = 0; i < chunks.length; i += UPLOAD_BATCH_SIZE) {
    const batch = chunks.slice(i, i + UPLOAD_BATCH_SIZE);

    // Transform chunks to database format
    const rows = batch.map((chunk) => ({
      content: chunk.content,
      embedding: chunk.embedding,
      source_file: chunk.metadata.source_file,
      heading_path: chunk.metadata.heading_path || null,
      chunk_index: chunk.metadata.chunk_index,
      token_count: chunk.metadata.token_count,
      version: chunk.metadata.version,
      content_hash: chunk.metadata.content_hash,
      source_url: chunk.metadata.source_url || null,
      published_date: chunk.metadata.published_date || null,
      title: chunk.metadata.title || null,
      doc_type: chunk.metadata.doc_type || null,
    }));

    try {
      const { error } = await supabase
        .from(tableName)
        .upsert(rows, {
          onConflict: 'source_file,chunk_index',
          ignoreDuplicates: false, // Update existing rows
        });

      if (error) {
        errors.push(`Batch ${Math.floor(i / UPLOAD_BATCH_SIZE) + 1}: ${error.message}`);
      } else {
        inserted += batch.length;
      }
    } catch (err) {
      errors.push(
        `Batch ${Math.floor(i / UPLOAD_BATCH_SIZE) + 1}: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    // Report progress
    if (onProgress) {
      onProgress(Math.min(i + UPLOAD_BATCH_SIZE, total), total);
    }
  }

  return { inserted, errors };
}

/**
 * Delete all chunks for a specific source file
 * Useful for re-ingesting a single document
 */
export async function deleteChunksForFile(
  sourceFile: string,
  supabaseUrl: string,
  supabaseKey: string,
  tableName: EmbeddingTable = 'document_chunks_chutes'
): Promise<{ deleted: number }> {
  const supabase = getSupabaseClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from(tableName)
    .delete()
    .eq('source_file', sourceFile)
    .select('id');

  if (error) {
    throw new Error(`Failed to delete chunks for ${sourceFile}: ${error.message}`);
  }

  return { deleted: data?.length ?? 0 };
}

/**
 * Get count of chunks in database
 * Useful for verification
 */
export async function getChunkCount(
  supabaseUrl: string,
  supabaseKey: string,
  tableName: EmbeddingTable = 'document_chunks_chutes'
): Promise<number> {
  const supabase = getSupabaseClient(supabaseUrl, supabaseKey);

  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to count chunks: ${error.message}`);
  }

  return count ?? 0;
}

/**
 * Get all unique source files currently in the database
 */
export async function getSourceFilesInDatabase(
  supabaseUrl: string,
  supabaseKey: string,
  tableName: EmbeddingTable = 'document_chunks_chutes'
): Promise<string[]> {
  const supabase = getSupabaseClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from(tableName)
    .select('source_file')
    .order('source_file');

  if (error) {
    throw new Error(`Failed to get source files: ${error.message}`);
  }

  // Get unique source files
  const uniqueFiles = [...new Set(data?.map((row) => row.source_file) ?? [])];
  return uniqueFiles;
}

/**
 * Delete chunks for files that no longer exist in the docs folder
 * Returns list of deleted source files and total chunks removed
 */
export async function cleanOrphanedChunks(
  localFiles: string[],
  supabaseUrl: string,
  supabaseKey: string,
  tableName: EmbeddingTable = 'document_chunks_chutes',
  onProgress?: (message: string) => void
): Promise<{ deletedFiles: string[]; deletedChunks: number }> {
  const supabase = getSupabaseClient(supabaseUrl, supabaseKey);

  // Get all source files in database
  const dbFiles = await getSourceFilesInDatabase(supabaseUrl, supabaseKey, tableName);

  // Normalize local file paths (use forward slashes)
  const localFileSet = new Set(localFiles.map((f) => f.replace(/\\/g, '/')));

  // Find orphaned files (in DB but not in local docs)
  // Also normalize DB paths in case they have backslashes
  const orphanedFiles = dbFiles.filter((dbFile) => !localFileSet.has(dbFile.replace(/\\/g, '/')));

  if (orphanedFiles.length === 0) {
    return { deletedFiles: [], deletedChunks: 0 };
  }

  let totalDeleted = 0;

  for (const sourceFile of orphanedFiles) {
    if (onProgress) {
      onProgress(`Removing: ${sourceFile}`);
    }

    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq('source_file', sourceFile)
      .select('id');

    if (error) {
      throw new Error(`Failed to delete chunks for ${sourceFile}: ${error.message}`);
    }

    totalDeleted += data?.length ?? 0;
  }

  return { deletedFiles: orphanedFiles, deletedChunks: totalDeleted };
}
