import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '新規登録 | KUSOGET',
  description: 'KUSOGETに新規登録してクソゲーを投稿・共有しましょう。メールアドレスとユーザー名で簡単登録できます。',
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
