import type { RetrievedChunk } from '../../../src/lib/rag/types';
import type { RelevanceQuality } from '../../../src/lib/rag/prompt';

type SearchResult = Omit<RetrievedChunk, 'citationIndex' | 'directSimilarity'>;

function document(id: number, title: string, content: string, similarity: number, anchor = ''): SearchResult {
  return {
    id,
    title,
    content,
    similarity,
    source_file: `fixtures/${id}.md`,
    source_url: `https://docs.quilibrium.com/regression/document-${id}${anchor}`,
    heading_path: null,
    published_date: null,
    doc_type: 'documentation',
  };
}

const query = 'Can external developers deploy a DEX on Quilibrium today? What is required?';
const roadmap = document(203, 'Deployment roadmap',
  'External developers cannot deploy decentralized exchanges on Quilibrium today. External deployments require public deployment tooling and network support for third-party applications. No release date has been announced.', 0.70);

export interface EvidenceFixture {
  id: string;
  quality: RelevanceQuality;
  query: string;
  documents: SearchResult[];
  expectedBehavior: string;
}

// Synthetic excerpts hold the answer steady across corpus updates.
export const evidence: Record<RelevanceQuality, EvidenceFixture> = {
  high: {
    id: 'external-deployment-supported',
    quality: 'high',
    query,
    documents: [
      document(201, 'Network operations', 'Node operators run network infrastructure.', 0.77),
      { ...roadmap, id: 202, source_url: roadmap.source_url + '#requirements' },
      roadmap,
      document(204, 'Token reference', 'Token applications are a separate feature from third-party app deployment.', 0.65),
      document(205, 'Storage overview', 'QStorage provides S3-compatible object storage.', 0.60),
    ],
    expectedBehavior: 'Say external developers cannot deploy a DEX today and cite the public deployment tooling and third-party application support requirements. Do not invent a date or additional prerequisites.',
  },
  low: {
    id: 'external-deployment-weak-evidence',
    quality: 'low',
    query,
    documents: [document(206, 'Node guide', 'Node operators can monitor their process logs.', 0.37)],
    expectedBehavior: 'Explicitly say the evidence cannot establish whether external DEX deployment is possible or what it requires. Avoid a yes/no conclusion, requirements guesses, and claims sourced to the unrelated node guide.',
  },
  none: {
    id: 'external-deployment-no-evidence',
    quality: 'none',
    query,
    documents: [],
    expectedBehavior: 'Explicitly say the documentation does not contain the information and point to the official docs. Avoid a yes/no conclusion, invented requirements, and citations.',
  },
};
