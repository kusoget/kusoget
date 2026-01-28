'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Logo() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // マウント前はライトモード用のロゴを表示（SSR対応）
  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark')
  const logoSrc = isDark ? '/img/logo_w.svg' : '/img/logo.svg'

  return (
    <img
      src={logoSrc}
      alt="KUSOGET"
      className="h-10 md:h-12 w-auto"
    />
  )
}
