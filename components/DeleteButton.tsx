'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface DeleteButtonProps {
  gameId: string
}

export default function DeleteButton({ gameId }: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('本当にこの投稿を削除しますか？')) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId)

      if (error) {
        alert('削除に失敗しました。しばらく待ってから再度お試しください。')
        console.error('Delete error:', error)
        return
      }

      router.refresh()
    } catch (err) {
      alert('削除に失敗しました。しばらく待ってから再度お試しください。')
      console.error('Delete error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      className="h-8 w-8"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
