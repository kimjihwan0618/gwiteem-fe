#!/bin/sh
set -eu

# 파일 배치만 수행합니다. 컨테이너나 Node.js 프로세스를 실행하지 않습니다.
cd "$1"
destination="$(pwd -P)"
transfer="$destination/.transfers/$2"
archive="$3"
case "$2" in ''|*[!a-zA-Z0-9-]*) exit 1 ;; esac
case "$archive" in gwiteem-fe.tar.gz) ;; *) exit 1 ;; esac

cd "$transfer"
sha256sum -c "$archive.sha256"
mkdir runtime
tar -xzf "$archive" -C runtime
test -f runtime/server.js
test -f runtime/package.json
test -f runtime/.next/BUILD_ID
test -d runtime/.next/static
test -d runtime/node_modules/next
test -d runtime/public
printf '%s\n' "$2" > runtime/TRANSFER_COMPLETE
mkdir previous

# 교체 도중 실패하면 옮긴 파일을 되돌립니다. 루트의 .env 등은 교체 대상이 아닙니다.
installed=""
saved=""
restore() {
  result=$?
  trap - 0 HUP INT TERM
  set +e
  for entry in $installed; do
    mv "$destination/$entry" "$transfer/runtime/$entry"
  done
  for entry in $saved; do
    mv "$transfer/previous/$entry" "$destination/$entry"
  done
  exit "$result"
}
trap restore 0
trap 'exit 1' HUP INT TERM
for entry in .next node_modules public server.js package.json TRANSFER_COMPLETE; do
  if [ -e "$destination/$entry" ] || [ -L "$destination/$entry" ]; then
    mv "$destination/$entry" "$transfer/previous/$entry"
    saved="$entry $saved"
  fi
  mv "$transfer/runtime/$entry" "$destination/$entry"
  installed="$entry $installed"
done
trap - 0 HUP INT TERM
printf 'Runtime files ready: %s\n' "$destination"
