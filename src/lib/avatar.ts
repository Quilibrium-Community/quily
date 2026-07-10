/**
 * User avatar generation via DiceBear (https://www.dicebear.com).
 *
 * Free, no API key, deterministic: the same seed always produces the same
 * avatar. We seed from the user's display name so the avatar stays stable
 * across sessions and updates when they rename themselves.
 */

const DICEBEAR_STYLE = 'shapes';
const DICEBEAR_VERSION = '9.x';

/**
 * Build the DiceBear SVG URL for a given seed (typically the user's name).
 */
export function getAvatarUrl(seed: string): string {
  const safeSeed = encodeURIComponent(seed || 'You');
  return `https://api.dicebear.com/${DICEBEAR_VERSION}/${DICEBEAR_STYLE}/svg?seed=${safeSeed}`;
}
