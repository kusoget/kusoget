import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // サイトのベースURL
    // 環境変数 NEXT_PUBLIC_SITE_URL が設定されていればそれを使用し、なければデフォルト値を使用
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kusoget.com'

    // 静的ページ
    const routes = [
        '',
        '/about',
        '/terms',
        '/privacy',
        '/submit',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // 動的ページ（ゲーム詳細）
    try {
        const supabase = await createClient()
        const { data: games } = await supabase
            .from('games')
            .select('id, updated_at')
            .order('updated_at', { ascending: false })

        const gameRoutes = (games || []).map((game) => ({
            url: `${baseUrl}/games/${game.id}`,
            lastModified: new Date(game.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

        return [...routes, ...gameRoutes]
    } catch (error) {
        console.error('Sitemap generation error:', error)
        return routes
    }
}
