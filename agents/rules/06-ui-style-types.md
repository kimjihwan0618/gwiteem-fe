# 컴포넌트, 스타일, 타입 규칙

## 컴포넌트 파일 구조

- React 컴포넌트 폴더와 파일은 PascalCase로 작성한다. 예: `ToastProvider/ToastProvider.tsx`.
- 재사용 컴포넌트의 기본 구조는 `ComponentName/ComponentName.tsx`, `ComponentName/styles.ts`, `ComponentName/index.ts`이다.
- `styles.ts`가 필요 없는 로직 전용 Provider 또는 컴포넌트에는 빈 스타일 파일을 만들지 않는다.
- `index.ts`는 컴포넌트의 public export만 담당하고 구현 로직이나 스타일을 포함하지 않는다.
- 컴포넌트를 import할 때는 내부 파일이 아니라 폴더의 public entry를 사용한다. 예: `@/components/ui/Button`.

## 컴포넌트와 스타일 규칙

- 공통 Button, Card, Input, Badge, Skeleton, Toast를 우선 재사용한다.
- 같은 버튼 스타일을 페이지마다 복사하지 않는다.
- `Button`의 `isPending`, `loadingText`, `disabled` 계약을 유지한다.
- 색상과 간격은 현재 DARU navy/blue-gray 디자인 시스템을 따른다.
- Tailwind class가 지나치게 반복되면 공통 컴포넌트로 올린다.
- 임의의 inline style은 SVG 좌표나 동적 값처럼 Tailwind로 표현하기 어려운 경우에만 사용한다.
- 아이콘은 Lucide React를 우선 사용한다.
- 클릭 가능한 요소는 `button` 또는 `a`를 사용하고 키보드 focus를 제공한다.
- 아이콘만 있는 버튼에는 `aria-label`을 작성한다.
- 색상만으로 상태를 구분하지 않는다.
- 모바일을 나중에 보정하지 말고 기본 레이아웃부터 반응형으로 작성한다.

## 상태 전환 애니메이션

- loading 상태를 표시하는 Skeleton, spinner, loading text에는 사용자가 처리 중임을 인지할 수 있는 애니메이션을 적용한다.
- inactive 상태에서 active 또는 selected 상태로 전환되는 탭, 메뉴, 토글, 피드백 UI에는 색상만 즉시 바꾸지 말고 짧고 일관된 상태 전환 애니메이션을 적용한다.
- 탭이나 메뉴처럼 상호 배타적인 선택 UI는 가능하면 active 요소를 매번 새로 나타내는 fade 효과보다 하나의 underline 또는 pill indicator가 이전 항목에서 새 항목으로 이동하는 애니메이션을 사용한다.
- active 콘텐츠가 교체되는 경우 새 콘텐츠에도 짧은 진입 애니메이션을 적용한다.
- 애니메이션은 공통 유틸리티와 디자인 토큰을 우선 재사용하고, 과도한 이동이나 장시간 반복 효과는 피한다.
- `prefers-reduced-motion`에서도 처리 상태를 전달하는 loading 애니메이션과 선택 위치를 전달하는 active indicator 이동은 제거하지 않는다. 장식 목적의 큰 이동 효과만 개별적으로 최소화한다.

## 스타일 시스템 필수 규칙

- 디자인 토큰의 단일 진실 공급원은 `src/app/globals.css`의 Tailwind `@theme`이다.
- JSX 안에 `text-[#...]`, `bg-[#...]`, `border-[#...]` 같은 임의 색상 클래스를 추가하지 않는다.
- 새 색상이 필요하면 용도를 먼저 정의하고 `brand`, `surface`, `ink`, `muted`, `border`, `success`, `danger` 같은 의미 기반 토큰으로 등록한다.
- SVG 좌표, SVG stroke/fill, 런타임 계산값처럼 유틸리티로 표현하기 어려운 값만 inline style 또는 직접 색상값을 허용한다.
- variant 또는 size가 둘 이상인 공통 UI는 `class-variance-authority`의 `cva`와 `VariantProps`로 관리한다.
- 조건부 class와 외부 class 병합에는 `src/lib/cn.ts`의 `cn`을 사용한다. 문자열 직접 연결은 피한다.
- 페이지에서 반복되는 긴 class 묶음은 `components/ui` 또는 기능 내부의 작은 표현 컴포넌트로 올린다.
- class 순서는 수동으로 관리하지 않는다. 변경 후 `npm run format`으로 Prettier와 Tailwind plugin을 실행한다.
- 스타일 변경 완료 조건에는 `npm run format:check`, `npm run lint`, `npm run build` 통과가 포함된다.
- React 컴포넌트 파일에는 Tailwind class 문자열을 직접 작성하지 않는다.
- 컴포넌트별 정적 스타일은 같은 경로의 `컴포넌트명.styles.ts`에서 관리한다.
- 컴포넌트는 `styles.root`, `styles.title`처럼 역할이 드러나는 이름만 참조한다. `div1`, `text2` 같은 순번 기반 이름은 금지한다.
- 상태, variant, size에 따라 달라지는 스타일은 `*.styles.ts`의 CVA variant로 정의한다.
- `*.styles.ts`에는 렌더링, 이벤트, API 호출 같은 컴포넌트 로직을 넣지 않는다.
- 외부에서 전달받은 `className`을 병합해야 하는 공통 UI만 컴포넌트 내부에서 `cn(variant(...), className)`을 사용할 수 있다.

## TypeScript 규칙

- `any`, 무분별한 type assertion, `@ts-ignore`를 사용하지 않는다.
- API 타입을 수동으로 중복 작성하지 말고 Zod schema에서 추론한다.
- null 가능성을 타입에 드러내고 UI에서 fallback을 처리한다.
- 컴포넌트 props는 책임이 드러나는 이름을 사용한다.
- boolean prop은 `is`, `has`, `can`, `should` 접두사를 선호한다.
- 서버 전용 코드와 client 전용 코드를 구분하고 필요한 파일에만 `"use client"`를 선언한다.
