import Script from "next/script";

export function GoogleAnalytics() {
  const measurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-PKNK0FCF19";

  if (
    process.env.NODE_ENV !== "production" ||
    !/^G-[A-Z0-9]+$/.test(measurementId)
  ) {
    return null;
  }

  return (
    <Script id="gwiteem-google-analytics" strategy="afterInteractive">
      {`
        if (["gwiteem.com", "www.gwiteem.com"].includes(window.location.hostname)) {
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');

          var analyticsScript = document.createElement('script');
          analyticsScript.async = true;
          analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
          document.head.appendChild(analyticsScript);
        }
      `}
    </Script>
  );
}
