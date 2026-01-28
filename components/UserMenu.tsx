'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
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
      <Tooltip content="マイページ">
        <Link href="/profile">
          <Button
            variant="ghost"
            size="icon"
          >
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </Tooltip>
      <Tooltip content="ログアウト">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          disabled={loading}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </Tooltip>
    </div>
  )
}
