/**
 * Supabaseのエラーメッセージを日本語に翻訳する関数
 */
export function translateAuthError(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    // 認証エラー
    'Email not confirmed': 'メールアドレスが確認されていません。確認メールをチェックしてください。',
    'Invalid login credentials': 'メールアドレスまたはパスワードが正しくありません。',
    'User already registered': 'このメールアドレスは既に登録されています。',
    'Email rate limit exceeded': 'メール送信の上限に達しました。しばらく待ってから再度お試しください。',
    'Password should be at least 6 characters': 'パスワードは6文字以上で入力してください。',
    'Signups not allowed': '現在、新規登録を受け付けていません。',
    'Email address is already registered': 'このメールアドレスは既に登録されています。',
    'Unable to validate email address: invalid format': 'メールアドレスの形式が正しくありません。',
    'For security purposes, you can only request this once every 60 seconds': 'セキュリティのため、60秒に1回のみリクエストできます。',
    'Invalid email': 'メールアドレスの形式が正しくありません。',
    'Invalid password': 'パスワードが正しくありません。',
    'Token has expired or is invalid': 'リンクの有効期限が切れています。再度リクエストしてください。',
    'User not found': 'ユーザーが見つかりません。',
    'Email address not authorized': 'このメールアドレスは認証されていません。',
    'Too many requests': 'リクエストが多すぎます。しばらく待ってから再度お試しください。',
    
    // 一般的なエラー
    'Network request failed': 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
    'An unexpected error occurred': '予期しないエラーが発生しました。しばらく待ってから再度お試しください。',
    'Failed to fetch': 'データの取得に失敗しました。インターネット接続を確認してください。',
  }

  // 完全一致をチェック
  if (errorMap[errorMessage]) {
    return errorMap[errorMessage]
  }

  // 部分一致をチェック（より柔軟なマッチング）
  const lowerErrorMessage = errorMessage.toLowerCase()
  
  // 特定のパターンをチェック
  if (lowerErrorMessage.includes('email not confirmed') || lowerErrorMessage.includes('email_not_confirmed')) {
    return 'メールアドレスが確認されていません。確認メールをチェックしてください。'
  }
  
  if (lowerErrorMessage.includes('invalid login') || lowerErrorMessage.includes('invalid credentials')) {
    return 'メールアドレスまたはパスワードが正しくありません。'
  }
  
  if (lowerErrorMessage.includes('already registered') || lowerErrorMessage.includes('already exists')) {
    return 'このメールアドレスは既に登録されています。'
  }
  
  if (lowerErrorMessage.includes('rate limit') || lowerErrorMessage.includes('too many')) {
    return 'リクエストが多すぎます。しばらく待ってから再度お試しください。'
  }
  
  if (lowerErrorMessage.includes('network') || lowerErrorMessage.includes('fetch')) {
    return 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
  }
  
  if (lowerErrorMessage.includes('expired') || lowerErrorMessage.includes('invalid token')) {
    return 'リンクの有効期限が切れています。再度リクエストしてください。'
  }

  // 部分一致をチェック
  for (const [key, value] of Object.entries(errorMap)) {
    if (lowerErrorMessage.includes(key.toLowerCase())) {
      return value
    }
  }

  // デフォルトメッセージ
  return 'エラーが発生しました。しばらく待ってから再度お試しください。'
}
