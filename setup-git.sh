#!/bin/bash

# Gitリポジトリを初期化
git init

# すべてのファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit: KUSOGET project"

# ブランチ名をmainに設定
git branch -M main

# GitHubリポジトリをリモートとして追加
git remote add origin https://github.com/kusoget/kusoget.git

echo "✅ Gitリポジトリの初期化が完了しました"
echo ""
echo "次のステップ:"
echo "1. GitHubの認証情報を設定してください（必要に応じて）"
echo "2. 以下のコマンドでGitHubにプッシュしてください:"
echo "   git push -u origin main"
echo ""
echo "認証が必要な場合:"
echo "- Personal Access Tokenを使用することを推奨します"
echo "- GitHub Settings > Developer settings > Personal access tokens で作成"
