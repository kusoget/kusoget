'use client'

import { useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DeleteButton from '@/components/DeleteButton'
import EditButton from '@/components/EditButton'
import LikeButton from '@/components/LikeButton'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getGenreLabel } from '@/lib/genre-labels'

interface GameCardProps {
  game: {
    id: string
    title: string
    description: string
    game_url: string
    thumbnail_url: string
    type: 'playable' | 'log'
    genre: 'action' | 'rpg' | 'puzzle' | 'simulation' | 'joke' | 'other'
    platform: string[]
    view_count: number
    author_id: string
    profiles?: {
      id: string
      username: string | null
    } | null
  }
  canDelete: boolean
  canEdit: boolean
  likeCount: number
  isLiked: boolean
}

export default function GameCard({ game, canDelete, canEdit, likeCount, isLiked }: GameCardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()

  const handleGameClick = async () => {
    try {
      await supabase.rpc('increment_view_count', {
        game_id: game.id,
      })
      // 閲覧数の更新はバックグラウンドで行われるため、ページリロードは不要
    } catch (error) {
      console.error('Failed to increment view count:', error)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // ボタンやリンクをクリックした場合はカードのリンクを無効化
    const target = e.target as HTMLElement
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return
    }
    startTransition(() => {
      router.push(`/games/${game.id}`)
    })
  }

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={handleCardClick}
    >
      {isPending && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div className="relative w-full h-48 bg-muted">
        {game.thumbnail_url && (
          <Image
            src={game.thumbnail_url}
            alt={game.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {(canDelete || canEdit) && (
          <div className="absolute top-2 right-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {canEdit && <EditButton gameId={game.id} />}
            {canDelete && <DeleteButton gameId={game.id} />}
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2 hover:text-primary">{game.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs px-2 py-1 bg-secondary rounded-md">
            {getGenreLabel(game.genre)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>
            {game.profiles?.username || '匿名ユーザー'}
          </span>
          <span>{game.view_count} プレイ</span>
        </div>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <LikeButton 
            gameId={game.id}
            initialLikeCount={likeCount}
            initialIsLiked={isLiked}
          />
          <Link 
            href={game.game_url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleGameClick}
            className="flex-1"
          >
            <Button className="w-full" variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              ゲームをプレイ
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
