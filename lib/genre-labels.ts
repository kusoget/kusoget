/**
 * ジャンルのラベルを取得する関数
 */
export function getGenreLabel(genre: string): string {
  const genreMap: Record<string, string> = {
    'action': 'アクション',
    'rpg': 'RPG',
    'puzzle': 'パズル',
    'simulation': 'シミュレーション',
    'joke': 'ジョーク',
    'platformer': 'プラットフォーマー',
    'shooter': 'シューティング',
    'racing': 'レーシング',
    'strategy': 'ストラテジー',
    'horror': 'ホラー',
    'adventure': 'アドベンチャー',
    'music': '音楽',
    'sports': 'スポーツ',
    'fighting': '格闘',
    'online': 'オンライン対戦',
    'gambling': 'ギャンブル',
    'novel': 'ノベル / ビジュアルノベル',
    'typing': 'タイピング',
    'card': 'カード / ボードゲーム',
    'quiz': 'クイズ',
    'rhythm': 'リズムゲーム',
    'survival': 'サバイバル',
    'mmorpg': 'MMORPG',
    'escape': '脱出ゲーム',
    'idle': '放置ゲーム',
    'other': 'その他',
  }

  return genreMap[genre] || genre
}

/**
 * 複数ジャンルのラベルを取得する関数
 */
export function getGenresLabel(genres: string[]): string[] {
  return genres.map(getGenreLabel)
}

/**
 * 利用可能なジャンル一覧
 */
export const GENRE_OPTIONS = [
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
  { value: 'online', label: 'オンライン対戦' },
  { value: 'gambling', label: 'ギャンブル' },
  { value: 'novel', label: 'ノベル / ビジュアルノベル' },
  { value: 'typing', label: 'タイピング' },
  { value: 'card', label: 'カード / ボードゲーム' },
  { value: 'quiz', label: 'クイズ' },
  { value: 'rhythm', label: 'リズムゲーム' },
  { value: 'survival', label: 'サバイバル' },
  { value: 'mmorpg', label: 'MMORPG' },
  { value: 'escape', label: '脱出ゲーム' },
  { value: 'idle', label: '放置ゲーム' },
  { value: 'other', label: 'その他' },
] as const

export type GenreValue = typeof GENRE_OPTIONS[number]['value']
