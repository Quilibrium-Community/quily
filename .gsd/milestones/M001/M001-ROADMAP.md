# M001: Migration

**Vision:** A self-hosted, open-source RAG chatbot that answers questions about the Quilibrium protocol.

## Success Criteria


## Slices

- [x] **S01: Data Pipeline** `risk:medium` `depends:[]`
  > After this: Set up the project foundation with TypeScript configuration, dependencies, database schema, and shared type definitions.
- [x] **S02: Rag Pipeline** `risk:medium` `depends:[S01]`
  > After this: Create the RAG retrieval layer: types, Supabase client, and two-stage retriever with optional reranking.
- [x] **S03: Chat Interface** `risk:medium` `depends:[S02]`
  > After this: Set up Phase 3 foundation: Tailwind CSS 4.
- [x] **S04: Polish** `risk:medium` `depends:[S03]`
  > After this: Install theme infrastructure and implement light/dark mode toggle.
