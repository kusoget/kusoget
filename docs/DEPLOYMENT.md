# Vercelデプロイガイド

KUSOGETアプリケーションをVercelにデプロイする手順です。

## 前提条件

- GitHubアカウント（新規作成済み）
- Vercelアカウント（GitHubアカウントでサインアップ可能）
- Supabaseプロジェクトの設定完了

## デプロイ手順

### 1. GitHubリポジトリの作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `kusoget`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

### 2. CursorとGitHubの連携設定

#### 方法1: Cursorの設定から変更

1. Cursorを開く
2. 「Settings」→「Accounts」または「Preferences」を開く
3. GitHubアカウントの設定を確認・変更
4. 新しいGitHubアカウントで認証

#### 方法2: Git認証情報を直接設定

ターミナルで以下のコマンドを実行：

```bash
# Gitのユーザー名とメールアドレスを設定
git config --global user.name "あなたのGitHubユーザー名"
git config --global user.email "あなたのGitHubメールアドレス"

# GitHub認証情報を確認
git config --global credential.helper
```

### 3. プロジェクトをGitリポジトリとして初期化

```bash
cd /Users/syumpei/appdesign/KUSOGET

# Gitリポジトリを初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: KUSOGET project setup"

# GitHubリポジトリをリモートとして追加（YOUR_USERNAMEとYOUR_REPO_NAMEを置き換え）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# ブランチ名をmainに設定
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

### 4. Vercelでデプロイ

#### 方法1: Vercelダッシュボードから（推奨）

1. [Vercel](https://vercel.com) にアクセス
2. 「Sign Up」または「Log In」をクリック
3. 「Continue with GitHub」を選択してGitHubアカウントでログイン
4. 「Add New Project」をクリック
5. GitHubリポジトリを選択（`kusoget`など）
6. 「Import」をクリック

#### プロジェクト設定

- **Framework Preset:** Next.js（自動検出されるはず）
- **Root Directory:** `./`（デフォルト）
- **Build Command:** `npm run build`（自動設定）
- **Output Directory:** `.next`（自動設定）
- **Install Command:** `npm install`（自動設定）

#### 環境変数の設定

「Environment Variables」セクションで以下を追加：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**重要:** `.env.local`の値をそのままコピーしてください。

#### デプロイ実行

1. 「Deploy」をクリック
2. ビルドが完了するまで待機（通常2-5分）
3. デプロイ完了後、URLが表示されます（例: `https://kusoget.vercel.app`）

### 5. Supabaseの認証設定を更新

デプロイ後、Supabaseの認証設定でリダイレクトURLを追加する必要があります。

1. Supabaseダッシュボードにログイン
2. 「Authentication」→「URL Configuration」を開く
3. 「Redirect URLs」に以下を追加：
   - `https://your-app-name.vercel.app/auth/callback`
   - `https://your-app-name.vercel.app/**`（ワイルドカード）

4. 「Site URL」を更新：
   - `https://your-app-name.vercel.app`

5. 「Save」をクリック

### 6. 動作確認

デプロイ完了後、以下を確認：

- [ ] トップページが表示される
- [ ] サインアップができる
- [ ] ログインができる
- [ ] 投稿機能が動作する
- [ ] 画像アップロードが動作する

## トラブルシューティング

### ビルドエラーが発生する場合

1. Vercelのビルドログを確認
2. 環境変数が正しく設定されているか確認
3. `package.json`の依存関係が正しいか確認

### 認証が動作しない場合

1. SupabaseのリダイレクトURL設定を確認
2. 環境変数が正しく設定されているか確認
3. ブラウザのコンソールでエラーを確認

### 画像が表示されない場合

1. Supabase Storageのバケット設定を確認
2. `next.config.js`の`remotePatterns`設定を確認

## 今後の更新方法

コードを更新したら：

```bash
git add .
git commit -m "更新内容の説明"
git push origin main
```

Vercelが自動的に新しいデプロイを開始します。

## カスタムドメインの設定（オプション）

1. Vercelダッシュボードでプロジェクトを開く
2. 「Settings」→「Domains」を開く
3. ドメイン名を入力
4. DNS設定に従ってドメインを設定

## 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth)
