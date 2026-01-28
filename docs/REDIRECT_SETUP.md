# Vercelドメインリダイレクト設定ガイド

`kusoget.vercel.app`から`kusoget.com`へのリダイレクト設定方法です。

## 設定手順

### 方法1: Vercelダッシュボードから設定（推奨）

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. `kusoget`プロジェクトを選択
3. 「**Settings**」タブ → 「**Domains**」を選択
4. `kusoget.vercel.app`の行で「**Edit**」をクリック
5. 「**Redirect to Another Domain**」を選択
6. 「**307 Temporary Redirect**」を選択（または「**308 Permanent Redirect**」）
7. リダイレクト先に `kusoget.com` を入力
8. 「**Save**」をクリック

### 方法2: next.config.jsで設定

`next.config.js`にリダイレクト設定を追加する方法です。

```javascript
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
```

この方法の場合、コードをコミット・プッシュする必要があります。

## 推奨設定

- **リダイレクトタイプ**: `308 Permanent Redirect`（SEO的に推奨）
- **リダイレクト先**: `kusoget.com`（wwwなし）

## 注意事項

- リダイレクト設定後、反映まで数分かかる場合があります
- ブラウザのキャッシュをクリアして確認してください
- `www.kusoget.com`にもアクセスできるようにする場合は、同様の設定を追加してください
