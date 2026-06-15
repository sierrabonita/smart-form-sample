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
