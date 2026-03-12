---
id: S01
parent: M001
milestone: M001
provides:
  - TypeScript project configuration
  - All npm dependencies for RAG pipeline
  - pgvector database schema with HNSW index
  - Shared TypeScript interfaces for document chunks
  - Markdown file loading with frontmatter parsing
  - Token-based text chunking with heading context
  - Content hashing for deduplication
  - Batch embedding generation via OpenRouter (generateEmbeddings)
  - Supabase vector storage with upsert (uploadChunks)
  - Helper functions for delete and count operations
requires: []
affects: []
key_files: []
key_decisions:
  - "NodeNext module resolution without type:module - tsx handles ESM"
  - "HNSW index with m=16, ef_construction=64 for <10k vectors"
  - "vector(1536) for text-embedding-3-small compatibility"
  - "800 token target with 100 overlap for chunk sizing"
  - "RecursiveCharacterTextSplitter.fromLanguage('markdown') for semantic splitting"
  - "Simple YAML parsing for frontmatter (no external parser needed)"
  - "50-item batches for embeddings to stay under token limits"
  - "100-item batches for Supabase inserts for performance"
  - "Heading context prepended to chunks for better semantic embedding"
  - "Upsert on source_file+chunk_index for duplicate prevention"
patterns_established:
  - "Database schema in scripts/db/ for manual execution"
  - "TypeScript interfaces in scripts/ingest/types.ts as single source of truth"
  - "JSDoc comments on all exported interfaces"
  - "Heading path tracking: 'Section > Subsection > Topic' format"
  - "Content hash for deduplication on re-ingestion"
  - "Progress callbacks: onProgress?: (completed: number, total: number) => void"
  - "Batch error context: include batch number in error messages"
  - "Service client factories: getSupabaseClient with minimal auth config"
observability_surfaces: []
drill_down_paths: []
duration: 2min
verification_result: passed
completed_at: 2026-01-24
blocker_discovered: false
---
# S01: Data Pipeline

**# Phase 01 Plan 01: Project Foundation Summary**

## What Happened

# Phase 01 Plan 01: Project Foundation Summary

**TypeScript project with @langchain/textsplitters, Supabase client, and pgvector schema ready for RAG pipeline**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-24T15:01:54Z
- **Completed:** 2026-01-24T15:04:45Z
- **Tasks:** 3
- **Files created:** 5

## Accomplishments

- Initialized TypeScript project with all 11 production dependencies
- Created pgvector database schema with document_chunks table and HNSW index
- Defined 6 TypeScript interfaces for the ingestion pipeline
- Configured strict TypeScript compilation with NodeNext modules

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize TypeScript project with dependencies** - `d8eb269` (feat)
2. **Task 2: Create database schema for vector storage** - `a0d4ea9` (feat)
3. **Task 3: Define shared TypeScript interfaces** - `58593af` (feat)

## Files Created/Modified

- `package.json` - Project dependencies and npm scripts
- `tsconfig.json` - TypeScript configuration with strict mode
- `.env.example` - Documents required environment variables
- `scripts/db/schema.sql` - pgvector schema with table, indexes, and RPC function
- `scripts/ingest/types.ts` - Shared TypeScript interfaces for RAG pipeline

## Decisions Made

- Used NodeNext module resolution without `"type": "module"` in package.json - tsx handles ESM transpilation
- HNSW index parameters (m=16, ef_construction=64) suitable for <10k vectors
- vector(1536) dimension matches text-embedding-3-small output

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

**External services require manual configuration.** User must:

1. **Supabase:**
   - Enable pgvector extension in Dashboard -> Database -> Extensions
   - Run schema.sql in SQL Editor
   - Copy SUPABASE_URL and SUPABASE_SERVICE_KEY to .env

2. **OpenRouter:**
   - Create API key at OpenRouter Dashboard
   - Copy OPENROUTER_API_KEY to .env

## Next Phase Readiness

- Foundation complete, ready for Plan 02 (document loader)
- User must configure Supabase and run schema.sql before Plan 04 (upload)
- All types defined and ready for import by other modules

---
*Phase: 01-data-pipeline*
*Completed: 2026-01-24*

# Phase 01 Plan 02: Document Loading and Chunking Summary

**Markdown loader with frontmatter parsing and semantic chunker using RecursiveCharacterTextSplitter with token-based sizing and heading context preservation**

## Performance

