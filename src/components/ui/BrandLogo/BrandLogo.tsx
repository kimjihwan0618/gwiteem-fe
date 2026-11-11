import Image from "next/image";
import { brandLogoStyles } from "./styles";

export function BrandLogo() {
  return (
    <Image
      src="/brand/gwiteem-wordmark-ko.png"
      alt="귀뜸"
      width={1776}
      height={888}
      className={brandLogoStyles.image}
      preload
    />
  );
}
