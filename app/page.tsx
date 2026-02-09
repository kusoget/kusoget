import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import GameCard from '@/components/GameCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ゲーム一覧 | KUSOGET',
  description: 'AIで作られたクソゲーを共有する投稿型ポータルサイト。面白いけど微妙なゲーム、変なゲーム、クソゲーを楽しみながら共有しましょう。',
}

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // まずゲームを取得（game_likesテーブルが存在しない場合でも動作するように）
  const { data: games, error } = await supabase
    .from('games')
    .select(`
      *,
      profiles:author_id (
        id,
        username
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  // いいね情報を取得（テーブルが存在する場合のみ）
  let gameLikesMap: Record<string, number> = {}
  let userLikedGames: string[] = []

  try {
    // 各ゲームのいいね数を取得
    if (games && games.length > 0) {
      const gameIds = games.map(g => g.id)
      const { data: likes } = await supabase
        .from('game_likes')
        .select('game_id, user_id')
        .in('game_id', gameIds)

      if (likes) {
        // いいね数をカウント
        likes.forEach(like => {
          gameLikesMap[like.game_id] = (gameLikesMap[like.game_id] || 0) + 1
        })

        // ユーザーがいいねしたゲームを取得
        if (user) {
          userLikedGames = likes
            .filter(like => like.user_id === user.id)
            .map(like => like.game_id)
        }
      }
    }
  } catch (err) {
    // game_likesテーブルが存在しない場合は無視
    console.log('game_likes table may not exist yet:', err)
  }

  let userProfile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('id, is_admin')
      .eq('id', user.id)
      .single()
    userProfile = data
  }

  if (error) {
    console.error('Error fetching games:', error)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {games && games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const canDelete = Boolean(userProfile && (
                userProfile.id === game.author_id ||
                userProfile.is_admin === true
              ))
              const canEdit = Boolean(userProfile && userProfile.id === game.author_id)

              // いいね数を取得
              const likeCount = gameLikesMap[game.id] || 0
              const isLiked = userLikedGames.includes(game.id)

              return (
                <GameCard
                  key={game.id}
                  game={{
                    ...game,
                    profiles: game.profiles as { id: string; username: string | null } | null
                  }}
                  canDelete={canDelete}
                  canEdit={canEdit}
                  likeCount={likeCount}
                  isLiked={isLiked}
                />
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                まだ投稿がありません。最初の投稿をしてみましょう！
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
