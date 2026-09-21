export interface NotificationItem {
  id: string;
  type: "weather" | "market" | "commute";
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
}

export const dummyNotifications: NotificationItem[] = [
  {
    id: "notice-1",
    type: "weather",
    title: "기온 변화가 있어요",
    description: "외출 전 시간대별 날씨를 확인해 보세요.",
    createdAt: "방금 전",
    isRead: false,
  },
  {
    id: "notice-2",
    type: "commute",
    title: "출근길 지연이 감지됐어요",
    description: "분당수서로 사고로 평소보다 12분 더 걸려요.",
    createdAt: "18분 전",
    isRead: false,
  },
  {
    id: "notice-3",
    type: "market",
    title: "관심 종목 가격이 변동했어요",
    description: "등록한 종목의 현재가와 차트를 확인해 보세요.",
    createdAt: "1시간 전",
    isRead: true,
  },
];
