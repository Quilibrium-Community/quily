# Project Research Summary

**Project:** Quilibrium Documentation RAG Chatbot
**Domain:** Self-hosted RAG documentation assistant with user-provided API keys
**Researched:** 2026-01-24
**Confidence:** HIGH

## Executive Summary

This project is a RAG-powered documentation chatbot targeting Quilibrium protocol documentation (50-100 markdown files + 20 transcripts) with zero operational cost through user-provided OpenRouter API keys. Based on comprehensive research, the recommended approach is to build with **Vercel AI SDK (raw implementation)** rather than heavyweight frameworks like LangChain, using **assistant-ui** for the chat interface, **pgvector on Supabase** for vector storage, and **text-embedding-3-small** for embeddings. This "simple stack" approach is validated by 2025-2026 ecosystem consensus: for straightforward RAG use cases, raw implementation beats framework overhead.

The architecture follows a clear separation of concerns: an **offline ingestion pipeline** (document chunking, embedding generation, storage) runs at build/CLI time, while the **online query pipeline** (vector search, context assembly, LLM generation, streaming) runs on Vercel Edge/Node.js runtime. This separation is critical because Edge Runtime cannot handle filesystem access or heavy compute required for ingestion. The key insight is that both pipelines share the same embedding model but operate at completely different times with different constraints.

Critical risks center on **chunking strategy** (naive fixed-size chunking destroys semantic context), **hallucination despite RAG** (LLM ignoring retrieved context without proper prompt engineering), and **Vercel Edge Runtime limitations** (functions dying mid-stream if not configured correctly). Prevention requires semantic chunking with 500-1000 token chunks and 100-token overlap, strict grounding instructions in prompts requiring inline citations, and using Node.js runtime (not Edge) for routes that write to databases. Get these right from the start to avoid rewrites.

## Key Findings

### Recommended Stack

**Core principle: Simplicity over abstraction.** The 2025-2026 consensus is clear: for basic RAG applications, Vercel AI SDK provides exactly what's needed without LangChain's 50+ dependency overhead. The stack prioritizes integration quality (assistant-ui + Vercel AI SDK is best-documented), cost efficiency (pgvector on Supabase free tier works for <100k vectors), and modern embedding options (text-embedding-3-small vastly outperforms outdated models like all-MiniLM-L6-v2).

**Core technologies:**
- **assistant-ui (^0.7.x)** — Production-ready chat UI with first-class Vercel AI SDK integration, streaming support, source citation rendering, and 8.2k GitHub stars with active maintenance
- **Vercel AI SDK (^6.0.x)** — LLM orchestration with `streamText()` for backend and `useChat()` for frontend; handles streaming, message state, and abort/retry without framework complexity
- **@openrouter/ai-sdk-provider (^1.5.x)** — Official OpenRouter integration enabling 300+ models via single API with user-provided keys (zero cost to you)
- **Supabase with pgvector (0.8.x)** — Vector database proven for <1M vectors with <100ms query latency; free tier sufficient for documentation scale with built-in Row Level Security for future multi-tenancy
- **text-embedding-3-small** — 1536-dimensional embeddings at $0.02/1M tokens; vastly superior to outdated all-MiniLM-L6-v2 (2019 model with only 56% Top-5 accuracy vs 86%+)

**Critical version requirements:**
- AI SDK 6.0+ for agent abstraction, reranking support, and LangChain adapter if needed later
- assistant-ui 0.7+ for `useChatRuntime` hook with Vercel AI SDK integration
- Next.js 14.2+ for stable Edge Runtime support

**Why NOT to use:**
- **LangChain (for v1)** — Overkill for simple RAG; 50+ dependencies; ~10ms overhead vs ~3-6ms for raw implementation; adds complexity creep
- **all-MiniLM-L6-v2** — Outdated 2019 model; only 384 dimensions; 512 token limit; 56% accuracy vs 86%+ for modern models
- **chatbot-ui-lite** — Minimal starter (~21 commits); no streaming infrastructure; unmaintained; would require significant work for production features

### Expected Features

**Table stakes (users expect these):**
- **Natural language query input** — Plain language questions in standard text field
- **Accurate, grounded responses** — RAG retrieval quality is critical; hallucinations destroy trust
- **Source citations with links** — Users must be able to verify answers; builds trust and credibility
- **Streaming responses** — ChatGPT set the standard; users expect token-by-token delivery; waiting feels broken
- **Markdown + code syntax highlighting** — Developer audience expects readable code blocks with proper formatting
- **Mobile-responsive design** — Non-negotiable; many users browse documentation on mobile devices
- **Error handling with clear messages** — Graceful degradation for rate limits, network errors, API failures
- **Model selection dropdown** — Users with their own API keys want to choose cost vs capability

**Competitive differentiators (valued when present):**
- **Thumbs up/down feedback** — Simple UI, valuable for quality improvement iteration; low effort, high value
- **Copy to clipboard** — Developer convenience for code snippets; trivially easy to add
- **Suggested follow-up questions** — Reduces friction, helps discovery; can be AI-generated or curated
- **Multi-turn conversation context** — Maintains thread coherence but requires session management complexity
- **Dark mode** — Developer preference; CSS theming work but can add any time
- **Stop generation button** — User control during streaming; enables canceling long-running responses

**Anti-features (explicitly defer to v2+):**
- **User accounts/authentication** — Adds complexity; user-provided API keys already personalize experience
- **Admin panel for embeddings** — Significant backend complexity; ship with pre-built index, add admin only if update frequency demands it
- **Agentic workflows** — Executing actions requires trust and security review; pure Q&A sufficient for v1
- **Real-time doc sync** — Periodic re-indexing (manual or cron) sufficient for v1; avoid complexity of watching external sources
- **Multi-language translation** — Requires extensive testing per language; focus English docs first

### Architecture Approach

RAG chatbots follow a well-established two-pipeline pattern: **offline ingestion** (document processing, chunking, embedding, storage) and **online query** (user query, retrieval, augmentation, generation, streaming). The pipelines share a common embedding model but operate at completely different times with different performance constraints. For Vercel Edge Runtime, the architecture must handle Edge limitations (no filesystem, limited Node.js APIs) by pre-computing embeddings at build/ingestion time.

**Major components:**

1. **Ingestion Pipeline (CLI/Build time)** — Document loader reads markdown files, chunker splits into 500-1000 token chunks with 100-token overlap respecting semantic boundaries, embedder generates vectors locally via Transformers.js, storage writer inserts chunks + embeddings + metadata into Supabase

2. **Query Pipeline (Runtime - Edge/Node.js)** — API route validates request and extracts user API key, query embedder creates vector via OpenRouter API, vector search uses pgvector cosine similarity to retrieve top-k candidates, optional reranker reduces 10-20 candidates to top 5 (+20-35% accuracy), context assembly formats chunks as LLM context with citations

3. **Streaming Handler (Vercel AI SDK)** — Backend uses `streamText()` to generate token-by-token response, frontend uses `useChat()` hook for real-time delivery, includes abort/retry handling and message state management

4. **Chat UI (assistant-ui)** — Browser-based interface with message history, streaming display with auto-scroll, markdown rendering with code highlighting, source citation display with clickable links

**Key patterns to follow:**
- **Separation of ingestion and query** — Ingestion runs as CLI script with filesystem access; query runs on Edge without filesystem; enables independent scaling and testing
- **Streaming-first API design** — Design for streaming from start, not afterthought; LLM responses take 5-30s; streaming provides immediate feedback
- **Metadata-rich chunks** — Store source_file, heading_path, chunk_index, token_count with each chunk for filtering, citation, context reconstruction, and debugging
- **User-owned API keys** — Users provide OpenRouter key; never store or proxy; no billing management, no rate limiting headaches, simpler compliance

### Critical Pitfalls

