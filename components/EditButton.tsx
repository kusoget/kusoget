'use client'

import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditButtonProps {
  gameId: string
}

export default function EditButton({ gameId }: EditButtonProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/games/${gameId}/edit`)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleEdit}
      className="h-8 w-8"
      title="編集"
    >
      <Pencil className="h-4 w-4" />
    </Button>
  )
}
