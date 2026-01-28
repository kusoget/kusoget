import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import UserMenu from '@/components/UserMenu'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/img/logo.svg"
              alt="KUSOGET"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/submit">
                  <Button>クソゲーを登録</Button>
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">ログイン</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>クソゲーを登録する</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
