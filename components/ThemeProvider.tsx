'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { createClient } from '@/lib/supabase/client'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [initialTheme, setInitialTheme] = React.useState<string | undefined>(undefined)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const loadUserTheme = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // ユーザーがログインしている場合、データベースから設定を読み込む
        const { data: profile } = await supabase
          .from('profiles')
          .select('theme_preference')
          .eq('id', user.id)
          .single()
        
        if (profile?.theme_preference) {
          setInitialTheme(profile.theme_preference)
        } else {
          setInitialTheme('system')
        }
      } else {
        // ログインしていない場合、ローカルストレージから読み込む（フォールバック）
        const stored = localStorage.getItem('theme')
        setInitialTheme(stored || 'system')
      }
      
      setMounted(true)
    }

    loadUserTheme()
  }, [])

  // マウント前はシステム設定を使用
  if (!mounted) {
    return (
      <NextThemesProvider
        {...props}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    )
  }

  return (
    <NextThemesProvider
      {...props}
      defaultTheme={initialTheme || 'system'}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
