/**
 * RAG retrieval layer types
 * These are distinct from ingestion types - different concerns
 */

/**
 * A retrieved document chunk from similarity search
 * Matches match_document_chunks RPC return + citationIndex
 */
export interface RetrievedChunk {
  /** Database ID */
  id: number;
  /** Chunk text content */
  content: string;
  /** Original source file path */
  source_file: string;
  /** Heading hierarchy path or null */
  heading_path: string | null;
  /** External source URL (e.g., YouTube URL for transcripts) or null */
  source_url: string | null;
  /** Publication date (YYYY-MM-DD) or null */
  published_date: string | null;
  /** Document title or null */
  title: string | null;
  /** Document type ('livestream_transcript', 'documentation', etc.) or null */
  doc_type: string | null;
  /**
   * Similarity measured against the USER'S OWN query, or null when no such measurement
   * exists for this chunk.
   *
   * `similarity` cannot answer "how relevant is this to what was asked". On the
   * decomposition path it may be the score against a synthetic sub-query such as "QStorage
   * S3-compatible object storage", and priority/recency chunks carry a hardcoded placeholder.
   * Relevance judgements must use this field, which is null precisely when relevance to the
   * question is unknown.
   */
  directSimilarity?: number | null;
  /** Cosine similarity score (0-1) */
  similarity: number;
  /** Citation index for display (1-based) */
  citationIndex: number;
}

/**
 * Options for retrieval with optional reranking
 */
export interface RetrievalOptions {
  /** Provider for embeddings (default: openrouter) */
  embeddingProvider?: 'openrouter' | 'chutes';
  /** OpenRouter API key for embedding */
  embeddingApiKey?: string;
  /** Chutes access token for embedding */
  chutesAccessToken?: string;
  /** Optional embedding model ID or chute URL for Chutes */
  embeddingModel?: string;
  /** Cohere API key for reranking (optional, paid) */
  cohereApiKey?: string;
  /** Number of candidates from vector search (default 15) */
  initialCount?: number;
  /** Number of results after reranking (default 5) */
  finalCount?: number;
  /** Minimum similarity threshold (default 0.35) */
  similarityThreshold?: number;
  /** Document IDs to prioritize from previous conversation */
  priorityDocIds?: number[];
}

/**
 * Source reference for client-side citation display
 */
export interface SourceReference {
  /** Database ID of the chunk */
  id: number;
  /** Citation index (1-based) */
  index: number;
  /** Source file path */
  file: string;
  /** Heading path or null */
  heading: string | null;
  /** URL to source if available */
  url: string | null;
  /** Document title or null */
  title: string | null;
  /** Publication date (YYYY-MM-DD) or null */
  published_date: string | null;
  /** Document type or null */
  doc_type: string | null;
}
