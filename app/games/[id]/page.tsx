import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LikeButton from '@/components/LikeButton'
import DeleteButton from '@/components/DeleteButton'
import EditButton from '@/components/EditButton'
import PlayButton from '@/components/PlayButton'
import CommentSection from '@/components/CommentSection'
import { getGenreLabel } from '@/lib/genre-labels'
import type { Metadata } from 'next'

interface GameDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data: game } = await supabase
    .from('games')
    .select('title, description, thumbnail_url')
    .eq('id', params.id)
    .single()

  if (!game) {
    return {
      title: 'ゲームが見つかりません | KUSOGET',
    }
  }

  const metadata: Metadata = {
    title: `${game.title} | KUSOGET`,
    description: game.description || `${game.title} - AIで作られたクソゲーを楽しもう`,
    openGraph: {
      title: `${game.title} | KUSOGET`,
      description: game.description || `${game.title} - AIで作られたクソゲーを楽しもう`,
      type: 'website',
    },
  }

  if (game.thumbnail_url) {
    metadata.openGraph!.images = [
      {
        url: game.thumbnail_url,
        width: 1200,
        height: 630,
        alt: game.title,
      },
    ]
  }

  return metadata
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ゲーム情報を取得
  const { data: game, error } = await supabase
    .from('games')
    .select(`
      *,
      profiles:author_id (
        id,
        username
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !game) {
    notFound()
  }

  // ユーザープロフィールを取得
  let userProfile = null
  let canDelete = false
  let canEdit = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, is_admin')
      .eq('id', user.id)
      .single()
    userProfile = profile
    canDelete = Boolean(profile && (
      profile.id === game.author_id ||
      profile.is_admin === true
    ))
    canEdit = Boolean(profile && profile.id === game.author_id)
  }

  // いいね情報を取得
  let likeCount = 0
  let isLiked = false

  try {
    const { data: likes } = await supabase
      .from('game_likes')
      .select('user_id')
      .eq('game_id', params.id)

    if (likes) {
      likeCount = likes.length
      if (user) {
        isLiked = likes.some(like => like.user_id === user.id)
      }
    }
  } catch (err) {
    // game_likesテーブルが存在しない場合は無視
    console.log('game_likes table may not exist yet:', err)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            ← 一覧に戻る
          </Link>
        </div>

        <Card className="mb-6">
          <div className="relative w-full h-64 md:h-96 bg-muted">
            {game.thumbnail_url && (
              <Image
                src={game.thumbnail_url}
                alt={game.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            )}
            {(canDelete || canEdit) && (
              <div className="absolute top-4 right-4 flex gap-2">
                {canEdit && <EditButton gameId={game.id} />}
                {canDelete && <DeleteButton gameId={game.id} />}
              </div>
            )}
          </div>
          <CardHeader>
            <CardTitle className="text-3xl mb-2">{game.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                投稿者: {game.profiles?.username || '匿名ユーザー'}
              </span>
              <span>{game.view_count} プレイ</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {(game.genres || (game.genre ? [game.genre] : [])).map((g: string) => (
                <span key={g} className="text-sm px-3 py-1 bg-secondary rounded-md">
                  {getGenreLabel(g)}
                </span>
              ))}
            </div>
            <div className="flex gap-4 mb-6">
              <LikeButton
                gameId={game.id}
                initialLikeCount={likeCount}
                initialIsLiked={isLiked}
              />
              <PlayButton gameUrl={game.game_url} gameId={game.id} />
            </div>
          </CardContent>
        </Card>

        <CommentSection gameId={params.id} />
      </div>
    </div>
  )
}
