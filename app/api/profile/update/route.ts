import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const { username } = await request.json()

    if (!username || username.length < 2 || username.length > 30) {
      return NextResponse.json(
        { error: 'ユーザー名は2文字以上30文字以内で入力してください' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        username,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
