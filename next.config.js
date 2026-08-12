// package.json is the single source of truth for the app version. Injecting it
// here means the UI cannot drift from the released version: there is nothing to
// remember to bump. Previously the version was a literal in src/lib/version.ts,
// which the v1.5.0 release did not touch, so the About page advertised v1.4.0
// for a full release cycle.
//
// `env` inlines the value at build time for both server and client components,
// so this works regardless of where VERSION ends up being imported.
const { version } = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  async redirects() {
    return [
      {
        source: '/2',
        destination: '/',
        permanent: false,
      },
      {
        source: '/links',
        destination: 'https://quilibrium.one/links',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
