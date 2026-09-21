"use client";

import {
  Bell,
  BellRing,
  CarFront,
  CheckCheck,
  CloudSun,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { dummyNotifications } from "@/components/layout/NotificationMenu/type";
import {
  notificationItemVariants,
  notificationMenuStyles,
  notificationTypeVariants,
} from "./styles";

const typeIcons = { weather: CloudSun, market: TrendingUp, commute: CarFront };

export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  function markAllAsRead() {
    setNotifications((items) =>
      items.map((item) => ({ ...item, isRead: true })),
    );
  }

  function readOne(id: string) {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  }

  return (
    <div className={notificationMenuStyles.root}>
      <button
        aria-label="알림 목록"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={notificationMenuStyles.trigger}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={notificationMenuStyles.count}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className={notificationMenuStyles.panel}>
          <div className={notificationMenuStyles.header}>
            <div>
              <h2 className={notificationMenuStyles.title}>알림</h2>
              <p className={notificationMenuStyles.unreadSummary}>
                읽지 않은 알림 {unreadCount}개
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className={notificationMenuStyles.markAll}
            >
              <CheckCheck size={15} /> 모두 읽음
            </button>
          </div>
          <div className={notificationMenuStyles.list}>
            {notifications.map((notice) => {
              const Icon = typeIcons[notice.type];
              return (
                <button
                  key={notice.id}
                  onClick={() => readOne(notice.id)}
                  className={notificationItemVariants({
                    unread: !notice.isRead,
                  })}
                >
                  <span
                    className={notificationTypeVariants({ type: notice.type })}
                  >
                    <Icon size={19} />
                  </span>
                  <span className={notificationMenuStyles.content}>
                    <span className={notificationMenuStyles.titleRow}>
                      <strong className={notificationMenuStyles.itemTitle}>
                        {notice.title}
                      </strong>
                      {!notice.isRead && (
                        <span className={notificationMenuStyles.unreadDot} />
                      )}
                    </span>
                    <span className={notificationMenuStyles.description}>
                      {notice.description}
                    </span>
                    <span className={notificationMenuStyles.createdAt}>
                      {notice.createdAt}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <button className={notificationMenuStyles.viewAll}>
            <BellRing size={16} /> 모든 알림 보기
          </button>
        </div>
      )}
    </div>
  );
}