1. **Naive chunking destroys context** — Fixed character/token counts without semantic boundaries cut sentences mid-thought, split code examples, separate headers from content; embedding vectors lose specificity; retrieved chunks contain half-sentences; LLM generates incorrect answers. **Prevention:** Use recursive chunking respecting paragraph boundaries; 400-800 token chunks with 10-20% overlap; preserve code blocks whole; chunk markdown by section (##) first then subdivide if needed. **Phase 1 (Ingestion Pipeline).**

2. **LLM ignores retrieved context (hallucination despite RAG)** — Without proper prompt engineering, model generates from training data instead of using retrieved chunks; users receive confident but wrong answers; trust erodes when manually verified. **Prevention:** Explicit grounding instructions ("Answer ONLY using provided context; if context doesn't contain answer, say so"); place retrieved context prominently; require inline citations; implement answer gating (refuse if similarity scores below threshold). **Phase 2-3 (Prompt Engineering).**

3. **Wrong K value and missing reranking** — Retrieving too few chunks (k=2-3) misses relevant info; too many (k=10+) floods context with noise; without reranking, initial retrieval order based solely on embedding similarity misses factually correct but semantically different chunks. **Prevention:** Start with k=5-7 for initial retrieval, rerank to top 3-4; implement two-stage retrieval (broad k=10-20 then cross-encoder reranking); use hybrid search (vector + keyword); set similarity score thresholds (don't include below 0.7). **Phase 2 (Retrieval Logic).**

4. **Vercel Edge function dies mid-stream** — Edge Runtime has strict limits (4MB bundle, no Node.js APIs, 1MB request); `onFinish` callbacks are fire-and-forget; async operations aren't awaited; Hobby plan 60s timeout can be exceeded; conversations cut off mid-response with no error. **Prevention:** Use Node.js runtime for routes needing database writes; don't rely on `onFinish` for critical operations; explicitly set `export const runtime = 'nodejs'`; implement error boundaries and timeout handling. **Phase 1 (Infrastructure).**

5. **Client-side API key exposure** — User-provided OpenRouter keys get logged, transmitted insecurely, or exposed through browser dev tools; keys leak through error messages or network requests. **Prevention:** Never log API keys server-side (even in error handlers); transmit only over HTTPS; store in localStorage (not cookies); show clear warnings; consider OAuth PKCE flow with OpenRouter; implement key validation endpoint that doesn't expose key. **Phase 1 (Security Architecture).**

6. **Unusable or missing citations** — Citations absent (no trust), wrong (cite sources not supporting claim), or unusable (dead links); LLM hallucinates citation numbers not matching retrieved chunks. **Prevention:** Store source URL/path with each chunk in metadata; include chunk ID in retrieval to map to citation; have LLM cite specific retrieved chunks, not generate citations; use tool-calling for deterministic citations. **Phase 2-3 (Response Formatting).**

## Implications for Roadmap

Based on research, suggested phase structure prioritizes **foundation before features** and **data layer before UI**. The architecture demands building ingestion pipeline first (can't test retrieval without data), then query pipeline (core RAG loop), then user interface (requires working backend), then enhancements (polish and optimization).

### Phase 1: Foundation & Data Pipeline
**Rationale:** Everything depends on having quality data properly ingested. Cannot test retrieval without embeddings. Cannot test generation without retrieval. The ingestion pipeline's chunking strategy is the most critical architectural decision that impacts all downstream quality.

**Delivers:**
- Supabase schema with pgvector extension, documents and chunks tables, HNSW index for <1M vector performance
- CLI ingestion script: markdown loader, semantic chunker (500-1000 tokens, 100 overlap, respect boundaries), local embedding via Transformers.js, metadata-rich storage
- Initial corpus embedded and searchable (50-100 docs + 20 transcripts)

**Addresses (from FEATURES.md):**
- Foundation for "Accurate, grounded responses" (table stakes)
- Enables "Source citations with links" (table stakes)

**Avoids (from PITFALLS.md):**
- **Pitfall 1:** Naive chunking — implement semantic chunking from start
- **Pitfall 8:** Embedding drift — version configuration, standardize preprocessing
- **Pitfall 11:** pgvector misconfiguration — configure HNSW correctly for corpus size

**Research needed:** No — chunking and embedding patterns are well-documented in research sources.

---

### Phase 2: Query Pipeline & RAG Core
**Rationale:** The critical path is the RAG loop: query embedding, vector search, context assembly, LLM generation. Test this thoroughly as standalone API before adding UI complexity. Streaming must be built from day one (not added later) because it's core to UX expectations.

**Delivers:**
- API route (`/api/chat`) with streaming support via Vercel AI SDK
- Query embedding via OpenRouter API (runtime, user's key)
- Vector similarity search with pgvector cosine distance
- Context assembly with token counting and prompt templates
- OpenRouter LLM integration with `streamText()`
- Two-stage retrieval: initial k=10-20, reranking to top 5
- Hybrid search (semantic + keyword) for technical term matching

**Uses (from STACK.md):**
- Vercel AI SDK ^6.0.x for `streamText()` backend orchestration
- @openrouter/ai-sdk-provider for multi-model access
- Supabase JS client for vector search queries
- text-embedding-3-small for query embedding (via OpenRouter)

**Implements (from ARCHITECTURE.md):**
- Query Pipeline components: query embedder, vector search, reranker, context assembly, LLM provider, stream handler
- Streaming-first API design pattern
- User-owned API keys pattern (BYOK)

**Avoids (from PITFALLS.md):**
- **Pitfall 2:** Wrong K value — implement two-stage retrieval with reranking
- **Pitfall 3:** Hallucination — strict grounding instructions, require citations
- **Pitfall 4:** Edge function death — use Node.js runtime for this route
- **Pitfall 9:** No streaming — build streaming from day one

**Research needed:** Possibly for reranking integration (Cohere/Jina APIs) if not using simple LLM-based reranking.

---

### Phase 3: Chat Interface & User Experience
**Rationale:** UI can only be properly tested with working backend. assistant-ui provides production-ready components for streaming, markdown, citations. Focus on core chat experience before adding enhancements.

**Delivers:**
- Chat UI with assistant-ui components (Thread, Message, Input primitives)
- API key management: input UI, localStorage storage, validation
- Message history with streaming display (`useChat` hook)
- Markdown rendering with code syntax highlighting (Prism/Shiki)
- Source citation display with clickable links to documentation
- Mobile-responsive design with Tailwind CSS
- Error handling with user-friendly messages
- Loading/typing indicators during generation

**Uses (from STACK.md):**
- assistant-ui ^0.7.x with `@assistant-ui/react-ai-sdk` integration
- Vercel AI SDK `useChat()` hook for frontend streaming
- Next.js 14.x+ for app framework
- Tailwind CSS for responsive styling

**Addresses (from FEATURES.md):**
- Natural language query input (table stakes)
- Streaming responses (table stakes)
- Markdown + code highlighting (table stakes)
- Mobile-responsive design (table stakes)
- Error handling (table stakes)
- Model selection dropdown (table stakes)
- Source citations with links (table stakes)

**Avoids (from PITFALLS.md):**
- **Pitfall 6:** API key exposure — HTTPS only, localStorage, clear warnings
- **Pitfall 10:** Unusable citations — tool-based citations, verify links
- **Pitfall 13:** Code formatting — ensure proper markdown rendering
- **Pitfall 15:** Error exposure — catch all errors, user-friendly messages

**Research needed:** No — assistant-ui integration is well-documented with examples.

---

### Phase 4: Quality & Trust Features
**Rationale:** After core chat works, add features that improve answer quality and build user trust. These are differentiators that increase engagement and enable iteration based on feedback.

**Delivers:**
- Thumbs up/down feedback mechanism with analytics logging
- Copy to clipboard for code blocks and responses
- Suggested follow-up questions (AI-generated based on context)
- Stop generation button for long-running responses
- Conversation context management (multi-turn awareness)
- "I don't know" graceful handling with similarity thresholds
- Dark mode CSS theming

**Addresses (from FEATURES.md):**
- Thumbs up/down feedback (differentiator)
- Copy to clipboard (differentiator)
- Suggested follow-up questions (differentiator)
- Stop generation button (differentiator)
- Multi-turn conversation context (differentiator)
- Dark mode (differentiator)

**Avoids (from PITFALLS.md):**
- **Pitfall 12:** No graceful "I don't know" — similarity thresholds, explicit refusal
- **Pitfall 14:** Missing conversation context — include last N messages in prompt

**Research needed:** No — these are standard patterns with existing implementations.

---

### Phase 5: Security Hardening (Post-MVP)
**Rationale:** For self-hosted with controlled documentation corpus, security risks are lower initially. However, before scaling or adding user-submitted content, implement security measures.

**Delivers:**
- Sanitization of retrieved content to prevent prompt injection
- Output validation before showing responses to users
- Content guardrails detecting injection patterns
- Audit process for new document sources (especially transcriptions)
- OAuth PKCE flow option as alternative to raw API key input
- Rate limiting and abuse prevention

**Avoids (from PITFALLS.md):**
- **Pitfall 5:** Prompt injection — sanitize retrieved content, clear delimiters, output validation

**Research needed:** Possibly for OAuth PKCE implementation details with OpenRouter.

---

### Phase Ordering Rationale

**Why this order:**
1. **Data first** — Cannot build retrieval without embedded corpus; chunking strategy impacts all downstream quality
2. **Backend before frontend** — RAG pipeline must work standalone before adding UI; enables isolated testing and validation
3. **Streaming from day one** — Not an enhancement; core UX expectation; adding later requires architectural changes
4. **Quality after functionality** — Feedback and enhancements require working chat to gather user input
5. **Security iteratively** — Controlled corpus reduces initial risk; harden before scaling or adding dynamic content

**Dependency flow:**
- Phase 1 output (embedded corpus) required for Phase 2 (retrieval)
- Phase 2 output (working API) required for Phase 3 (UI integration)
- Phase 3 output (user-facing chat) required for Phase 4 (feedback collection)
- Phases 1-3 complete before Phase 5 (can't secure what doesn't exist)

**Pitfall avoidance:**
- Building ingestion (Phase 1) correctly avoids chunking pitfalls that would require re-embedding entire corpus
- Building streaming (Phase 2) from start avoids Edge function death and UX rewrites
- Separating security (Phase 5) allows focus on core functionality but doesn't defer critical issues (API key handling in Phase 3)

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 2 (Reranking integration):** If using Cohere or Jina APIs for cross-encoder reranking, may need `/gsd:research-phase` for API specifics and pricing
- **Phase 5 (OAuth PKCE flow):** If implementing OAuth alternative to raw keys, needs OpenRouter OAuth documentation research

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Ingestion):** Chunking and embedding patterns thoroughly documented in research sources
- **Phase 3 (Chat UI):** assistant-ui + Vercel AI SDK integration has official docs and templates
- **Phase 4 (Quality features):** Standard patterns with existing implementations (feedback buttons, copy-to-clipboard, etc.)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | Official Vercel AI SDK docs, assistant-ui GitHub with 8.2k stars, Supabase pgvector production usage verified, OpenRouter provider package official |
| Features | **HIGH** | Multiple RAG chatbot sources agree on table stakes (citations, streaming, markdown); anti-features validated by community pitfalls |
| Architecture | **HIGH** | Two-pipeline pattern is well-established; Vercel Edge constraints documented; ingestion/query separation validated by official templates |
| Pitfalls | **MEDIUM-HIGH** | Critical pitfalls (chunking, hallucination, Edge death) verified across multiple sources; some lower-priority pitfalls from single sources |

**Overall confidence:** **HIGH**

The core recommendation (Vercel AI SDK raw implementation over LangChain for simple RAG) is validated by 2025-2026 ecosystem consensus. The stack choices (assistant-ui, pgvector, text-embedding-3-small) have official documentation and production usage examples. The architecture pattern (separate ingestion/query pipelines) is standard for Edge deployments. Critical pitfalls are well-documented with clear prevention strategies.

### Gaps to Address

**During Phase 1 implementation:**
- Validate chunking strategy on sample Quilibrium docs — may need adjustment based on actual heading structure and code block patterns
- Test text-embedding-3-small quality on protocol-specific terminology — consider hybrid search if semantic-only fails on technical terms

**During Phase 2 implementation:**
- Determine reranking approach: simple LLM-based vs dedicated API (Cohere/Jina) — benchmark latency vs accuracy tradeoff
- Set optimal k value empirically — start with k=10-20 for retrieval, top 5 after reranking, but adjust based on actual doc corpus

**During Phase 3 implementation:**
- Decide on conversation context strategy: include last N messages vs summarization — depends on typical user session patterns
- Validate citation link format matches Quilibrium docs URL structure — metadata must include correct paths

**Open questions (resolve during planning):**
- Should query embeddings use OpenRouter (consistent with LLM calls) or dedicated embedding API (potentially cheaper/faster)?
- For transcriptions specifically: do they need special preprocessing (speaker labels, timestamps) before chunking?
- What's the acceptable similarity score threshold for "I don't know" responses (0.6? 0.7? empirically determine)?

## Sources

### Primary (HIGH confidence)
- [Vercel AI SDK 6 Announcement](https://vercel.com/blog/ai-sdk-6) — December 2025 release details, agent abstraction, reranking support
- [assistant-ui GitHub](https://github.com/assistant-ui/assistant-ui) — Updated January 2026, 8.2k stars, production usage examples
- [assistant-ui Vercel AI SDK Docs](https://www.assistant-ui.com/docs/runtimes/ai-sdk/use-chat) — Integration patterns with `useChatRuntime`
- [OpenRouter AI SDK Provider](https://github.com/OpenRouterTeam/ai-sdk-provider) — Official provider package, 162+ projects using
- [Supabase AI & Vectors Docs](https://supabase.com/docs/guides/ai) — Vector storage patterns, pgvector extension guide
- [Vercel Edge Runtime Docs](https://vercel.com/docs/functions/runtimes/edge) — Runtime constraints, limitations, best practices
- [OWASP LLM Top 10](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — Prompt injection as #1 risk for LLM apps

### Secondary (MEDIUM confidence)
- [RAG Stack Recommendations 2025](https://medium.com/devmap/the-rag-stack-id-use-if-i-were-starting-from-zero-in-2025-and-why-c4b1d67ad859) — LangChain vs raw implementation guidance
- [NVIDIA RAG 101](https://developer.nvidia.com/blog/rag-101-demystifying-retrieval-augmented-generation-pipelines/) — Two-pipeline architecture explanation
- [Pinecone: Rerankers Guide](https://www.pinecone.io/learn/series/rag/rerankers/) — Two-stage retrieval with cross-encoders
- [Weaviate: Chunking Strategies](https://weaviate.io/blog/chunking-strategies-for-rag) — Semantic boundary preservation
- [Unstructured: Chunking Best Practices](https://unstructured.io/blog/chunking-for-rag-best-practices) — Context preservation importance
- [Stack Overflow: Chunking in RAG](https://stackoverflow.blog/2024/12/27/breaking-up-is-hard-to-do-chunking-in-rag-applications/) — Chunking pitfalls
- [kapa.ai: RAG Common Mistakes](https://www.kapa.ai/blog/rag-gone-wrong-the-7-most-common-mistakes-and-how-to-avoid-them) — K value, chunking, hallucination issues
- [AWS: RAG Security](https://aws.amazon.com/blogs/security/hardening-the-rag-chatbot-architecture-powered-by-amazon-bedrock-blueprint-for-secure-design-and-anti-pattern-migration/) — Security patterns
- [Promptfoo: RAG Data Poisoning](https://www.promptfoo.dev/blog/rag-poisoning/) — Injection via retrieved documents

### Tertiary (LOW confidence, needs validation)
- [Vercel Community: Edge Functions Dying](https://community.vercel.com/t/vercel-edge-functions-dying-without-hitting-timeout-limits/17879) — Anecdotal reports of Edge function issues
- [DEV Community: Embedding Drift](https://dev.to/dowhatmatters/embedding-drift-the-quiet-killer-of-retrieval-quality-in-rag-systems-4l5m) — Single source on drift issues

---
*Research completed: 2026-01-24*
*Ready for roadmap: yes*

# Architecture Patterns: RAG Chatbot System

**Domain:** Self-hosted RAG chatbot for Quilibrium protocol documentation
**Researched:** 2026-01-24
**Confidence:** HIGH (verified with official documentation)

## Executive Summary

RAG chatbot systems follow a well-established architectural pattern with two distinct pipelines: an **offline ingestion pipeline** (document processing, chunking, embedding, storage) and an **online query pipeline** (user query, retrieval, augmentation, generation, response streaming). The key architectural insight is that these pipelines share a common embedding model but operate at completely different times and with different performance constraints.

For the Quilibrium documentation chatbot with Vercel Edge Runtime constraints, the architecture must account for:
- Pre-computed embeddings at build/ingestion time (not runtime)
- Edge Runtime limitations (no filesystem, limited Node.js APIs)
- Streaming responses via Vercel AI SDK
- User-provided API keys requiring secure handling

---

## Recommended Architecture

```
+------------------+     +-------------------+     +------------------+
|   INGESTION      |     |     STORAGE       |     |   QUERY FLOW     |
|   PIPELINE       |     |                   |     |   (Runtime)      |
|   (Offline/CLI)  |     |                   |     |                  |
+------------------+     +-------------------+     +------------------+
        |                         |                        |
        v                         v                        v
+------------------+     +-------------------+     +------------------+
| 1. Document      |     | Supabase          |     | 1. User Query    |
|    Loader        |     | PostgreSQL        |     |    (Browser)     |
| (Markdown files) |     |                   |     +--------+---------+
+--------+---------+     | - documents table |              |
         |               | - chunks table    |              v
         v               | - embeddings      |     +------------------+
+------------------+     |   (pgvector)      |     | 2. API Route     |
| 2. Chunker       |     | - metadata        |     |    (Edge/Node)   |
| (500-1000 tokens |     +-------------------+     +--------+---------+
|  100 overlap)    |              ^                        |
+--------+---------+              |                        v
         |                        |               +------------------+
         v                        |               | 3. Query         |
+------------------+              |               |    Embedding     |
| 3. Embedder      |              |               | (runtime API or  |
| (all-MiniLM-L6-v2|              |               |  pre-computed)   |
|  Transformers.js)|              |               +--------+---------+
+--------+---------+              |                        |
         |                        |                        v
         v                        |               +------------------+
+------------------+              |               | 4. Vector Search |
| 4. Storage       +--------------+               |    (pgvector)    |
|    Writer        |                              +--------+---------+
| (Supabase client)|                                       |
+------------------+                                       v
                                                  +------------------+
                                                  | 5. Reranker      |
                                                  |    (optional)    |
                                                  +--------+---------+
                                                           |
                                                           v
                                                  +------------------+
                                                  | 6. Context       |
                                                  |    Assembly      |
                                                  +--------+---------+
                                                           |
                                                           v
                                                  +------------------+
                                                  | 7. LLM Call      |
                                                  |    (OpenRouter)  |
                                                  +--------+---------+
                                                           |
                                                           v
                                                  +------------------+
                                                  | 8. Stream        |
                                                  |    Response      |
                                                  | (Vercel AI SDK)  |
                                                  +------------------+
```

---

## Component Boundaries

| Component | Responsibility | Communicates With | Runtime |
|-----------|---------------|-------------------|---------|
| **Document Loader** | Read markdown files from filesystem | Chunker | CLI/Build |
| **Chunker** | Split documents into semantic chunks with overlap | Embedder | CLI/Build |
| **Embedder** | Generate 384-dim vectors using all-MiniLM-L6-v2 | Storage Writer | CLI/Build |
| **Storage Writer** | Insert chunks + embeddings into Supabase | Supabase | CLI/Build |
| **Chat UI** | User interaction, message history | API Route | Browser |
| **API Route** | Orchestrate RAG pipeline, handle streaming | All query components | Edge/Node |
| **Query Embedder** | Embed user query at runtime | Vector Search | Edge/Node |
| **Vector Search** | Retrieve top-k similar chunks | Supabase pgvector | Edge/Node |
| **Reranker** | Re-score retrieved chunks for relevance | Context Assembly | Edge/Node (optional) |
| **Context Assembly** | Format retrieved chunks as LLM context | LLM Call | Edge/Node |
| **LLM Provider** | Generate response via OpenRouter | Stream Response | External API |
| **Stream Handler** | Stream tokens to browser via SSE | Chat UI | Edge/Node |

---

## Data Flow

### Ingestion Pipeline (Offline)

```
Markdown Files (50-100 docs + 20 transcripts)
    |
    v
[1] Load & Parse Markdown
    - Preserve heading structure
    - Extract front matter as metadata
    - Maintain source file reference
    |
    v
[2] Chunking Strategy
    - Target: 500-1000 tokens per chunk
    - Overlap: 100 tokens (10-15%)
    - Split on: Heading boundaries first, then paragraphs
    - Preserve: Section context in chunk metadata
    |
    v
[3] Embedding Generation
    - Model: all-MiniLM-L6-v2 via Transformers.js
    - Output: 384-dimensional vectors
    - Batch processing for efficiency
    - Run locally (no API calls needed)
    |
    v
[4] Storage
    - Insert into Supabase PostgreSQL
    - Store: chunk text, embedding vector, metadata
    - Metadata: source_file, heading_path, chunk_index
```

### Query Pipeline (Online)

```
User Query (from browser)
    |
    v
[1] API Route Handler (/api/chat)
    - Validate request
    - Extract user API key from header/session
    - Initialize Supabase client
    |
    v
[2] Query Embedding
    OPTION A (Recommended for your constraints):
    - Use OpenRouter embedding endpoint (user's API key)
    - Or use Supabase Edge Function with local model

    OPTION B (If avoiding runtime embedding):
    - Pre-compute common query embeddings
    - Use hybrid keyword + semantic search
    |
    v
[3] Vector Similarity Search
    - Query: SELECT * FROM chunks
             ORDER BY embedding <=> query_embedding
             LIMIT 10
    - Uses pgvector's cosine distance operator
    - Returns top-k candidates (10-20)
    |
    v
[4] Reranking (Optional but Recommended)
    - Cross-encoder reranking via API (Cohere, Jina)
    - Or: Simple relevance scoring with LLM
    - Reduces 10-20 candidates to 5 best
    - Adds 200-500ms latency but +20-35% accuracy
    |
    v
[5] Context Assembly
    - Format: System prompt + retrieved chunks + user query
    - Include source citations for each chunk
    - Respect LLM context window limits
    |
    v
[6] LLM Generation (OpenRouter)
    - User provides their own API key
    - Stream response via SSE
    - Model selection by user preference
    |
    v
[7] Response Streaming (Vercel AI SDK)
    - streamText() on backend
    - useChat() on frontend
    - Real-time token delivery
```

---

## Patterns to Follow

### Pattern 1: Separation of Ingestion and Query Pipelines

**What:** Keep the ingestion pipeline completely separate from the runtime query pipeline. Ingestion runs as a CLI script or build step; queries run on Edge/serverless.

**Why:**
- Ingestion requires filesystem access (reading markdown files)
- Ingestion requires heavy compute (embedding generation)
- Edge Runtime cannot do either of these
- Clear separation enables independent scaling and testing

**Implementation:**
```typescript
// scripts/ingest.ts (runs locally or in CI)
import { pipeline } from "@huggingface/transformers";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const embedder = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);

async function ingestDocument(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const chunks = splitIntoChunks(content, {
    targetSize: 750,
    overlap: 100
  });

  for (const chunk of chunks) {
    const embedding = await embedder(chunk.text, {
      pooling: "mean",
      normalize: true
    });

    await supabase.from("chunks").insert({
      content: chunk.text,
      embedding: Array.from(embedding.data),
      metadata: {
        source: filePath,
        heading: chunk.heading,
        index: chunk.index
      }
    });
  }
}
```

### Pattern 2: Streaming-First API Design

**What:** Design the API route to stream responses from the start, not as an afterthought.

**Why:**
- LLM responses can take 5-30 seconds
- Streaming provides immediate feedback
- Vercel Edge has 25s initial response requirement
- Better UX with progressive rendering

**Implementation:**
```typescript
// app/api/chat/route.ts
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const runtime = "edge";

export async function POST(request: Request) {
  const { messages, apiKey } = await request.json();

  // 1. Get query embedding (fast - ~50ms)
  const queryEmbedding = await getQueryEmbedding(
    messages[messages.length - 1].content
  );

  // 2. Retrieve relevant chunks (fast - ~100ms)
  const relevantChunks = await searchChunks(queryEmbedding, 5);

  // 3. Build context
  const context = formatContext(relevantChunks);

  // 4. Stream LLM response
  const openrouter = createOpenRouter({ apiKey });

  const result = streamText({
    model: openrouter("anthropic/claude-3-haiku"),
    system: buildSystemPrompt(context),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Pattern 3: Metadata-Rich Chunks

**What:** Store rich metadata with each chunk to enable filtering, citation, and context reconstruction.

**Why:**
- Enables source attribution in responses
- Allows filtering by document type (docs vs transcripts)
- Supports hierarchical context (section > subsection > paragraph)
- Enables debugging and quality analysis

**Implementation:**
```typescript
// Chunk schema
interface Chunk {
  id: string;
  content: string;
  embedding: number[]; // 384 dimensions
  metadata: {
    source_file: string;      // "docs/consensus.md"
    source_type: "doc" | "transcript";
    title: string;            // Document title from frontmatter
    heading_path: string[];   // ["Consensus", "Proof of Work"]
    chunk_index: number;      // Position in document
    token_count: number;      // For context window budgeting
    url?: string;             // Link to original if available
  };
  created_at: string;
}
```

### Pattern 4: User-Owned API Keys

**What:** Users provide their own OpenRouter API key; never store or proxy through your backend.

**Why:**
- No billing management for you
- No rate limiting headaches
- Users control their own costs
- Simpler compliance (you don't touch their data)

**Implementation:**
```typescript
// Frontend: Store key in localStorage, send in header
const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-OpenRouter-Key": localStorage.getItem("openrouter_key"),
  },
  body: JSON.stringify({ messages }),
});

// Backend: Use key from request
export async function POST(request: Request) {
  const apiKey = request.headers.get("X-OpenRouter-Key");
  if (!apiKey) {
    return new Response("API key required", { status: 401 });
  }
  // Use key directly with OpenRouter
}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Runtime Embedding in Edge Runtime

**What:** Trying to run Transformers.js or other embedding models inside Edge Runtime.

**Why bad:**
- Edge Runtime has 1-4MB code size limit (compressed)
- Transformers.js models are 20-100MB
- No filesystem access to load model weights
- CPU-bound operations hit Edge timeout limits

**Instead:**
- Pre-compute document embeddings at build time
- For query embeddings, use an external API (OpenRouter, OpenAI, Cohere)
- Or use a Supabase Edge Function (which has Node.js runtime)

### Anti-Pattern 2: Fetching All Chunks Then Filtering

**What:** Retrieving all chunks from the database and filtering in application code.

**Why bad:**
- Transfers huge amounts of data (100+ chunks x embedding size)
- Application memory pressure
- Slow response times
- Wastes database and network resources

**Instead:**
```sql
-- Let PostgreSQL + pgvector handle the similarity search
SELECT id, content, metadata,
       1 - (embedding <=> $1) as similarity
FROM chunks
ORDER BY embedding <=> $1  -- Cosine distance
LIMIT 10;
```

### Anti-Pattern 3: Monolithic API Route

**What:** Putting all logic (embedding, search, reranking, generation) in a single 500-line API route.

**Why bad:**
- Hard to test individual components
- Can't swap implementations
- Debugging nightmares
- Violates single responsibility

**Instead:** Compose small, focused functions:
```typescript
// lib/rag/embed.ts
export async function embedQuery(text: string): Promise<number[]>

// lib/rag/search.ts
export async function searchChunks(embedding: number[], k: number): Promise<Chunk[]>

// lib/rag/rerank.ts
export async function rerankChunks(query: string, chunks: Chunk[]): Promise<Chunk[]>

// lib/rag/context.ts
export async function buildContext(chunks: Chunk[]): Promise<string>

// app/api/chat/route.ts - orchestration only
```

### Anti-Pattern 4: Ignoring Token Limits

**What:** Stuffing all retrieved chunks into context without counting tokens.

**Why bad:**
- Exceeds LLM context window (causes errors)
- Wastes money on unused tokens
- Later chunks get less attention (recency bias)
- Unpredictable failures

**Instead:**
```typescript
function buildContext(chunks: Chunk[], maxTokens: number): string {
  let tokenCount = 0;
  const includedChunks: Chunk[] = [];

  for (const chunk of chunks) {
    if (tokenCount + chunk.metadata.token_count > maxTokens) break;
    includedChunks.push(chunk);
    tokenCount += chunk.metadata.token_count;
  }

  return formatChunksAsContext(includedChunks);
}
```

---

## Vercel Edge Runtime Considerations

### What Works on Edge

| Capability | Status | Notes |
|------------|--------|-------|
| fetch() to external APIs | YES | OpenRouter, Supabase |
| Streaming responses | YES | Core feature for AI apps |
| JSON parsing/serialization | YES | Standard |
| Supabase JS client | YES | Use @supabase/supabase-js |
| Vercel AI SDK | YES | Designed for Edge |
| Environment variables | YES | For Supabase keys |

### What Does NOT Work on Edge

| Capability | Status | Alternative |
|------------|--------|-------------|
| Filesystem access | NO | Pre-compute at build time |
| Transformers.js (large models) | NO | Use API for query embedding |
| Heavy computation | NO | Offload to external service |
| node_modules with native deps | NO | Use Edge-compatible packages |
| Long synchronous operations | NO | Stream or use background tasks |

### Recommended Runtime Strategy

```typescript
// app/api/chat/route.ts
export const runtime = "edge";  // Fast cold starts, global distribution

// Alternative for heavy operations:
export const runtime = "nodejs"; // Full Node.js, single region
```

**Recommendation:** Use Edge Runtime for the chat API route. It's sufficient for:
- Calling Supabase (fetch-based)
- Calling OpenRouter (fetch-based)
- Streaming responses (native support)
- Light orchestration logic

The heavy work (embedding generation) happens at build/ingestion time, not runtime.

---

## Suggested Build Order

Based on component dependencies, build in this order:

### Phase 1: Foundation (Data Layer)
**Build first - everything depends on this**

1. **Supabase Schema Setup**
   - Create `documents` table (source files)
   - Create `chunks` table with pgvector column
   - Enable pgvector extension
   - Create similarity search function

2. **Ingestion Pipeline (CLI)**
   - Markdown loader
   - Chunking logic
   - Embedding generation (local Transformers.js)
   - Supabase insertion

**Why first:** Can't test retrieval without data. Can't test generation without retrieval.

### Phase 2: Query Pipeline (Core RAG)
**Build second - the critical path**

3. **Vector Search Function**
   - Query embedding (via API for runtime)
   - Supabase similarity search
   - Result formatting

4. **Context Assembly**
   - Prompt templates
   - Token counting
   - Source citation formatting

5. **LLM Integration**
   - OpenRouter provider setup
   - Streaming response handling
   - Error handling

**Why second:** This is the core RAG loop. Test it thoroughly before adding UI.

### Phase 3: User Interface
**Build third - user-facing layer**

6. **Chat UI**
   - Message history
   - Input handling
   - Streaming display (useChat hook)

7. **API Key Management**
   - Key input UI
   - Secure storage (localStorage)
   - Validation

**Why third:** UI can only be properly tested with working backend.

### Phase 4: Enhancements
**Build last - polish and optimization**

8. **Reranking** (Optional)
   - Cross-encoder integration
   - Improves accuracy 20-35%

9. **Hybrid Search** (Optional)
   - Add keyword search alongside semantic
   - Better for exact matches

10. **Analytics & Feedback** (Optional)
    - Query logging
    - User feedback collection

---

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **Vector Search** | pgvector IVFFlat index | pgvector HNSW index | Consider dedicated vector DB |
| **Embedding Storage** | Single Supabase instance | Same (pgvector handles millions) | Shard by document category |
| **Query Latency** | ~200ms total | ~300ms (add caching) | ~500ms (add CDN, edge caching) |
| **LLM Costs** | User pays (OpenRouter) | User pays | User pays |
| **Ingestion** | Manual CLI runs | Automated CI/CD | Background workers |

---

## Sources

### Official Documentation (HIGH confidence)
- [Supabase AI & Vectors](https://supabase.com/docs/guides/ai) - Vector storage patterns
- [Vercel Edge Runtime](https://vercel.com/docs/functions/runtimes/edge) - Runtime constraints
- [Vercel AI SDK](https://ai-sdk.dev/docs/introduction) - streamText/useChat architecture
- [OpenRouter API](https://openrouter.ai/docs/api/reference/streaming) - Streaming integration

### Technical References (MEDIUM confidence)
- [NVIDIA RAG 101](https://developer.nvidia.com/blog/rag-101-demystifying-retrieval-augmented-generation-pipelines/) - Pipeline architecture
- [Weaviate Chunking Strategies](https://weaviate.io/blog/chunking-strategies-for-rag) - Chunking best practices
- [Pinecone Rerankers Guide](https://www.pinecone.io/learn/series/rag/rerankers/) - Two-stage retrieval
- [Transformers.js Documentation](https://huggingface.co/Xenova/all-MiniLM-L6-v2) - Local embedding generation

### Community Patterns (MEDIUM confidence)
- [Vercel AI SDK RAG Template](https://vercel.com/templates/next.js/ai-sdk-rag) - Reference implementation
- [Upstash RAG Tutorial](https://upstash.com/blog/degree-guru) - Next.js + AI SDK pattern

# Technology Stack

**Project:** Quilibrium Documentation RAG Chatbot
**Researched:** 2026-01-24
**Overall Confidence:** HIGH

## Executive Summary

For a self-hosted RAG chatbot targeting Quilibrium protocol documentation with zero operational cost (user-provided API keys), the recommended stack leverages the Vercel AI SDK as the foundation rather than heavier frameworks like LangChain. The key insight from 2025-2026 ecosystem research: **for simple RAG use cases, raw implementation with Vercel AI SDK beats framework overhead**.

The stack prioritizes:
- **Simplicity over abstraction** - Vercel AI SDK handles LLM streaming without LangChain complexity
- **Integration quality** - assistant-ui + Vercel AI SDK is the best-documented combination
- **Cost efficiency** - pgvector on Supabase free tier is proven for <100k vectors
- **Modern embedding options** - text-embedding-3-small outperforms all-MiniLM-L6-v2 in quality

---

## Recommended Stack

### Chat UI Layer

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **assistant-ui** | ^0.7.x | Chat UI components | HIGH |
| @assistant-ui/react | ^0.7.x | Core React components | HIGH |
| @assistant-ui/react-ai-sdk | ^0.7.x | Vercel AI SDK integration | HIGH |

**Why assistant-ui over chatbot-ui-lite:**

1. **Active maintenance**: assistant-ui has 8.2k GitHub stars with updates as recent as January 2026. chatbot-ui-lite is a minimal starter that hasn't been significantly updated.

2. **Vercel AI SDK integration**: First-class support via `@assistant-ui/react-ai-sdk` with `useChatRuntime` hook - handles streaming, tool calls, and message state automatically.

3. **Production features out of box**:
   - Streaming with auto-scroll and interruptions
   - Markdown rendering with code highlighting
   - Accessibility and keyboard shortcuts built-in
   - Source citation rendering (critical for RAG)
   - Optimized bundle with minimal re-renders

4. **Composable primitives**: Not a monolithic component - you get Thread, Message, Input primitives that can be styled with Tailwind/shadcn.

5. **Enterprise adoption**: Used by LangChain, Browser Use, and 50k+ monthly npm downloads.

**chatbot-ui-lite assessment:**
- Minimal starter kit with ~21 commits total
- No built-in streaming infrastructure
- Would require significant work to add RAG-specific features
- Better suited for learning/prototyping, not production

**VERDICT: Use assistant-ui** - the integration story with Vercel AI SDK is mature and well-documented.

---

### LLM Orchestration Layer

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Vercel AI SDK** | ^6.0.x | LLM streaming, chat management | HIGH |
| ai | ^6.0.37+ | Core SDK | HIGH |
| @openrouter/ai-sdk-provider | ^1.5.x | OpenRouter integration | HIGH |

**Why Vercel AI SDK over LangChain/LlamaIndex:**

1. **Right-sized for RAG**: 2025-2026 consensus is clear - LangChain's abstraction overhead is "unnecessary for basic RAG use cases." For a documentation chatbot doing semantic search + LLM response, Vercel AI SDK provides exactly what's needed.

2. **Performance**: Benchmark data shows LangChain adds ~10ms overhead vs ~3-6ms for lighter approaches. More importantly, LangChain pulls in 50+ packages vs 3-5 for raw implementation.

3. **First-class streaming**: `streamText()` and `useChat()` handle the hard parts:
   - Token-by-token streaming to UI
   - Message state management
   - Abort/retry handling
   - Type-safe message formats

4. **AI SDK 6 features** (released December 2025):
   - Agent abstraction for future extensibility
   - Tool execution with human-in-the-loop
   - Reranking support for improved retrieval
   - LangChain adapter if you need it later

5. **OpenRouter provider**: Official `@openrouter/ai-sdk-provider` package with AI SDK v5/v6 support, used by 162+ projects.

**When you WOULD use LangChain:**
- Multi-step reasoning chains with state
- Complex agent workflows with tool orchestration
- Need for LangSmith observability
- Team already invested in LangChain ecosystem

**VERDICT: Use Vercel AI SDK raw** - you get streaming, chat management, and OpenRouter integration without framework overhead. Add LangChain later only if complexity demands it.

---

### Vector Database Layer

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Supabase** | Latest | Database + Auth | HIGH |
| **pgvector** | 0.8.x | Vector similarity search | HIGH |

**Why pgvector on Supabase:**

1. **Already decided** - Supabase with pgvector is in project constraints. Research validates this is appropriate for the use case.

2. **Scale validation**: pgvector performs well for <1M vectors, and documentation chatbots typically have <100k chunks. Query latency under 100ms is achievable.

3. **Hybrid search**: Supabase supports semantic + keyword search in same query - useful for technical documentation with specific terms.

4. **Row Level Security**: Built-in RLS for future multi-tenant scenarios without changing architecture.

5. **Free tier sufficient**: Supabase free tier provides adequate storage and compute for documentation corpus.

**Limitations to monitor:**
- Performance drops at 10M+ vectors (not a concern for docs)
- Index build times can be slow for large batches (batch during ingestion, not runtime)
- 8KB page limit constrains very high-dimensional embeddings (1536 dims is fine)

**Schema recommendation:**
```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  metadata jsonb,
  embedding vector(1536), -- for text-embedding-3-small
  created_at timestamptz default now()
);

create index on documents
using hnsw (embedding vector_cosine_ops);
```

**VERDICT: Supabase pgvector validated** - appropriate for documentation scale, with room to grow.

---

### Embedding Model Layer

| Technology | Dimensions | Cost | Confidence |
|------------|------------|------|------------|
| **text-embedding-3-small** | 1536 | $0.02/1M tokens | HIGH |
| nomic-embed-text-v1.5 | 768 | Free (self-host) | MEDIUM |

**Why text-embedding-3-small over all-MiniLM-L6-v2:**

1. **all-MiniLM-L6-v2 is outdated**: 2019 architecture with only 384 dimensions. Hacker News consensus (Jan 2026): "Don't use all-MiniLM-L6-v2 for new vector embeddings datasets."

2. **Performance gap**: all-MiniLM-L6-v2 achieved only 56% Top-5 accuracy in recent benchmarks vs 86%+ for modern models. For documentation Q&A, retrieval quality directly impacts answer quality.

3. **Context length**: all-MiniLM-L6-v2 limited to 512 tokens. text-embedding-3-small handles longer chunks better, important for documentation with code blocks.

4. **Cost is negligible**: At $0.02/1M tokens, embedding your entire documentation corpus costs pennies. User pays via their API key anyway.

**Alternative: nomic-embed-text-v1.5**

If you want to avoid OpenAI dependency for embeddings:
- Outperforms text-embedding-3-small on 2/3 benchmarks
- 8192 token context length
- Can run locally via Ollama
- 768 dimensions (smaller storage)

Trade-off: 2x slower embedding time, requires self-hosting or API setup.

**VERDICT: Use text-embedding-3-small** - best quality/simplicity ratio for user-provided API key model. Consider nomic-embed if OpenAI-free requirement emerges.

---

### LLM Routing Layer

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **OpenRouter** | API v1 | Multi-model LLM access | HIGH |
| @openrouter/ai-sdk-provider | ^1.5.4 | Vercel AI SDK integration | HIGH |

**Why OpenRouter (already decided, validated):**

1. **300+ models via single API**: Users can choose Claude, GPT-4, Llama, Mistral, etc. with their own keys.

2. **BYOK support**: User provides their own API key - zero cost to you. 5% fee on upstream usage (moving to fixed subscription).

3. **Vercel AI SDK integration**: First-class provider package that works with `streamText()` and `generateText()`.

4. **Latency**: ~25-40ms overhead is acceptable for chat applications where LLM response dominates latency.

**Implementation pattern:**
```typescript
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';

const openrouter = createOpenRouter({
  apiKey: userProvidedKey, // from user input
});

const result = await streamText({
  model: openrouter.chat('anthropic/claude-3.5-sonnet'),
  messages,
  system: systemPrompt,
});
```

**VERDICT: OpenRouter validated** - mature integration, appropriate for user-provided key model.

---

### Framework Layer (Already Decided)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| Next.js | 14.x+ | App framework | HIGH |
| Tailwind CSS | 3.x | Styling | HIGH |
| Vercel Edge Runtime | - | Deployment | HIGH |

**Edge Runtime considerations:**
- 1MB request limit (fine for chat)
- 4MB function size limit (monitor bundle)
- No native Node.js APIs (use Edge-compatible packages)
- Shorter cold starts than serverless

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Chat UI | assistant-ui | chatbot-ui-lite | Minimal features, no streaming infra, unmaintained |
| Chat UI | assistant-ui | @llamaindex/chat-ui | Less mature, tighter LlamaIndex coupling |
| RAG Framework | Vercel AI SDK (raw) | LangChain | Overkill for simple RAG, 50+ deps, abstraction overhead |
| RAG Framework | Vercel AI SDK (raw) | LlamaIndex | Better for complex indexing, not needed for single doc corpus |
| Embedding | text-embedding-3-small | all-MiniLM-L6-v2 | Outdated (2019), lower accuracy, short context |
| Embedding | text-embedding-3-small | nomic-embed-text-v2 | Requires self-hosting, 2x slower |
| Vector DB | Supabase pgvector | Pinecone | Cost (vs free tier), another service to manage |
| Vector DB | Supabase pgvector | Qdrant | More setup, not needed at docs scale |

---

## Installation

```bash
# Core dependencies
npm install ai @openrouter/ai-sdk-provider
npm install @assistant-ui/react @assistant-ui/react-ai-sdk
npm install @supabase/supabase-js

# For embedding generation (if done client-side via OpenRouter)
# No additional packages - use OpenRouter with embedding model

# Dev dependencies
npm install -D @types/node typescript
```

**package.json versions (pin these):**
```json
{
  "dependencies": {
    "ai": "^6.0.37",
    "@openrouter/ai-sdk-provider": "^1.5.4",
    "@assistant-ui/react": "^0.7.0",
    "@assistant-ui/react-ai-sdk": "^0.7.0",
    "@supabase/supabase-js": "^2.45.0",
    "next": "^14.2.0",
    "react": "^18.3.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| **LangChain** (for v1) | Overhead for simple RAG, complexity creep, 50+ deps |
| **all-MiniLM-L6-v2** | Outdated 2019 model, poor accuracy, 512 token limit |
| **chatbot-ui-lite** | Unmaintained, no streaming, would need significant work |
| **Chroma** | Good for prototyping, not recommended for production |
| **Custom streaming** | Vercel AI SDK already solves this well |
| **Pinecone/Qdrant** | Adds cost and complexity when pgvector suffices |

---

## Confidence Assessment

| Area | Level | Rationale |
|------|-------|-----------|
| Chat UI (assistant-ui) | HIGH | Official docs, npm stats, recent updates, production usage |
| Vercel AI SDK | HIGH | Official Vercel docs, Context7 verified, AI SDK 6 released Dec 2025 |
| OpenRouter integration | HIGH | Official provider package, documented integration |
| pgvector for docs scale | HIGH | Multiple sources confirm <1M vector performance |
| text-embedding-3-small | HIGH | Benchmark data, pricing verified, superior to alternatives |
| Raw RAG vs LangChain | MEDIUM | Community consensus clear, but verify with prototype |

---

## Sources

### HIGH Confidence (Official/Verified)
- [Vercel AI SDK 6 Announcement](https://vercel.com/blog/ai-sdk-6) - December 2025
- [assistant-ui GitHub](https://github.com/assistant-ui/assistant-ui) - Updated January 2026
- [assistant-ui Vercel AI SDK Docs](https://www.assistant-ui.com/docs/runtimes/ai-sdk/use-chat)
- [OpenRouter AI SDK Provider](https://github.com/OpenRouterTeam/ai-sdk-provider)
- [Supabase AI & Vectors Docs](https://supabase.com/docs/guides/ai)
- [Supabase pgvector Extension](https://supabase.com/docs/guides/database/extensions/pgvector)

### MEDIUM Confidence (Multiple Sources Agree)
- [RAG Stack Recommendations 2025](https://medium.com/devmap/the-rag-stack-id-use-if-i-were-starting-from-zero-in-2025-and-why-c4b1d67ad859)
- [LangChain vs Raw Implementation](https://www.droptica.com/blog/langchain-vs-langgraph-vs-raw-openai-how-choose-your-rag-stack/)
- [Embedding Model Benchmarks](https://supermemory.ai/blog/best-open-source-embedding-models-benchmarked-and-ranked/)
- [Best Embedding Models 2026](https://elephas.app/blog/best-embedding-models)

### LOW Confidence (Single Source, Verify Before Use)
- Specific version numbers should be verified at implementation time
- Bundle size claims for assistant-ui not independently verified

# Feature Landscape

**Domain:** RAG Documentation Chatbot / AI Documentation Assistant
**Researched:** 2026-01-24
**Confidence:** MEDIUM-HIGH (WebSearch verified across multiple sources)

## Table Stakes

Features users expect. Missing = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Natural language query input** | Users expect to ask questions in plain language | Low | Text input field, standard UX |
| **Accurate, grounded responses** | Core value proposition; hallucinations destroy trust | High | RAG retrieval quality is critical |
| **Source citations with links** | Users need to verify answers; builds trust | Medium | Must show which docs answer came from |
| **Streaming responses** | ChatGPT set the standard; waiting feels broken | Medium | SSE or WebSocket streaming |
| **Markdown rendering** | Technical docs have code, formatting | Medium | Use react-markdown or similar |
| **Code syntax highlighting** | Developer audience expects readable code | Medium | Prism.js, highlight.js, or Shiki |
| **Mobile-responsive design** | Many users on mobile; non-negotiable | Medium | Responsive CSS, touch-friendly |
| **Error handling with clear messages** | Graceful degradation prevents frustration | Medium | Rate limits, network errors, API failures |
| **Loading/typing indicators** | Users need feedback during generation | Low | Shows system is working |
| **Model selection** | Different needs (cost, capability) | Low | Dropdown for user-provided key scenario |

## Differentiators

Features that set product apart. Not expected, but valued when present.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Suggested follow-up questions** | Reduces friction, helps discovery | Medium | Can be AI-generated or curated |
| **Thumbs up/down feedback** | Enables quality improvement over time | Low | Simple UI, valuable data |
| **Copy response to clipboard** | Developer convenience for code/text | Low | High value, low effort |
| **Semantic search (not just keyword)** | Handles paraphrased questions | Medium | Embeddings-based retrieval |
| **Multi-turn conversation context** | Maintains thread coherence | High | Requires session management |
| **Confidence indicators** | Transparency about answer certainty | Medium | Helps users judge reliability |
| **Quick action buttons** | "Show me an example", "Explain simpler" | Low | Reduces typing, increases engagement |
| **Dark mode** | Developer preference, accessibility | Low | CSS theming |
| **Stop generation button** | User control during streaming | Low | Cancels ongoing stream |
| **Chat history persistence** | Resume previous conversations | Medium | LocalStorage or backend storage |
| **Export conversation** | Save for reference or sharing | Low | Markdown or text export |
| **Keyboard shortcuts** | Power user efficiency | Low | Enter to send, etc. |
| **Retry failed responses** | Recovery from transient errors | Low | Re-run last query |

## Anti-Features

Features to explicitly NOT build for v1. Common mistakes in this domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **User accounts/authentication** | Adds complexity; user-provided API keys already personalize | Rely on API key in localStorage; add accounts only if needed for history sync |
| **Admin panel for embeddings** | Significant backend complexity; v1 should ship with pre-built index | Build embeddings at deploy time; add admin later if update frequency demands it |
| **Usage analytics dashboard** | Scope creep; focus on core chat experience | Log basics server-side; defer dashboard to v1.1+ |
| **Multi-language translation** | Complex, requires extensive testing per language | Focus on English docs first; add translation layer later |
| **Voice input/output** | Multimodal adds significant complexity | Text-first; voice is a v2+ feature |
| **Agentic workflows** | Executing actions requires trust, security review | Pure Q&A first; agentic features require maturity |
| **Custom training/fine-tuning UI** | Requires ML infrastructure, adds operational burden | Use standard embeddings; defer custom training |
| **Real-time doc sync** | Complexity of watching external sources | Periodic re-indexing (manual or cron) is sufficient for v1 |
| **Collaborative features** | Multi-user sharing, annotations | Single-user focus; collaboration is a separate product direction |
| **Complex conversation branching** | Edit history, fork threads | Linear conversation is simpler and sufficient for v1 |
| **Social login (OAuth)** | Unnecessary complexity for self-hosted BYOK model | API key input is the auth; no user accounts needed |

## Feature Dependencies

```
Core Flow (must build in order):
1. API Key Management (localStorage)
   --> 2. LLM Integration (with selected model)
       --> 3. Chat Interface (input/output)
           --> 4. Streaming Responses
               --> 5. Markdown/Code Rendering

RAG Pipeline (parallel to chat UI):
1. Document Processing & Chunking
   --> 2. Embedding Generation
       --> 3. Vector Storage
           --> 4. Retrieval Pipeline
               --> 5. Source Citation Display

Enhancement Layer (after core works):
Chat Interface --> Feedback Mechanism (thumbs up/down)
Chat Interface --> Copy to Clipboard
Chat Interface --> Suggested Questions
Streaming --> Stop Generation Button
Error Handling --> Retry Mechanism
```

## MVP Recommendation

Based on research and the PRD context provided, the v1 feature set is well-aligned with table stakes.

**For MVP, prioritize (in order):**

1. **Core chat with streaming** - The fundamental experience
2. **RAG with source citations** - Core differentiator, builds trust
3. **Markdown + code syntax highlighting** - Developer audience expectation
4. **Mobile-responsive design** - Accessibility requirement
5. **Error handling** - Graceful degradation for API issues
6. **Model selection dropdown** - Enables user choice with BYOK model

**Consider adding to v1 (low effort, high value):**

- **Copy to clipboard** for code blocks - Listed as v1.1 but trivially easy
- **Thumbs up/down feedback** - Simple to add, valuable for iteration

**Defer to post-MVP (correctly identified in PRD):**

- Chat history persistence: Adds state management complexity
- Multi-turn context: Requires token management, conversation memory
- Admin panel: Backend complexity, not needed if docs update infrequently
- Dark mode: CSS work, can add any time

## Complexity Assessment by Category

| Category | v1 Complexity | Notes |
|----------|---------------|-------|
| Chat UI | Low-Medium | Standard React patterns, well-documented |
| Streaming | Medium | SSE implementation, state management |
| RAG Pipeline | Medium-High | Embedding quality, chunking strategy critical |
| Source Citations | Medium | Metadata handling, UI for clickable sources |
| Error Handling | Medium | Multiple failure modes (rate limits, network, API errors) |
| Mobile Responsive | Low | Tailwind/CSS frameworks handle this well |
| Markdown Rendering | Low | Libraries exist (react-markdown) |
| Code Highlighting | Low | Shiki, Prism, or highlight.js |

## Sources

### RAG Chatbot Features
- [Wonderchat - Top 5 RAG Chatbots 2026](https://wonderchat.io/blog/best-rag-chatbots-2026)
- [Vercel AI SDK - RAG Agent Guide](https://ai-sdk.dev/cookbook/guides/rag-chatbot)
- [LangChain - Build a RAG Agent](https://docs.langchain.com/oss/python/langchain/rag)
- [DocsBot AI Documentation](https://docsbot.ai/documentation)
- [Mendable AI](https://www.mendable.ai/)

### UX and Design
- [Robylon - AI Chatbot Trends 2026](https://www.robylon.ai/blog/ai-chatbot-trends-2026)
- [ShapeofAI - Citations Pattern](https://www.shapeof.ai/patterns/citations)
- [Nielsen Norman Group - Prompt Controls in GenAI](https://www.nngroup.com/articles/prompt-controls-genai/)
- [Jotform - Best Chatbot UI 2026](https://www.jotform.com/ai/agents/best-chatbot-ui/)
- [GoldenOwl - Chatbot UI Design 2026](https://goldenowl.asia/blog/chatbot-ui-design)
- [Microsoft Teams - Stream Bot Messages](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/streaming-ux)

### Error Handling & Feedback
- [Quidget - 7 Chatbot Error Handling Strategies](https://quidget.ai/blog/ai-automation/7-chatbot-error-handling-strategies-for-better-ux/)
- [IBM - Implementing Thumbs Up/Down Feedback](https://developer.ibm.com/tutorials/awb-watsonx-assistant-thumbs-up-down-feedback/)
- [Zapier - Review Chatbot Feedback](https://help.zapier.com/hc/en-us/articles/21980947537421-Review-chatbot-feedback)
- [Zapier - Add Suggested Questions](https://help.zapier.com/hc/en-us/articles/31261767095693-Add-suggested-questions-to-your-chatbot-conversations)

### Anti-Patterns
- [Jason Liu - RAG Mistakes That Are Killing Your AI](https://jxnl.co/writing/2025/09/11/the-rag-mistakes-that-are-killing-your-ai-skylar-payne/)
- [Martin Fowler - Emerging Patterns in GenAI Products](https://martinfowler.com/articles/gen-ai-patterns/)
- [AWS - Hardening RAG Chatbot Architecture](https://aws.amazon.com/blogs/security/hardening-the-rag-chatbot-architecture-powered-by-amazon-bedrock-blueprint-for-secure-design-and-anti-pattern-migration/)

### Must-Have Features
- [Crescendo - 15 Must-Have Chatbot Features](https://www.crescendo.ai/blog/must-have-features-in-a-chatbot)
- [WotNot - 18 Must-Have Chatbot Features](https://wotnot.io/blog/chatbot-features)
- [MeetChatty - Chatbot Requirements Guide 2026](https://meetchatty.com/blog/chatbot-requirements)

# Domain Pitfalls: RAG Chatbot for Documentation

**Domain:** RAG-powered documentation chatbot (Quilibrium protocol)
**Researched:** 2026-01-24
**Overall Confidence:** MEDIUM-HIGH

---

## Critical Pitfalls

Mistakes that cause rewrites, major quality issues, or security incidents.

---

### Pitfall 1: Naive Chunking Destroys Context

**What goes wrong:** Teams default to fixed character/token counts (e.g., split every 500 characters) without considering semantic boundaries. This cuts sentences mid-thought, splits code examples, and separates headers from their content.

**Why it happens:** It's the easiest approach to implement. Most tutorials show simple `split_text()` calls with arbitrary sizes.

**Consequences:**
- Embedding vectors lose specificity (too much in chunk = vague; too little = no context)
- Retrieved chunks contain half-sentences or orphaned code
- LLM generates incorrect answers because context is literally torn apart
- "The semantic meaning is lost... this loss will propagate across your entire database" ([Unstructured](https://unstructured.io/blog/chunking-for-rag-best-practices))

**Prevention:**
1. Start with recursive chunking (respects paragraph/sentence boundaries)
2. Use 400-800 token chunks with 10-20% overlap as baseline
3. Preserve structural elements: keep code blocks whole, don't split tables, maintain header-to-content relationships
4. For markdown docs specifically: chunk by section (##) first, then subdivide if needed

**Detection (warning signs):**
- Retrieved chunks frequently start/end mid-sentence
- Code snippets are syntactically broken
- Users report answers that "don't make sense"
- Hit rate is decent but answer quality is poor

**Phase to address:** Phase 1 (Ingestion Pipeline) - get this right before embedding anything

**Sources:**
- [Stack Overflow: Chunking in RAG](https://stackoverflow.blog/2024/12/27/breaking-up-is-hard-to-do-chunking-in-rag-applications/)
- [Weaviate: Chunking Strategies](https://weaviate.io/blog/chunking-strategies-for-rag)
- [kapa.ai: RAG Common Mistakes](https://www.kapa.ai/blog/rag-gone-wrong-the-7-most-common-mistakes-and-how-to-avoid-them)

---

### Pitfall 2: Wrong K Value and Missing Reranking

**What goes wrong:** Teams either retrieve too few chunks (k=2-3) missing relevant info, or too many (k=10+) flooding context with noise. Without reranking, the initial retrieval order (based solely on embedding similarity) determines what the LLM sees.

**Why it happens:**
- K is often set arbitrarily or copied from tutorials
- Reranking adds latency and complexity, so it's skipped
- Embedding-based retrieval seems "good enough" in simple tests

**Consequences:**
- k too low: Multi-part questions fail; LLM lacks information to answer fully
- k too high: Context window fills with marginally relevant content; LLM gets confused
- No reranking: Semantically similar but factually wrong chunks rank higher than correct ones
- "Small K values omit crucial information and large K values introduce noise" ([Pinecone](https://www.pinecone.io/learn/series/rag/rerankers/))

**Prevention:**
1. Start with k=5-7 for initial retrieval, then rerank to top 3-4
2. Implement two-stage retrieval: broad retrieval (k=10-20) then cross-encoder reranking
3. Use hybrid search (vector + keyword) before reranking for better initial candidates
4. Set similarity score thresholds - don't include chunks below 0.7 similarity even if k allows it

**Detection:**
- Answers miss obvious information that exists in docs
- "I don't know" responses when relevant content exists
- Answers contradict each other across similar questions
- Retrieval latency is fine but answer quality varies wildly

**Phase to address:** Phase 2 (Retrieval Logic) - after basic ingestion works

**Sources:**
- [Pinecone: Rerankers](https://www.pinecone.io/learn/series/rag/rerankers/)
- [Fuzzy Labs: Re-Ranking Techniques](https://www.fuzzylabs.ai/blog-post/improving-rag-performance-re-ranking)
- [Neo4j: Advanced RAG Techniques](https://neo4j.com/blog/genai/advanced-rag-techniques/)

---

### Pitfall 3: LLM Ignores Retrieved Context (Hallucination Despite RAG)

**What goes wrong:** The LLM generates plausible-sounding answers from its training data instead of using the retrieved chunks. RAG is supposed to ground responses, but without proper prompt engineering, the model "knows better" and ignores context.

**Why it happens:**
- System prompt doesn't explicitly constrain to retrieved context
- Retrieved context is placed poorly in the prompt (buried, not emphasized)
- LLM's parametric knowledge is more confident than the noisy retrieved chunks
- Prompt allows freeform answering instead of requiring evidence

**Consequences:**
- Users receive confident but wrong answers
- Answers cite sources but the cited content doesn't support the claim
- Trust in the system erodes when users verify answers manually
- "The risk of hallucinations persists in RAG systems unless a well-crafted prompt instructs the system to exclusively rely on retrieved text" ([PromptHub](https://www.prompthub.us/blog/three-prompt-engineering-methods-to-reduce-hallucinations))

**Prevention:**
1. Use explicit grounding instructions: "Answer ONLY using the provided context. If the context doesn't contain the answer, say 'I don't have information about that in the documentation.'"
2. Place retrieved context prominently (not buried after long instructions)
3. Require inline citations: "For each claim, cite the specific section you're drawing from"
4. Implement answer gating: if similarity scores are all below threshold, refuse to answer rather than guess
5. Add Chain-of-Verification: prompt model to verify its answer against context before responding

**Detection:**
- Answers contain specific claims not found in any retrieved chunk
- Citation links exist but cited text doesn't support the answer
- Model answers confidently about topics not in your documentation
- Answers for niche protocol questions sound generic/Wikipedia-like

**Phase to address:** Phase 2-3 (Prompt Engineering) - iterative refinement needed

**Sources:**
- [SUSE: Preventing AI Hallucinations](https://documentation.suse.com/suse-ai/1.0/html/AI-preventing-hallucinations/index.html)
- [Prompt Engineering Guide: RAG](https://www.promptingguide.ai/research/rag)
- [AWS: Detect Hallucinations for RAG](https://aws.amazon.com/blogs/machine-learning/detect-hallucinations-for-rag-based-systems/)

---

### Pitfall 4: Vercel Edge Function Dies Mid-Stream

**What goes wrong:** Edge functions timeout, die silently, or fail to complete `onFinish` callbacks. Streaming appears to work locally but breaks in production. Database writes in `onFinish` never complete.

**Why it happens:**
- Edge Runtime has strict limits: 4MB bundle size, no native Node.js APIs, 1MB request limit
- `onFinish` callbacks may be "fire-and-forget" - async operations aren't properly awaited
- Hobby plan has 60-second timeout; long LLM responses can exceed this
- Memory billing during streaming keeps instance busy the entire time

**Consequences:**
- Conversations cut off mid-response with no error
- Chat history fails to save, breaking conversation continuity
- Usage tracking/logging never completes
- "As soon as there is an asynchronous call there, the function just dies" ([Vercel Community](https://community.vercel.com/t/vercel-edge-functions-dying-without-hitting-timeout-limits/17879))

**Prevention:**
1. Use Node.js runtime for routes that need database writes, not Edge Runtime
2. Don't rely on `onFinish` for critical operations - consider separate API calls
3. Explicitly set `runtime` in route files: `export const runtime = 'nodejs'`
4. Implement proper error boundaries and timeout handling
5. For Pro plan: set `maxDuration` explicitly (up to 300s)
6. Keep streaming route minimal; offload heavy operations to background jobs

**Detection:**
- Responses work locally but cut off in production
- No errors in Vercel logs despite obvious failures
- Database records missing for conversations that users completed
- Intermittent "partial response" reports from users

**Phase to address:** Phase 1 (Infrastructure) - architecture decision before building chat

**Sources:**
- [Vercel: Edge Runtime Docs](https://vercel.com/docs/functions/runtimes/edge)
- [Vercel Community: Edge Functions Dying](https://community.vercel.com/t/vercel-edge-functions-dying-without-hitting-timeout-limits/17879)
- [AI SDK: Timeout Troubleshooting](https://ai-sdk.dev/docs/troubleshooting/timeout-on-vercel)
- [Upstash: Vercel Edge Explained](https://upstash.com/blog/vercel-edge)

---

### Pitfall 5: Prompt Injection via Retrieved Documents

**What goes wrong:** Malicious instructions embedded in documentation (or user-submitted content) get retrieved and injected into the system prompt, causing the LLM to execute unintended actions.

**Why it happens:**
- RAG systems trust that retrieved content is safe
- No sanitization between retrieval and prompt construction
- System assumes documentation is controlled, but transcriptions or community content may not be
- "Prompt injection is #1 on the OWASP Top 10 for LLMs" ([OWASP](https://genai.owasp.org/llmrisk/llm01-prompt-injection/))

**Consequences:**
- LLM ignores original instructions and follows injected ones
- System leaks information it shouldn't (other users' data, system prompts)
- Model generates harmful or off-topic content
- "Just five carefully crafted documents in a database of millions can successfully manipulate AI responses 90% of the time" ([Promptfoo](https://www.promptfoo.dev/blog/rag-poisoning/))

**Prevention:**
1. Sanitize retrieved content: strip potential instruction patterns before including in prompt
2. Use clear delimiters between system instructions and retrieved context
3. Implement output validation before showing responses to users
4. For user-provided API keys: they're calling their own model, but still filter content
5. Audit document sources: transcriptions need review before embedding
6. Consider content guardrails that detect injection patterns in context

**Detection:**
- Model suddenly responds in different persona or language
- Responses include content clearly not from your documentation
- Users report seeing system prompt contents in responses
- Answer quality degrades after adding new document sources

**Phase to address:** Phase 2-3 (Security hardening) - add after basic flow works

**Sources:**
- [OWASP: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [Promptfoo: RAG Data Poisoning](https://www.promptfoo.dev/blog/rag-poisoning/)
- [Wiz: Prompt Injection Defense](https://www.wiz.io/academy/ai-security/prompt-injection-attack)
- [IEEE S&P 2026 Paper on Plugin Injection](https://arxiv.org/html/2511.05797v1)

---

### Pitfall 6: Client-Side API Key Exposure

**What goes wrong:** User-provided OpenRouter API keys get logged, transmitted insecurely, or exposed through browser dev tools. Keys leak through error messages, network requests, or improper storage.

**Why it happens:**
- BYOK (Bring Your Own Key) requires client-side key handling
- Keys must be sent to server for API calls
- Error handling may inadvertently log keys
- LocalStorage is readable by any JavaScript on the page

**Consequences:**
- Users' API keys stolen and used for unauthorized purposes
- User charged for attacker's usage
- Loss of user trust destroys adoption
- Potential legal liability

**Prevention:**
1. Never log API keys server-side (even in error handlers)
2. Transmit keys only over HTTPS
3. Store in browser's localStorage (not cookies that get sent automatically)
4. Show clear warnings to users about key security
5. Consider OAuth PKCE flow with OpenRouter instead of raw keys (OpenRouter supports this)
6. Implement key validation endpoint that doesn't expose the key in responses
7. Use short-lived sessions rather than persistent key storage

**Detection:**
- API keys appearing in server logs
- Keys visible in browser network tab to wrong endpoints
- Users reporting unexpected charges
- Keys appearing in error messages or UI

**Phase to address:** Phase 1 (Security architecture) - design before implementing auth

**Sources:**
- [OpenRouter: Authentication Docs](https://openrouter.ai/docs/api/reference/authentication)
- [OpenRouter: OAuth PKCE](https://openrouter.ai/docs/guides/overview/auth/oauth)
- [AWS: RAG Chatbot Security](https://aws.amazon.com/blogs/security/hardening-the-rag-chatbot-architecture-powered-by-amazon-bedrock-blueprint-for-secure-design-and-anti-pattern-migration/)

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or degraded user experience.

---

### Pitfall 7: Embedding Model Mismatch

**What goes wrong:** Using a general-purpose embedding model for domain-specific technical content. The model doesn't understand protocol-specific terminology, leading to poor retrieval.

**Why it happens:**
- Default to popular models (OpenAI ada-002) without testing on domain
- Domain-specific terms (Quilibrium concepts, node operator jargon) not in training data
- No evaluation of retrieval quality before launch

**Prevention:**
1. Test embedding models on sample queries with expected results
2. Consider domain-specific fine-tuning if generic models underperform
3. Implement hybrid search: keywords catch exact technical terms, vectors catch semantic similarity
4. Add glossary/alias handling for protocol-specific terminology

**Detection:**
- Queries using exact documentation terms don't retrieve those documents
- Semantic queries work but technical term queries fail
- Users rephrase questions multiple times to get relevant results

**Phase to address:** Phase 1 (Embedding selection) with validation in Phase 2

**Sources:**
- [Snorkel: RAG Failure Modes](https://snorkel.ai/blog/retrieval-augmented-generation-rag-failure-modes-and-how-to-fix-them/)
- [OpenXcell: Best Embedding Models 2026](https://www.openxcell.com/blog/best-embedding-models/)

---

### Pitfall 8: Embedding Drift Over Time

**What goes wrong:** Re-embedding documents with different preprocessing, versions, or settings creates inconsistent vectors. Old and new embeddings don't align semantically.

**Why it happens:**
- Updating embedding model version without re-embedding all docs
- Inconsistent text preprocessing (whitespace, encoding, special characters)
- Partial re-indexing after content updates
- "By the time people notice that answers have become inconsistent, the drift has already spread" ([DEV Community](https://dev.to/dowhatmatters/embedding-drift-the-quiet-killer-of-retrieval-quality-in-rag-systems-4l5m))

**Prevention:**
1. Version your embedding configuration (model + preprocessing)
2. Re-embed ALL documents when changing embedding approach
3. Standardize preprocessing pipeline (consistent chunking, cleaning)
4. Store embedding version metadata with vectors
5. Implement consistency checks comparing old/new embeddings

**Detection:**
- Answer quality degrades after content updates
- Similar queries return inconsistent results over time
- New documents not retrieving as well as original ones

**Phase to address:** Phase 1 (Ingestion Pipeline) - build in from start

---

### Pitfall 9: No Streaming = Terrible UX

**What goes wrong:** Full response waits until LLM completes generation. Users see loading spinner for 10-30 seconds, assume system is broken, and leave.

**Why it happens:**
- Simpler to implement non-streaming first
- Edge Runtime issues (Pitfall 4) make streaming seem risky
- Team doesn't prioritize UX over functionality

**Consequences:**
- Users abandon before seeing response
- Perceived performance much worse than actual
- "Users won't wait 31 seconds for a Slack response" ([kapa.ai](https://www.kapa.ai/blog/rag-gone-wrong-the-7-most-common-mistakes-and-how-to-avoid-them))

**Prevention:**
1. Implement streaming from day one - it's not much harder
2. Use Vercel AI SDK's built-in streaming support
3. Show typing indicators and partial responses
4. If streaming fails, gracefully degrade to loading state (not blank screen)

**Detection:**
- High bounce rate on chat page
- User feedback about "slow" system
- Analytics showing users leaving before response completes

**Phase to address:** Phase 1 (Chat implementation) - non-negotiable for MVP

**Sources:**
- [Vercel: Streaming Functions](https://vercel.com/docs/functions/streaming-functions)
- [LogRocket: AI SDK Streaming](https://blog.logrocket.com/nextjs-vercel-ai-sdk-streaming/)

---

### Pitfall 10: Unusable or Missing Citations

**What goes wrong:** Citations are either absent (no trust), wrong (cite sources that don't support the claim), or unusable (dead links, no way to verify).

**Why it happens:**
- Citations bolted on after core functionality
- LLM hallucinates citation numbers not matching retrieved chunks
- Source URLs change or weren't stored with embeddings
- "If an LLM response is incorrect, it is crucial to review the final prompt... For issues with citations, developers must trace back to the original document links" ([Stack-AI](https://www.stack-ai.com/blog/how-to-build-rag-chatbot))

**Prevention:**
1. Store source URL/path with each chunk in metadata
2. Include chunk ID in retrieval, map to citation
3. Have LLM cite specific retrieved chunks, not generate citations
4. Verify cited chunks actually support the claims
5. Link citations to anchor points in docs (not just page)
6. Use tool-calling for citations: "having the model call a tool to declare citations is natural and deterministic" ([cianfrani.dev](https://cianfrani.dev/posts/citations-in-the-key-of-rag/))

**Detection:**
- Users report citations don't match content
- Clicking citations leads to wrong section
- Citations reference documents not in your corpus

**Phase to address:** Phase 2-3 (Response formatting) - design into data model early

---

### Pitfall 11: pgvector Index Misconfiguration

**What goes wrong:** Using wrong index type or misconfigured parameters leads to slow queries or poor recall. HNSW index exceeds RAM, IVFFlat has poor recall.

**Why it happens:**
- Default to simplest index without understanding tradeoffs
- Don't monitor memory usage as corpus grows
- Skip performance testing at realistic scale

**Consequences:**
- Query latency spikes from ms to seconds
- Memory exhaustion crashes database
- Recall drops silently (wrong results, no errors)
- "HNSW Index is RAM hungry - if your index exceeds your RAM, performance falls off a cliff" ([Geetopadesha](https://geetopadesha.com/vector-search-in-2026-pinecone-vs-supabase-pgvector-performance-test/))

**Prevention:**
1. For <10K vectors: IVFFlat is fine
2. For 10K-1M vectors: HNSW with proper memory allocation
3. Monitor Supabase memory usage dashboards
4. Set `ef_search` and `m` parameters appropriately for HNSW
5. Consider pgvectorscale for larger corpora (SSD-based indexing)
6. Test with production-like data volume before launch

**Detection:**
- Query latency increases as corpus grows
- Out-of-memory errors in Supabase logs
- Retrieval quality degrades at scale

**Phase to address:** Phase 1 (Database setup) - configure correctly from start

**Sources:**
- [Supabase: pgvector Docs](https://supabase.com/docs/guides/database/extensions/pgvector)
- [Vector Search 2026: Pinecone vs Supabase](https://geetopadesha.com/vector-search-in-2026-pinecone-vs-supabase-pgvector-performance-test/)

---

## Minor Pitfalls

Mistakes that cause annoyance but are relatively easy to fix.

---

### Pitfall 12: No Graceful "I Don't Know"

**What goes wrong:** System attempts to answer every question, even ones clearly outside scope. Results in poor answers and user frustration.

**Prevention:**
1. Implement similarity score thresholds - refuse below threshold
2. Explicit prompt instruction: "If uncertain, say so"
3. Provide suggested alternative resources when declining

**Detection:**
- Users report irrelevant answers to off-topic questions
- System attempts to answer questions about unrelated topics

---

### Pitfall 13: Ignoring Code Block Formatting

**What goes wrong:** Code examples in responses render as plain text, losing syntax highlighting and formatting.

**Prevention:**
1. Ensure markdown rendering in chat UI
2. Test code-heavy responses during development
3. Consider copy-to-clipboard buttons for code blocks

**Detection:**
- Code appears as unformatted text in chat
- Users can't easily copy commands

---

### Pitfall 14: Missing Conversation Context

**What goes wrong:** Each message treated independently; follow-up questions fail because system doesn't know what "it" refers to.

**Prevention:**
1. Include conversation history in prompt (last N messages)
2. Implement conversation summarization for long chats
3. Clear signal to users when starting new topic

**Detection:**
- Follow-up questions get confused responses
- "What do you mean by 'it'?" type failures

---

### Pitfall 15: Error Messages Expose Internals

**What goes wrong:** Raw API errors, stack traces, or internal details shown to users.

**Prevention:**
1. Catch all errors and show user-friendly messages
2. Log detailed errors server-side only
3. Never expose API keys, paths, or system details in UI

**Detection:**
- Users see JSON error objects
- Stack traces appear in chat window

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Ingestion Pipeline | Naive chunking (#1), Embedding drift (#8) | Implement semantic chunking, version embeddings |
| Database Setup | pgvector misconfiguration (#11) | Start with HNSW, monitor memory |
| Retrieval Logic | Wrong K value (#2), Embedding mismatch (#7) | Two-stage retrieval with reranking, hybrid search |
| Chat UI | No streaming (#9), Poor citations (#10) | Stream from day one, tool-based citations |
| Prompt Engineering | Hallucination (#3), Missing "I don't know" (#12) | Strict grounding instructions, score thresholds |
| Security | API key exposure (#6), Prompt injection (#5) | HTTPS only, sanitize retrieved content |
| Vercel Deployment | Edge function issues (#4) | Use Node.js runtime for DB operations |

---

## Priority Matrix for Quilibrium Project

Given the specific context (self-hosted docs chatbot, user-provided API keys, ~100 docs):

**Must Address Before MVP:**
1. Chunking strategy (#1) - foundational
2. Streaming (#9) - UX is non-negotiable
3. API key security (#6) - trust requirement
4. Edge function architecture (#4) - avoid rewrites

**Address in MVP:**
5. K value and reranking (#2) - quality
6. Hallucination prevention (#3) - accuracy
7. Basic citations (#10) - trust

**Can Iterate Post-MVP:**
8. Prompt injection hardening (#5) - controlled content
9. Embedding drift prevention (#8) - small corpus
10. Advanced pgvector tuning (#11) - ~100 docs won't stress it

---

## Sources Summary

**High Confidence (Official docs, verified):**
- [Vercel Edge Runtime Docs](https://vercel.com/docs/functions/runtimes/edge)
- [Supabase pgvector Docs](https://supabase.com/docs/guides/database/extensions/pgvector)
- [OpenRouter Authentication](https://openrouter.ai/docs/api/reference/authentication)
- [OWASP LLM Top 10](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)

**Medium Confidence (Multiple sources agree):**
- [Pinecone: Rerankers](https://www.pinecone.io/learn/series/rag/rerankers/)
- [Unstructured: Chunking Best Practices](https://unstructured.io/blog/chunking-for-rag-best-practices)
- [Weaviate: Chunking Strategies](https://weaviate.io/blog/chunking-strategies-for-rag)
- [AWS: RAG Security](https://aws.amazon.com/blogs/security/hardening-the-rag-chatbot-architecture-powered-by-amazon-bedrock-blueprint-for-secure-design-and-anti-pattern-migration/)

**Lower Confidence (Single source, community):**
- [Vercel Community discussions on Edge function issues](https://community.vercel.com/t/vercel-edge-functions-dying-without-hitting-timeout-limits/17879)
- [DEV Community: Embedding Drift](https://dev.to/dowhatmatters/embedding-drift-the-quiet-killer-of-retrieval-quality-in-rag-systems-4l5m)