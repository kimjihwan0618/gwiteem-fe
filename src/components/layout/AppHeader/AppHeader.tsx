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
import { useEffect, useState } from "react";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { ProfileMenu } from "../ProfileMenu";
import {
  appHeaderStyles,
  desktopActiveIndicatorVariants,
  desktopNavItemVariants,
  mobileNavItemVariants,
} from "./styles";

const navItems = [
  { label: "전체", href: "/#all", icon: Grid2X2 },
  { label: "직장", href: "/#work", icon: BriefcaseBusiness },
  { label: "소비", href: "/#spending", icon: WalletCards },
  { label: "관계", href: "/#relationship", icon: UsersRound },
  { label: "일상", href: "/#daily", icon: Coffee },
];

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("/#all");
  const { user, isReady } = useAuth();
  const activeNavIndex = Math.max(
    navItems.findIndex(({ href }) => href === activeHref),
    0,
  );
  const activeNavPosition = activeNavIndex as 0 | 1 | 2 | 3 | 4;

  useEffect(() => {
    const syncActiveHref = () =>
      setActiveHref(
        window.location.hash && window.location.hash !== "#my"
          ? `/${window.location.hash}`
          : "/#all",
      );
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
              <Link href="/login" className={appHeaderStyles.loginLink}>
                <LogIn size={16} /> 로그인
              </Link>
            )}
            {isReady && user && (
              <>
                <Link href="/#my" className={appHeaderStyles.myChoicesLink}>
                  내 선택
                </Link>
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
                </div>
              )}
              {user && (
                <Link
                  href="/#my"
                  onClick={() => setMenuOpen(false)}
                  className={appHeaderStyles.mobileLogin}
                >
                  내 선택
                </Link>
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
