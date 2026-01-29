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
import { RadioGroup } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'

const submitSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  game_url: z.string().url('有効なURLを入力してください'),
  genre: z.enum([
    'action', 
    'rpg', 
    'puzzle', 
    'simulation', 
    'joke', 
    'platformer',
    'shooter',
    'racing',
    'strategy',
    'horror',
    'adventure',
    'music',
    'sports',
    'fighting',
    'other'
  ], {
    required_error: 'ジャンルを選択してください',
  }),
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
      agreeToTerms: false,
    },
  })

  const agreeToTerms = watch('agreeToTerms')
  const genre = watch('genre')

  const genreOptions = [
    { value: 'action', label: 'アクション' },
    { value: 'rpg', label: 'RPG' },
    { value: 'puzzle', label: 'パズル' },
    { value: 'simulation', label: 'シミュレーション' },
    { value: 'joke', label: 'ジョーク' },
    { value: 'platformer', label: 'プラットフォーマー' },
    { value: 'shooter', label: 'シューティング' },
    { value: 'racing', label: 'レーシング' },
    { value: 'strategy', label: 'ストラテジー' },
    { value: 'horror', label: 'ホラー' },
    { value: 'adventure', label: 'アドベンチャー' },
    { value: 'music', label: '音楽' },
    { value: 'sports', label: 'スポーツ' },
    { value: 'fighting', label: '格闘' },
    { value: 'other', label: 'その他' },
  ]

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
          description: '', // 説明は空文字列を設定
          game_url: data.game_url,
          thumbnail_url: thumbnailUrl,
          author_id: profile.id,
          type: 'playable', // デフォルト値として'playable'を設定
          genre: data.genre,
          platform: [], // プラットフォームは空配列を設定
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
              新しいクソゲーを共有しましょう
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
                <Label htmlFor="thumbnail">サムネイル画像 *</Label>
                <div className="flex items-center gap-2 flex-wrap">
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
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    ファイルを選択
                  </Button>
                  {thumbnailFile && (
                    <span className="text-sm text-muted-foreground">
                      選択中: {thumbnailFile.name}
                    </span>
                  )}
                </div>
                {thumbnailFile && (
                  <div className="mt-2">
                    <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="プレビュー"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>ジャンル *</Label>
                <RadioGroup
                  name="genre"
                  options={genreOptions}
                  value={genre}
                  onValueChange={(value) => setValue('genre', value as any)}
                />
                {errors.genre && (
                  <p className="text-sm text-destructive">{errors.genre.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setValue('agreeToTerms', checked === true)}
                  className="mt-0"
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm font-normal cursor-pointer leading-none"
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
