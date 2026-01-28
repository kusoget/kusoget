# カスタムドメイン設定ガイド

`kusoget.com`をVercelに設定する手順です。

## ステップ1: Vercelでカスタムドメインを追加

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. `kusoget`プロジェクトを選択
3. 「**Settings**」タブをクリック
4. 左メニューから「**Domains**」を選択
5. 「**Add Domain**」または「**Add**」ボタンをクリック
6. ドメイン名を入力: `kusoget.com`
7. 「**Add**」をクリック

## ステップ2: DNS設定

VercelがDNS設定の指示を表示します。ドメインのDNSプロバイダー（例: Namecheap, GoDaddy, Cloudflare等）で以下の設定を行います。

### 方法A: Aレコードを使用（推奨）

Vercelが表示するAレコードを追加：

- **Type:** A
- **Name:** `@` または空白（ルートドメインの場合）
- **Value:** Vercelが提供するIPアドレス（例: `76.76.21.21`）
- **TTL:** 3600（デフォルト）

### 方法B: CNAMEレコードを使用

- **Type:** CNAME
- **Name:** `@` または空白（ルートドメインの場合）
- **Value:** `cname.vercel-dns.com.`（Vercelが提供するCNAME）
- **TTL:** 3600（デフォルト）

**注意:** 一部のDNSプロバイダーでは、ルートドメイン（`@`）にCNAMEレコードを設定できない場合があります。その場合はAレコードを使用してください。

### wwwサブドメインも設定する場合

`www.kusoget.com`も設定する場合：

- **Type:** CNAME
- **Name:** `www`
- **Value:** `cname.vercel-dns.com.`
- **TTL:** 3600

## ステップ3: DNS設定の反映を待つ

1. DNS設定を保存後、反映まで数分〜24時間かかる場合があります（通常は数分〜1時間）
2. Vercelダッシュボードで「**Domains**」ページを確認
3. ドメインの横に「**Valid Configuration**」と表示されれば設定完了
4. SSL証明書が自動的に発行されます（数分〜数時間）

## ステップ4: Supabaseの設定を更新

カスタムドメインが有効になったら、SupabaseのリダイレクトURL設定を更新します。

1. [Supabase Dashboard](https://app.supabase.com) にログイン
2. プロジェクトを選択
3. 「**Authentication**」→「**URL Configuration**」を開く
4. 「**Redirect URLs**」に以下を追加：
   ```
   https://kusoget.com/auth/callback
   https://www.kusoget.com/auth/callback
   ```
   （wwwサブドメインも設定した場合）
5. 「**Site URL**」を更新：
   ```
   https://kusoget.com
   ```
6. 「**Save**」をクリック

## ステップ5: 動作確認

1. `https://kusoget.com` にアクセス
2. サイトが表示されることを確認
3. サインアップ・ログインが動作することを確認
4. SSL証明書が有効であることを確認（ブラウザのアドレスバーに鍵アイコンが表示される）

## トラブルシューティング

### DNS設定が反映されない

- DNS設定の保存を確認
- DNSプロバイダーの設定画面で正しく設定されているか確認
- `nslookup kusoget.com` または `dig kusoget.com` コマンドでDNS設定を確認
- DNSプロパゲーションには時間がかかる場合があります（最大48時間）

### SSL証明書が発行されない

- DNS設定が正しく反映されているか確認
- Vercelダッシュボードで「**Domains**」ページを確認
- 数時間待ってから再度確認

### リダイレクトが動作しない

- SupabaseのリダイレクトURL設定を確認
- ブラウザのコンソールでエラーを確認
- Vercelの環境変数が正しく設定されているか確認

## 参考リンク

- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [DNS設定ガイド](https://vercel.com/docs/concepts/projects/domains/add-a-domain)
