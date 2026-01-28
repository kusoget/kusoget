# Vercelへのデプロイ手順

KUSOGETアプリケーションをVercelにデプロイする手順です。

## 前提条件

- GitHubアカウント（推奨）またはGitリポジトリ
- Vercelアカウント（[vercel.com](https://vercel.com)で無料登録可能）
- Supabaseプロジェクトが設定済み

## デプロイ方法

### 方法1: GitHub経由でデプロイ（推奨）

#### 1. GitHubリポジトリの作成

```bash
# Gitリポジトリを初期化（まだの場合）
git init
git add .
git commit -m "Initial commit"

# GitHubにリポジトリを作成してプッシュ
git remote add origin https://github.com/your-username/kusoget.git
git branch -M main
git push -u origin main
```

#### 2. Vercelにプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. 「Add New...」→「Project」をクリック
3. 「Import Git Repository」からGitHubリポジトリを選択
4. 「Import」をクリック

#### 3. プロジェクト設定

- **Framework Preset**: Next.js（自動検出）
- **Root Directory**: `./`（デフォルト）
- **Build Command**: `npm run build`（自動検出）
- **Output Directory**: `.next`（自動検出）
- **Install Command**: `npm install`（自動検出）

#### 4. 環境変数の設定

「Environment Variables」セクションで以下を追加：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトのURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | SupabaseプロジェクトのAnon Key |

**重要**: 
- 環境変数は「Production」「Preview」「Development」の3つの環境で設定できます
- 本番環境用には「Production」に設定してください

#### 5. デプロイ実行

「Deploy」ボタンをクリックしてデプロイを開始します。

### 方法2: Vercel CLIでデプロイ

#### 1. Vercel CLIのインストール

```bash
npm i -g vercel
```

#### 2. ログイン

```bash
vercel login
```

#### 3. プロジェクトのデプロイ

```bash
# プロジェクトルートで実行
vercel
```

初回デプロイ時は対話形式で設定を聞かれます：
- Set up and deploy? → **Y**
- Which scope? → アカウントを選択
- Link to existing project? → **N**（新規プロジェクトの場合）
- What's your project's name? → `kusoget` など
- In which directory is your code located? → `./`

#### 4. 環境変数の設定

```bash
# 環境変数を設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

各環境変数の値を入力します。

#### 5. 本番環境にデプロイ

```bash
vercel --prod
```

## デプロイ後の確認事項

### 1. 動作確認

1. デプロイが完了したら、Vercelから提供されるURLにアクセス
2. トップページが表示されることを確認
3. サインアップ・ログインが動作することを確認
4. 投稿機能が動作することを確認

### 2. Supabaseの認証設定

VercelにデプロイしたURLをSupabaseの認証設定に追加する必要があります：

1. Supabaseダッシュボードにログイン
2. 「Authentication」→「URL Configuration」を開く
3. 「Site URL」にVercelのURLを設定（例: `https://kusoget.vercel.app`）
4. 「Redirect URLs」に以下を追加：
   - `https://kusoget.vercel.app/auth/callback`
   - `https://kusoget.vercel.app/**`

### 3. カスタムドメインの設定（オプション）

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」を開く
3. カスタムドメインを追加
4. DNS設定を完了

## 自動デプロイの設定

GitHub経由でデプロイした場合、デフォルトで自動デプロイが有効になっています：

- **mainブランチへのpush** → 本番環境に自動デプロイ
- **その他のブランチへのpush** → プレビュー環境に自動デプロイ

## トラブルシューティング

### ビルドエラーが発生する場合

1. ローカルでビルドが成功するか確認：
   ```bash
   npm run build
   ```
2. エラーログを確認して修正
3. 環境変数が正しく設定されているか確認

### 認証が動作しない場合

1. Supabaseの「URL Configuration」でVercelのURLが設定されているか確認
2. 環境変数が正しく設定されているか確認
3. ブラウザのコンソールでエラーを確認

### 画像が表示されない場合

1. Supabase Storageのバケットが公開設定になっているか確認
2. `next.config.js`の`remotePatterns`設定を確認

## 環境変数の管理

### 本番環境と開発環境で異なるSupabaseプロジェクトを使う場合

Vercelの環境変数設定で、環境ごとに異なる値を設定できます：

- **Production**: 本番用Supabaseプロジェクトの値
- **Preview**: ステージング用Supabaseプロジェクトの値
- **Development**: 開発用Supabaseプロジェクトの値

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Supabase Documentation](https://supabase.com/docs)
