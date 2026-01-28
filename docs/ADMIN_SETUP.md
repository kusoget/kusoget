# 管理者アカウント設定ガイド

特定のユーザーを管理者に設定する方法です。

## 方法1: メールアドレスで設定（推奨）

SupabaseのSQL Editorで以下を実行：

```sql
-- メールアドレスを置き換えてください
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);
```

例：
```sql
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'kusoget@outlook.jp'
);
```

## 方法2: ユーザーIDで設定

ユーザーIDが分かっている場合：

```sql
-- ユーザーIDを置き換えてください
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE id = 'ユーザーID（UUID）';
```

## ユーザーIDの確認方法

### 方法A: Supabaseダッシュボードから

1. Supabaseダッシュボードにログイン
2. 「Authentication」→「Users」を開く
3. ユーザー一覧から対象ユーザーを探す
4. ユーザーID（UUID）をコピー

### 方法B: SQLで確認

```sql
-- すべてのユーザーとメールアドレスを確認
SELECT 
  au.id,
  au.email,
  p.username,
  p.is_admin
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
```

## 管理者権限の確認

設定後、以下のSQLで確認できます：

```sql
-- 管理者一覧を確認
SELECT 
  id,
  username,
  email,
  is_admin
FROM public.profiles
WHERE is_admin = TRUE;
```

## 管理者権限の解除

管理者権限を解除する場合：

```sql
-- メールアドレスで解除
UPDATE public.profiles 
SET is_admin = FALSE 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);
```
