/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'kusoget.vercel.app',
          },
        ],
        destination: 'https://kusoget.com/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
