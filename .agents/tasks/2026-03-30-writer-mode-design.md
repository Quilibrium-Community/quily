# Writer Mode - Design Spec

**Date:** 2026-03-30
**Status:** Approved
**Type:** New Feature (MVP)

---

## Overview

Writer Mode is a distinct mode in the Quily web chat UI that helps Quilibrium community members create social media posts grounded in verified knowledge from the RAG knowledge base. It targets both newcomers who need help writing (e.g., non-native English speakers) and experienced advocates who want to save time while ensuring accuracy.

The core challenge: if hundreds of users generate posts, they must not all sound the same, must not look AI-generated, and must not contain hallucinated facts.

---

## Goals

1. **Accuracy first** - every factual claim must come from retrieved RAG context. Refuse to write if confidence is too low.
2. **Style variation** - posts must sound different across users and across requests for the same user.
3. **Not AI-detectable** - posts must read as natural human writing, not LLM output.
4. **Simple MVP** - no user accounts, no persistent style profiles, no extra LLM calls. Pure prompt engineering + UI.

## Non-Goals (for MVP)

- User style profiling from writing samples
- Platform-specific formatting (Twitter threads vs. Farcaster vs. LinkedIn)
- Draft history or revision tracking
- Emoji toggle UI
- Short-form (280 char) post support

---

## User Flow

### Entry Point

1. User opens a new conversation. They see the existing screen: Quily logo, tagline, Help/Examples/Sources pills.
2. A **"Writer" pill** sits alongside the existing pills, with a small **"Beta" badge** attached.
3. Writer Mode is **hidden by default**. It only appears if activated via URL parameter `?writer=true`. Once activated, a localStorage flag persists it for that browser so the user doesn't need the URL every time.

### Mode Transition

4. User clicks the "Writer" pill. The screen transforms (same centered layout):
   - Tagline changes to **"Write about Quilibrium"**
   - A **beta callout** appears below the tagline: "Writer Mode is in beta. Always review posts before sharing."
   - Two action pills appear: **"Inspire me"** / **"Check my draft"**
   - A **voice selector row** appears below: Casual / Technical / Storyteller / Enthusiast
   - Input placeholder changes to **"What do you want to write about?"**

### Writing Conversation

5. A **"Writer Beta" chip** with a pen icon stays visible near the input bar for the entire conversation.
6. User either:
   - Clicks **"Inspire me"** - bot queries RAG broadly and suggests 3-5 topics worth writing about
   - Clicks **"Check my draft"** - the input placeholder changes to "Paste your draft below..." prompting the user to paste their text. Bot then verifies claims against the knowledge base.
   - **Types directly** - user provides their own topic and the bot writes a post. In Writer Mode, any freeform input is treated as a topic/writing request, never as a Q&A question.
7. Bot retrieves from RAG, generates a post in the selected voice.
8. Post appears as a **normal chat message**. User copies with the existing copy button.
9. User can ask for revisions, a different angle, or a new topic in the same conversation.
10. Writer Mode and voice selection both persist for the whole conversation. Neither can be changed mid-conversation. To switch, the user starts a new chat.

---

## Voice System

Four voice personas, each with distinct tone, vocabulary, sentence patterns, and emoji behavior:

### Casual
- Conversational, relaxed, like explaining to a friend
- Shorter sentences, colloquialisms allowed
- Occasional emojis, sporadic and natural, never systematic

### Technical
- Precise, detail-oriented, for developer audiences
- Longer sentences with specifics, technical vocabulary
- No emojis, or only functional ones

### Storyteller
- Narrative-driven, provides context and background, "here's why this matters"
- Varied paragraph lengths, flowing prose
- Minimal emojis, one or two for emphasis at most

### Enthusiast
- Energetic and genuinely positive, but still fact-based, no empty hype
- Think "someone who's been following the project and shares what they find cool"
- A few more emojis than other voices, but never more than 2-3 per post

