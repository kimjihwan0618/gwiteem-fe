# NAS 빌드 결과물 전송

`.github/workflows/transfer-nas.yml`은 main push 또는 Actions의 Run workflow로 실행합니다.
대상: `hodo_admin@kimjihodo.synology.me:22`.
실행 파일 경로: `/volume1/docker/gwiteem/product/fe/`.
해당 디렉터리를 Node.js 컨테이너에 마운트하면 `npm run start`로 프론트 서버를 실행할 수 있도록 준비합니다.
Actions는 빌드, 파일 전송, 체크섬 검증, 압축 해제와 파일 배치까지만 수행하며 서버를 실행하거나 재시작하지 않습니다.

## GitHub 설정

각 저장소 Settings → Secrets and variables → Actions에서 New repository secret을 눌러 다음 항목 하나만 등록합니다.

- `NAS_SSH_PASSWORD`: NAS의 `hodo_admin` 계정 로그인 비밀번호.

Actions는 저장된 비밀번호를 sshpass의 환경변수로 읽습니다. 실행 중 비밀번호 입력창은 뜨지 않습니다.
`NAS_SSH_PRIVATE_KEY`, `NAS_KNOWN_HOSTS`, NAS 공개키 등록은 필요하지 않습니다. 비밀번호는 코드나 실행 입력값에 넣지 않습니다.

각 Actions 실행은 첫 SSH 접속에서 받은 호스트 키를 자동으로 신뢰하고 임시 known_hosts 파일에 저장합니다(`StrictHostKeyChecking=accept-new`). 같은 실행에서 이후 접속의 호스트 키가 달라지면 거부합니다. 새 실행마다 처음 받은 키를 신뢰하므로 최초 접속 대상의 신원을 사전에 검증하지는 않습니다.

NAS에서 SSH 비밀번호 인증이 허용되어야 하며 해당 계정에 대상 디렉터리 생성/쓰기 권한이 필요합니다.
SSH, SCP, sha256sum, tar를 사용할 수 있어야 하며 외부 GitHub hosted runner에서 22번 포트에 연결할 수 있어야 합니다.
Synology 호환성을 위해 SCP의 기존 프로토콜(`-O`)을 사용합니다.

## 결과물과 완료 확인

- Node.js 22 / Linux x64에서 Next.js standalone 빌드를 생성합니다.
- `gwiteem-fe.tar.gz`: server.js, 실행용 package.json, 필요한 node_modules, public, .next/static을 포함합니다.
- 배포용 package.json의 start 명령은 `HOSTNAME=0.0.0.0 node server.js`입니다. 저장소의 개발용 package.json은 변경하지 않습니다.
- 환경변수 파일은 압축에서 제외합니다. 서버용 `API_BASE_URL`은 컨테이너 실행 환경변수로 설정합니다.
- standalone 구성 참고: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- 압축 파일과 SHA-256 파일은 `.transfers/<commit SHA>-<run ID>-<attempt>/`에 전송합니다.
- NAS에서 체크섬을 검증하고 `runtime/`에 압축을 해제한 뒤 필수 실행 파일을 확인합니다.
- 검증이 끝나면 실행 파일을 `fe/` 바로 아래에 배치하고 `TRANSFER_COMPLETE` 파일을 만듭니다.
- 교체 대상은 `.next`, `node_modules`, `public`, `server.js`, `package.json`, `TRANSFER_COMPLETE`입니다. 기존 파일은 이번 전송 디렉터리의 `previous/`에 보관합니다. 교체 도중 오류가 나면 기존 파일을 복구하도록 구성합니다.
- `fe/`의 기존 `.env`나 이 목록에 없는 파일, 이전 방식으로 생성된 실행별 디렉터리는 그대로 보존합니다.
- Actions 실행 요약에 실행 파일과 전송 기록의 경로를 기록합니다.
- 전송 압축과 백업은 자동 삭제하지 않습니다. 보관 기간/삭제 정책은 별도입니다.

완료 후 디렉터리 구조는 다음과 같습니다. `.next`와 `.transfers`는 숨김 디렉터리이므로 `ls -la`로 확인합니다.

```text
/volume1/docker/gwiteem/product/fe/
├── package.json
├── server.js
├── node_modules/
├── public/
├── .next/
├── TRANSFER_COMPLETE
└── .transfers/
    └── <commit SHA>-<run ID>-<attempt>/
        ├── gwiteem-fe.tar.gz
        ├── gwiteem-fe.tar.gz.sha256
        ├── runtime/
        └── previous/
```

`TRANSFER_COMPLETE`는 폴더가 아니라 배치 완료를 나타내는 파일입니다. 최신 전송의 성공 여부는 Actions 로그와 함께 확인합니다. 실패 후 복구되었다면 이전 버전의 완료 파일이 남아 있을 수 있습니다.

## 컨테이너 실행 시 설정

아래 설정은 사용자가 이후 컨테이너를 실행할 때 적용합니다. Actions에서 컨테이너를 생성하거나 실행하지 않습니다.

| 항목                 | 값                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------- |
| 이미지               | `node:22-bookworm-slim`                                                                   |
| 플랫폼               | Linux amd64 / x86_64                                                                      |
| NAS 마운트 경로      | `/volume1/docker/gwiteem/product/fe`                                                      |
| 컨테이너 마운트 경로 | `/app`                                                                                    |
| 작업 디렉터리        | `/app`                                                                                    |
| 실행 명령            | `npm run start`                                                                           |
| 컨테이너 포트        | `3000`                                                                                    |
| 환경변수             | `NODE_ENV=production`, `PORT=3000`, `API_BASE_URL=<컨테이너에서 접근 가능한 백엔드 주소>` |

빌드에 포함된 네이티브 의존성이 Linux x64 기준이므로 Debian 계열의 위 이미지와 같은 플랫폼을 사용합니다. Alpine이나 ARM 컨테이너용 결과물은 별도 빌드가 필요합니다.

NAS에서 사용할 외부 포트를 컨테이너의 `3000`에 연결하세요. `API_BASE_URL`에는 실제 백엔드 주소를 넣어야 하며, 컨테이너 안의 `localhost`는 그 프론트 컨테이너 자신을 가리킵니다. 로그인과 백엔드 API 요청에는 실행 중인 백엔드가 필요합니다.

실행에 필요한 node_modules를 포함하므로 컨테이너에서 `npm install`이나 `npm run build`를 다시 실행할 필요가 없습니다. 마운트는 Next.js 캐시를 쓸 수 있도록 쓰기 가능하게 설정합니다. 컨테이너 사용자를 별도로 지정한다면 NAS 마운트 디렉터리의 읽기/탐색 권한과 `.next` 캐시 쓰기 권한을 확인하세요.

이미 실행 중인 컨테이너가 있다면 파일 배치가 끝난 뒤 사용자가 재시작해야 새 빌드가 적용됩니다. 파일 교체 중 서비스 무중단 운영은 보장하지 않습니다. 이번 단계에서는 Docker 이미지 로드, 컨테이너/서버 실행, 재시작, DB 마이그레이션을 하지 않습니다.
