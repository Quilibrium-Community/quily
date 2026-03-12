# S02: Rag Pipeline

**Goal:** Create the RAG retrieval layer: types, Supabase client, and two-stage retriever with optional reranking.
**Demo:** Create the RAG retrieval layer: types, Supabase client, and two-stage retriever with optional reranking.

## Must-Haves


## Tasks

- [x] **T01: 02-rag-pipeline 01**
  - Create the RAG retrieval layer: types, Supabase client, and two-stage retriever with optional reranking.

Purpose: Foundation for semantic search - given a query, find and rank the most relevant documentation chunks.
Output: Working retriever module that can be called with a query string and returns citation-indexed chunks.
- [x] **T02: 02-rag-pipeline 02** `est:7min`
  - Build the prompt assembly layer and streaming chat API endpoint.

Purpose: Complete the RAG pipeline - take retrieved chunks, format into prompt with citations, stream LLM response with source metadata.
Output: Working /api/chat endpoint that accepts user query and streams AI response with source references.

## Files Likely Touched

- `src/lib/rag/types.ts`
- `src/lib/rag/retriever.ts`
- `src/lib/supabase.ts`
- `src/lib/rag/prompt.ts`
- `app/api/chat/route.ts`