**Default voice:** Casual (if user doesn't select one).

---

## Anti-Sameness Strategy

Four layers working together to ensure posts sound different:

### 1. Banned Word/Phrase List
~30 high-signal AI-tell words and ~15 formulaic phrases blocked in the system prompt:

**Banned words include:** delve, tapestry, robust, pivotal, leverage, harness, unleash, seamless, cutting-edge, groundbreaking, transformative, revolutionary, nuanced, multifaceted, comprehensive, furthermore, moreover, subsequently, accordingly, crucial, essential, vital, innovative, unprecedented, paradigm, synergy, elevate, foster, streamline, supercharge, unlock, embark, navigate, landscape

**Banned phrases include:** "In today's [world/landscape/era]", "It's worth noting that", "In the world of", "Let's dive in", "Now more than ever", "Revolutionizing the way", "Unlock the power/potential of", "Game-changer", "At the forefront of", "It's no secret that", "Imagine a world where"

**Banned structural patterns:** em dashes as parenthetical separators, starting consecutive sentences with the same word, ending with a neat summary/conclusion, more than 2 bullet points in a row, balanced "on one hand / on the other hand" framing.

### 2. Enforced Burstiness
The system prompt explicitly instructs dramatic sentence length variation. Never three sentences of similar length in a row. Some paragraphs should be one sentence. Others three or four. Sentence fragments are allowed.

### 3. Randomized Structural Templates
Each generation randomly selects an opening strategy from a pool:
- Open with a surprising fact
- Open with a rhetorical question
- Open with a specific detail or number
- Open with a bold statement / take
- Open with a "did you know" angle
- Open with a personal angle ("I've been looking into...")

This rotates per request, so repeated asks on the same topic produce structurally different posts.

### 4. Voice Personas
The four voices (described above) provide fundamentally different tonal profiles. Combined with the randomized structure, two users picking different voices get very different output.

---

## Anti-Hallucination (Stricter than Q&A)

Writer Mode uses a stricter anti-hallucination prompt than normal Q&A because a hallucinated fact in a social post that gets shared widely is far more damaging than an incorrect answer in a private chat.

Rules:
- **Every factual claim must come from retrieved RAG context.** No filling gaps with general knowledge.
- **If RAG confidence is too low, refuse to write.** Suggest a different topic instead. Don't produce a vague, substance-free post.
- **No price speculation, no financial advice framing, no "to the moon" language, no unverifiable claims.** These rules apply across all four voices.
- **Links only from source metadata.** The bot may include 1-2 links per post when a claim comes from a specific official source (docs, blog, announcement). Links must come from URLs present in the retrieved RAG chunks. Never generate or guess URLs.

---

## Anti-Hype Rules (All Voices)

Even the Enthusiast voice is constrained:
- No price predictions or financial advice
- No unverifiable superlatives ("best," "most advanced" unless the source says it)
- No empty marketing language
- No comparisons with competitors unless sourced
- Enthusiasm must be grounded in specific facts, not generic excitement

---

## Links in Posts

The RAG pipeline already returns source URLs with chunks. The system prompt instructs:
- When a specific claim comes from an official source, include the link naturally in the text
- Maximum 1-2 links per post
- Don't force links where they don't fit
- Only use URLs that appear in the retrieved context (never hallucinate URLs)

This serves double duty: makes posts more credible and drives traffic to official Quilibrium resources.

---

## System Prompt Architecture

Writer Mode uses the **same chat API route and RAG pipeline** as normal Q&A. The frontend sends additional flags with the message:
- `mode: "writer"` - triggers the Writer Mode system prompt
- `voice: "casual" | "technical" | "storyteller" | "enthusiast"` - selects the voice persona

The Writer Mode system prompt is composed of these blocks:

1. **Base writer instructions** - role, output format (longer-form posts suitable for threads), general behavior
2. **Voice persona block** - swapped depending on selected voice
3. **Banned words/phrases list** - always included
4. **Burstiness and structural rules** - always included
5. **Randomly selected structural template** - rotated per request from the pool (selection happens server-side in the API route, not in the frontend)
6. **Anti-hallucination rules** - stricter version of the existing Q&A rules
7. **Anti-hype rules** - always included
8. **Link instructions** - how to include source URLs naturally
9. **RAG context** - the retrieved chunks, same as Q&A

### Entry Point Behavior

**"Inspire me":** The bot sends a predefined broad query (e.g., "recent Quilibrium updates, features, and announcements") to the RAG pipeline to retrieve a diverse set of chunks. The query should be tuned to favor recent content so suggestions feel timely. From those chunks, it extracts 3-5 distinct topics and presents them with a one-line description of why each would make a good post. The user picks one (or asks for more), and the bot then writes a post on that topic.

**"Check my draft":** The bot takes the user's pasted text, runs it through RAG to verify each claim, and responds with:
- What's accurate (with sources)
- What's wrong or misleading (with corrections)
- What it can't verify (flagged as unverifiable)

**Direct topic input:** User types a topic, bot retrieves relevant RAG chunks and generates a post in the selected voice.

---

## Feature Gating

- **Default state:** Writer Mode is hidden. The Writer pill does not appear.
- **Activation:** URL parameter `?writer=true` shows the Writer pill and sets a localStorage flag.
- **Persistence:** localStorage flag keeps Writer Mode available for that browser without needing the URL again.
- **Public launch:** Remove the gate and show the Writer pill to all users.

---

## Beta Signals

Three points where the user sees this is a beta feature:
1. The "Writer" pill on the new conversation screen has a small **"Beta" badge**
2. After clicking Writer, a **callout below the tagline**: "Writer Mode is in beta. Always review posts before sharing."
3. The persistent **"Writer Beta" chip** near the input bar throughout the conversation

---

## What Does NOT Change

- RAG retrieval logic
- Embedding pipeline
- Supabase storage
- Models API (still DeepSeek V3.2 on Chutes)
- Chat message rendering (posts are normal messages)
- Copy button behavior
- Existing Q&A mode (completely unaffected)

---

## Technical Scope Summary

| Component | Change |
|-----------|--------|
| New conversation screen | Add Writer pill (gated), Writer Mode transformed screen with pills and voice selector |
| Chat input area | "Writer Beta" chip, new placeholder text |
| Frontend state | `writerMode` flag, `writerVoice` selection, localStorage for feature gate |
| Chat API route | Detect mode/voice flags, swap system prompt |
| System prompt | New Writer Mode prompt with voice personas, banned words, burstiness rules, structural templates |
| "Inspire me" handler | Broad RAG query + topic suggestion formatting |
| "Check my draft" handler | Claim extraction + RAG verification + accuracy report |

---

## Research Reference

See [Humanizing LLM Output Research](../reports/2026-03-30-humanizing-llm-output-research.md) for detailed background on banned word lists, burstiness, persona prompting, min-p sampling, and anti-detection techniques that informed this design.

---

*Last updated: 2026-03-30*
