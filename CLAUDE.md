# CLAUDE.md

## このリポジトリの目的

Hono（TypeScript の Web フレームワーク）をキャッチアップするための個人学習用リポジトリ。
ここで学んだあと、これまでの学習（Go の TodoApp、React 学習）を活かして
**Hono + React（Vite か Next.js、未決定）** でアプリを作る予定。

- ランタイム: Node.js v24（`npm create hono@latest` の nodejs テンプレート）
- これまでの経験:
  - バックエンド: Go（net/http + GORM、Model → Repository → Service → Handler → Router の層構造、
    interface と DI、JWT ログイン、単体テスト・統合テスト）
    — `C:\dev\Go言語\go-learning\todoApp\todo-back`
  - フロントエンド: React 19 + TypeScript + Vite（react-router-dom、Context、Custom Hooks、
    CSS Modules、React Query）
  - **Express / Prisma / Jest は未経験。** Hono の説明は Go の net/http と比べると伝わりやすい

## 学習の進め方（重要）

- **答え（完成コード）を先に書かない。** ヒント・考え方・調べるキーワード・設計上の選択肢を出し、
  ユーザー自身に書いてもらう。
- ヒントは簡潔に。一度に詰め込まず、聞かれたら次を出す。段階的に気づかせる問いかけを使う。
- ユーザーが書いたコードへのレビュー（考え方の妥当性、Hono / TypeScript らしい書き方か、改善点）は積極的に行う。
- 代わりに実装してよいか迷ったら「自分で書きたいか、実装を見せてほしいか」を確認する。
- 置き換えたコードは削除せず、コメントアウトで残す（学習の履歴として）。
- 教材に無くても知っておくべきこと（セキュリティ、現場の慣習など）は「補足問題」として、
  頼まれなくても 1 回に 1〜3 個出す。問題文は このリポジトリ直下の `補足メモ.md` の
  該当ステップの見出しの下に**問題文のまま**追記する（答えは書かない）。
- 過去の学習に触れるときは番号でなく題名で言う（例:「ログイン機能の章」「React Query の章」）。

## キャッチアップの流れ

| # | テーマ | 状態 |
|---|---|---|
| 1 | セットアップと Hello World（Context の `c`、Response を返す） | 完了（2026-10-20） |
| 2 | ルーティング・パスパラメータ・クエリ・JSON ボディ、`app.route()` での分割 | 未着手 |
| 3 | ミドルウェア（logger / cors / 自作、`c.set` / `c.get` と Variables の型） | 未着手 |
| 4 | バリデーション（zod + `@hono/zod-validator`） | 未着手 |
| 5 | エラーハンドリング（`HTTPException`、`app.onError`、`app.notFound`） | 未着手 |
| 6 | 認証（`hono/jwt`、cookie ヘルパー） | 未着手 |
| 7 | テスト（`app.request()` + Vitest） | 未着手 |
| 8 | RPC（`hc` クライアント）で React と型を共有する | 未着手 |

DB（ORM の選定）と、Vite / Next.js のどちらにするかは、上の流れが進んでから決める。

## 学習の記録（毎ステップ更新する）

ステップが終わるたび、または区切りのよい所で、以下を更新する。

1. **`C:\dev\学習の記録\学習の記録_hono-learning.md`** — やったこと・学んだこと・つまずいた点・コミット
2. このファイルの「キャッチアップの流れ」の状態欄
3. 大きな区切り（数ステップ完了時など）では **`C:\dev\学習の記録\スキルシート用_学習まとめ.md`** にも追記
