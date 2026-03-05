import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { CookieConsent } from "./CookieConsent";
import { ClientWrapper } from "./ClientWrapper";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-RDJD1YVHR7";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "4979950938896019";

export const metadata: Metadata = {
  title: "WorkFlow Breaker — AI 工作流拆解器",
  description: "輸入你的目標，AI 幫你拆解成可執行的工作流程步驟。Break big goals into actionable steps.",
  keywords: ["工作流拆解", "workflow breakdown", "AI 任務規劃", "project planning", "task decomposition"],
  openGraph: {
    title: "WorkFlow Breaker — AI 工作流拆解器",
    description: "輸入你的目標，AI 幫你拆解成可執行的工作流程步驟",
    url: "https://workflow.atmarketing.tw",
    siteName: "WorkFlow Breaker",
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "WorkFlow Breaker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkFlow Breaker — AI 工作流拆解器",
    description: "輸入你的目標，AI 幫你拆解成可執行的工作流程步驟",
    images: ["/api/og"],
  },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  metadataBase: new URL("https://workflow.atmarketing.tw"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}');
        `}</Script>
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366F1" />
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
          }
        `}</Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "WorkFlow Breaker",
              description: "AI-powered workflow decomposition tool",
              url: "https://workflow.atmarketing.tw",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "TWD" },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-surface dark:bg-surface-dark antialiased">
        <ClientWrapper>{children}</ClientWrapper>
        <CookieConsent />
      </body>
    </html>
  );
}
