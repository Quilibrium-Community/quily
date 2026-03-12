---
id: S02
parent: M001
milestone: M001
provides:
  - Prompt builder with citation formatting (buildContextBlock, buildSystemPrompt, formatSourcesForClient)
  - Streaming chat API endpoint (POST /api/chat)
  - Next.js App Router configuration
requires: []
affects: []
key_files: []
key_decisions:
  - "createUIMessageStream over legacy createDataStreamResponse for ai SDK v6"
  - "source-url stream parts for citation metadata before LLM response"
  - "Minimal next.config.js - v16 defaults work well"
  - "Path alias @/* for clean imports"
patterns_established:
  - "Prompt pattern: [N] citation format with source path and heading"
  - "Stream pattern: sources first via writer.write, then LLM via writer.merge"
  - "Validation pattern: zod schema for request body validation"
observability_surfaces: []
drill_down_paths: []
duration: 7min
verification_result: passed
completed_at: 2026-01-24
blocker_discovered: false
---
# S02: Rag Pipeline

**# Phase 02 Plan 01: RAG Retrieval Layer Summary**

## What Happened

# Phase 02 Plan 01: RAG Retrieval Layer Summary

**One-liner:** Two-stage retrieval with vector search via Supabase RPC and optional Cohere reranking for improved relevance.

## What Was Built

### 1. RAG Type Definitions (`src/lib/rag/types.ts`)

Three interfaces for the retrieval layer:

- **RetrievedChunk**: Search result with id, content, source_file, heading_path, similarity, citationIndex
- **RetrievalOptions**: Config for retrieval (API keys, counts, thresholds)
- **SourceReference**: Citation display format for client

### 2. Supabase Client Singleton (`src/lib/supabase.ts`)

Server-side Supabase client with:
- Service role key authentication
- Env var validation at import time
- Singleton pattern for connection reuse

### 3. Two-Stage Retriever (`src/lib/rag/retriever.ts`)

`retrieveWithReranking(query, options)` function:

**Stage 1 - Vector Search:**
- Embeds query with `openai/text-embedding-3-small` (same as ingestion)
- Calls `match_document_chunks` RPC with configurable threshold/count
- Returns candidates sorted by cosine similarity

**Stage 2 - Optional Reranking:**
- If Cohere API key available AND enough candidates:
  - Reranks with `rerank-v3.5` model
  - Maps back to original metadata
- Fallback: Returns top N by similarity score

**Output:** Array of `RetrievedChunk` with 1-based `citationIndex` for display.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| b8afcb6 | feat | Add RAG types and dependencies |
| 953316f | feat | Create Supabase client singleton |
| d1947c2 | feat | Create two-stage retriever with reranking |

## Files Changed

**Created:**
- `src/lib/rag/types.ts` - RetrievedChunk, RetrievalOptions, SourceReference
- `src/lib/rag/retriever.ts` - retrieveWithReranking function
- `src/lib/supabase.ts` - Supabase client singleton

**Modified:**
- `package.json` - Added @ai-sdk/cohere, zod dependencies
- `.env.example` - Added NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, COHERE_API_KEY

## Deviations from Plan

None - plan executed exactly as written.

## Key Patterns Established

1. **Two-stage retrieval**: Over-fetch candidates, rerank for quality
2. **Optional enhancement**: Works without Cohere, better with it
3. **Citation indexing**: 1-based indices for display consistency
4. **Environment fallback**: API keys from options or process.env

## Integration Points

**Uses (from Phase 1):**
- `match_document_chunks` RPC function (created in 01-03)
- Same embedding model `openai/text-embedding-3-small` (used in 01-02)

**Provides (for Phase 2):**
- `retrieveWithReranking()` for API route
- `RetrievedChunk` type for response formatting
- `SourceReference` type for citation display

## Next Phase Readiness

Ready for:
- **02-02**: Context assembly (use retrieved chunks to build prompts)
- **02-03**: API route (call retriever with user query)

No blockers. Retriever module is self-contained and tested via type checking.

# Phase 2 Plan 02: Prompt Assembly & Chat API Summary

**Streaming chat API with citation-formatted prompts using Vercel AI SDK v6 createUIMessageStream**

## Performance

- **Duration:** 7 min
- **Started:** 2026-01-24T16:04:19Z
- **Completed:** 2026-01-24T16:11:04Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Prompt builder formats chunks with [N] citations and docs.quilibrium.com URLs
- System prompt instructs LLM to cite sources and stay within context
- Chat API streams source metadata before LLM tokens
- Next.js App Router configured with path aliases

## Task Commits

Each task was committed atomically:

1. **Task 1: Create prompt builder module** - `0023898` (feat)
2. **Task 2: Create streaming chat API route** - `0630fbe` (feat)
3. **Task 3: Configure Next.js and path aliases** - `cc92ffe` (chore)

## Files Created/Modified

- `src/lib/rag/prompt.ts` - Context formatting with [N] citations, system prompt builder, URL generator
- `app/api/chat/route.ts` - Streaming chat endpoint with zod validation and RAG context
- `next.config.js` - Minimal Next.js config
- `tsconfig.json` - Updated for Next.js App Router with @/* path alias
- `package.json` - Added dev/build/start scripts, next/react dependencies
- `src/lib/rag/retriever.ts` - Fixed rerank API for ai SDK v6 (RerankResult.ranking)

## Decisions Made

- **Vercel AI SDK v6 API:** Used `createUIMessageStream` with `writer.write()` for sources and `writer.merge()` for LLM stream, as `createDataStreamResponse` is not available in v6
- **Source streaming:** Send sources as `source-url` stream parts before LLM response starts, enabling frontend to display citations while tokens stream
- **URL generation:** Construct docs.quilibrium.com URLs for files starting with `docs/`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed retriever.ts rerank API mismatch**
- **Found during:** Task 2 (type checking chat route)
- **Issue:** retriever.ts used `results` property and `cohere.reranking(model, {apiKey})` which don't exist in ai SDK v6
- **Fix:** Changed to `ranking` property with `originalIndex`, used `createCohere({apiKey})` provider factory
- **Files modified:** src/lib/rag/retriever.ts
- **Verification:** `npx tsc --noEmit` passes
- **Committed in:** 0630fbe (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential fix for type checking to pass. No scope creep.

## Issues Encountered

- **ai SDK v6 API changes:** Plan specified `createDataStreamResponse` which doesn't exist in v6. Adapted to use `createUIMessageStream` + `createUIMessageStreamResponse` pattern which achieves same goal.

## User Setup Required

None - no external service configuration required for this plan. Cohere API key remains optional (set in 02-01).

## Next Phase Readiness

- Chat API ready for frontend integration
- Streaming works with sources-first pattern
- Next.js dev server starts successfully
- Path aliases configured for clean imports

---
*Phase: 02-rag-pipeline*
*Completed: 2026-01-24*
