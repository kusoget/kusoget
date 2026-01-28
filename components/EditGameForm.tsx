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
import { RadioGroup } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'

const editSchema = z.object({
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
})

type EditForm = z.infer<typeof editSchema>

interface EditGameFormProps {
  game: {
    id: string
    title: string
    game_url: string
    thumbnail_url: string
    genre: string
  }
}

export default function EditGameForm({ game }: EditGameFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(game.thumbnail_url)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: game.title,
      game_url: game.game_url,
      genre: game.genre as any,
    },
  })

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data: EditForm) => {
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      let thumbnailUrl = game.thumbnail_url

      // 新しいサムネイルがアップロードされた場合
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
      }

      // ゲーム情報を更新
      const { error: updateError } = await supabase
        .from('games')
        .update({
          title: data.title,
          game_url: data.game_url,
          thumbnail_url: thumbnailUrl,
          genre: data.genre,
        })
        .eq('id', game.id)

      if (updateError) {
        setError('更新に失敗しました: ' + updateError.message)
        setLoading(false)
        return
      }

      setSuccess('ゲーム情報を更新しました')
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    } catch (err) {
      setError('更新に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ゲームを編集</CardTitle>
        <CardDescription>
          ゲーム情報を更新できます
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
            <Label htmlFor="thumbnail">サムネイル画像</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {previewUrl && (
              <div className="mt-2">
                <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
                  <img
                    src={previewUrl}
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

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? '更新中...' : '更新する'}
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
  )
}
