# Mock, 검증, 완료 정의

## Mock 개발 규칙

- 실제 API가 없을 때는 `app/api`의 Route Handler로 mock endpoint를 만든다.
- mock도 실제 예정 응답 envelope와 schema를 따른다.
- mock data는 컴포넌트 JSX 내부에 대량으로 작성하지 않는다.
- 인위적 지연은 공통 API client에서 development 환경에만 적용한다.
- mock 성공만 구현하지 말고 필요하면 오류 응답을 쉽게 재현할 수 있는 구조를 둔다.
- 실제 API처럼 보이는 가짜 투자 정보에는 mock 또는 예시임을 화면에 표시한다.

## 필수 검증

완료 전 최소한 다음 명령을 통과시킨다.

```bash
npm run lint
npm run build
```

UI 상호작용을 변경했다면 가능할 때 실제 브라우저에서 다음을 확인한다.

- 초기 loading 또는 Skeleton
- 성공 Toast와 실패 Toast
- mutation 버튼의 pending 및 중복 클릭 방지
- 로그인/비로그인 헤더 전환
- 모바일 overflow와 dropdown 위치
- 브라우저 console error 유무

검증이 실패하면 실패 사실을 숨기지 말고 원인과 남은 작업을 보고한다.

## 완료 정의

다음 조건이 모두 충족되어야 완료다.

- 요청한 사용자 흐름이 실제로 동작한다.
- 타입, lint, build가 통과한다.
- API 응답과 UI 상태가 연결되어 있다.
- loading/error/empty 상태가 필요한 위치에 존재한다.
- 공통 요소가 중복 구현되지 않았다.
- 임시 코드와 TODO가 실제 교체 지점을 설명한다.
- README 또는 지침에 영향을 주는 구조 변경은 문서에도 반영했다.
- 페이지를 추가·변경했다면 [SEO 검증 항목](09-page-seo.md#검증)을 통과하고 검색 노출 정책과 사이트맵의 일치 여부를 확인했다.

## 금지사항

- 컴포넌트에서 직접 API URL 호출
- API 응답을 검증 없이 `as`로 강제 변환
- pending 상태 없는 mutation 버튼
- 오류를 console에만 남기고 사용자에게 숨기기
- 거대한 페이지 컴포넌트에 모든 상태와 UI 몰아넣기
- 동일한 mock data를 여러 파일에 복사
- 이유 없는 dependency 추가
- `node_modules`, `.next`, 생성 파일 직접 수정
- 사용자 요청 없이 전체 디자인 또는 디렉터리 구조 재작성
- lint 오류를 disable 주석으로 덮기
- 검증하지 않고 "완료"라고 보고하기
