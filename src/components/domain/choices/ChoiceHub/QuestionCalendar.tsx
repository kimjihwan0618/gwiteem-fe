import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { editorialStyles as styles } from "./editorial.styles";

interface Props {
  date: Date;
  hasTodayQuestion: boolean;
}

/** Date archive selection stays disabled until a dated featured-question API exists. */
export function QuestionCalendar({ date, hasTodayQuestion }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();

  return (
    <aside className={styles.calendar} aria-label="질문 달력">
      <button
        type="button"
        className={styles.calendarToggle}
        aria-expanded={isOpen}
        aria-controls="question-calendar-days"
        onClick={() => setIsOpen((value) => !value)}
      >
        <CalendarDays size={18} />
        {new Intl.DateTimeFormat("ko-KR", {
          month: "long",
          day: "numeric",
          weekday: "long",
        }).format(date)}
        <ChevronDown size={16} />
      </button>
      <div
        id="question-calendar-days"
        className={cn(styles.calendarBody, isOpen && styles.calendarBodyOpen)}
      >
        <div className={styles.calendarHeading}>
          <button
            disabled
            aria-label="이전 달 질문 준비 중"
            className={styles.monthButton}
          >
            <ChevronLeft size={19} />
          </button>
          <h2>
            {year}년 {month + 1}월
          </h2>
          <button
            disabled
            aria-label="다음 달 질문 준비 중"
            className={styles.monthButton}
          >
            <ChevronRight size={19} />
          </button>
        </div>
        <div className={styles.calendarGrid}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <span key={day} className={styles.weekday}>
              {day}
            </span>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (
            <span key={`blank-${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const day = i + 1;
            const isToday = day === date.getDate();
            return (
              <button
                key={day}
                disabled={!isToday || !hasTodayQuestion}
                aria-current={isToday ? "date" : undefined}
                aria-label={`${month + 1}월 ${day}일${isToday ? ", 오늘" : ", 선택할 수 없음"}`}
                className={cn(styles.day, isToday && styles.today)}
              >
                {day}
              </button>
            );
          })}
        </div>
        <p className={styles.calendarNote}>
          지난 날짜의 질문은 곧 만나볼 수 있어요.
        </p>
      </div>
    </aside>
  );
}
