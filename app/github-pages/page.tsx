import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Github, Code, Settings, Rocket, CheckCircle2, FileCode, Workflow } from 'lucide-react'

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">GitHub Pagesでゲームを公開する方法</h1>
          <p className="text-lg text-muted-foreground">
            Geminiで生成したゲームを、誰でも無料で公開できる手順を優しく解説します
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
              GitHub Pagesは、GitHubが提供する無料のホスティングサービスです。
              静的サイト（HTML、CSS、JavaScriptで作られたサイト）を無料で公開できます。
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
                  <p className="text-sm">まだアカウントがない場合は、<a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHubの公式サイト</a>から無料で作成できます。</p>
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
              Geminiで生成したゲームのコードを、作成したリポジトリにアップロードします。
            </p>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground mb-2">方法A: GitHubのWebサイトからアップロード</p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-4">
                  <li>リポジトリのページで「uploading an existing file」をクリック</li>
                  <li>ゲームのファイルをドラッグ&ドロップまたは選択</li>
                  <li>「Commit changes」をクリック</li>
                </ol>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium text-foreground mb-2">方法B: Gitコマンドを使う（上級者向け）</p>
                <div className="mt-2 p-3 bg-secondary rounded text-xs font-mono space-y-1">
                  <div className="text-foreground"># ターミナルで実行</div>
                  <div>git clone https://github.com/あなたのユーザー名/リポジトリ名.git</div>
                  <div>cd リポジトリ名</div>
                  <div># ゲームファイルをコピー</div>
                  <div>git add .</div>
                  <div>git commit -m "初回コミット"</div>
                  <div>git push</div>
                </div>
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
                  <p className="text-sm">リポジトリのページで「Settings」タブをクリックします。</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Pagesの設定を開く</p>
                  <p className="text-sm">左側のメニューから「Pages」をクリックします。</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">公開元を選択</p>
                  <p className="text-sm mb-2">「Source」のドロップダウンから「Deploy from a branch」を選択します。</p>
                  <div className="mt-2 p-3 bg-secondary rounded text-xs">
                    Branch: main（またはmaster）<br />
                    Folder: /（ルート）<br />
                    「Save」をクリック
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
              <p className="text-xs font-mono text-primary break-all">
                https://あなたのユーザー名.github.io/リポジトリ名/
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ⏱️ 初回の公開には5〜10分かかる場合があります。しばらく待ってからアクセスしてみてください。
            </p>
          </CardContent>
        </Card>

        {/* Next.jsプロジェクトの場合 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Next.jsプロジェクトの場合（上級者向け）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Next.jsで作られたプロジェクトをGitHub Pagesで公開する場合は、静的エクスポートの設定が必要です。
            </p>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground mb-2">1. next.config.jsを設定</p>
                <div className="mt-2 p-3 bg-secondary rounded text-xs font-mono">
                  <div className="text-foreground">// next.config.js</div>
                  <div>module.exports = {'{'}</div>
                  <div className="ml-4">output: 'export',</div>
                  <div className="ml-4">images: {'{'}</div>
                  <div className="ml-8">unoptimized: true</div>
                  <div className="ml-4">{'}'}</div>
                  <div>{'}'}</div>
                </div>
              </div>

              <div>
                <p className="font-medium text-foreground mb-2">2. package.jsonにスクリプトを追加</p>
                <div className="mt-2 p-3 bg-secondary rounded text-xs font-mono">
                  <div className="text-foreground">// package.json</div>
                  <div>{'"scripts": {'}</div>
                  <div className="ml-4">"export": "next build"</div>
                  <div>{'}'}</div>
                </div>
              </div>

              <div>
                <p className="font-medium text-foreground mb-2">3. ビルドしてアップロード</p>
                <div className="mt-2 p-3 bg-secondary rounded text-xs font-mono space-y-1">
                  <div>npm run export</div>
                  <div># outフォルダが作成される</div>
                  <div># outフォルダの中身をGitHubにアップロード</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Actionsを使った自動デプロイ */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              GitHub Actionsで自動デプロイ（便利な方法）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              GitHub Actionsを使うと、コードをプッシュするだけで自動的にサイトが更新されます。
            </p>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium text-foreground mb-2">1. .github/workflows/deploy.ymlを作成</p>
                <div className="mt-2 p-3 bg-secondary rounded text-xs font-mono overflow-x-auto">
                  <div className="text-foreground">name: Deploy to GitHub Pages</div>
                  <div className="mt-1">on:</div>
                  <div className="ml-4">push:</div>
                  <div className="ml-8">branches: [ main ]</div>
                  <div className="mt-1">jobs:</div>
                  <div className="ml-4">build-and-deploy:</div>
                  <div className="ml-8">runs-on: ubuntu-latest</div>
                  <div className="ml-8">steps:</div>
                  <div className="ml-12">- uses: actions/checkout@v3</div>
                  <div className="ml-12">- uses: actions/setup-node@v3</div>
                  <div className="ml-16">with:</div>
                  <div className="ml-20">node-version: '18'</div>
                  <div className="ml-12">- run: npm install</div>
                  <div className="ml-12">- run: npm run export</div>
                  <div className="ml-12">- uses: peaceiris/actions-gh-pages@v3</div>
                  <div className="ml-16">with:</div>
                  <div className="ml-20">github_token: {'$'}{'{'}{'{'} secrets.GITHUB_TOKEN {'}'}{'}'}</div>
                  <div className="ml-20">publish_dir: ./out</div>
                </div>
              </div>

              <div>
                <p className="font-medium text-foreground mb-2">2. 設定を保存してプッシュ</p>
                <p className="text-sm text-muted-foreground">
                  このファイルをリポジトリに追加してプッシュすると、自動的にデプロイが開始されます。
                </p>
              </div>
            </div>
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
                <span className="text-primary">1.</span>
                <span>GitHubアカウントを作成してリポジトリを作る</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">2.</span>
                <span>ゲームのコードをアップロードする</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">3.</span>
                <span>Settings → Pages で公開設定をする</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">4.</span>
                <span>数分待って公開URLにアクセスする</span>
              </li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              これで、Geminiで生成したゲームを世界中の人に見てもらえるようになります！🎮
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
