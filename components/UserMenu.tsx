'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function UserMenu() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        disabled={loading}
        title="ログアウト"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  )
}
