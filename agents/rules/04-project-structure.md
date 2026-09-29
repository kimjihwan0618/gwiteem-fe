# 프로젝트 구조

## 디렉터리 책임

```text
src/
  app/                         # Next.js route, layout, Route Handler
    providers/                 # Root layout에서 앱을 감싸는 전역 provider
    (page)/                    # 화면 페이지 route group. URL에는 포함되지 않음
      hooks/                   # 여러 페이지가 공유하는 page-level hook
      type/                    # 여러 페이지가 공유하는 page-level type/schema
      <page>/
        page.tsx               # 페이지 엔트리
        hooks/                 # 해당 페이지에서 호출하는 API hook 및 page hook
          index.ts
        store/                 # 해당 페이지에서만 쓰는 UI/client state slice
          index.ts
          <service>-slice.ts
        type/                  # 해당 페이지에서 쓰는 type/schema
          index.ts
        styles.ts              # 페이지 전용 스타일이 있을 때만 작성
    api/                       # Route Handler. 서버 API 연동과 서버 전용 유틸 포함
      <domain>/
        route.ts
        _lib/                  # 해당 API route domain의 서버 전용 helper
  components/
    ui/                        # 도메인과 무관한 공통 UI
    layout/                    # Header, Footer 등 공통 레이아웃
    domain/                    # 도메인별 컴포넌트
      auth/
      briefing/
  lib/
    api/                       # 공통 HTTP client와 응답 규약
    query-keys.ts              # Query Key Factory
```

## app 페이지 폴더 규칙

- 화면 페이지는 `src/app/(page)` 아래에 둔다.
- `(page)`는 Next.js route group이므로 URL path에 포함되지 않는다. 예: `src/app/(page)/login/page.tsx`는 `/login`이다.
- 페이지 폴더는 기본적으로 `page.tsx`, `hooks/`, `store/`, `type/`, `styles.ts`로 구성한다.
- `hooks/`에는 해당 페이지에서 실행하는 API 호출 함수와 React Query hook을 함께 둔다.
- `type/`에는 해당 페이지에서 쓰는 타입, Zod schema, 페이지 전용 상수를 둔다.
- 여러 페이지가 공유하는 인증 세션 hook/type처럼 page 영역 공통 책임은 `src/app/(page)/hooks`와 `src/app/(page)/type`에 둔다.
- `store/`는 서버 상태를 복제하지 않는다. 선택 UI, 모달, 임시 입력처럼 페이지 UI 상태만 관리한다.
- Next.js 예약 파일인 `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`는 소문자 규칙을 따른다.

## Provider 규칙

- `QueryProvider`처럼 앱 전체를 감싸는 provider는 `components`가 아니라 `src/app/providers`에 둔다.
- 도메인 상태를 제공하는 provider는 성격에 따라 도메인 컴포넌트 아래에 둘 수 있다. 예: `components/domain/auth/AuthProvider`.
- provider는 `src/app/layout.tsx`에서 조립하고, 일반 UI 컴포넌트와 섞지 않는다.

## API 규칙

- 클라이언트에서 호출하는 API 함수는 별도 `src/api`에 두지 않고, 호출하는 페이지의 `hooks/index.ts` 안에 둔다.
- Route Handler는 `src/app/api` 아래에 둔다.
- Route Handler 전용 서버 helper는 해당 API domain 아래 `_lib/`에 둔다. 예: `src/app/api/auth/_lib/server.ts`.
- API route에서만 쓰는 로직은 페이지 컴포넌트나 `components`로 올리지 않는다.

## 컴포넌트 배치 규칙

- `components/ui`는 비즈니스 도메인과 API를 알면 안 된다.
- `components/layout`은 여러 페이지가 공유하는 레이아웃 컴포넌트만 둔다.
- 도메인 컴포넌트는 `components/domain/<domain>`으로 나눈다. 예: `components/domain/auth`, `components/domain/briefing`.
- 특정 페이지에서만 쓰는 작은 조립 컴포넌트는 페이지 폴더 안에 둘 수 있다.
- 여러 페이지나 도메인에서 재사용되기 시작하면 `components/domain/<domain>` 또는 `components/ui`로 올린다.

## 금지 구조

- `src/features`는 사용하지 않는다.
- `src/api`는 사용하지 않는다. 페이지 API 호출은 page `hooks/`로 옮긴다.
- `src/models`는 사용하지 않는다. 타입/schema는 page `type/` 또는 API route domain 내부에 둔다.
- 앱 전역 provider를 `src/components` 바로 아래에 두지 않는다. `src/app/providers`로 분리한다.
- 컴포넌트 파일에 Tailwind class 문자열을 직접 길게 쓰지 않는다. 같은 폴더의 `styles.ts`로 분리한다.
