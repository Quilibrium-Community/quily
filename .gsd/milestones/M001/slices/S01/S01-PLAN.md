# S01: Data Pipeline

**Goal:** Set up the project foundation with TypeScript configuration, dependencies, database schema, and shared type definitions.
**Demo:** Set up the project foundation with TypeScript configuration, dependencies, database schema, and shared type definitions.

## Must-Haves


## Tasks

- [x] **T01: 01-data-pipeline 01** `est:3min`
  - Set up the project foundation with TypeScript configuration, dependencies, database schema, and shared type definitions.

Purpose: Establishes the foundation that all other plans build upon. Without this, no code can compile or run.
Output: Working TypeScript project with database schema ready for vector storage.
- [x] **T02: 01-data-pipeline 02** `est:1min`
  - Implement markdown loading and semantic chunking for the ingestion pipeline.

Purpose: These modules transform raw markdown files into properly-sized chunks with metadata, ready for embedding.
Output: loader.ts that finds and loads markdown files, chunker.ts that splits them with heading context preservation.
- [x] **T03: 01-data-pipeline 03** `est:2min`
  - Implement embedding generation and Supabase storage for the ingestion pipeline.

Purpose: These modules transform text chunks into vectors and persist them in the database for similarity search.
Output: embedder.ts that generates embeddings via OpenRouter, uploader.ts that stores them in Supabase.
- [x] **T04: 01-data-pipeline 04**
  - Create the CLI entry point that orchestrates the full ingestion pipeline and verify end-to-end functionality.

Purpose: This is the user-facing interface to the data pipeline. It ties all modules together and provides feedback during ingestion.
Output: Working CLI script that can ingest documentation into Supabase with progress feedback.

## Files Likely Touched

- `package.json`
- `tsconfig.json`
- `.env.example`
- `scripts/db/schema.sql`
- `scripts/ingest/types.ts`
- `scripts/ingest/loader.ts`
- `scripts/ingest/chunker.ts`
- `scripts/ingest/embedder.ts`
- `scripts/ingest/uploader.ts`
- `scripts/ingest/index.ts`
