# T01: 02-rag-pipeline 01

**Slice:** S02 — **Milestone:** M001

## Description

Create the RAG retrieval layer: types, Supabase client, and two-stage retriever with optional reranking.

Purpose: Foundation for semantic search - given a query, find and rank the most relevant documentation chunks.
Output: Working retriever module that can be called with a query string and returns citation-indexed chunks.

## Must-Haves

- [ ] "Query embedding matches documents via match_document_chunks RPC"
- [ ] "Retriever returns chunks with source metadata and citation indices"
- [ ] "Reranking optional based on Cohere key availability"

## Files

- `src/lib/rag/types.ts`
- `src/lib/rag/retriever.ts`
- `src/lib/supabase.ts`
