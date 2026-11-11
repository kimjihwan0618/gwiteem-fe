"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { LoginForm } from "@/components/domain/auth/LoginForm";
import { useLoginMutation, useSocialLoginMutation } from "./hooks";
import { loginPageStyles } from "./styles";

export default function LoginPage() {
  const loginMutation = useLoginMutation();
  const socialLoginMutation = useSocialLoginMutation();

  return (
    <main className={loginPageStyles.root}>
      <header className={loginPageStyles.header}>
        <Link href="/" className={loginPageStyles.logo}>
          <BrandLogo />
        </Link>
        <Link href="/" className={loginPageStyles.backLink}>
          <ArrowLeft size={17} /> 메인으로
        </Link>
      </header>

      <section className={loginPageStyles.formContent}>
        <LoginForm
          loginMutation={loginMutation}
          socialLoginMutation={socialLoginMutation}
        />
      </section>

      <footer className={loginPageStyles.footer}>
        <span>© 2026 귀뜸</span>
        <nav className={loginPageStyles.footerLinks}>
          <Link href="#">이용약관</Link>
          <Link href="#">개인정보처리방침</Link>
        </nav>
      </footer>
    </main>
  );
}
