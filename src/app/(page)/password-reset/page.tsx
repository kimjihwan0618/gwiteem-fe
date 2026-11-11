"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { PasswordResetForm } from "@/components/domain/auth/PasswordResetForm";
import {
  useConfirmPasswordResetCodeMutation,
  useResetPasswordMutation,
  useSendPasswordResetCodeMutation,
} from "./hooks";
import { passwordResetPageStyles } from "./styles";

export default function PasswordResetPage() {
  const sendCodeMutation = useSendPasswordResetCodeMutation();
  const confirmCodeMutation = useConfirmPasswordResetCodeMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  return (
    <main className={passwordResetPageStyles.root}>
      <header className={passwordResetPageStyles.header}>
        <Link href="/" className={passwordResetPageStyles.logo}>
          <BrandLogo />
        </Link>
        <Link href="/login" className={passwordResetPageStyles.backLink}>
          <ArrowLeft size={17} /> 로그인으로
        </Link>
      </header>

      <section className={passwordResetPageStyles.formContent}>
        <PasswordResetForm
          sendCodeMutation={sendCodeMutation}
          confirmCodeMutation={confirmCodeMutation}
          resetPasswordMutation={resetPasswordMutation}
        />
      </section>

      <footer className={passwordResetPageStyles.footer}>
        <span>© 2026 귀뜸</span>
        <nav className={passwordResetPageStyles.footerLinks}>
          <Link href="#">이용약관</Link>
          <Link href="#">개인정보처리방침</Link>
        </nav>
      </footer>
    </main>
  );
}
