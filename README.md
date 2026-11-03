# Gwiteem Frontend

**오늘, 당신의 선택은?** Gwiteem은 일상의 고민을 질문으로 만나고, 자신의 선택과 이유를 남긴 뒤 다른 사람들의 생각을 확인하는 서비스입니다.

직장·소비·관계·일상 네 가지 주제에서 가볍게 참여하고, 투표 결과와 댓글로 서로의 관점을 나눕니다. 이 저장소는 질문 탐색, 참여, 결과 확인, 댓글과 내 기록을 제공하는 Next.js 프론트엔드입니다.

## 서비스 경험

1. 오늘의 질문과 질문 목록에서 관심 있는 고민을 찾습니다.
2. 선택지와 해당 선택의 이유를 고르고 참여합니다.
3. 참여 후 선택지별 비율과 이유별 집계를 확인합니다. 기존 선택도 변경할 수 있습니다.
4. 댓글과 답글로 생각을 나누고, 마음에 드는 질문이나 댓글에 좋아요를 남깁니다.
5. 로그인하면 내 선택과 좋아요한 질문을 모아볼 수 있습니다.

비로그인 사용자도 질문·댓글을 조회하고 투표할 수 있습니다. 게스트 선택은 브라우저의 게스트 식별자로 구분하며, 로그인하면 계정의 선택 기록으로 병합합니다. 질문·댓글 좋아요와 댓글·답글 작성에는 로그인이 필요합니다.

## 주요 기능

- **질문 탐색**: 직장·소비·관계·일상 다중 카테고리 필터, 참여순·최신순·좋아요순 정렬
- **제목 검색**: 입력창 오른쪽 검색 아이콘 또는 Enter로 검색 실행. 입력만으로는 조회하지 않으며, X 버튼으로 입력값과 적용된 검색어 초기화
- **목록 더 보기**: 15개 단위 커서 페이지네이션, 하단 도달 시 추가 조회 및 실패 시 재시도
- **질문 상세**: 선택지·필수 이유 선택, 투표 결과, 선택 변경, 질문 링크 공유
- **댓글과 답글**: 댓글 최신순 20개씩 조회, 본인 글 수정·삭제, 한 단계 답글, 댓글 좋아요. 답글에는 좋아요가 없으며 원댓글 삭제 시 답글도 삭제
- **내 기록**: 참여한 질문과 좋아요한 질문을 각각 탐색
- **인증**: 이메일 가입·인증·로그인, 비밀번호 재설정, 카카오·네이버·Google 로그인 연동, 로그아웃·회원 탈퇴
- **반응형 UI**: 모바일과 데스크톱에서 질문 목록과 상세 모달 이용

## 기술 스택

- Next.js 16 App Router, React 19, TypeScript
- TanStack Query 5: 서버 상태·조회 캐시·mutation 관리
- Zod 4: API 응답 검증
- Tailwind CSS 4, CVA, clsx, tailwind-merge: 디자인 토큰과 컴포넌트 스타일
- Lucide React: 아이콘
- ESLint, Prettier 및 Tailwind CSS plugin

## 로컬 실행

```bash
npm install
```

저장소 루트에 `.env.local`을 만들고 실행 중인 백엔드 주소를 설정합니다.

```env
API_BASE_URL=http://localhost:8000
```

```bash
npm run dev
```

[로컬 화면](http://localhost:3000)을 엽니다. API 주소에는 `/api/v1`을 붙이지 않습니다. Next.js Route Handler가 백엔드 경로를 조립합니다. `NEXT_PUBLIC_API_BASE_URL`도 대체 설정으로 지원하지만, 서버 프록시용 `API_BASE_URL`을 우선 사용합니다.

질문·인증 기능은 실제 FastAPI와 연결됩니다. 백엔드 주소가 없을 때 자동으로 mock 서비스로 전환하지 않습니다. 소셜 로그인과 이메일 인증은 백엔드의 제공사 설정이 필요합니다.

## 주요 디렉터리

```text
src/
  app/
    (page)/
      (home)/
        page.tsx          # 질문 목록·내 기록·상세 모달 조립
        hooks/            # 질문·투표·좋아요·댓글 API hook, 검색 상태
        type/             # 질문·댓글 타입과 응답 스키마
      hooks/              # 공통 인증 세션 hook
      type/               # 공통 인증 타입과 스키마
      login/              # 로그인
      register/           # 회원가입
      password-reset/     # 비밀번호 재설정
    api/
      choices/            # 질문·투표·좋아요·댓글 백엔드 프록시
      auth/               # 인증 프록시와 쿠키 처리
    providers/            # QueryProvider 등 전역 provider
    globals.css           # 디자인 토큰과 공통 스타일
  components/
    domain/choices/       # 질문 카드·상세·댓글·검색·내 기록 UI
    domain/auth/          # 인증 UI와 AuthProvider
    layout/               # 헤더·푸터·프로필 메뉴
    ui/                   # Button·Skeleton·Toast 등 공통 UI
  lib/
    api/                  # HTTP client, 응답 검증, ApiError
    query-keys.ts         # TanStack Query key 관리
```

## 데이터와 상태 흐름

```text
화면 컴포넌트
  → 페이지 hooks의 useQuery / useMutation
  → lib/api/client.ts
  → Next.js /api/choices 또는 /api/auth
  → FastAPI /api/v1/choices 또는 /api/v1/auth
```

서버 데이터는 TanStack Query, 인증 사용자 정보는 `AuthProvider`, 검색 입력·탭·임시 작성 내용은 UI 상태로 관리합니다. 인증 토큰은 Next.js 서버의 HTTP-only 쿠키로 처리합니다. 게스트 식별자는 브라우저에 저장되며 인증 토큰과 구분합니다.

좋아요·투표는 해당 질문의 캐시를 갱신하고, 댓글 좋아요는 해당 댓글 상태를 반영합니다. 댓글 작성·수정·삭제는 해당 질문의 댓글을 다시 조회합니다. 백그라운드 갱신 중에는 기존 목록을 유지합니다.

## 검증

```bash
npm run lint
npm run build
npm run format:check
```

화면 확인 시 검색 아이콘·Enter·X 초기화, 로그인 여부에 따른 참여 권한, mutation 중 중복 클릭 방지, 오류 안내, 모바일 레이아웃을 점검합니다.

## 배포

```bash
npm run build
npm run start
```