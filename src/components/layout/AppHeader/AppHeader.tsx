"use client";

import {
  BriefcaseBusiness,
  Coffee,
  Grid2X2,
  LogIn,
  Menu,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { ProfileMenu } from "../ProfileMenu";
import {
  appHeaderStyles,
  desktopActiveIndicatorVariants,
  desktopNavItemVariants,
  mobileNavItemVariants,
} from "./styles";

const navItems = [
  { label: "전체", href: "/", category: "all", icon: Grid2X2 },
  {
    label: "직장",
    href: "/?category=work",
    category: "work",
    icon: BriefcaseBusiness,
  },
  {
    label: "소비",
    href: "/?category=spending",
    category: "spending",
    icon: WalletCards,
  },
  {
    label: "관계",
    href: "/?category=relationship",
    category: "relationship",
    icon: UsersRound,
  },
  {
    label: "일상",
    href: "/?category=daily",
    category: "daily",
    icon: Coffee,
  },
];

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const { user, isReady } = useAuth();
  const activeCategory = searchParams.get("category") ?? "all";
  const isMyView = searchParams.get("view") === "my";
  const activeNavIndex = Math.max(
    navItems.findIndex(({ category }) => category === activeCategory),
    0,
  );
  const activeNavPosition = activeNavIndex as 0 | 1 | 2 | 3 | 4;

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
            {navItems.map(({ label, href, category }) => (
              <Link
                key={label}
                href={
                  isMyView
                    ? category === "all"
                      ? "/?view=my"
                      : `/?view=my&category=${category}`
                    : href
                }
                aria-current={activeCategory === category ? "page" : undefined}
                className={desktopNavItemVariants({
                  active: activeCategory === category,
                })}
              >
                {label}
              </Link>
            ))}
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
              {navItems.map(({ label, href, category, icon: Icon }) => (
                <Link
                  key={label}
                  href={
                    isMyView
                      ? category === "all"
                        ? "/?view=my"
                        : `/?view=my&category=${category}`
                      : href
                  }
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                  aria-current={
                    activeCategory === category ? "page" : undefined
                  }
                  className={mobileNavItemVariants({
                    active: activeCategory === category,
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
                </div>
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
