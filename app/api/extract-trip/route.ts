import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { businessTripSchema } from "@/schema";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { prompt, currentDate } = await req.json();

    if (!prompt || !currentDate) {
      return NextResponse.json(
        { error: "prompt と currentDate は必須です" },
        { status: 400 }
      );
    }

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: businessTripSchema }),
      system: `あなたは優秀な経理・総務アシスタントです。
ユーザーの入力テキストから出張申請情報を抽出し、指定されたスキーマに従って出力してください。
今日の日付は ${currentDate} です。「来週の金曜」や「1泊」などの相対的な表現は、必ずこの日付を基準に正確に計算し、"YYYY-MM-DD"形式で出力してください。
テキストから明確に読み取れない項目は、絶対に勝手に推測（ハルシネーション）せず、空文字（""）または未選択（false / 0）にしてください。`,
      prompt: prompt,
    });

    return NextResponse.json(result.output);
  } catch (error) {
    console.error("抽出中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "データの抽出に失敗しました" },
      { status: 500 }
    );
  }
}
