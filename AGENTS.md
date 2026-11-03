# DARU-FE Codex 지침

이 파일은 세부 규칙을 한곳에 모아 안내하는 include 문서다. Codex 및 자동화 에이전트는 작업 전에 아래 규칙 파일을 모두 읽고 적용한다.

## 규칙 파일

- [제품 맥락](agents/rules/01-product-context.md)
- [작업 원칙과 응답 방식](agents/rules/02-workflow.md)
- [기술 스택과 Next.js 주의사항](agents/rules/03-tech-stack.md)
- [프로젝트 구조](agents/rules/04-project-structure.md)
- [API, 상태, 인증 규칙](agents/rules/05-api-state-auth.md)
- [컴포넌트, 스타일, 타입 규칙](agents/rules/06-ui-style-types.md)
- [Mock, 검증, 완료 정의](agents/rules/07-validation.md)
- [개발 서버 유지 규칙](agents/rules/08-dev-server.md)
- [페이지 SEO와 메타데이터 규칙](agents/rules/09-page-seo.md)

## 우선순위

1. 사용자 요청을 가장 먼저 따른다.
2. 이 문서와 세부 규칙 파일을 따른다.
3. 기존 코드베이스의 패턴을 따른다.
4. 충돌이 있으면 더 좁고 최근에 추가된 규칙을 우선한다.
