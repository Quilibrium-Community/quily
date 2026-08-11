import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { embed } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! });

// Use BGE-M3 model (1024 dims) to match document_chunks_chutes table
const EMBEDDING_MODEL = 'baai/bge-m3';

// Search term / query, taken from the command line.
//   npx tsx scripts/debug-search.ts                        -> defaults to "quilibrium"
//   npx tsx scripts/debug-search.ts copyleft               -> text + vector search for "copyleft"
//   npx tsx scripts/debug-search.ts "how do fees work"     -> quote multi-word queries
//   npx tsx scripts/debug-search.ts --source discord/      -> dump chunks whose path matches
// The same string drives both the literal text search and the vector search.
const argv = process.argv.slice(2);
const sourceFlag = argv.indexOf('--source');
const SOURCE_FILTER = sourceFlag !== -1 ? argv[sourceFlag + 1] : undefined;
const QUERY =
  (sourceFlag !== -1 ? argv.filter((_, i) => i !== sourceFlag && i !== sourceFlag + 1) : argv)
    .join(' ')
    .trim() || 'quilibrium';

/**
 * Dump the chunks stored under a given source_file path.
 * Useful for inspecting an orphaned or duplicated entry before deleting it.
 */
async function dumpBySource(pathFragment: string) {
  console.log(`=== Chunks whose source_file matches "${pathFragment}" ===\n`);

  const { data, error } = await supabase
    .from('document_chunks_chutes')
    .select('id, source_file, content')
    .ilike('source_file', `%${pathFragment}%`)
    .order('id');

  if (error) {
    console.error('Query error:', error.message);
    return;
  }

  console.log(`Found ${data?.length ?? 0} chunk(s)\n`);
  for (const chunk of data ?? []) {
    console.log('---');
    console.log('ID:', chunk.id);
    console.log('Source:', chunk.source_file);
    console.log('Length:', chunk.content.length, 'chars');
    console.log('Content:', chunk.content.slice(0, 600).replace(/\n/g, ' '));
    console.log('');
  }
}

async function debugSearch() {
  console.log(`=== Searching for chunks containing "${QUERY}" ===\n`);

  // Literal substring match on chunk content
  const { data: textMatches, error: textError } = await supabase
    .from('document_chunks_chutes')
    .select('id, source_file, content')
    .ilike('content', `%${QUERY}%`)
    .limit(20);

  if (textError) {
    console.error('Text search error:', textError.message);
    return;
  }

  console.log(`Found ${textMatches?.length ?? 0} chunks with "${QUERY}" in text\n`);

  if (textMatches && textMatches.length > 0) {
    for (const chunk of textMatches.slice(0, 5)) {
      console.log('---');
      console.log('ID:', chunk.id);
      console.log('Source:', chunk.source_file);
      console.log('Preview:', chunk.content.slice(0, 200).replace(/\n/g, ' ') + '...');
    }
  } else {
    console.log('(This is a literal substring match, not semantic — a full sentence');
    console.log(' will usually find nothing here. See the vector search below.)');
  }

  // Also check source files
  console.log(`\n\n=== Source files containing "${QUERY}" in path ===\n`);

  const { data: sourceFiles } = await supabase
    .from('document_chunks_chutes')
    .select('source_file')
    .ilike('source_file', `%${QUERY}%`);

  const uniqueSources = [...new Set(sourceFiles?.map(f => f.source_file) ?? [])];
  console.log(`Found ${uniqueSources.length} source files with "${QUERY}" in path:`);
  for (const src of uniqueSources) {
    console.log('  -', src);
  }

  // Check total embedding count
  console.log('\n\n=== Embedding statistics ===\n');

  const { data: sample } = await supabase
    .from('document_chunks_chutes')
    .select('id, embedding')
    .limit(1);

  if (sample && sample[0]) {
    const embedding = sample[0].embedding;
    console.log('Embedding exists:', !!embedding);
    console.log('Embedding type:', typeof embedding);
    if (Array.isArray(embedding)) {
      console.log('Embedding length:', embedding.length);
      console.log('First 5 values:', embedding.slice(0, 5));
    } else if (typeof embedding === 'string') {
      // pgvector returns as string
      const parsed = embedding.replace(/[\[\]]/g, '').split(',').map(Number);
      console.log('Embedding length:', parsed.length);
      console.log('First 5 values:', parsed.slice(0, 5));
    }
  }
}

async function testVectorSearch() {
  console.log('\n\n=== Testing vector search directly ===\n');

  console.log('Query:', QUERY);

  // Generate embedding using BGE-M3 (1024 dims)
  console.log('Generating embedding with BGE-M3...');
  const { embedding } = await embed({
    model: openrouter.textEmbeddingModel(EMBEDDING_MODEL),
    value: QUERY,
  });

  console.log('Embedding generated, length:', embedding.length);
  console.log('First 5 values:', embedding.slice(0, 5));

  // Test with very low threshold
  console.log('\nCalling match_document_chunks_chutes with threshold 0.3...');
  const { data: results, error } = await supabase.rpc('match_document_chunks_chutes', {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: 10,
  });

  if (error) {
    console.error('RPC Error:', error.message);
    return;
  }

  console.log(`\nFound ${results?.length ?? 0} results:`);
  for (const result of results ?? []) {
    console.log('---');
    console.log('Similarity:', result.similarity.toFixed(4));
    console.log('Source:', result.source_file);
    console.log('Preview:', result.content.slice(0, 100).replace(/\n/g, ' ') + '...');
  }

  // Also test a specific chunk we know has "quilibrium"
  console.log('\n\n=== Testing with a known good chunk ===');
  const { data: knownChunk } = await supabase
    .from('document_chunks_chutes')
    .select('id, content, embedding')
    .eq('source_file', 'quilibrium-official/discover/01-what-is-quilibrium.md')
    .limit(1)
    .single();

  if (knownChunk) {
    console.log('\nFound "what-is-quilibrium.md" chunk:');
    console.log('ID:', knownChunk.id);
    console.log('Content preview:', knownChunk.content.slice(0, 200));

    // Parse the embedding from the chunk
    const chunkEmbedding = typeof knownChunk.embedding === 'string'
      ? knownChunk.embedding.replace(/[\[\]]/g, '').split(',').map(Number)
      : knownChunk.embedding;

    console.log('\nChunk embedding length:', chunkEmbedding?.length);
    console.log('Chunk first 5 values:', chunkEmbedding?.slice(0, 5));

    // Calculate cosine similarity manually
    if (chunkEmbedding && chunkEmbedding.length === embedding.length) {
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      for (let i = 0; i < embedding.length; i++) {
        dotProduct += embedding[i] * chunkEmbedding[i];
        normA += embedding[i] * embedding[i];
        normB += chunkEmbedding[i] * chunkEmbedding[i];
      }
      const cosineSimilarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      console.log('\nManual cosine similarity:', cosineSimilarity.toFixed(4));
    }
  } else {
    console.log('Could not find what-is-quilibrium.md chunk');
  }
}

if (SOURCE_FILTER) {
  dumpBySource(SOURCE_FILTER).catch(console.error);
} else {
  debugSearch().then(testVectorSearch).catch(console.error);
}
