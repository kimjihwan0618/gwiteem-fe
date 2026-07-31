import { z } from "zod";

export const briefingSchema = z.object({
  updatedAt: z.string(),
  user: z.object({ name: z.string(), isGuest: z.boolean() }),
  commute: z.object({
    leaveBy: z.string(),
    etaMinutes: z.number(),
    delayMinutes: z.number(),
    reason: z.string(),
    destination: z.string(),
  }),
  weather: z.object({
    temperature: z.number(),
    condition: z.string(),
    eveningDelta: z.number(),
  }),
  priorities: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      evidence: z.string(),
      sourceCount: z.number(),
    }),
  ),
  stocks: z.array(
    z.object({
      symbol: z.string(),
      name: z.string(),
      price: z.string(),
      change: z.number(),
      issue: z.string(),
      changeDirection: z.enum(["UP", "DOWN", "FLAT"]).optional(),
      priceHistory: z.array(z.number()).optional(),
      priceChart: z
        .array(
          z.object({
            timestamp: z.string(),
            open: z.number(),
            high: z.number(),
            low: z.number(),
            close: z.number(),
            volume: z.number(),
          }),
        )
        .optional(),
      relatedIssues: z
        .array(z.object({ id: z.number(), title: z.string() }))
        .optional(),
    }),
  ),
  schedule: z.array(
    z.object({ time: z.string(), label: z.string(), kind: z.string() }),
  ),
  clusters: z.array(
    z.object({
      topic: z.string(),
      count: z.number(),
      title: z.string(),
      summary: z.string(),
      tone: z.string(),
    }),
  ),
});

export type Briefing = z.infer<typeof briefingSchema>;
export type Priority = Briefing["priorities"][number];

export const briefingActionResultSchema = z.object({
  briefingId: z.string(),
  action: z.enum(["start", "save", "feedback", "share"]),
});

export type FeedbackValue = "up" | "down";

export const demoBriefing: Briefing = {
  updatedAt: "오전 7:28",
  user: { name: "", isGuest: true },
  commute: {
    leaveBy: "8:10",
    etaMinutes: 53,
    delayMinutes: 12,
    reason: "분당수서로 사고로 평소보다 12분 더 걸려요",
    destination: "회사 · 분당수서로",
  },
  weather: { temperature: 21, condition: "맑음", eveningDelta: -9 },
  priorities: [
    {
      id: 1,
      title: "HBM 공급계약 이슈가 관심 종목에 영향을 줄 수 있어요",
      evidence:
        "국내외 주요 매체 18건이 같은 공급계약 전망을 다뤘어요. 확정 공시 전이므로 전망과 사실을 구분해 확인하세요.",
      sourceCount: 18,
    },
    {
      id: 2,
      title: "미국 금리 발언이 오늘 국내 증시의 핵심 변수예요",
      evidence:
        "연준 인사 발언과 국채 금리 움직임을 다룬 기사 4건을 하나의 이슈로 묶었어요.",
      sourceCount: 4,
    },
    {
      id: 3,
      title: "퇴근 시간 기온이 아침보다 9°C 낮아요",
      evidence:
        "18시 이후 기온 하락과 강한 바람이 예보되어 얇은 겉옷을 챙기는 편이 좋아요.",
      sourceCount: 2,
    },
  ],
  stocks: [
    {
      symbol: "005930",
      name: "삼성전자",
      price: "71,800원",
      change: 1.27,
      issue: "HBM 공급계약 전망",
    },
    {
      symbol: "000660",
      name: "SK하이닉스",
      price: "195,700원",
      change: -0.51,
      issue: "메모리 수급 전망",
    },
    {
      symbol: "035420",
      name: "NAVER",
      price: "178,600원",
      change: 2.35,
      issue: "AI 서비스 경쟁 심화",
    },
  ],
  schedule: [
    { time: "09:00", label: "국내 증시 개장", kind: "market" },
    { time: "15:30", label: "미국 물가 발표", kind: "global" },
    { time: "18:20", label: "예상 퇴근", kind: "commute" },
  ],
  clusters: [
    {
      topic: "반도체",
      count: 18,
      title: "HBM 공급계약 확대 기대감",
      summary: "관심 종목과 연결된 핵심 변화만 추렸어요.",
      tone: "blue",
    },
    {
      topic: "금리",
      count: 4,
      title: "파월 발언, 증시 숨 고르기",
      summary: "오늘 국내 증시의 변동 요인을 확인하세요.",
      tone: "green",
    },
    {
      topic: "AI",
      count: 2,
      title: "글로벌 빅테크 AI 경쟁 심화",
      summary: "서비스 차별화와 비용 효율이 화두예요.",
      tone: "violet",
    },
  ],
};
