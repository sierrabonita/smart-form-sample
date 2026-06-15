# Harness Engineering Log (AI Prompt History)

- このファイルは、VS Code + Gemini Code Assist を用いた開発において、AIの挙動を制御・最適化するために設計したプロンプトの記録です。
- プロンプトと修正ファイルをいっしょにコミットしていきます

## プロンプト

```
AGENTS.mdのルールに従って、出張申請フォーム用のZodスキーマ定義ファイルを作成してください。

作成先ファイル: `app/lib/schema.ts`

【要件】
1. 項目は10個程度（部署名、申請者名、行き先、出張目的、開始日、終了日、交通手段、概算費用、宿泊の有無、備考）。
2. 交通手段は enum（新幹線、飛行機、電車、バス、社用車、その他）にすること。
3. AIが自然言語からデータを抽出する際のヒントとして、各フィールドに適切な `.describe("...")` を記述すること。
4. z.infer を使って、フォーム用のTypeScriptの型（BusinessTripFormValues）をエクスポートすること。
```

```
AGENTS.mdのルールに従って、自然言語のテキストから出張申請のJSONデータを抽出するAPI Route Handlerを作成してください。

作成先ファイル: `app/api/extract-trip/route.ts`

【要件】
1. Vercel AI SDKの `generateText` 関数と、`@ai-sdk/google` プロバイダーの `gemini-1.5-flash` モデルを使用すること。
2. 前回のタスクで作成したZodスキーマ（`@/lib/schema` の `businessTripSchema`）をインポートし、`generateText` の `schema` に指定すること。
3. クライアントから POST リクエストで `{ prompt: string, currentDate: string }` を受け取ること。
4. AIへのシステムプロンプト（systemプロパティ）に以下のルールを含めること：
   - あなたは優秀な経理・総務アシスタントです。
   - ユーザーの入力テキストから出張申請情報を抽出し、指定されたスキーマに従って出力してください。
   - 今日の日付は `${currentDate}` です。「来週の金曜」や「1泊」などの相対的な表現は、必ずこの日付を基準に正確に計算し、"YYYY-MM-DD"形式で出力してください。
   - テキストから明確に読み取れない項目は、絶対に勝手に推測（ハルシネーション）せず、空文字（""）または未選択（false / 0）にしてください。
5. 抽出されたオブジェクト（result.output）を `NextResponse.json()` でクライアントに返却すること。
```

```
AGENTS.mdのルールに従って、AI自動入力機能付きの出張申請フォーム画面（Pageコンポーネント）を作成してください。

作成先ファイル: `app/page.tsx`

【要件】
1. `react-hook-form` と `@hookform/resolvers/zod` を使用し、先に作成した `app/lib/schema.ts` の `businessTripSchema` を使ってフォームを管理すること（"use client" が必要です）。
2. 画面を上下（または左右）の2つのセクションに分けること：
   - 【AIアシスタントエリア】: 自由入力用のテキストエリアと、「AIで自動入力」ボタンを配置。
   - 【フォームエリア】: スキーマに定義された10個のフィールド（部署名、申請者名、行き先、出張目的、開始日、終了日、交通手段のセレクトボックス、概算費用、宿泊の有無のチェックボックス、備考）をTailwind CSSできれいに配置。
3. 【最重要：ハイライト機能のロジック】
   - AIからデータが返ってきたら、`react-hook-form` の `setValue` を使って各フィールドに値をセットすること。
   - その際、**「AIによって値が空（または初期値）から新しい値に変更されたフィールド」** を特定し、そのフィールドの背景色を数秒間ハイライト（例：薄い黄色や青）させるための状態管理（state）と Tailwind CSS のアニメーション（@keyframes等、または単純なsetTimeoutでのクラス切り替え）を実装すること。
4. 「AIで自動入力」ボタンの押下時に、`/api/extract-trip` に対して POST リクエストを送り、ボディに `prompt` と `currentDate`（JavaScriptの `new Date().toISOString().split('T')[0]` 等で取得した今日の日付）を含めて送信すること。
5. ローディング状態（AI解析中）のUI表示も制御すること。
```