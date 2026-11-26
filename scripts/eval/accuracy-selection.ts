import type { RetrievedChunk } from '../../src/lib/rag/types';

type Passage = Omit<RetrievedChunk, 'citationIndex'>;
type VectorLane = { query: string; rows: Passage[] };

export interface SelectionTrace {
  query: string;
  final: RetrievedChunk[];
  vector: VectorLane[];
  facetReports?: Array<{ query: string; trace: { vector: VectorLane[] } }>;
}

function declaredHeaders(content: string): Set<string> {
  const block = content.split(/export const HEADER_PARAMETERS\s*=\s*\[/)[1]?.split(/^\s*\];/m)[0] ?? '';
  return new Set([...block.matchAll(/\{\s*name:\s*"([^"]+)"(?:(?!^\s*\},?\s*$)[\s\S])*?\brequired:\s*(?:true|false)\b/gm)]
    .map(match => match[1].toLowerCase()));
}

export function selectPassage(trace: SelectionTrace, rankOnly = false) {
  const { query, final, vector, facetReports = [] } = trace;
  if (final.length < 2) return final;
  const selectedIds = new Set(final.map(chunk => chunk.id));
  const selectedFiles = new Set(final.map(chunk => chunk.source_file));
  const missingSibling = (chunk: Passage) =>
    !selectedIds.has(chunk.id) && selectedFiles.has(chunk.source_file);
  const direct = vector.find(lane => lane.query === query)?.rows.slice(0, 6) ?? [];

  // An HTTP syntax example can repeat a header without declaring its required status.
  const terms = new Set(query.toLowerCase().match(/\b[a-z0-9]+(?:-[a-z0-9]+)*\b/g) ?? []);
  const directPick = rankOnly ? direct.find(missingSibling) : direct
    .filter(missingSibling)
    .map(chunk => {
      const operation = chunk.source_file.split('/').at(-1)?.replace(/\.mdx?$/, '').replaceAll('-', '');
      if (!operation || !terms.has(operation)) return { chunk, gain: 0 };
      const declared = new Set(final.filter(selected => selected.source_file === chunk.source_file)
        .flatMap(selected => [...declaredHeaders(selected.content)]));
      const gain = [...declaredHeaders(chunk.content)]
        .filter(header => terms.has(header) && !declared.has(header)).length;
      return { chunk, gain };
    })
    .filter(item => item.gain > 0)
    .sort((left, right) => right.gain - left.gain)[0]?.chunk;

  // Facets, when available, get the same one-slot cap as direct selection.
  const facetPick = facetReports.flatMap(facet =>
    facet.trace.vector.find(lane => lane.query === facet.query)?.rows.slice(0, 2) ?? [])
    .find(missingSibling);
  const pick = directPick ?? facetPick;
  if (!pick) return final;
  // A sibling may contain a different requested declaration, including the
  // continuation of a split table. Keep the operation's existing passages.
  const evict = directPick && !rankOnly ?
    final.findLastIndex((chunk, index) => index > 0 && chunk.source_file !== pick.source_file) :
    final.length - 1;
  if (evict < 0) return final;
  return [
    ...final.filter((_, index) => index !== evict),
    { ...pick, directSimilarity: directPick ? pick.similarity : null, citationIndex: final.length },
  ].map((chunk, index) => chunk.citationIndex === index + 1 ? chunk : { ...chunk, citationIndex: index + 1 });
}
