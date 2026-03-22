#!/usr/bin/env python3
"""
Model Scout — Discover better or cheaper open-source models for Quily.

Two-phase approach:
  1. Query OpenRouter for all open-source text models with pricing
  2. Cross-check interesting candidates against Chutes availability + pricing

Usage:
    python scripts/model-scout.py                    # Discovery report only
    python scripts/model-scout.py --benchmark        # Also run quick quality eval on shortlist
    python scripts/model-scout.py --type embedding   # Scout embedding models instead of LLMs
    python scripts/model-scout.py --max-input 1.00   # Custom price ceiling ($/M input tokens)
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path


def load_dotenv():
    """Load .env file from project root (no external dependency)."""
    # Walk up from script location to find .env
    script_dir = Path(__file__).resolve().parent
    for parent in [script_dir.parent, script_dir]:
        env_file = parent / ".env"
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, _, value = line.partition("=")
                    key = key.strip()
                    value = value.strip().strip("'\"")
                    # Only set if not already in environment
                    if key not in os.environ:
                        os.environ[key] = value
            break


load_dotenv()

# ─── Current Models (mirror of what's in the codebase) ─────────────────────

CURRENT_LLM_MODELS = {
    "chutes-deepseek-ai-deepseek-v3-1-tee": {
        "display": "DeepSeek V3.1",
        "openrouter_id": "deepseek/deepseek-chat",
        "role": "primary",
    },
    "chutes-deepseek-ai-deepseek-r1-tee": {
        "display": "DeepSeek R1",
        "openrouter_id": "deepseek/deepseek-r1",
        "role": "reasoning",
    },
    "chutes-moonshotai-kimi-k2-5-tee": {
        "display": "Kimi K2.5",
        "openrouter_id": "moonshotai/kimi-k2.5",
        "role": "fallback",
    },
    "chutes-qwen-qwen2-5-72b-instruct": {
        "display": "Qwen 2.5 72B",
        "openrouter_id": "qwen/qwen-2.5-72b-instruct",
        "role": "fallback",
    },
    "chutes-qwen-qwen3-32b": {
        "display": "Qwen 3 32B",
        "openrouter_id": "qwen/qwen3-32b",
        "role": "fallback",
    },
    "chutes-chutesai-mistral-small-3-2-24b-instruct-2506": {
        "display": "Mistral Small 3.2",
        "openrouter_id": "mistralai/mistral-small-3.2-24b-instruct",
        "role": "fallback",
    },
    "chutes-nousresearch-hermes-4-70b": {
        "display": "Hermes 4 70B",
        "openrouter_id": "nousresearch/hermes-4-70b",
        "role": "fallback",
    },
}

CURRENT_EMBEDDING_MODELS = {
    "chutes-baai-bge-m3": {
        "display": "BGE-M3",
        "openrouter_id": None,  # Not on OpenRouter
        "role": "primary",
    },
    "chutes-baai-bge-large-en-v1-5": {
        "display": "BGE Large EN",
        "openrouter_id": None,
        "role": "fallback",
    },
}

# ─── Open-source detection ──────────────────────────────────────────────────

# Known open-source orgs/prefixes on OpenRouter
OPEN_SOURCE_PREFIXES = [
    "deepseek/",
    "meta-llama/",
    "qwen/",
    "mistralai/",
    "nousresearch/",
    "microsoft/phi",
    "microsoft/mai",
    "google/gemma",
    "allenai/",
    "nvidia/",
    "01-ai/",
    "databricks/",
    "cognitivecomputations/",
    "thudm/",
    "amazon/",
    "cohere/command-r",  # open-weight variants
    "xiaomi/",
    "moonshotai/",
    "open-r1/",
    "bytedance/",
]

# Explicitly proprietary — never flag as open-source
PROPRIETARY_PREFIXES = [
    "anthropic/",
    "openai/",
    "google/gemini",
    "google/palm",
    "cohere/command",  # commercial variants
    "x-ai/",
    "perplexity/",
]


def is_reasoning_model(model_id_or_name: str) -> bool:
    """Check if a model is a reasoning/thinking model (too slow for chatbot use)."""
    s = model_id_or_name.lower()
    # Reasoning model indicators: R1, QwQ, "thinking" variants, o1/o3-style
    reasoning_patterns = ["-r1", "/r1", "qwq", "thinking", "-o1", "-o3"]
    return any(p in s for p in reasoning_patterns)


def is_open_source(model_id: str) -> bool:
    """Heuristic: check if a model ID belongs to a known open-source org."""
    mid = model_id.lower()
    # Exclude proprietary first
    for prefix in PROPRIETARY_PREFIXES:
        if mid.startswith(prefix):
            return False
    # Check known open-source
    for prefix in OPEN_SOURCE_PREFIXES:
        if mid.startswith(prefix):
            return True
    # Unknown org — skip
    return False


# ─── API helpers ────────────────────────────────────────────────────────────

def fetch_json(url: str, headers: dict = None, timeout: int = 30) -> dict:
    """Fetch JSON from a URL."""
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode())


def fetch_openrouter_models() -> list[dict]:
    """Fetch all models from OpenRouter (no auth required)."""
    data = fetch_json("https://openrouter.ai/api/v1/models")
    return data.get("data", [])


def fetch_chutes_models(limit: int = 1000) -> list[dict]:
    """Fetch all public chutes from Chutes.ai (no auth required)."""
    url = f"https://api.chutes.ai/chutes/?include_public=true&limit={limit}"
    data = fetch_json(url, headers={"Content-Type": "application/json"})
    return data.get("items", [])


# ─── Parsing helpers ────────────────────────────────────────────────────────

def parse_or_pricing(model: dict) -> tuple[float, float]:
    """Extract per-million-token pricing from OpenRouter model."""
    pricing = model.get("pricing", {})
    try:
        p_in = float(pricing.get("prompt", 0)) * 1_000_000
        p_out = float(pricing.get("completion", 0)) * 1_000_000
    except (ValueError, TypeError):
        p_in, p_out = 0.0, 0.0
    return p_in, p_out


def parse_chutes_pricing(chute: dict) -> tuple[float, float]:
    """Extract per-million-token pricing from Chutes model."""
    price = chute.get("current_estimated_price", {})
    per_m = price.get("per_million_tokens", {})
    try:
        p_in = per_m.get("input", {}).get("usd", 0.0)
        p_out = per_m.get("output", {}).get("usd", 0.0)
    except (ValueError, TypeError):
        p_in, p_out = 0.0, 0.0
    return p_in, p_out


def normalize_model_name(name: str) -> str:
    """Normalize a model name for fuzzy matching between OpenRouter and Chutes."""
    return (
        name.lower()
        .replace("-", "")
        .replace("_", "")
        .replace(".", "")
        .replace(" ", "")
    )


def chute_slug_to_search_terms(slug: str) -> list[str]:
    """Extract searchable terms from a Chutes slug."""
    # e.g. "chutes-deepseek-ai-deepseek-v3-1-tee" -> ["deepseek", "v3", "1"]
    parts = slug.replace("chutes-", "").replace("-tee", "").split("-")
    # Filter out org-name-like parts and short fragments
    return [p for p in parts if len(p) > 1]


# ─── Phase 1: OpenRouter Discovery ─────────────────────────────────────────

def discover_openrouter(
    model_type: str = "llm",
    max_input_price: float = 2.0,
    max_output_price: float = 8.0,
) -> list[dict]:
    """
    Discover open-source models on OpenRouter.
    Returns sorted list of candidates with pricing.
    """
    print("  Fetching OpenRouter models...")
    all_models = fetch_openrouter_models()
    print(f"  Found {len(all_models)} total models")

    candidates = []
    for m in all_models:
        mid = m.get("id", "")

        # Skip free-tier variants (rate limited, not for production)
        if mid.endswith(":free") or mid.endswith(":extended"):
            continue

        # Open-source only
        if not is_open_source(mid):
            continue

        # Filter by modality
        arch = m.get("architecture", {})
        modality = arch.get("modality", "")

        if model_type == "llm":
            if "text" not in modality.split("->")[-1]:
                continue
        elif model_type == "embedding":
            # OpenRouter doesn't really list embedding models, but check anyway
            if "embedding" not in modality.lower() and "embed" not in mid.lower():
                continue

        p_in, p_out = parse_or_pricing(m)

        # Price ceiling filter
        if p_in > max_input_price or p_out > max_output_price:
            continue

        candidates.append({
            "id": mid,
            "name": m.get("name", mid),
            "context_length": m.get("context_length", 0),
            "price_in": p_in,
            "price_out": p_out,
            "modality": modality,
            "source": "openrouter",
        })

    # Sort by input price ascending
    candidates.sort(key=lambda c: (c["price_in"], c["price_out"]))
    print(f"  {len(candidates)} open-source candidates within price range")
    return candidates


# ─── Phase 2: Chutes Cross-Check ───────────────────────────────────────────

def crosscheck_chutes(
    candidates: list[dict],
    model_type: str = "llm",
) -> tuple[list[dict], list[dict]]:
    """
    Check which OpenRouter candidates are also available on Chutes.
    Returns (on_chutes, not_on_chutes) lists.
    """
    print("  Fetching Chutes catalog...")
    chutes = fetch_chutes_models()
    print(f"  Found {len(chutes)} total chutes")

    # Filter to vLLM template (actual LLM inference) or embedding
    if model_type == "llm":
        chutes = [c for c in chutes if c.get("standard_template") == "vllm"]
    elif model_type == "embedding":
        chutes = [
            c for c in chutes
            if "embed" in c.get("name", "").lower()
            or "bge" in c.get("name", "").lower()
            or "e5" in c.get("name", "").lower()
        ]

    # Build lookup: normalized name fragments -> chute
    chutes_index = {}
    for chute in chutes:
        name = chute.get("name", "")
        slug = chute.get("slug", "")
        norm_name = normalize_model_name(name)
        norm_slug = normalize_model_name(slug)
        chutes_index[norm_name] = chute
        chutes_index[norm_slug] = chute

    on_chutes = []
    not_on_chutes = []

    for cand in candidates:
        or_id = cand["id"]
        # Try matching by normalized name
        # OpenRouter ID like "deepseek/deepseek-chat" -> normalize the model part
        norm_id = normalize_model_name(or_id.split("/")[-1])
        norm_full = normalize_model_name(or_id.replace("/", ""))

        match = None
        for key, chute in chutes_index.items():
            if norm_id in key or norm_full in key or key in norm_id:
                match = chute
                break

        if match:
            cp_in, cp_out = parse_chutes_pricing(match)
            cand["chutes_slug"] = match.get("slug", "")
            cand["chutes_name"] = match.get("name", "")
            cand["chutes_price_in"] = cp_in
            cand["chutes_price_out"] = cp_out
            cand["chutes_tee"] = match.get("tee", False)
            cand["chutes_invocations"] = match.get("invocation_count", 0)
            on_chutes.append(cand)
        else:
            not_on_chutes.append(cand)

    print(f"  {len(on_chutes)} candidates available on Chutes")
    print(f"  {len(not_on_chutes)} candidates OpenRouter-only")
    return on_chutes, not_on_chutes


# ─── Chutes-direct discovery (for embeddings) ──────────────────────────────

def discover_chutes_embeddings() -> tuple[list[dict], list[dict]]:
    """
    Discover embedding models directly from Chutes.
    OpenRouter doesn't list embedding models, so we go to Chutes directly.
    """
    print("  Fetching Chutes catalog...")
    chutes = fetch_chutes_models()
    print(f"  Found {len(chutes)} total chutes")

    # Filter to embedding-related chutes (exclude mining/affine noise and non-embedding models)
    EMBED_KEYWORDS = ["embed", "bge", "e5-", "gte-"]
    embedding_chutes = [
        c for c in chutes
        if any(kw in c.get("name", "").lower() for kw in EMBED_KEYWORDS)
        and "affine" not in c.get("name", "").lower()
        and "affine" not in c.get("slug", "").lower()
        # Exclude models that just happen to match but aren't embedding models
        and c.get("standard_template") != "vllm"
    ]

    print(f"  {len(embedding_chutes)} embedding models found")

    on_chutes = []
    for ch in embedding_chutes:
        cp_in, cp_out = parse_chutes_pricing(ch)
        on_chutes.append({
            "id": ch.get("slug", ""),
            "name": ch.get("name", ""),
            "context_length": 0,  # Chutes doesn't expose this for embeddings
            "price_in": cp_in,
            "price_out": cp_out,
            "modality": "embedding",
            "source": "chutes",
            "chutes_slug": ch.get("slug", ""),
            "chutes_name": ch.get("name", ""),
            "chutes_price_in": cp_in,
            "chutes_price_out": cp_out,
            "chutes_tee": ch.get("tee", False),
            "chutes_invocations": ch.get("invocation_count", 0),
        })

    on_chutes.sort(key=lambda c: (c["price_in"], c["price_out"]))
    return on_chutes, []  # No "not on chutes" for direct discovery


# ─── Phase 3: Report ───────────────────────────────────────────────────────

def get_current_models(model_type: str) -> dict:
    if model_type == "llm":
        return CURRENT_LLM_MODELS
    return CURRENT_EMBEDDING_MODELS


def extract_model_size(name: str) -> float:
    """Extract model size in billions from name. Returns 0 if not found."""
    import re
    # Match patterns like "235B", "70b", "32B", "1B", "0.6B"
    # Also handle MoE patterns like "235B-A22B" or "480B A35B"
    # Use word boundary to avoid matching version numbers like "V3.2"
    match = re.search(r'(\d+(?:\.\d+)?)\s*[Bb]\b', name)
    if match:
        return float(match.group(1))
    # Known models without size in name
    KNOWN_SIZES = {
        "deepseek v3": 685,
        "deepseek-v3": 685,
        "deepseek v3.1": 685,
        "deepseek v3.2": 685,
        "deepseek-chat": 685,
        "deepseek r1 0528": 685,
        "deepseek r1": 685,
        "mimo-v2-flash": 56,
        "mimo-v2-omni": 56,
        "mistral nemo": 12,
        "mistral small 3": 24,
        "kimi k2": 1000,  # 1T MoE
        "qwen3 coder next": 480,  # Same as Qwen3 Coder 480B
        "qwen3-coder-next": 480,
    }
    # Normalize for matching: strip punctuation
    name_clean = re.sub(r'[^a-z0-9\s\-.]', '', name.lower())
    for key, size in KNOWN_SIZES.items():
        if key in name_clean:
            return float(size)
    return 0.0


def print_report(
    on_chutes: list[dict],
    not_on_chutes: list[dict],
    model_type: str,
    benchmark_results: dict = None,
):
    """Print the model scout report."""
    current = get_current_models(model_type)
    current_or_ids = {
        v["openrouter_id"] for v in current.values() if v.get("openrouter_id")
    }
    current_chutes_slugs = set(current.keys())

    type_label = "LLM" if model_type == "llm" else "Embedding"
    print()
    print("=" * 110)
    print(f"  MODEL SCOUT REPORT — {type_label} Models")
    print(f"  Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 110)

    # ── Current models ──
    print(f"\n  CURRENT {type_label.upper()} MODELS")
    print("  " + "-" * 106)
    print(f"  {'Model':<35} {'Role':<12} {'Chutes Slug':<50}")
    print("  " + "-" * 106)
    for slug, info in current.items():
        print(f"  {info['display']:<35} {info['role']:<12} {slug}")

    # ── Candidates on Chutes (most actionable) ──
    if not on_chutes:
        print(f"\n  No new open-source {type_label} candidates found on Chutes.")
    else:
        # Get primary model pricing for comparison
        primary_slug = next(
            (s for s, v in current.items() if v["role"] == "primary"), None
        )
        primary_chutes = next(
            (c for c in on_chutes if primary_slug and primary_slug in c.get("chutes_slug", "")),
            None,
        )
        # If primary wasn't in the OpenRouter results (already in use), fetch its Chutes price
        if not primary_chutes and primary_slug:
            try:
                chutes_all = fetch_chutes_models()
                for ch in chutes_all:
                    if primary_slug in ch.get("slug", ""):
                        cp_in, cp_out = parse_chutes_pricing(ch)
                        primary_chutes = {
                            "chutes_price_in": cp_in,
                            "chutes_price_out": cp_out,
                            "chutes_invocations": ch.get("invocation_count", 0),
                        }
                        break
            except Exception:
                pass

        # Filter out models we already use
        new_candidates = [
            c for c in on_chutes
            if c["id"] not in current_or_ids
            and c.get("chutes_slug", "") not in current_chutes_slugs
        ]

        if not new_candidates:
            print(f"\n  All Chutes-available candidates are already in use.")
        else:
            # ── CHUTES SECTION: sorted by power (subscription — cost doesn't filter) ──
            # Quality rank: model size > invocations > context window
            for c in new_candidates:
                c["_size"] = extract_model_size(c["name"])

            new_candidates.sort(key=lambda c: (
                -c["_size"],                          # Bigger model first
                -c.get("chutes_invocations", 0),      # More popular first
                -c.get("context_length", 0),           # Larger context first
            ))

            # Price comparison tag vs primary
            ref_in = primary_chutes.get("chutes_price_in", 0) if primary_chutes else 0

            print(f"\n  CHUTES CANDIDATES — ranked by estimated capability ({len(new_candidates)} found)")
            print("  Chutes uses subscription pricing — cost shown for reference, not as a filter.")
            if primary_chutes:
                ref_inv = primary_chutes.get("chutes_invocations", 0)
                print(f"  Current primary: {primary_slug} (${ref_in:.3f}/M in, {ref_inv:,} invocations)")
            print("  " + "-" * 106)
            header = (
                f"  {'Model':<35} {'Size':>6} {'Ctx':>6} "
                f"{'Chutes In':>10} {'Chutes Out':>11} "
                f"{'TEE':>4} {'Invocations':>12}  {'vs Primary'}"
            )
            print(header)
            print("  " + "-" * 106)

            for c in new_candidates:
                # Price comparison tag
                c_in = c.get("chutes_price_in", 0)
                if ref_in > 0:
                    if c_in < ref_in * 0.8:
                        price_tag = "CHEAPER"
                    elif c_in > ref_in * 1.2:
                        price_tag = "PRICIER"
                    else:
                        price_tag = "SIMILAR COST"
                else:
                    price_tag = ""

                tee = "Yes" if c.get("chutes_tee") else "No"
                invocations = c.get("chutes_invocations", 0)
                inv_str = f"{invocations:,}" if invocations else "—"
                size = c.get("_size", 0)
                size_str = f"{size:.0f}B" if size >= 1 else (f"{size}B" if size > 0 else "—")
                ctx = c.get("context_length", 0)
                ctx_str = f"{ctx // 1000}k" if ctx > 0 else "—"

                bench_str = ""
                if benchmark_results and c["id"] in benchmark_results:
                    br = benchmark_results[c["id"]]
                    bench_str = f" [Bench: {br['score']}/{br['max']}]"

                print(
                    f"  {c['name']:<35} {size_str:>6} {ctx_str:>6} "
                    f"${c.get('chutes_price_in', 0):>8.3f} ${c.get('chutes_price_out', 0):>9.3f} "
                    f"{tee:>4} {inv_str:>12}  {price_tag}"
                    f"{bench_str}"
                )

    # ── OpenRouter-only candidates (for reference / pay-as-you-go) ──
    notable_or_only = [
        c for c in not_on_chutes
        if c["id"] not in current_or_ids
        and c["price_in"] < 0.50
    ]
    if notable_or_only:
        print(f"\n  OPENROUTER-ONLY — not on Chutes, relevant if using pay-as-you-go ({len(notable_or_only)} shown)")
        print("  " + "-" * 106)
        print(
            f"  {'Model':<45} {'Context':>8} "
            f"{'$/M In':>10} {'$/M Out':>11}"
        )
        print("  " + "-" * 106)
        for c in notable_or_only[:15]:
            print(
                f"  {c['name']:<45} {c['context_length'] // 1000:>6}k "
                f"${c['price_in']:>8.3f} ${c['price_out']:>9.3f}"
            )
        if len(notable_or_only) > 15:
            print(f"  ... and {len(notable_or_only) - 15} more")

    print()
    print("=" * 110)
    print("  Notes:")
    print("  - Chutes section: sorted by model size/capability, not price (subscription model)")
    print("  - Price shown for reference — relevant if switching to pay-as-you-go")
    print("  - Size = total parameters (MoE models show total, e.g. 235B-A22B = 235B total)")
    print("  - Context = max token window in thousands (k)")
    print("  - TEE = Trusted Execution Environment (privacy-preserving)")
    print("  - Invocations = total API calls on Chutes (popularity/trust signal)")
    if benchmark_results:
        print("  - Bench scores: higher is better (tests Q&A quality with Quilibrium questions)")
    print("  - To update the curated list, edit src/lib/chutes/chuteDiscovery.ts")
    print("=" * 110)


# ─── Phase 4: Benchmark (optional) ─────────────────────────────────────────

BENCHMARK_PROMPTS = [
    # ── Factual (should answer correctly) ──
    {
        "id": "factual",
        "prompt": "What is Quilibrium?",
        "must_mention": ["decentralized", "privacy", "protocol"],
        "must_not_mention": [],
        "description": "Core protocol knowledge",
    },
    {
        "id": "technical",
        "prompt": "How does Quilibrium's consensus mechanism work?",
        "must_mention": ["proof", "work"],
        "must_not_mention": [],
        "description": "Technical depth — must reference proof-of-meaningful-work",
    },
    {
        "id": "product",
        "prompt": "What is QKMS and how does it work?",
        "must_mention": ["key", "management"],
        "must_not_mention": [],
        "description": "Product knowledge — key management service",
    },
    # ── Hallucination traps (should NOT make things up) ──
    {
        "id": "no-staking",
        "prompt": "How do I stake QUIL tokens?",
        "must_mention": [],
        "must_not_mention": ["stake your tokens", "staking rewards", "apy", "validator staking",
                             "delegate your", "staking pool", "earn rewards by staking"],
        "description": "Quilibrium has NO staking — model must not hallucinate one",
    },
    {
        "id": "no-solidity",
        "prompt": "How do I deploy a Solidity smart contract on Quilibrium?",
        "must_mention": [],
        "must_not_mention": ["deploy your solidity", "compile your contract",
                             "evm bytecode", "remix ide", "hardhat deploy"],
        "description": "Quilibrium doesn't use Solidity/EVM — must not hallucinate",
    },
    {
        "id": "no-price",
        "prompt": "What will QUIL be worth in 2027?",
        "must_mention": [],
        "must_not_mention": ["will reach", "could reach", "projected to", "price target",
                             "market cap of", "will be worth $"],
        "description": "Should decline price speculation, not predict",
    },
    # ── Instruction following ──
    {
        "id": "concise",
        "prompt": "In exactly one sentence, what does a Quilibrium node do?",
        "must_mention": [],
        "must_not_mention": [],
        "max_sentences": 3,  # Generous, but penalizes essays
        "description": "Instruction following — asked for one sentence",
    },
    # ── Boundary testing ──
    {
        "id": "off-topic",
        "prompt": "What do you think of Solana?",
        "must_mention": [],
        "must_not_mention": [],
        "should_decline": True,
        "description": "Off-topic about another chain — should redirect to Quilibrium",
    },
    # ── Correction handling (multi-turn) ──
    {
        "id": "correction",
        "prompt": "That's wrong. The node requirements are actually 16GB RAM minimum, not 8GB.",
        "must_mention": [],
        "must_not_mention": [],
        "is_correction_test": True,
        "description": "User says answer is wrong — model should acknowledge and offer to flag/fix, not double down",
        # Requires multi-turn setup (assistant gave a previous answer)
        "setup_messages": [
            {"role": "user", "content": "What are the system requirements for running a Quilibrium node?"},
            {"role": "assistant", "content": "To run a Quilibrium node, you'll need at least 8GB of RAM, a multi-core CPU, and around 250GB of disk space. Make sure your system meets these minimums for stable operation."},
        ],
    },
]

BENCHMARK_SYSTEM_PROMPT = (
    "You are Quily, the official Quilibrium AI assistant. "
    "You help users understand the Quilibrium decentralized protocol. "
    "Be accurate, concise, and helpful. If you're not sure about something, say so. "
    "Quilibrium uses proof-of-meaningful-work consensus and multi-party computation (MPC). "
    "Quilibrium does NOT have staking, does NOT use EVM/Solidity, and is NOT an L1/L2 blockchain. "
    "Only answer questions about Quilibrium. Politely decline off-topic questions."
)


def benchmark_model(model_id: str, api_key: str) -> dict:
    """Run a quick quality benchmark against a model via OpenRouter."""
    url = "https://openrouter.ai/api/v1/chat/completions"
    total_score = 0
    max_score = 0
    details = []

    for test in BENCHMARK_PROMPTS:
        max_score += 3

        # Build messages — support multi-turn setup for correction tests
        messages = [{"role": "system", "content": BENCHMARK_SYSTEM_PROMPT}]
        if test.get("setup_messages"):
            messages.extend(test["setup_messages"])
        messages.append({"role": "user", "content": test["prompt"]})

        payload = json.dumps({
            "model": model_id,
            "messages": messages,
            "max_tokens": 1500,  # Higher limit for thinking models that use <think> tags
        }).encode()

        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                body = json.loads(resp.read().decode())
            raw_content = (
                body.get("choices", [{}])[0]
                .get("message", {})
                .get("content", "")
            )

            # Strip <think>...</think> blocks (reasoning/CoT models)
            import re
            content = re.sub(
                r'<think>.*?</think>', '', raw_content, flags=re.DOTALL
            ).strip().lower()

            # If stripping left nothing, try the raw content
            if len(content.split()) < 3:
                content = raw_content.lower()

            # Scoring: up to 3 points per test
            score = 0
            notes = []
            word_count = len(content.split())

            if word_count > 5:
                score = 1  # At least gave a real response

            # Positive: must_mention keywords
            mentions_found = []
            must_mention = test.get("must_mention", [])
            for kw in must_mention:
                if kw.lower() in content:
                    mentions_found.append(kw)
            if must_mention:
                if len(mentions_found) == len(must_mention):
                    score += 1
                    notes.append(f"mentioned {len(mentions_found)}/{len(must_mention)}")
                else:
                    notes.append(f"missed {len(must_mention) - len(mentions_found)} keywords")

            # Negative: must_not_mention (hallucination detection)
            must_not = test.get("must_not_mention", [])
            hallucinated = [kw for kw in must_not if kw.lower() in content]
            if must_not and not hallucinated:
                score += 1  # Correctly avoided hallucination
                notes.append("no hallucination")
            elif hallucinated:
                score = max(0, score - 1)  # Penalize hallucination
                notes.append(f"hallucinated: {hallucinated[:2]}")

            # Instruction following: max_sentences check
            max_sent = test.get("max_sentences")
            if max_sent is not None:
                # Rough sentence count
                sentences = len([s for s in content.split('.') if len(s.strip()) > 10])
                if sentences <= max_sent:
                    score += 1
                    notes.append(f"{sentences} sentences (good)")
                else:
                    notes.append(f"{sentences} sentences (asked for {max_sent})")

            # Correction handling: should acknowledge error and offer to flag
            if test.get("is_correction_test"):
                acknowledge_indicators = [
                    "thank", "apolog", "correct", "you're right", "you are right",
                    "updated", "noted", "appreciate", "mistake", "sorry",
                    "i stand corrected", "my mistake", "thanks for",
                ]
                flag_indicators = [
                    "issue", "flag", "report", "fix", "update", "note",
                    "record", "forward", "team", "review",
                ]
                doubled_down = any(phrase in content for phrase in [
                    "actually 8gb", "8gb is correct", "the requirement is 8gb",
                    "8 gb is the minimum",
                ])
                acknowledged = any(ind in content for ind in acknowledge_indicators)
                offered_action = any(ind in content for ind in flag_indicators)
                if doubled_down:
                    score = max(0, score - 2)
                    notes.append("doubled down on wrong answer")
                elif acknowledged and offered_action:
                    score += 2
                    notes.append("acknowledged + offered to flag")
                elif acknowledged:
                    score += 1
                    notes.append("acknowledged but no action offered")
                else:
                    notes.append("unclear correction response")

            # Boundary: should_decline
            if test.get("should_decline"):
                decline_indicators = [
                    "quilibrium", "can't help with", "outside my", "not related",
                    "focus on quilibrium", "i'm here to help with quilibrium",
                    "don't have information about", "only assist with",
                ]
                if any(ind in content for ind in decline_indicators):
                    score += 1
                    notes.append("redirected to Quilibrium")
                else:
                    notes.append("didn't redirect")

            # If no special checks (pure factual), give bonus for having content
            if not must_not and not test.get("max_sentences") and not test.get("should_decline"):
                if word_count > 20 and mentions_found:
                    score += 1  # Substantial, relevant answer

            score = min(score, 3)
            total_score += score
            details.append({
                "test": test["id"],
                "score": score,
                "notes": "; ".join(notes) if notes else "",
                "mentions": mentions_found,
                "word_count": word_count,
            })

        except Exception as e:
            details.append({
                "test": test["id"],
                "score": 0,
                "error": str(e)[:100],
            })

        # Small delay to avoid rate limiting
        time.sleep(0.5)

    return {
        "score": total_score,
        "max": max_score,
        "details": details,
    }


def run_benchmarks(candidates: list[dict], max_models: int = 5) -> dict:
    """Benchmark top N candidates."""
    api_key = os.environ.get("OPENROUTER_API_KEY", "")
    if not api_key:
        print("\n  WARNING: OPENROUTER_API_KEY not set. Skipping benchmark.")
        print("  Set it to enable quality testing: export OPENROUTER_API_KEY=sk-or-...")
        return {}

    # Filter out reasoning/thinking models — too slow for chatbot use
    chat_candidates = []
    skipped = []
    for c in candidates:
        if is_reasoning_model(c["id"]) or is_reasoning_model(c.get("name", "")):
            skipped.append(c)
        else:
            chat_candidates.append(c)
    if skipped:
        print(f"  Skipping {len(skipped)} reasoning model(s) (too slow for chatbot):")
        for s in skipped:
            print(f"    - {s.get('name', s['id'])}")

    # Pick top candidates by capability (largest models first) up to max_models
    ranked = sorted(chat_candidates, key=lambda c: (
        -extract_model_size(c["name"]),
        -c.get("chutes_invocations", 0),
        -c.get("context_length", 0),
    ))
    to_test = ranked[:max_models]

    print(f"\n  Benchmarking {len(to_test)} candidates...")
    results = {}

    for cand in to_test:
        mid = cand["id"]
        print(f"    Testing {mid}...", end=" ", flush=True)
        result = benchmark_model(mid, api_key)
        results[mid] = result
        print(f"{result['score']}/{result['max']}")

    return results


# ─── Main ───────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Scout for better/cheaper open-source models for Quily"
    )
    parser.add_argument(
        "--type",
        choices=["llm", "embedding"],
        default="llm",
        help="Model type to scout (default: llm)",
    )
    parser.add_argument(
        "--max-input",
        type=float,
        default=2.0,
        help="Max input price in $/M tokens (default: 2.0)",
    )
    parser.add_argument(
        "--max-output",
        type=float,
        default=8.0,
        help="Max output price in $/M tokens (default: 8.0)",
    )
    parser.add_argument(
        "--benchmark",
        action="store_true",
        help="Run quality benchmark on shortlisted candidates (needs OPENROUTER_API_KEY)",
    )
    parser.add_argument(
        "--benchmark-count",
        type=int,
        default=5,
        help="Max models to benchmark (default: 5)",
    )
    args = parser.parse_args()

    type_label = "LLM" if args.type == "llm" else "Embedding"
    print(f"Model Scout — {type_label} Discovery")
    print(f"  Price ceiling: ${args.max_input:.2f}/M in, ${args.max_output:.2f}/M out")
    print(f"  Benchmark: {'Yes' if args.benchmark else 'No'}")
    print()

    if args.type == "embedding":
        # Embedding models: query Chutes directly (OpenRouter doesn't list them)
        print("Phase 1: Chutes Direct Discovery (embeddings)")
        on_chutes, not_on_chutes = discover_chutes_embeddings()
        print_report(on_chutes, not_on_chutes, args.type)
    else:
        # LLM models: OpenRouter discovery + Chutes cross-check
        print("Phase 1: OpenRouter Discovery")
        candidates = discover_openrouter(
            model_type=args.type,
            max_input_price=args.max_input,
            max_output_price=args.max_output,
        )

        if not candidates:
            print("  No candidates found. Try increasing --max-input / --max-output.")
            return

        # Phase 2: Chutes cross-check
        print("\nPhase 2: Chutes Cross-Check")
        on_chutes, not_on_chutes = crosscheck_chutes(candidates, model_type=args.type)

        # Phase 3 (optional): Benchmark
        benchmark_results = {}
        if args.benchmark and on_chutes:
            print("\nPhase 3: Quality Benchmark")
            current = get_current_models(args.type)
            current_or_ids = {
                v["openrouter_id"] for v in current.values() if v.get("openrouter_id")
            }
            current_chutes_slugs = set(current.keys())
            new_on_chutes = [c for c in on_chutes
            if c["id"] not in current_or_ids
            and c.get("chutes_slug", "") not in current_chutes_slugs]
            if new_on_chutes:
                benchmark_results = run_benchmarks(new_on_chutes, max_models=args.benchmark_count)
            else:
                print("  No new candidates to benchmark.")

        # Report
        print_report(on_chutes, not_on_chutes, args.type, benchmark_results)


if __name__ == "__main__":
    main()
