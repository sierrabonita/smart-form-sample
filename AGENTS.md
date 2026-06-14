# Project: Smart Form Sample (AI Auto-fill Form)

## プロジェクト概要
ユーザーが自然言語で入力したテキスト（例：出張の予定）をAIが解析し、複雑な入力フォームに構造化データ（JSON）として自動入力（Auto-fill）するWebアプリケーションです。業務効率化と優れたUXの提供を目的としています。

## 技術スタック
- Framework: Next.js (App Router) ※ `src/` ディレクトリは使用せず、プロジェクト直下の `app/` を使用する
- Language: TypeScript
- Styling: Tailwind CSS
- Form Management: `react-hook-form`
- Validation & Schema: `zod`, `@hookform/resolvers/zod`
- AI SDK: Vercel AI SDK (`ai`)
- AI Provider: `@ai-sdk/google` (`gemini-1.5-flash`)

## AIアシスタントへの絶対的なコーディングルール

### 1. ディレクトリとパスのルール
- `src/` ディレクトリは存在しません。コードは必ず `app/`, `components/`, `lib/` などのプロジェクト直下のディレクトリに作成してください。
- インポートエイリアスは `@/` を使用してください（例: `@/lib/schema`）。

### 2. フォームとバリデーション
- フォームの状態管理は必ず `react-hook-form` を使用してください。
- データの型定義とバリデーションは必ず `zod` を使用し、フォームと連携させてください。
- AIにデータ構造を理解させるため、Zodスキーマの推測が難しい項目には `.describe("AI向けの説明")` を必ず記述してください。

### 3. AI SDKの実装ルール
- 自然言語からデータを抽出する際は、Vercel AI SDKの `generateObject` 関数を使用して構造化出力（Structured Outputs）を強制してください。
- AIへのシステムプロンプトでは、「推測でデータを捏造（ハルシネーション）せず、分からない項目は空欄にする」という制約を必ず明記してください。

### 4. コミュニケーションと言語
- コード内のコメントや、ユーザーへのフィードバック（エラーメッセージなど）はすべて自然な日本語で記述してください。