# T01: 01-data-pipeline 01

**Slice:** S01 — **Milestone:** M001

## Description

Set up the project foundation with TypeScript configuration, dependencies, database schema, and shared type definitions.

Purpose: Establishes the foundation that all other plans build upon. Without this, no code can compile or run.
Output: Working TypeScript project with database schema ready for vector storage.

## Must-Haves

- [ ] "npm install completes without errors"
- [ ] "TypeScript compiles without errors"
- [ ] "Database schema exists in Supabase with pgvector extension"
- [ ] "Similarity search function is callable via RPC"

## Files

- `package.json`
- `tsconfig.json`
- `.env.example`
- `scripts/db/schema.sql`
- `scripts/ingest/types.ts`
