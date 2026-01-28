import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import UserMenu from '@/components/UserMenu'
import { ThemeToggle } from '@/components/ThemeToggle'
import Logo from '@/components/Logo'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <nav className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                {/* デスクトップのみ表示 */}
                <Link href="/submit" className="hidden md:block">
                  <Button>クソゲーを登録</Button>
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                {/* デスクトップのみ表示 */}
                <Link href="/auth/signin" className="hidden md:block">
                  <Button variant="ghost">ログイン</Button>
                </Link>
                <Link href="/auth/signup" className="hidden md:block">
                  <Button>クソゲーを登録する</Button>
                </Link>
                {/* スマホのみ表示 */}
                <ThemeToggle />
                <Link href="/auth/signin" className="md:hidden">
                  <Button variant="ghost" size="sm">ログイン</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
