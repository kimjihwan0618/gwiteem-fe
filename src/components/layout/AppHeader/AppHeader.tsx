"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { ProfileMenu } from "../ProfileMenu";
import { appHeaderStyles } from "./styles";

export function AppHeader() {
  const { user, isReady } = useAuth();

  return (
    <header className={appHeaderStyles.header}>
      <div className={appHeaderStyles.container}>
        <Link href="/" className={appHeaderStyles.logo}>
          <BrandLogo />
        </Link>
        <span className={appHeaderStyles.date}>
          {new Intl.DateTimeFormat("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "long",
            timeZone: "Asia/Seoul",
          }).format(new Date())}
        </span>
        <nav className={appHeaderStyles.nav} aria-label="주 메뉴">
          <Link className={appHeaderStyles.navLink} href="/">
            오늘의 질문
          </Link>
          <Link className={appHeaderStyles.navLink} href="/#questions">
            둘러보기
          </Link>
          <Link className={appHeaderStyles.navLink} href="/?view=my">
            내 선택
          </Link>
        </nav>
        <div className={appHeaderStyles.actions}>
          {isReady && !user && (
            <Link href="/login" className={appHeaderStyles.loginLink}>
              <LogIn size={16} /> 로그인
            </Link>
          )}
          {isReady && user && <ProfileMenu />}
        </div>
      </div>
    </header>
  );
}
