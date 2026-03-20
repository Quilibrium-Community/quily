/** @type {import('next').NextConfig} */
const nextConfig = {
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
