# T04: 01-data-pipeline 04

**Slice:** S01 — **Milestone:** M001

## Description

Create the CLI entry point that orchestrates the full ingestion pipeline and verify end-to-end functionality.

Purpose: This is the user-facing interface to the data pipeline. It ties all modules together and provides feedback during ingestion.
Output: Working CLI script that can ingest documentation into Supabase with progress feedback.

## Must-Haves

- [ ] "CLI script runs full pipeline: load -> chunk -> embed -> upload"
- [ ] "CLI script shows progress during each stage"
- [ ] "CLI script has dry-run mode for testing without upload"
- [ ] "Vector similarity search returns relevant chunks"

## Files

- `scripts/ingest/index.ts`
