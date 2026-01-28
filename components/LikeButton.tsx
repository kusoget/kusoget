'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  gameId: string
  initialLikeCount: number
  initialIsLiked: boolean
}

export default function LikeButton({ gameId, initialLikeCount, initialIsLiked }: LikeButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // ログインページにリダイレクト
      router.push('/auth/signin')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.rpc('toggle_game_like', {
        p_game_id: gameId,
      })

      if (error) {
        console.error('Like error:', error)
        alert(`いいねに失敗しました: ${error.message}`)
        return
      }

      // RPC関数の戻り値から最新の状態を取得
      if (data && data.length > 0) {
        const result = data[0]
        setIsLiked(result.liked)
        setLikeCount(Number(result.like_count))
      } else {
        // フォールバック: 楽観的更新
        setIsLiked(!isLiked)
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
      }
      
      // ページをリフレッシュして最新の状態を取得
      router.refresh()
    } catch (err) {
      console.error('Failed to toggle like:', err)
      alert(`いいねに失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className="gap-2"
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likeCount}</span>
    </Button>
  )
}
