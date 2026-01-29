import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '管理画面 | KUSOGET',
  description: 'KUSOGETの管理画面。投稿されたゲームの管理やユーザー管理ができます。',
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // 管理者権限を確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.is_admin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">管理画面</h1>
          <p className="text-lg text-muted-foreground">
            投稿とユーザーの管理
          </p>
        </div>

        <AdminDashboard />
      </div>
    </div>
  )
}
