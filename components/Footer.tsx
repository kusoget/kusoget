'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Footer() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [supabase])

  return (
    <>
      {/* スマホ用の固定登録ボタン */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg">
        {user ? (
          <Link href="/submit" className="block w-full">
            <Button className="w-full" size="lg">
              クソゲーを登録
            </Button>
          </Link>
        ) : (
          <Link href="/auth/signup" className="block w-full">
            <Button className="w-full" size="lg">
              クソゲーを登録する
            </Button>
          </Link>
        )}
      </div>
      
      {/* フッター本体（スマホでは下部に余白を追加） */}
      <footer className="border-t bg-background pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2026 KUSOGET. All rights reserved.
            </div>
            <nav className="flex gap-6">
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                利用規約
              </Link>
              <Link 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                プライバシーポリシー
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </>
  )
}
