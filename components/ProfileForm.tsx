'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Trash2, LogOut, Sun, Moon, Monitor } from 'lucide-react'
import { RadioGroup } from '@/components/ui/radio-group'

const profileSchema = z.object({
  username: z.string().min(2, 'ユーザー名は2文字以上で入力してください').max(30, 'ユーザー名は30文字以内で入力してください'),
})

type ProfileForm = z.infer<typeof profileSchema>

interface ProfileFormProps {
  initialUsername: string
  email: string
  initialThemePreference: 'light' | 'dark' | 'system'
}

export default function ProfileForm({ initialUsername, email, initialThemePreference }: ProfileFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [signOutLoading, setSignOutLoading] = useState(false)
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>(initialThemePreference)
  const [themeLoading, setThemeLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialUsername,
    },
  })

  const onSubmit = async (data: ProfileForm) => {
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        setError('ユーザー名の更新に失敗しました: ' + updateError.message)
        return
      }

      setSuccess('ユーザー名を更新しました')
      router.refresh()
    } catch (err) {
      setError('ユーザー名の更新に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
      return
    }

    const confirmation = prompt('削除を確認するため、「削除」と入力してください:')
    if (confirmation !== '削除') {
      alert('確認が一致しませんでした。アカウントは削除されませんでした。')
      return
    }

    setDeleteLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      // RPC関数を使用してアカウントを削除
      const { error: deleteError } = await supabase.rpc('delete_user_account')

      if (deleteError) {
        // RPC関数が存在しない場合、直接profilesテーブルから削除
        const { error: profileDeleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id)

        if (profileDeleteError) {
          setError('アカウントの削除に失敗しました: ' + profileDeleteError.message)
          return
        }
      }

      // ログアウトしてトップページにリダイレクト
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (err) {
      setError('アカウントの削除に失敗しました')
      console.error(err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSignOut = async () => {
    setSignOutLoading(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setThemeLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          theme_preference: newTheme,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        setError('テーマ設定の更新に失敗しました: ' + updateError.message)
        return
      }

      setThemePreference(newTheme)
      setSuccess('テーマ設定を更新しました。ページをリロードしてください。')
      
      // テーマを即座に反映
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement
        if (newTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          root.classList.remove('light', 'dark')
          root.classList.add(systemTheme)
        } else {
          root.classList.remove('light', 'dark')
          root.classList.add(newTheme)
        }
        localStorage.setItem('theme', newTheme)
      }
    } catch (err) {
      setError('テーマ設定の更新に失敗しました')
      console.error(err)
    } finally {
      setThemeLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ユーザー情報 */}
      <Card>
        <CardHeader>
          <CardTitle>ユーザー情報</CardTitle>
          <CardDescription>
            アカウントの基本情報を管理できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                メールアドレスは変更できません
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">ユーザー名</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 p-3 rounded-md">
                {success}
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? '更新中...' : 'ユーザー名を更新'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* テーマ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>テーマ設定</CardTitle>
          <CardDescription>
            アプリの表示テーマを設定できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RadioGroup
              value={themePreference}
              onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
              options={[
                { value: 'light', label: 'ライトモード' },
                { value: 'dark', label: 'ダークモード' },
                { value: 'system', label: 'システム設定に従う' },
              ]}
              disabled={themeLoading}
            />
            {themeLoading && (
              <p className="text-sm text-muted-foreground">更新中...</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ログアウト */}
      <Card>
        <CardHeader>
          <CardTitle>ログアウト</CardTitle>
          <CardDescription>
            アカウントからログアウトします
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={signOutLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {signOutLoading ? 'ログアウト中...' : 'ログアウト'}
          </Button>
        </CardContent>
      </Card>

      {/* アカウント削除 */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            危険な操作
          </CardTitle>
          <CardDescription>
            アカウントを削除すると、すべてのデータが永久に削除されます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              アカウントを削除すると、以下のデータがすべて削除されます：
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>プロフィール情報</li>
              <li>投稿したゲーム</li>
              <li>その他のアカウント関連データ</li>
            </ul>
            <p className="text-sm font-semibold text-destructive">
              この操作は取り消せません。
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteLoading ? '削除中...' : 'アカウントを削除'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
