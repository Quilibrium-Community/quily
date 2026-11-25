/**
 * Extract cited source indices from response text.
 * Matches patterns like [1], [2], etc.
 */
export function getCitedIndices(text: string): Set<number> {
  const indices = new Set<number>();
  for (const match of text.matchAll(/\[(\d+)\]/g)) {
    indices.add(Number(match[1]));
  }
  return indices;
}

/**
 * Check if response text contains any inline citations.
 */
export function hasCitations(text: string): boolean {
  return /\[\d+\]/.test(text);
}
/** Read the citation number from a streamed or persisted source ID. */
export function getSourceCitationIndex(sourceId: string): number {
  return Number(sourceId.match(/^source-(\d+)-\d+$/)?.[1] ?? NaN);
}

