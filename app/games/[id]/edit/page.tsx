import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EditGameForm from '@/components/EditGameForm'
import type { Metadata } from 'next'

interface EditPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const supabase = await createClient()
  const { data: game } = await supabase
    .from('games')
    .select('title')
    .eq('id', params.id)
    .single()

  if (!game) {
    return {
      title: 'ゲームを編集 | KUSOGET',
    }
  }

  return {
    title: `${game.title}を編集 | KUSOGET`,
    description: `${game.title}の情報を編集します。`,
  }
}

export default async function EditGamePage({ params }: EditPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // ゲーム情報を取得
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !game) {
    notFound()
  }

  // 投稿者か管理者か確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, is_admin')
    .eq('id', user.id)
    .single()

  const canEdit = profile && (profile.id === game.author_id || profile.is_admin === true)

  if (!canEdit) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <EditGameForm game={game} />
      </div>
    </div>
  )
}
