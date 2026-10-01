"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { ProfileMenu } from "../ProfileMenu";
import { appHeaderStyles } from "./styles";

export function AppHeader() {
  const { user, isReady } = useAuth();

  return (
    <header className={appHeaderStyles.header}>
      <div className={appHeaderStyles.container}>
        <Link href="/" className={appHeaderStyles.logo}>
          Gwiteem
        </Link>
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