- **Duration:** 1 min
- **Started:** 2026-01-24T15:06:48Z
- **Completed:** 2026-01-24T15:08:08Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments
- Markdown file loader that finds and loads all `.md` files with frontmatter extraction
- Semantic text chunker with heading hierarchy tracking for context preservation
- Token-based sizing using gpt-tokenizer (matches text-embedding-3-small tokenizer)
- MD5 content hashing for deduplication on re-ingestion

## Task Commits

Each task was committed atomically:

1. **Task 1: Create markdown document loader** - `91b8dc8` (feat)
2. **Task 2: Create semantic text chunker with heading context** - `01374c7` (feat)

## Files Created/Modified
- `scripts/ingest/loader.ts` - Finds markdown files, parses frontmatter, returns LoadedDocument[]
- `scripts/ingest/chunker.ts` - Splits documents with heading context, token sizing, content hashes

## Decisions Made
- Used simple regex-based YAML parsing for frontmatter (sufficient for key:value pairs, no external dependency)
- 800 token target with 100 token overlap (per research: balances context size vs retrieval granularity)
- RecursiveCharacterTextSplitter.fromLanguage('markdown') for proper markdown-aware splitting
- Heading path stored as "Section > Subsection > Topic" format for readable context

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- loader.ts and chunker.ts ready for use in ingestion pipeline
- Plan 01-03 (embedding) can use these modules to process documents
- Plan 01-04 (CLI orchestration) can wire these together

---
*Phase: 01-data-pipeline*
*Completed: 2026-01-24*

# Phase 01 Plan 03: Embedder and Uploader Summary

**Batch embedding generation via OpenRouter with Vercel AI SDK and Supabase vector storage with upsert for idempotent ingestion**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-24T15:06:48Z
- **Completed:** 2026-01-24T15:08:35Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Batch embedding generator with 50-chunk batches and heading context prepending
- Supabase uploader with upsert preventing duplicates on re-ingestion
- Helper functions for file deletion and chunk counting
- Progress callbacks in both modules for CLI integration

## Task Commits

Each task was committed atomically:

1. **Task 1: Create batch embedding generator** - `685ff12` (feat)
2. **Task 2: Create Supabase vector uploader** - `98a5db4` (feat)

## Files Created/Modified
- `scripts/ingest/embedder.ts` - Generates 1536-dim embeddings via OpenRouter with batching and rate limiting
- `scripts/ingest/uploader.ts` - Stores chunks in Supabase with upsert, includes delete and count helpers

## Decisions Made
- Batch size of 50 for embeddings (conservative limit to avoid rate limits)
- Batch size of 100 for database inserts (Supabase performs well at this size)
- 100ms delay between embedding batches for rate limit avoidance
- Prepend heading_path to chunk content before embedding for better semantic context
- Use service role key for Supabase (not anon key) for insert permissions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. Environment variables (OPENROUTER_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY) were documented in 01-01.

## Next Phase Readiness
- Embedder and uploader ready for integration into CLI orchestrator
- Types flow correctly: ChunkWithContext -> generateEmbeddings -> DocumentChunk -> uploadChunks
- Both modules expose progress callbacks for spinner updates

---
*Phase: 01-data-pipeline*
*Completed: 2026-01-24*

# Plan 01-04 Summary: CLI Entry Point and Verification

## What Was Built

- **scripts/ingest/index.ts**: CLI entry point orchestrating the full ingestion pipeline

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Commander for CLI | Standard Node.js CLI framework with subcommands |
| Ora spinners with progress callbacks | Visual feedback during long operations |
| Chalk for colored output | Better UX with color-coded messages |
| Dry-run mode | Test chunking without API keys |
| Default version = today's date | Simple versioning for re-ingestion |

## Verification Results

- [x] `npm run ingest -- --help` shows usage
- [x] `npm run ingest -- run --dry-run` previews chunks
- [x] `npm run ingest -- run` completes full pipeline
- [x] Supabase table has chunks with embeddings
- [x] User verified end-to-end: "approved"

## Files Changed

| File | Change |
|------|--------|
| scripts/ingest/index.ts | Created - CLI with run and count commands |
| scripts/ingest/loader.ts | Fixed - Windows path compatibility |

## Commits

- `18f309e` - feat(ingest): add CLI entry point with commander
- `7171a2d` - Fix: Windows path compatibility for glob pattern

## Issues Encountered

- **Windows glob paths**: Fixed by converting backslashes to forward slashes in loader.ts

---
*Completed: 2026-01-24*
*Duration: ~5 min (including user verification)*
*Checkpoint: PASSED*
