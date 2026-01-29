import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'クソゲーを投稿 | KUSOGET',
  description: 'AIで作られたクソゲーを投稿して共有しましょう。タイトル、ジャンル、サムネイル、ゲームURLを入力して投稿できます。',
}

export default async function SubmitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return <>{children}</>
}
