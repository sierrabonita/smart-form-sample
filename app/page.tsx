"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessTripSchema, BusinessTripFormValues, transportationOptions } from "@/schema";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
  } = useForm<BusinessTripFormValues>({
    resolver: zodResolver(businessTripSchema),
    defaultValues: {
      department: "",
      applicantName: "",
      destination: "",
      purpose: "",
      startDate: "",
      endDate: "",
      transportation: undefined,
      estimatedCost: undefined,
      hasAccommodation: false,
      remarks: "",
    },
  });

  const handleAutoFill = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setHighlightedFields([]);

    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const response = await fetch("/api/extract-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, currentDate }),
      });

      if (!response.ok) {
        throw new Error("APIリクエストに失敗しました");
      }

      const data: Partial<BusinessTripFormValues> = await response.json();
      const updatedFields: string[] = [];

      // AIから返ってきたデータをフォームにセットし、変更があったフィールドを記録
      (Object.keys(data) as Array<keyof BusinessTripFormValues>).forEach((key) => {
        const newValue = data[key];
        const currentValue = getValues(key);
        
        // 値が存在し（空文字等ではない）、かつ現在の値から変更された場合のみ更新とハイライトの対象とする
        if (newValue !== undefined && newValue !== null && newValue !== "") {
          if (newValue !== currentValue) {
            setValue(key, newValue as never, { shouldValidate: true, shouldDirty: true });
            updatedFields.push(key);
          }
        }
      });

      // 変更があったフィールドをハイライト状態にし、3秒後に解除する
      if (updatedFields.length > 0) {
        setHighlightedFields(updatedFields);
        setTimeout(() => {
          setHighlightedFields([]);
        }, 3000);
      }

    } catch (error) {
      console.error(error);
      alert("自動入力中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: BusinessTripFormValues) => {
    console.log("Submit:", data);
    alert("申請を送信しました。\n\n" + JSON.stringify(data, null, 2));
  };

  // Tailwindのクラスを利用して、対象フィールドの場合だけ背景色を黄色に変更する関数
  const getFieldClass = (fieldName: keyof BusinessTripFormValues) => {
    const baseClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border text-gray-900";
    const highlightClass = highlightedFields.includes(fieldName)
      ? "bg-yellow-100 transition-none"
      : "bg-white transition-colors duration-1000";
    return `${baseClass} ${highlightClass}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">AI出張申請フォーム</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* AIアシスタントエリア */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md self-start sticky top-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="mr-2">✨</span> AIアシスタント
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              出張の予定を自然な文章で入力してください。AIがフォームの各項目に自動で振り分けます。
            </p>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 text-sm"
              placeholder="例：来週の水曜日から2泊3日で東京の本社に行ってきます。交通費は新幹線で往復3万円くらいです。目的は四半期定例会議です。"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            <button
              onClick={handleAutoFill}
              disabled={isLoading || !prompt.trim()}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AIで解析中...
                </>
              ) : (
                "AIで自動入力"
              )}
            </button>
          </div>

          {/* フォームエリア */}
          <div className="w-full lg:w-2/3 bg-white p-6 sm:p-8 rounded-xl shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">部署名</label>
                  <input type="text" {...register("department")} className={getFieldClass("department")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">申請者名</label>
                  <input type="text" {...register("applicantName")} className={getFieldClass("applicantName")} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">行き先</label>
                  <input type="text" {...register("destination")} className={getFieldClass("destination")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">出張目的</label>
                  <input type="text" {...register("purpose")} className={getFieldClass("purpose")} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">開始日</label>
                  <input type="date" {...register("startDate")} className={getFieldClass("startDate")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">終了日</label>
                  <input type="date" {...register("endDate")} className={getFieldClass("endDate")} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">交通手段</label>
                  <select {...register("transportation")} className={getFieldClass("transportation")}>
                    <option value="">選択してください</option>
                    {transportationOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">概算費用 (円)</label>
                  <input type="number" {...register("estimatedCost", { setValueAs: v => v === "" ? undefined : parseInt(v, 10) })} className={getFieldClass("estimatedCost")} />
                </div>
              </div>

              <div className={`p-3 rounded-md inline-block ${highlightedFields.includes("hasAccommodation") ? "bg-yellow-100 transition-none" : "bg-transparent transition-colors duration-1000"}`}>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" {...register("hasAccommodation")} className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                  <span className="text-sm font-medium text-gray-700">宿泊を伴う</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">備考</label>
                <textarea {...register("remarks")} rows={3} className={getFieldClass("remarks")} />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button type="submit" className="w-full md:w-auto px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors">
                  申請内容を送信
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
