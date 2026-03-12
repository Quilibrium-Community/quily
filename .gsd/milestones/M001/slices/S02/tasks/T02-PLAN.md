# T02: 02-rag-pipeline 02

**Slice:** S02 — **Milestone:** M001

## Description

Build the prompt assembly layer and streaming chat API endpoint.

Purpose: Complete the RAG pipeline - take retrieved chunks, format into prompt with citations, stream LLM response with source metadata.
Output: Working /api/chat endpoint that accepts user query and streams AI response with source references.

## Must-Haves

- [ ] "POST /api/chat accepts messages, apiKey, model and streams response"
- [ ] "Retrieved chunks are formatted with numbered citations in system prompt"
- [ ] "Response includes source metadata before LLM tokens stream"
- [ ] "LLM is instructed to cite sources using [1], [2], etc."

## Files

- `src/lib/rag/prompt.ts`
- `app/api/chat/route.ts`
