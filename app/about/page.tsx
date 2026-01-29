import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Gamepad2, Users, Heart, MessageSquare } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KUSOGETとは？ | KUSOGET',
  description: 'KUSOGETは、AIで作られたクソゲーを気軽に投稿・共有できるプラットフォームです。面白いけど微妙なゲーム、変なゲーム、クソゲーを楽しみながら共有しましょう。',
}

export default function AboutPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">KUSOGETとは？</h1>
          <p className="text-lg text-muted-foreground">
            AIで作られたクソゲーを共有する投稿型ポータルサイト
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                クソゲーを共有しよう
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                KUSOGETは、AIで作られたクソゲーを気軽に投稿・共有できるプラットフォームです。
                面白いけど微妙なゲーム、変なゲーム、クソゲーを楽しみながら共有しましょう。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                コミュニティで楽しむ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                投稿されたゲームに対して、いいねやコメントで反応できます。
                他のユーザーと交流しながら、クソゲーの魅力を発見しましょう。
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-sm">いいね機能</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="text-sm">コメント機能</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>使い方</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <p className="font-medium text-foreground mb-1">アカウントを作成</p>
                    <p>メールアドレスとユーザー名で簡単登録</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <p className="font-medium text-foreground mb-1">ゲームを投稿</p>
                    <p>タイトル、ジャンル、サムネイル、ゲームURLを入力して投稿</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <p className="font-medium text-foreground mb-1">楽しむ</p>
                    <p>他のユーザーの投稿を見て、いいねやコメントで反応</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ルール・ガイドライン</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-destructive">•</span>
                  <span>誹謗中傷や不適切なコンテンツの投稿は禁止です</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">•</span>
                  <span>著作権を侵害するコンテンツの投稿は禁止です</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">•</span>
                  <span>他のユーザーを尊重し、楽しいコミュニティを維持しましょう</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-destructive">•</span>
                  <span>詳細は<Link href="/terms" className="text-primary hover:underline">利用規約</Link>をご確認ください</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/submit" className="flex-1">
            <Button className="w-full" size="lg">
              クソゲーを投稿する
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
