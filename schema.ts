import { z } from "zod";

export const transportationOptions = [
  "新幹線",
  "飛行機",
  "電車",
  "バス",
  "社用車",
  "その他",
] as const;

export const businessTripSchema = z.object({
  department: z
    .string()
    .optional()
    .describe("申請者の所属する部署名。推測でデータを捏造せず、分からない場合は空にすること。"),
  applicantName: z
    .string()
    .optional()
    .describe("申請者の氏名。推測でデータを捏造せず、分からない場合は空にすること。"),
  destination: z
    .string()
    .optional()
    .describe("出張の行き先（都道府県、都市名、訪問先企業名など）。分からない場合は空にすること。"),
  purpose: z
    .string()
    .optional()
    .describe("出張の目的（会議、商談、視察など）。分からない場合は空にすること。"),
  startDate: z
    .string()
    .optional()
    .describe("出張の開始日。YYYY-MM-DDの形式。分からない場合は空にすること。"),
  endDate: z
    .string()
    .optional()
    .describe("出張の終了日。YYYY-MM-DDの形式。分からない場合は空にすること。"),
  transportation: z
    .enum(transportationOptions)
    .optional()
    .describe("利用する主な交通手段。分からない場合は空にすること。"),
  estimatedCost: z
    .number()
    .optional()
    .describe("交通費や宿泊費などの概算費用（数値のみ）。単位は円。分からない場合は空にすること。"),
  hasAccommodation: z
    .boolean()
    .optional()
    .describe("宿泊の有無。日帰りの場合はfalse、宿泊を伴う場合はtrue。分からない場合は空にすること。"),
  remarks: z
    .string()
    .optional()
    .describe("その他の補足情報や備考、同行者など。該当情報がない場合は空にすること。"),
});

export type BusinessTripFormValues = z.infer<typeof businessTripSchema>;