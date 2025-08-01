# Vue.js 最小構成プロジェクト

Vue 3とViteを使用したシンプルなVue.jsプロジェクトです。

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. 開発サーバーを起動:
```bash
npm run dev
```

3. ブラウザで http://localhost:3000 を開く

## プロジェクト構成

```
├── index.html          # メインのHTMLファイル
├── package.json        # プロジェクト設定とパッケージ依存関係
├── vite.config.js      # Vite設定
└── src/
    ├── main.js         # アプリケーションのエントリーポイント
    └── App.vue         # メインのVueコンポーネント
```

## 機能

- Vue 3 Composition API
- Viteによる高速な開発サーバー
- シンプルなリアクティブな状態管理
- 基本的なイベントハンドリング

## 仕様

- テキストエリア、checkボタン、clearボタンを持つUI
- テキストエリアには複数のURLが入力される
- checkボタンを押すと、以下の処理を行う
    - もしURLが入力されていない場合はボタンの下にエラーメッセージを表示して終了
    - 入力されたURLを改行で分割
    - 各URLのpathを/で分割して、"001"で始まる要素(id)を抽出
    - idを ids という Set に追加する
    - idsの要素数が1なら、ボタンの下に「They are same SFDC accounts! Account ID: <code>${ids[0]}</code>」と表示して終了
    - idsの要素数が2以上なら、ボタンの下に「They are different SFDC accounts! Account IDs: <code>${Array.from(ids).join(', ')}</code>」と表示して終了
- clearボタンを押すと、テキストエリアとメッセージをクリア

## 追加仕様

- 「Account ID(s):」というメッセージの後ろに抽出した SFDC アカウント ID を表示するが、各 ID の後ろに、ID を GitHub.com で検索するためのリンクを付ける
- 検索URLは https://github.com/search?q=user%3Agithub+%22${id}%22&type=issues&ref=advsearch というフォーマットで、{id} は抽出した SFDC アカウント ID に置き換える
- 各IDのリンクは、`<a>`タグで囲み、`target="_blank"`属性を付けて新しいタブで開くようにする
- 各IDのリンクは、<code>${id}</code>の後ろに、🔗 絵文字として追加する

## 追加仕様2

- 「Account ID(s):」というメッセージの後ろに抽出した SFDC アカウント ID を表示するが、各 ID 文字列をクリップボードにコピーするボタンを付ける
- ボタンは 📋 絵文字で表示する
- ボタンを押すと、クリップボードにコピーされる
- ボタンを押した後、「Copied!」というメッセージを表示し、数秒後に消える

## スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - プロダクション用にビルド
- `npm run preview` - ビルドしたアプリをプレビュー
