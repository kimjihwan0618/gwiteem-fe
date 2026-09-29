"use client";

import { useParams, useSearchParams } from "next/navigation";
import { OAuthCallback } from "@/components/domain/auth/OAuthCallback";
import { socialProviderSchema } from "@/app/(page)/type/auth";
import { useSocialCallbackMutation } from "./hooks";

export default function OAuthCallbackPage() {
  const params = useParams<{ provider: string }>();
  const searchParams = useSearchParams();
  const callback = useSocialCallbackMutation();
  const parsedProvider = socialProviderSchema.safeParse(params.provider);

  return (
    <OAuthCallback
      provider={parsedProvider.success ? parsedProvider.data : null}
      code={searchParams.get("code") ?? undefined}
      state={searchParams.get("state") ?? undefined}
      error={searchParams.get("error") ?? undefined}
      callback={callback}
    />
  );
}
