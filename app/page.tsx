import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import GameCard from '@/components/GameCard'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: games, error } = await supabase
    .from('games')
    .select(`
      *,
      profiles:author_id (
        id,
        username
      ),
      game_likes(count)
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  // ユーザーがいいねしたゲームを取得
  let userLikedGames: string[] = []
  if (user) {
    const { data: likes } = await supabase
      .from('game_likes')
      .select('game_id')
      .eq('user_id', user.id)
    
    userLikedGames = likes?.map(like => like.game_id) || []
  }

  const { data: { user } } = await supabase.auth.getUser()
  
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">KUSOGET</h1>
          <p className="text-lg text-muted-foreground">
            AIで作られたクソゲーを共有する投稿型ポータルサイト
          </p>
        </div>

        {games && games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const canDelete = Boolean(userProfile && (
                userProfile.id === game.author_id || 
                userProfile.is_admin === true
              ))
              const canEdit = Boolean(userProfile && userProfile.id === game.author_id)

              // いいね数を取得
              const likeCount = Array.isArray(game.game_likes) 
                ? game.game_likes.length 
                : (game.game_likes as any)?.count || 0
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
