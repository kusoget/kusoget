'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface PlayButtonProps {
  gameUrl: string
  gameId: string
}

export default function PlayButton({ gameUrl, gameId }: PlayButtonProps) {
  const supabase = createClient()

  const handlePlayClick = async () => {
    try {
      await supabase.rpc('increment_view_count', {
        game_id: gameId,
      })
    } catch (error) {
      console.error('Failed to increment view count:', error)
    }
  }

  return (
    <Link 
      href={gameUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handlePlayClick}
    >
      <Button variant="default" size="default">
        <ExternalLink className="mr-2 h-4 w-4" />
        ゲームをプレイ
      </Button>
    </Link>
  )
}
