# NAS 빌드 결과물 전송

`.github/workflows/transfer-nas.yml`은 main push 또는 Actions의 Run workflow로 실행합니다.
대상: `hodo_admin@kimjihodo.synology.me:22`.
경로: `/volume1/docker/gwiteem/product/fe/<commit SHA>-<run ID>-<attempt>/`.

## GitHub 설정

각 저장소 Settings → Secrets and variables → Actions에서 New repository secret을 눌러 다음 항목 하나만 등록합니다.

- `NAS_SSH_PASSWORD`: NAS의 `hodo_admin` 계정 로그인 비밀번호.

Actions는 저장된 비밀번호를 sshpass의 환경변수로 읽습니다. 실행 중 비밀번호 입력창은 뜨지 않습니다.
`NAS_SSH_PRIVATE_KEY`, `NAS_KNOWN_HOSTS`, NAS 공개키 등록은 필요하지 않습니다. 비밀번호는 코드나 실행 입력값에 넣지 않습니다.

각 Actions 실행은 첫 SSH 접속에서 받은 호스트 키를 자동으로 신뢰하고 임시 known_hosts 파일에 저장합니다(`StrictHostKeyChecking=accept-new`). 같은 실행에서 이후 접속의 호스트 키가 달라지면 거부합니다. 새 실행마다 처음 받은 키를 신뢰하므로 최초 접속 대상의 신원을 사전에 검증하지는 않습니다.

NAS에서 SSH 비밀번호 인증이 허용되어야 하며 해당 계정에 대상 디렉터리 생성/쓰기 권한이 필요합니다.
SSH, SCP, sha256sum을 사용할 수 있어야 하며 외부 GitHub hosted runner에서 22번 포트에 연결할 수 있어야 합니다.
Synology 호환성을 위해 SCP의 기존 프로토콜(`-O`)을 사용합니다.

## 결과물과 완료 확인

- Node.js 22 / Linux x64에서 Next.js standalone 빌드를 생성합니다.
- `gwiteem-fe.tar.gz`: server.js, 필요한 node_modules, public, .next/static을 포함합니다.
- 환경변수 파일은 압축에서 제외합니다. 추후 실행 단계에서 서버용 `API_BASE_URL`을 설정합니다.
- standalone 구성 참고: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- SHA-256 파일도 함께 전송하고 NAS에서 검증한 뒤 `TRANSFER_COMPLETE` 파일을 생성합니다.
- 실패한 전송에는 완료 파일이 없습니다. 재실행은 별도 attempt 경로를 사용합니다.
- Actions 실행 요약에 검증 완료된 파일 경로를 기록합니다.
- 기존 결과물은 보존합니다. 보관 기간/삭제 정책은 별도입니다.

이번 단계에서는 압축 해제, Docker 이미지 로드, 컨테이너/서버 실행, 재시작, DB 마이그레이션을 하지 않습니다.
