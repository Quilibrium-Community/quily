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
