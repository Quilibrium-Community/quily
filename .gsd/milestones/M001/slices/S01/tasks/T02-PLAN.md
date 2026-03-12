# T02: 01-data-pipeline 02

**Slice:** S01 — **Milestone:** M001

## Description

Implement markdown loading and semantic chunking for the ingestion pipeline.

Purpose: These modules transform raw markdown files into properly-sized chunks with metadata, ready for embedding.
Output: loader.ts that finds and loads markdown files, chunker.ts that splits them with heading context preservation.

## Must-Haves

- [ ] "Loader finds all markdown files in a directory"
- [ ] "Loader extracts frontmatter from markdown files"
- [ ] "Chunker splits text at semantic boundaries (headings, paragraphs)"
- [ ] "Chunks are 500-1000 tokens with 100 token overlap"
- [ ] "Each chunk includes heading path metadata"

## Files

- `scripts/ingest/loader.ts`
- `scripts/ingest/chunker.ts`
