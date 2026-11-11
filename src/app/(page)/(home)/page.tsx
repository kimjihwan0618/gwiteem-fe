import HomePage from "./HomePage";
import { pageMetadata, siteDescription, siteName, siteUrl } from "@/lib/seo";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  // 검색 노출은 기본 목록에 한정하고 상세 모달·필터·내 기록 URL은 제외한다.
  const isMainPage = Object.keys(params).every(
    (key) => key.startsWith("utm_") || ["gclid", "fbclid"].includes(key),
  );
  return pageMetadata(
    "귀뜸 | 오늘, 당신의 선택은? 일상 고민 투표",
    siteDescription,
    "/",
    isMainPage,
  );
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            alternateName: "gwiteem",
            url: siteUrl,
            description: siteDescription,
            inLanguage: "ko-KR",
          }).replace(/</g, "\\u003c"),
        }}
      />
      <HomePage />
    </>
  );
}
