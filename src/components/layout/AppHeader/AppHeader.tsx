"use client";

import {
  LogIn,
  Menu,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { NotificationMenu } from "../NotificationMenu";
import { ProfileMenu } from "../ProfileMenu";
import {
  appHeaderStyles,
  desktopActiveIndicatorVariants,
  desktopNavItemVariants,
  mobileNavItemVariants,
} from "./styles";

const navItems = [
  { label: "오늘의 브리핑", href: "/", icon: Sparkles },
  { label: "이슈 탐색", href: "/#issues", icon: Search },
  { label: "관심 종목", href: "/#stocks", icon: TrendingUp },
  { label: "설정", href: "/#settings", icon: Settings2 },
];

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("/");
  const { user, isReady } = useAuth();
  const activeNavIndex = Math.max(
    navItems.findIndex(({ href }) => href === activeHref),
    0,
  );
  const activeNavPosition =
    activeNavIndex === 1
      ? 1
      : activeNavIndex === 2
        ? 2
        : activeNavIndex === 3
          ? 3
          : 0;

  useEffect(() => {
    const syncActiveHref = () =>
      setActiveHref(window.location.hash ? `/${window.location.hash}` : "/");
    syncActiveHref();
    window.addEventListener("hashchange", syncActiveHref);
    return () => window.removeEventListener("hashchange", syncActiveHref);
  }, []);

  return (
    <>
      <header className={appHeaderStyles.header}>
        <div className={appHeaderStyles.container}>
          <button
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen(true)}
            className={appHeaderStyles.menuButton}
          >
            <Menu size={22} />
          </button>
          <Link href="/" className={appHeaderStyles.logo}>
            Gwiteem
          </Link>
          <nav className={appHeaderStyles.desktopNav}>
            <span
              aria-hidden="true"
              className={desktopActiveIndicatorVariants({
                position: activeNavPosition,
              })}
            />
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setActiveHref(href)}
                aria-current={activeHref === href ? "page" : undefined}
                className={desktopNavItemVariants({
                  active: activeHref === href,
                })}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className={appHeaderStyles.actions}>
            {isReady && !user && (
              <>
                <Link href="/login" className={appHeaderStyles.loginLink}>
                  <LogIn size={16} /> 로그인
                </Link>
                <Link href="/register" className={appHeaderStyles.signUpLink}>
                  <UserPlus size={16} /> 회원가입
                </Link>
              </>
            )}
            {isReady && user && (
              <>
                <NotificationMenu />
                <ProfileMenu />
              </>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className={appHeaderStyles.mobileLayer}>
          <button
            aria-label="메뉴 닫기"
            className={appHeaderStyles.mobileBackdrop}
            onClick={() => setMenuOpen(false)}
          />
          <aside className={appHeaderStyles.mobilePanel}>
            <div className={appHeaderStyles.mobileHeader}>
              <Link href="/" className={appHeaderStyles.mobileLogo}>
                Gwiteem
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                className={appHeaderStyles.closeButton}
              >
                <X size={21} />
              </button>
            </div>
            <nav className={appHeaderStyles.mobileNav}>
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => {
                    setActiveHref(href);
                    setMenuOpen(false);
                  }}
                  aria-current={activeHref === href ? "page" : undefined}
                  className={mobileNavItemVariants({
                    active: activeHref === href,
                  })}
                >
                  <Icon size={19} /> {label}
                </Link>
              ))}
              {!user && (
                <div className={appHeaderStyles.mobileAuthActions}>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className={appHeaderStyles.mobileLogin}
                  >
                    <LogIn size={19} /> 로그인
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className={appHeaderStyles.mobileSignUp}
                  >
                    <UserPlus size={19} /> 회원가입
                  </Link>
                </div>
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
