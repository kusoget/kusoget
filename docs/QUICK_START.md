# クイックスタートガイド - Vercelデプロイ

## ステップ1: GitHubリポジトリを作成

1. [GitHub](https://github.com) に新しいアカウントでログイン
2. 右上の「+」ボタン → 「New repository」をクリック
3. リポジトリ名を入力（例: `kusoget`）
4. 「Public」または「Private」を選択
5. 「Add a README file」はチェックを**外す**（既にREADMEがあるため）
6. 「Create repository」をクリック
7. 作成されたリポジトリのページで、HTTPSのURLをコピー（例: `https://github.com/your-username/kusoget.git`）

## ステップ2: プロジェクトをGitリポジトリとして初期化

ターミナルで以下のコマンドを実行：

```bash
# プロジェクトディレクトリに移動
cd /Users/syumpei/appdesign/KUSOGET

# Gitリポジトリを初期化
git init

# Gitのユーザー情報を設定（新しいGitHubアカウントの情報に変更）
git config user.name "あなたのGitHubユーザー名"
git config user.email "あなたのGitHubメールアドレス"

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: KUSOGET project"

# ブランチ名をmainに設定
git branch -M main

# GitHubリポジトリをリモートとして追加（YOUR_USERNAMEとYOUR_REPO_NAMEを実際の値に置き換え）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# GitHubにプッシュ
git push -u origin main
```

**注意:** `git push`の際にGitHubの認証が求められます。新しいアカウントの認証情報を入力してください。

## ステップ3: Vercelでデプロイ

1. [Vercel](https://vercel.com) にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択して、新しいGitHubアカウントでログイン
4. 「Add New Project」をクリック
5. 作成したリポジトリ（`kusoget`など）を選択
6. 「Import」をクリック

### 環境変数の設定

「Environment Variables」セクションで以下を追加：

- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
  **Value:** `.env.local`にあるSupabase URL（例: `https://dtkufuktjdhmnfvztbeu.supabase.co`）

- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  **Value:** `.env.local`にあるSupabase Anon Key

### デプロイ実行

1. 「Deploy」をクリック
2. ビルドが完了するまで待機（2-5分程度）
3. デプロイ完了後、表示されたURL（例: `https://kusoget.vercel.app`）をコピー

## ステップ4: Supabaseの設定を更新

1. [Supabase Dashboard](https://app.supabase.com) にログイン
2. プロジェクトを選択
3. 「Authentication」→「URL Configuration」を開く
4. 「Redirect URLs」に以下を追加：
   ```
   https://your-app-name.vercel.app/auth/callback
   ```
   （`your-app-name`を実際のVercelのURLに置き換え）
5. 「Site URL」を更新：
   ```
   https://your-app-name.vercel.app
   ```
6. 「Save」をクリック

## 完了！

これでデプロイ完了です。VercelのURLにアクセスして動作確認してください。
