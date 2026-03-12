# T03: 01-data-pipeline 03

**Slice:** S01 — **Milestone:** M001

## Description

Implement embedding generation and Supabase storage for the ingestion pipeline.

Purpose: These modules transform text chunks into vectors and persist them in the database for similarity search.
Output: embedder.ts that generates embeddings via OpenRouter, uploader.ts that stores them in Supabase.

## Must-Haves

- [ ] "Embedder generates 1536-dimensional vectors for text chunks"
- [ ] "Embedder batches requests to avoid rate limits"
- [ ] "Uploader stores chunks with embeddings in Supabase"
- [ ] "Uploader uses upsert to prevent duplicates on re-ingestion"

## Files

- `scripts/ingest/embedder.ts`
- `scripts/ingest/uploader.ts`
