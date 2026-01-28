'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Search, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import DeleteButton from '@/components/DeleteButton'
import { getGenreLabel } from '@/lib/genre-labels'

interface Game {
  id: string
  title: string
  description: string
  game_url: string
  thumbnail_url: string
  type: 'playable' | 'log'
  genre: string
  platform: string[]
  view_count: number
  created_at: string
  author_id: string
  profiles?: {
    id: string
    username: string | null
  } | null
}

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          profiles:author_id (
            id,
            username
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching games:', error)
        return
      }

      setGames(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">読み込み中...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">総投稿数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{games.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">総閲覧数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {games.reduce((sum, game) => sum + game.view_count, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">表示中の投稿</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredGames.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* 検索 */}
      <Card>
        <CardHeader>
          <CardTitle>投稿検索</CardTitle>
          <CardDescription>
            タイトル、説明、ユーザー名で検索できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 投稿一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>投稿一覧</CardTitle>
          <CardDescription>
            すべての投稿を管理できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredGames.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? '検索結果がありません' : '投稿がありません'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                    {game.thumbnail_url && (
                      <Image
                        src={game.thumbnail_url}
                        alt={game.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 truncate">
                          {game.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-secondary rounded-md">
                            {getGenreLabel(game.genre)}
                          </span>
                          {game.platform?.map((p) => (
                            <span key={p} className="text-xs px-2 py-1 bg-secondary rounded-md">
                              {p === 'pc' ? 'PC' : 'モバイル'}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            投稿者: {game.profiles?.username || '匿名ユーザー'}
                          </span>
                          <span>閲覧数: {game.view_count}</span>
                          <span>
                            投稿日: {new Date(game.created_at).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={game.game_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            確認
                          </Button>
                        </a>
                        <DeleteButton 
                          gameId={game.id} 
                          onDelete={fetchGames}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
