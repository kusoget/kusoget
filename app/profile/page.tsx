import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">マイページ</h1>
          <p className="text-lg text-muted-foreground">
            プロフィール設定とアカウント管理
          </p>
        </div>

        <ProfileForm 
          initialUsername={profile?.username || ''}
          email={user.email || ''}
        />
      </div>
    </div>
  )
}
