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
  { value: 'other', label: 'その他' },
] as const

export type GenreValue = typeof GENRE_OPTIONS[number]['value']
