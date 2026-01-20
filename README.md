# TaskChecker

## 開発構成

- `src/`: TypeScript（GASの実行コード）
- `src/appsscript.json`: GAS設定
- `.clasp.json`: `rootDir` は `src`

## 反映（clasp）

前提: `clasp` がインストール済みでログイン済み

```bash
clasp push
```

型チェックを使う場合:

```bash
npm install
npm run typecheck
```

## Script Properties (GAS)

GASのスクリプトエディタで Script Properties に以下のキーを設定してください。

- NOTION_API_TOKEN
- SLACK_WEBHOOK_URL

設定手順:
1. Apps Scriptエディタを開く
2. 左の歯車アイコン（Project Settings）を開く
3. Script Properties で上記キーを追加し保存

注意: トークン/URLはリポジトリにコミットしないでください。
