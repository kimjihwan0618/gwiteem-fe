import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 공유 봇마다 HTML 처리 방식이 달라 메타데이터를 초기 head에 포함한다.
  // 메타데이터 생성은 외부 API 호출 없이 수행한다.
  htmlLimitedBots: /.*/,
  allowedDevOrigins: ["192.168.250.14"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ssl.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },
    ],
  },
};

export default nextConfig;
