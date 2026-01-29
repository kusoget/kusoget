import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import UserMenu from '@/components/UserMenu'
import Logo from '@/components/Logo'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
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
                  <Link href="/auth/signin" className="md:hidden">
                    <Button variant="ghost" size="sm">ログイン</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      {/* スクロールバナー */}
      <div className="bg-primary text-white dark:text-white overflow-hidden whitespace-nowrap sticky top-[73px] md:top-[81px] z-40">
        <div className="flex animate-scroll">
          <span className="inline-block px-4 text-xs md:text-sm font-medium flex-shrink-0">
            みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩
          </span>
          <span className="inline-block px-4 text-xs md:text-sm font-medium flex-shrink-0">
            みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩 みんなのクソゲーで遊ばせて💩
          </span>
        </div>
      </div>
    </>
  )
}
