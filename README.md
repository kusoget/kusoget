# KUSOGET

AIで作られたクソゲーを共有する投稿型ポータルサイト

## 技術スタック

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Backend/DB:** Supabase (Auth, Postgres, Storage)
- **Deployment:** Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルに以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

これらの値は、Supabaseダッシュボードの「Settings」→「API」から取得できます。

### 3. Supabaseデータベースのセットアップ

`supabase/migrations/001_initial_schema.sql` ファイルの内容をSupabaseのSQL Editorで実行してください。

または、Supabase CLIを使用している場合：

```bash
supabase db push
```

### 4. Supabaseメールテンプレートの設定

認証メール（確認メール、パスワードリセットなど）を日本語でユーザーフレンドリーにするため、Supabaseダッシュボードでメールテンプレートを設定してください。

詳細な設定方法は [`docs/SUPABASE_EMAIL_SETUP.md`](./docs/SUPABASE_EMAIL_SETUP.md) を参照してください。

**重要:** メールテンプレートを設定しないと、デフォルトの英語メールが送信されます。

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## デプロイ

Vercelへのデプロイ手順は [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) を参照してください。

## 実装済み機能

### Phase 1: 基本構築 & リーガル対応 ✅

- ✅ **固定ページ（法的ページ）**
  - `/terms` - 利用規約ページ
  - `/privacy` - プライバシーポリシーページ
  - フッターにリンク設置

- ✅ **認証機能**
  - Email/Password方式でのサインアップ・ログイン
  - ログイン後、ヘッダーの表示切り替え
  - PKCEフロー対応の認証コールバック
  - ログアウト機能
  - エラーメッセージの日本語化

- ✅ **投稿機能**
  - ログインユーザーのみアクセス可能（`/submit`）
  - 入力項目: タイトル, URL, サムネイル(file), 解説, ジャンル, タイプ, プラットフォーム
  - バリデーション実装（React Hook Form + Zod）
  - 「利用規約に同意する」チェックボックス必須

- ✅ **一覧表示（Feed）**
  - トップページでゲームをグリッド表示
  - カードクリック時にRPC `increment_view_count` を呼んで遷移
  - レスポンシブデザイン（モバイルファースト）

- ✅ **管理機能**
  - 各ゲームカードに削除ボタンを設置
  - 削除ボタンは「そのゲームの作者」または「管理者（`is_admin`がtrueのユーザー）」にのみ表示
  - 削除実行時は確認ダイアログを表示

## プロジェクト構造

```
KUSOGET/
├── app/                    # Next.js App Router
│   ├── auth/              # 認証関連
│   │   ├── callback/      # OAuthコールバック
│   │   ├── signin/        # ログインページ
│   │   ├── signup/        # サインアップページ
│   │   └── signout/       # ログアウトAPI
│   ├── submit/            # 投稿ページ
│   ├── terms/             # 利用規約ページ
│   ├── privacy/           # プライバシーポリシーページ
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── ui/                # shadcn/uiコンポーネント
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── label.tsx
│   │   ├── checkbox.tsx
│   │   └── select.tsx
│   ├── Header.tsx         # ヘッダーコンポーネント
│   ├── Footer.tsx         # フッターコンポーネント
│   ├── GameCard.tsx       # ゲームカードコンポーネント
│   ├── DeleteButton.tsx   # 削除ボタンコンポーネント
│   └── UserMenu.tsx       # ユーザーメニューコンポーネント
├── lib/                  # ユーティリティ
│   ├── supabase/         # Supabaseクライアント
│   │   ├── client.ts     # ブラウザ用クライアント
│   │   └── server.ts     # サーバー用クライアント
│   ├── error-messages.ts # エラーメッセージ翻訳
│   └── utils.ts          # 共通ユーティリティ
├── supabase/
│   └── migrations/       # データベースマイグレーション
│       └── 001_initial_schema.sql
├── docs/                 # ドキュメント
│   ├── DEPLOYMENT.md     # デプロイガイド
│   ├── SUPABASE_EMAIL_SETUP.md
│   └── DISABLE_EMAIL_CONFIRMATION.md
├── middleware.ts         # Next.jsミドルウェア（認証セッション管理）
└── package.json
```

## データベーススキーマ

### profiles テーブル
- `id`: UUID (PK, auth.users参照)
- `username`: TEXT
- `avatar_url`: TEXT
- `is_admin`: BOOLEAN (デフォルト: false)
- `updated_at`: TIMESTAMP

### games テーブル
- `id`: UUID (PK)
- `title`: TEXT (必須)
- `description`: TEXT (必須)
- `game_url`: TEXT (必須)
- `thumbnail_url`: TEXT (必須)
- `author_id`: UUID (FK -> profiles.id)
- `type`: TEXT (Enum: 'playable', 'log')
- `genre`: TEXT (Enum: 'action', 'rpg', 'puzzle', 'simulation', 'joke', 'other')
- `platform`: TEXT[] (Array: 'pc', 'mobile')
- `view_count`: INTEGER (デフォルト: 0)
- `created_at`: TIMESTAMP

## セキュリティ

- Row Level Security (RLS) が全テーブルで有効化されています
- 管理者フラグ (`is_admin`) により、管理者は任意のコンテンツを削除できます
- Storageバケット (`thumbnails`) のアクセス制御が設定されています

## ライセンス

このプロジェクトはプライベートプロジェクトです。
