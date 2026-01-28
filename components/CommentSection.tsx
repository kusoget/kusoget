'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { MessageSquare, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale/ja'

interface Comment {
  id: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  profiles: {
    id: string
    username: string | null
  }
}

interface CommentSectionProps {
  gameId: string
}

export default function CommentSection({ gameId }: CommentSectionProps) {
  const router = useRouter()
  const supabase = createClient()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    loadComments()
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, is_admin')
        .eq('id', user.id)
        .single()
      setUserProfile(profile)
    }
  }

  const loadComments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('game_comments')
        .select(`
          *,
          profiles:user_id (
            id,
            username
          )
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading comments:', error)
        return
      }

      setComments(data || [])
    } catch (err) {
      console.error('Failed to load comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ログインチェック（念のため二重チェック）
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      router.push('/auth/signin')
      return
    }

    if (!newComment.trim()) {
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('game_comments')
        .insert({
          game_id: gameId,
          content: newComment.trim(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error posting comment:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        const errorMessage = error.message || error.details || '不明なエラー'
        const errorHint = error.hint ? `\n\nヒント: ${error.hint}` : ''
        alert(`コメントの投稿に失敗しました: ${errorMessage}${errorHint}\n\nエラーコード: ${error.code || 'N/A'}`)
        return
      }

      if (!data) {
        console.error('No data returned from insert')
        alert('コメントの投稿に失敗しました: データが返されませんでした')
        return
      }

      setNewComment('')
      loadComments()
    } catch (err) {
      console.error('Failed to post comment:', err)
      const errorMessage = err instanceof Error ? err.message : '不明なエラー'
      console.error('Exception details:', err)
      alert(`コメントの投稿に失敗しました: ${errorMessage}\n\nブラウザのコンソールを確認してください。`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('コメントを削除しますか？')) {
      return
    }

    try {
      const { error } = await supabase
        .from('game_comments')
        .delete()
        .eq('id', commentId)

      if (error) {
        console.error('Error deleting comment:', error)
        alert(`コメントの削除に失敗しました: ${error.message}`)
        return
      }

      loadComments()
    } catch (err) {
      console.error('Failed to delete comment:', err)
      alert(`コメントの削除に失敗しました: ${err instanceof Error ? err.message : '不明なエラー'}`)
    }
  }

  const canDelete = (comment: Comment) => {
    if (!user) return false
    // 自分のコメントまたは管理者の場合に削除可能
    if (user.id === comment.user_id) return true
    if (userProfile && userProfile.is_admin === true) return true
    return false
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          コメント ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを入力..."
              rows={4}
              maxLength={1000}
              className="mb-2"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {newComment.length}/1000
              </span>
              <Button type="submit" disabled={submitting || !newComment.trim()}>
                {submitting ? '投稿中...' : 'コメントを投稿'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-muted rounded-md text-center">
            <p className="text-sm text-muted-foreground mb-2">
              コメントを投稿するにはログインが必要です
            </p>
            <Button onClick={() => router.push('/auth/signin')} variant="outline" size="sm">
              ログイン
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            読み込み中...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            まだコメントがありません。最初のコメントを投稿してみましょう！
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">
                      {comment.profiles?.username || '匿名ユーザー'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: ja,
                      })}
                      {comment.updated_at !== comment.created_at && ' (編集済み)'}
                    </p>
                  </div>
                  {canDelete(comment) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
