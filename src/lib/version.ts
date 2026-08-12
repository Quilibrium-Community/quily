/**
 * Application version.
 *
 * Follows semantic versioning (semver): MAJOR.MINOR.PATCH
 * - MAJOR: Breaking changes
 * - MINOR: New features (backwards compatible)
 * - PATCH: Bug fixes (backwards compatible)
 *
 * The version is NOT stored here. `package.json` is the single source of truth,
 * and next.config.js inlines it as NEXT_PUBLIC_APP_VERSION at build time. Bump
 * it with `yarn version:bump <major|minor|patch>`, or let `yarn release run` do it.
 *
 * This file used to hold a literal, which meant two places had to be kept in step
 * and nothing enforced it. They fell out of step at v1.5.0 and the About page
 * showed v1.4.0 until v1.6.0 caught it.
 */

// Falls back only outside a Next build (unit tests, scripts importing this
// module directly). A real build always inlines the value, so a '0.0.0-dev'
// showing up in the UI means the injection broke and should be visible, not
// papered over with a plausible-looking number.
export const VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0-dev';

export const VERSION_INFO = {
  version: VERSION,
  name: 'Quily Chat',
  buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().split('T')[0],
};
