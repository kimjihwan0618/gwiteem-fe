# 페이지 SEO와 메타데이터 규칙

## 페이지 생성 시 필수 작업

- 새 화면 페이지를 만들 때 UI와 함께 서버 측 메타데이터 선언 구조를 반드시 작성한다. 루트의 일반 제목·설명을 그대로 상속하는 것으로 완료하지 않는다.
- 페이지 목적에 맞는 제목, 설명, 대표 URL(canonical), 검색 허용 여부, Open Graph, Twitter Card를 설정한다.
- 공통 도메인·서비스명·공유 이미지·메타데이터 생성은 `src/lib/seo.ts`의 `pageMetadata()`를 재사용한다. 페이지마다 같은 설정을 복사하지 않는다.
- 파비콘·Apple 아이콘은 루트 설정을 상속한다. 페이지마다 중복 생성하지 않는다.

## 파일 구성

Next.js가 메타데이터를 읽는 진입점은 서버 컴포넌트인 `page.tsx` 또는 `layout.tsx`의 `metadata` / `generateMetadata` export다. 일반 `meta.ts` 파일을 만들기만 해서는 적용되지 않는다. `.tx` 대신 React 파일에는 `.tsx`, 순수 설정·함수 파일에는 `.ts` 확장자를 사용한다.

다음 중 페이지에 맞는 구조 하나를 선택한다.

1. **서버 페이지**: `page.tsx`에서 정적 `metadata` 또는 동적 `generateMetadata`를 export한다.
2. **기존 client 페이지의 정적 메타데이터**: `page.tsx`는 유지하고 같은 폴더의 서버 `layout.tsx`에서 `metadata`를 export한다. 부모 layout의 설정을 공유하는 하위 페이지도 고유한 제목·설명이 필요한지 확인한다.
3. **query 등 요청별 메타데이터가 필요한 client 화면**: 서버 `page.tsx`에서 `generateMetadata`를 export하고, UI는 같은 폴더의 `<PageName>Page.tsx` client 컴포넌트로 분리한다. `searchParams`는 페이지에서 처리하며 layout에 전달된다고 가정하지 않는다.

`"use client"` 파일에서는 `metadata`나 `generateMetadata`를 export하지 않는다. 같은 라우트 파일에 두 export를 동시에 선언하지 않는다. 필요에 따라 로직을 `meta.ts` 등으로 분리할 수 있지만 서버 진입점에서 반드시 연결하고, 단순한 설정을 위해 파일을 불필요하게 늘리지 않는다.

정적 메타데이터를 가진 client 페이지의 예시:

```text
src/app/(page)/example/
  page.tsx       # "use client" 화면
  layout.tsx     # 서버 metadata 선언
```

```tsx
// layout.tsx
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "페이지 이름 | Gwiteem",
  "이 페이지에서 사용자가 할 수 있는 일을 설명합니다.",
  "/example",
  false, // 새 페이지는 기본적으로 noindex
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
```

## 검색 노출 정책

- 현재 검색 허용 대상은 메인(`/`)과 로그인(`/login`) 두 페이지다. 새 페이지는 기본 `noindex`로 작성하고, 사용자 요청에 검색 노출 확대가 포함된 경우 해당 페이지와 사이트맵을 함께 갱신한다.
- 회원가입·비밀번호 재설정·인증 콜백·내 기록·질문 모달·필터 URL 등 현재 검색 제외 대상의 정책을 유지한다. 비로그인 접근 가능 여부와 검색 허용 여부를 혼동하지 않는다.
- canonical에는 운영 도메인의 대표 URL을 사용한다. 임시 query, 토큰, 사용자별 정보가 들어간 URL을 대표 주소로 사용하지 않는다.
- query에 따라 검색 정책이 달라지면 서버 `generateMetadata`에서 처리한다. 기존 허용된 유입 추적 query는 메인 canonical로 정규화하는 정책을 유지한다.
- `src/app/sitemap.ts`에는 검색 허용된 대표 URL만 포함한다. noindex·인증 콜백·API·query 변형 URL은 넣지 않는다.
- `robots.txt`로 noindex 페이지의 크롤링까지 막지 않는다. 검색 로봇이 HTML의 noindex를 읽을 수 있어야 한다. 현재 `/api/` 크롤링 제외 정책은 유지한다.

## 서비스 설명과 SNS 공유

- 설명은 현재 서비스인 직장·소비·관계·일상 질문, 선택과 이유, 투표 결과, 댓글·답글, 내 기록에 맞춘다. 예전 브리핑·날씨·주식 서비스 설명을 재사용하지 않는다.
- Open Graph와 Twitter Card에는 페이지 제목·설명과 외부에서 접근 가능한 절대 이미지 URL을 포함한다. 기본 공유 이미지는 로고가 포함된 `/brand/gwiteem-share.png`(1200×630)를 사용한다.
- 공유 이미지의 크기·타입·대체 설명을 유지한다. 별도 페이지 이미지는 실제 파일이 존재하는지 확인한다.
- 메타데이터를 브라우저 effect에서 뒤늦게 삽입하지 않는다. 공유 봇이 초기 HTML의 head에서 읽을 수 있도록 현재 설정을 유지한다.
- 메타데이터 생성을 위해 불필요한 API 호출을 추가하지 않는다. 동적 콘텐츠 조회가 필요한 경우 서버 전용 코드에서 처리한다.

## 검증

- `npm run lint`와 `npm run build`를 실행한다.
- 서버가 반환한 HTML에서 title, description, canonical, robots, OG, Twitter 메타태그가 올바르고 중복되지 않는지 확인한다.
- 메인·로그인은 index, 검색 제외 페이지는 noindex인지 확인한다. query 기반 화면은 해당 URL에 직접 접근해 검사한다.
- `sitemap.xml`의 URL과 검색 허용 대상이 일치하고 `robots.txt`의 사이트맵 주소가 올바른지 확인한다.
- 공유 이미지와 아이콘 URL이 정상 응답하고 올바른 이미지 형식·크기인지 확인한다.
- 메타데이터 적용을 위한 서버/client 분리 후 기존 페이지의 조회·입력·탐색 동작이 유지되는지 확인한다.
- 로컬 HTML 검증과 운영 배포 후 실제 SNS 미리보기 확인을 구분해서 보고한다.
