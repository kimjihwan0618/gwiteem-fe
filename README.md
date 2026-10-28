# Gwiteem Frontend

출근 경로, 날씨, 관심 산업과 종목의 변화를 하나의 **3분 개인화 아침 브리핑**으로 제공하는 Next.js 프론트엔드입니다.

## 기술 스택

- Next.js 16 App Router + React 19
- TypeScript
- Tailwind CSS 4
- Tailwind `@theme`: 색상, 테두리, 반경, 그림자 디자인 토큰
- CVA: 공통 UI variant 관리
- clsx + tailwind-merge: 조건부 class와 Tailwind 충돌 병합
- Prettier + Tailwind CSS plugin: 코드 및 class 순서 자동 정렬
- Colocated `*.styles.ts`: JSX와 Tailwind/CVA 스타일 정의 분리
- PascalCase component folders: `Button/Button.tsx + styles.ts + index.ts`
- TanStack Query: 서버 상태, 캐시, 재시도 정책
- Zod: FastAPI 응답 런타임 검증
- Lucide React: 일관된 아이콘 시스템
- 공통 API Client: 응답 envelope 검증 및 `ApiError` 표준화
- Toast Provider: API 성공·실패 메시지 전역 표시
- ESLint + Next.js 권장 규칙

전역 클라이언트 상태 라이브러리는 현재 MVP에 필요하지 않아 제외했습니다. 사용자 인증이 추가되면 서버 세션을 기준으로 설계하고, 화면 전용 상태는 컴포넌트에 가깝게 유지합니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## FastAPI 연결

`.env.example`을 `.env.local`로 복사하고 백엔드 주소를 설정합니다.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

프론트는 `GET /api/briefing`을 호출하며, 응답은 `src/lib/briefing.ts`의 Zod 스키마를 통과해야 합니다. 환경 변수가 비어 있으면 데모를 위한 Next.js Route Handler가 사용됩니다.

## 구현된 사용자 흐름

- 비회원의 오늘 브리핑 즉시 체험
- 출발 권장 시각, 교통 지연, 날씨 확인
- 중복 뉴스를 이슈 단위로 탐색
- 관심 종목과 관련 이슈 연결
- 3단계 브리핑 재생과 근거 확인
- 저장, 공유, 유용성 피드백
- 로그인 후 개인 브리핑 전환 CTA
- 모바일/태블릿/데스크톱 반응형 레이아웃

## 주요 디렉터리

```text
src/
  app/
    (home)/
      page.tsx             # Next.js 예약 라우트 파일
      store.ts             # 홈 페이지 UI 상태
    api/briefing/route.ts  # 개발용 mock API
    login/
      page.tsx             # 로그인 페이지
      store.ts             # 로그인 페이지 UI 상태
      styles.ts            # 로그인 페이지 스타일
    layout.tsx
  components/
    layout/
      AppHeader/
        AppHeader.tsx
        styles.ts
        index.ts
    ui/
      Button/
        Button.tsx
        styles.ts
        index.ts
    QueryProvider/
      QueryProvider.tsx
      index.ts
  features/
    auth/                  # 로그인 폼과 인증 UI
    briefing/              # 브리핑 모델, API, 기능별 카드
    notification/          # 알림 모델과 더미 데이터
  lib/cn.ts                # 공통 className 유틸리티
  lib/api/                 # HTTP client, ApiResponse, ApiError
  lib/query-keys.ts        # React Query key factory
```

## 구조 원칙

- `app`: 라우팅과 페이지 조립만 담당
- `components/ui`: 도메인과 무관한 공통 디자인 컴포넌트
- `components/layout`: 여러 페이지에서 공유하는 레이아웃
- `features`: 인증, 브리핑처럼 기능 단위로 모델·API·UI를 함께 배치
- `lib`: 전역에서 재사용하는 작은 유틸리티만 배치

## API 호출 흐름

```text
Component
  → feature/hooks (useQuery, useMutation)
  → feature/api
  → lib/api/client
  → FastAPI 또는 Next.js mock route
```

API 응답은 아래 envelope 형식을 사용합니다.

```json
{
  "success": true,
  "data": {},
  "message": "처리되었습니다.",
  "code": "OPTIONAL_CODE"
}
```

- mutation 응답의 `message`는 Toast로 표시합니다.
- 공통 `Button`은 `isPending`과 `loadingText`를 지원합니다.
- 최초 조회 중에는 `DashboardSkeleton`을 표시합니다.
- 개발 환경의 모든 API 요청은 `lib/api/client.ts`에서 1초 지연되어 pending UI를 확인할 수 있습니다.

현재 연결된 mock mutation:

- 이메일 로그인, 카카오·네이버·Google 로그인
- 브리핑 시작
- 브리핑 저장 및 저장 취소
- 브리핑 유용성 피드백
- 브리핑 공유 기록

헤더는 `AuthProvider`의 사용자 상태를 기준으로 렌더링됩니다.

- 비로그인: 로그인 버튼만 표시
- 로그인: 더미 알림 목록과 프로필 메뉴 표시
- 프로필 이미지 URL 존재: 이미지 표시
- 프로필 이미지 없음: 사용자 이름의 첫 글자 표시

# 질문별 댓글

각 댓글에서 답글을 펼치거나 작성할 수 있습니다. 답글은 한 단계만 지원하며 좋아요는 없고,
본인이 작성한 답글만 수정·삭제할 수 있습니다. 원댓글 삭제 시 답글도 함께 삭제됩니다.
대댓글 기능 사용 전 백엔드 마이그레이션 `87af8eca06fd`를 적용하세요.

질문 카드의 댓글 버튼으로 상세 댓글 탭을 바로 열 수 있습니다. 댓글 조회는 공개이며
로그인 후 작성·좋아요, 본인 댓글 수정·삭제를 지원합니다. 최신순 20개씩 더 불러오며
댓글 변경 후 카드와 탭의 댓글 수를 갱신합니다. 댓글 내용은 공백 제거 후 1~1,000자입니다.

프론트 API는 `/api/choices/questions/[questionId]/comments`에서 FastAPI로 프록시합니다.
백엔드 배포 전에 `alembic upgrade head`로 댓글 마이그레이션 `1c159ec384dd`를 적용하세요.
