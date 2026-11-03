import type { Metadata } from "next";

export const siteUrl = "https://gwiteem.com";
export const siteName = "Gwiteem";
export const siteDescription =
  "직장·소비·관계·일상의 고민, 당신은 어떤 선택을 하나요? Gwiteem에서 선택과 이유를 남기고 투표 결과와 댓글로 다른 사람들의 생각을 만나보세요.";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  index = false,
): Metadata {
  const url = new URL(path, siteUrl).toString();
  const image = {
    url: new URL("/brand/gwiteem-share.png", siteUrl).toString(),
    width: 1200,
    height: 630,
    type: "image/png",
    alt: "Gwiteem — 오늘, 당신의 선택은?",
  };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName,
      title,
      description,
      url,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
