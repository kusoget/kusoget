import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ログイン | KUSOGET',
  description: 'KUSOGETにログインしてクソゲーを投稿・共有しましょう。',
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
