import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

// 원본 빌드와 개발용 package.json은 유지하고 NAS용 실행 디렉터리를 만듭니다.
const destination = process.argv[2];
if (!destination) throw new Error("배포 패키지 경로가 필요합니다.");
if (existsSync(destination))
  throw new Error("새 배포 패키지 경로를 사용해야 합니다.");

const standalone = path.resolve(".next/standalone");
for (const entry of [
  "server.js",
  "package.json",
  "node_modules",
  ".next/BUILD_ID",
]) {
  if (!existsSync(path.join(standalone, entry))) {
    throw new Error(
      `standalone 빌드에 ${entry} 파일 또는 디렉터리가 없습니다.`,
    );
  }
}

mkdirSync(destination, { recursive: true });
cpSync(standalone, destination, {
  recursive: true,
  filter: (source) => !path.basename(source).startsWith(".env"),
});
cpSync(".next/static", path.join(destination, ".next/static"), {
  recursive: true,
});
mkdirSync(path.join(destination, "public"), { recursive: true });
if (existsSync("public")) {
  cpSync("public", path.join(destination, "public"), { recursive: true });
}

const manifestPath = path.join(destination, "package.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
// Linux 컨테이너에서 외부 포트 연결을 받을 수 있도록 모든 인터페이스에 바인딩합니다.
manifest.scripts = { start: "HOSTNAME=0.0.0.0 PORT=6812 node server.js" };
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
