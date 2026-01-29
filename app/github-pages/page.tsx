import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Github, Code, Settings, Rocket, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ゲームを無料で公開する方法 | KUSOGET',
  description: 'GitHub Pagesを使って作ったゲームを無料で公開する方法を優しく解説します。誰でも無料で簡単にゲームを公開できます。',
}

export default function GitHubPagesGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            ホームに戻る
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">作ったゲームを無料で公開する方法</h1>
          <p className="text-lg text-muted-foreground">
            誰でも無料で簡単にゲームを公開できる手順を優しく解説します
          </p>
        </div>

        {/* はじめに */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              GitHub Pagesとは？
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              GitHub Pagesは、GitHubが提供する無料のサービスです。
              作ったゲームを無料で公開できます。
            </p>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">✓ 無料で使える</p>
              <p className="text-sm font-medium mb-2">✓ 簡単に公開できる</p>
              <p className="text-sm font-medium">✓ 自動で更新される</p>
            </div>
          </CardContent>
        </Card>

        {/* ステップ1 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
              <Github className="h-5 w-5" />
              GitHubアカウントを作成・準備する
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">GitHubアカウントを作成</p>
                  <p className="text-sm">まだアカウントがない場合は、<a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-purple-300 hover:underline">GitHubの公式サイト</a>から無料で作成できます。</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">新しいリポジトリを作成</p>
                  <p className="text-sm">GitHubにログイン後、右上の「+」ボタンから「New repository」を選択します。</p>
                  <div className="mt-2 p-3 bg-secondary rounded text-xs font-mono">
                    リポジトリ名: 好きな名前（例: my-game）<br />
                    Public: チェックを入れる<br />
                    README: チェックを入れても入れなくてもOK
                  </div>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* ステップ2 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
              <Code className="h-5 w-5" />
              ゲームのコードをGitHubにアップロードする
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              作ったゲームのファイルを、作成したリポジトリにアップロードします。
            </p>
            
            <div>
              <p className="font-medium text-foreground mb-3">手順：</p>
              <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground ml-2">
                <li>
                  <span className="font-medium text-foreground">リポジトリのページを開く</span><br />
                  作成したリポジトリのページで「uploading an existing file」というリンクをクリックします
                </li>
                <li>
                  <span className="font-medium text-foreground">ファイルをアップロード</span><br />
                  ゲームのファイル（HTML、CSS、JavaScriptなど）をドラッグ&ドロップするか、クリックして選択します
                </li>
                <li>
                  <span className="font-medium text-foreground">保存する</span><br />
                  ページの下にある「Commit changes」ボタンをクリックして保存します
                </li>
              </ol>
              <div className="mt-4 p-3 bg-secondary rounded text-sm">
                <p className="font-medium text-foreground mb-1">💡 ヒント</p>
                <p className="text-xs text-muted-foreground">
                  ゲームのメインファイル（index.htmlなど）が、リポジトリの一番上のフォルダにあるようにしてください。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ステップ3 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
              <Settings className="h-5 w-5" />
              GitHub Pagesの設定をする
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">リポジトリの設定ページを開く</p>
                  <p className="text-sm">リポジトリのページの上の方にある「Settings」というタブをクリックします。</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Pagesの設定を開く</p>
                  <p className="text-sm">Settingsページの左側にあるメニューから「Pages」をクリックします。</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">公開設定をする</p>
                  <p className="text-sm mb-2">「Source」というところのドロップダウン（選択メニュー）から「Deploy from a branch」を選びます。</p>
                  <div className="mt-2 p-3 bg-secondary rounded text-xs">
                    Branch: main を選ぶ<br />
                    Folder: /（ルート）を選ぶ<br />
                    最後に「Save」ボタンをクリック
                  </div>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* ステップ4 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
              <Rocket className="h-5 w-5" />
              公開URLを確認する
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              設定が完了すると、数分でサイトが公開されます。
            </p>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">公開URLの形式:</p>
              <p className="text-xs font-mono text-primary dark:text-purple-300 break-all">
                https://あなたのユーザー名.github.io/リポジトリ名/
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ⏱️ 初回の公開には5〜10分かかる場合があります。しばらく待ってからアクセスしてみてください。
            </p>
          </CardContent>
        </Card>


        {/* よくある質問 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>よくある質問</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground mb-2">Q: 公開にどれくらい時間がかかりますか？</p>
                <p className="text-sm text-muted-foreground">
                  A: 初回の公開は5〜10分程度かかります。2回目以降は数分で反映されます。
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Q: 無料で使えますか？</p>
                <p className="text-sm text-muted-foreground">
                  A: はい、完全に無料です。GitHubアカウントがあれば誰でも使えます。
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Q: カスタムドメインは使えますか？</p>
                <p className="text-sm text-muted-foreground">
                  A: はい、GitHub Pagesの設定からカスタムドメインを設定できます。
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-2">Q: 更新はどうすればいいですか？</p>
                <p className="text-sm text-muted-foreground">
                  A: リポジトリにファイルをアップロード（プッシュ）するだけで、自動的にサイトが更新されます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* まとめ */}
        <Card className="mb-6 bg-primary/5">
          <CardHeader>
            <CardTitle>まとめ</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary dark:text-purple-300">1.</span>
                <span>GitHubアカウントを作成してリポジトリを作る</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary dark:text-purple-300">2.</span>
                <span>ゲームのコードをアップロードする</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary dark:text-purple-300">3.</span>
                <span>Settings → Pages で公開設定をする</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary dark:text-purple-300">4.</span>
                <span>数分待って公開URLにアクセスする</span>
              </li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              これで、作ったゲームを世界中の人に見てもらえるようになります！🎮
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/submit" className="flex-1">
            <Button className="w-full" size="lg">
              ゲームを投稿する
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              ゲーム一覧を見る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
