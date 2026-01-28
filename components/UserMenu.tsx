'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function UserMenu() {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
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
    </div>
  )
}
