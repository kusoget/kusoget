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
    'other': 'その他',
  }
  
  return genreMap[genre] || genre
}
