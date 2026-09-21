"use client";

import { ChevronDown, LogOut, Settings2, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { profileMenuStyles } from "./styles";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const toast = useToast();
  if (!user) return null;

  async function handleLogout() {
    await logout();
    setOpen(false);
    toast.info("로그아웃했습니다.");
  }

  return (
    <div className={profileMenuStyles.root}>
      <button
        aria-label="프로필 메뉴"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={profileMenuStyles.trigger}
      >
        <Avatar name={user.name} avatarUrl={user.avatarUrl} />
        <span className={profileMenuStyles.userName}>{user.name}</span>
        <ChevronDown size={15} className={profileMenuStyles.chevron} />
      </button>
      {open && (
        <div className={profileMenuStyles.panel}>
          <div className={profileMenuStyles.identity}>
            <Avatar name={user.name} avatarUrl={user.avatarUrl} />
            <div className={profileMenuStyles.identityText}>
              <p className={profileMenuStyles.name}>{user.name}</p>
              {user.email && (
                <p className={profileMenuStyles.email}>{user.email}</p>
              )}
            </div>
          </div>
          <div className={profileMenuStyles.actions}>
            <Link href="/#my" className={profileMenuStyles.action}>
              <UserRound size={17} /> 내 선택
            </Link>
            <button className={profileMenuStyles.action}>
              <Settings2 size={17} /> 계정 설정
            </button>
          </div>
          <button
            onClick={() => void handleLogout()}
            className={profileMenuStyles.logout}
          >
            <LogOut size={17} /> 로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

function Avatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  if (avatarUrl)
    return (
      <Image
        src={avatarUrl}
        alt={`${name} 프로필`}
        width={40}
        height={40}
        className={profileMenuStyles.avatarImage}
      />
    );
  return (
    <span className={profileMenuStyles.avatarFallback}>{name.slice(0, 1)}</span>
  );
}
