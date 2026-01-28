'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'

const submitSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  game_url: z.string().url('有効なURLを入力してください'),
  description: z.string().min(1, '説明を入力してください'),
  type: z.enum(['playable', 'log'], {
    required_error: 'タイプを選択してください',
  }),
  genre: z.enum(['action', 'rpg', 'puzzle', 'simulation', 'joke', 'other'], {
    required_error: 'ジャンルを選択してください',
  }),
  platform: z.array(z.enum(['pc', 'mobile'])).min(1, '少なくとも1つのプラットフォームを選択してください'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: '利用規約への同意が必要です',
  }),
})

type SubmitForm = z.infer<typeof submitSchema>

export default function SubmitPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SubmitForm>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      platform: [],
      agreeToTerms: false,
    },
  })

  const agreeToTerms = watch('agreeToTerms')
  const platform = watch('platform')

  const handlePlatformChange = (platformValue: 'pc' | 'mobile', checked: boolean) => {
    const currentPlatforms = platform || []
    if (checked) {
      setValue('platform', [...currentPlatforms, platformValue])
    } else {
      setValue('platform', currentPlatforms.filter((p) => p !== platformValue))
    }
  }

  const onSubmit = async (data: SubmitForm) => {
    setError(null)
    setLoading(true)

    try {
      // 認証チェック
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      let thumbnailUrl = ''

      // サムネイルアップロード
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(filePath, thumbnailFile)

        if (uploadError) {
          setError('サムネイルのアップロードに失敗しました')
          setLoading(false)
          return
        }

        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(filePath)

        thumbnailUrl = publicUrl
      } else {
        setError('サムネイル画像を選択してください')
        setLoading(false)
        return
      }

      // プロファイル取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        setError('プロファイルが見つかりません')
        setLoading(false)
        return
      }

      // ゲーム投稿
      const { error: insertError } = await supabase
        .from('games')
        .insert({
          title: data.title,
          description: data.description,
          game_url: data.game_url,
          thumbnail_url: thumbnailUrl,
          author_id: profile.id,
          type: data.type,
          genre: data.genre,
          platform: data.platform,
        })

        if (insertError) {
          setError('投稿に失敗しました。しばらく待ってから再度お試しください。')
          console.error('Insert error:', insertError)
          setLoading(false)
          return
        }

      router.push('/')
      router.refresh()
    } catch (err) {
      setError('投稿に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>ゲームを投稿</CardTitle>
            <CardDescription>
              新しいクソゲーや開発ログを共有しましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">タイトル *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="ゲームのタイトル"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="game_url">ゲームURL *</Label>
                <Input
                  id="game_url"
                  type="url"
                  placeholder="https://example.com/game"
                  {...register('game_url')}
                />
                {errors.game_url && (
                  <p className="text-sm text-destructive">{errors.game_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">説明 *</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="ゲームの説明を入力してください"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">サムネイル画像 *</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setThumbnailFile(file)
                    }
                  }}
                />
                {thumbnailFile && (
                  <p className="text-sm text-muted-foreground">
                    選択中: {thumbnailFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">タイプ *</Label>
                <Select id="type" {...register('type')}>
                  <option value="">選択してください</option>
                  <option value="playable">プレイ可能</option>
                  <option value="log">開発ログ</option>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">ジャンル *</Label>
                <Select id="genre" {...register('genre')}>
                  <option value="">選択してください</option>
                  <option value="action">アクション</option>
                  <option value="rpg">RPG</option>
                  <option value="puzzle">パズル</option>
                  <option value="simulation">シミュレーション</option>
                  <option value="joke">ジョーク</option>
                  <option value="other">その他</option>
                </Select>
                {errors.genre && (
                  <p className="text-sm text-destructive">{errors.genre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>プラットフォーム *</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="platform-pc"
                      checked={platform?.includes('pc')}
                      onCheckedChange={(checked) => handlePlatformChange('pc', checked === true)}
                    />
                    <Label htmlFor="platform-pc" className="font-normal cursor-pointer">
                      PC
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="platform-mobile"
                      checked={platform?.includes('mobile')}
                      onCheckedChange={(checked) => handlePlatformChange('mobile', checked === true)}
                    />
                    <Label htmlFor="platform-mobile" className="font-normal cursor-pointer">
                      モバイル
                    </Label>
                  </div>
                </div>
                {errors.platform && (
                  <p className="text-sm text-destructive">{errors.platform.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setValue('agreeToTerms', checked === true)}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm font-normal cursor-pointer"
                  >
                    私は{' '}
                    <Link href="/terms" className="text-primary hover:underline" target="_blank">
                      利用規約
                    </Link>
                    に同意します *
                  </Label>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? '投稿中...' : '投稿する'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
