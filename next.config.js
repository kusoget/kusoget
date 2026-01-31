const BOMB_BOX_GAME_URL = process.env.BOMB_BOX_GAME_URL || 'https://<発行されたURL>';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Bomb Box Game へのプロキシ
      {
        source: '/bomb-box-game',
        // 末尾の / は無し
        destination: `${BOMB_BOX_GAME_URL}/bomb-box-game`,
      },
      {
        source: '/bomb-box-game/:path*',
        // 末尾の / は無し
        destination: `${BOMB_BOX_GAME_URL}/bomb-box-game/:path*`,
      },
    ]
  },
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
