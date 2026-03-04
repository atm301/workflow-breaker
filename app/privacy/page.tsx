import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私權政策 — WorkFlow Breaker",
};

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">隱私權政策 Privacy Policy</h1>
      <div className="prose prose-sm dark:prose-invert space-y-4 text-gray-700 dark:text-gray-300">
        <p>最後更新：2026 年 3 月</p>
        <h2 className="text-lg font-semibold mt-6">資料收集</h2>
        <p>本網站不要求使用者註冊或登入。我們不儲存您輸入的目標或工作流資料。所有 AI 分析皆即時處理，處理完畢後不保留任何內容。</p>
        <h2 className="text-lg font-semibold mt-6">Cookies 與追蹤</h2>
        <p>我們使用 Google Analytics 4 和 Meta Pixel 收集匿名瀏覽數據（頁面瀏覽量、停留時間等），以改善使用體驗。這些服務可能使用 Cookies。</p>
        <h2 className="text-lg font-semibold mt-6">Data Collection</h2>
        <p>This website does not require registration or login. We do not store your goal inputs or workflow data. All AI analysis is processed in real-time and not retained.</p>
        <h2 className="text-lg font-semibold mt-6">Cookies & Tracking</h2>
        <p>We use Google Analytics 4 and Meta Pixel to collect anonymous browsing data to improve user experience. These services may use cookies.</p>
        <div className="mt-8">
          <a href="/" className="text-brand-primary hover:underline">← 返回首頁 Back to Home</a>
        </div>
      </div>
    </div>
  );
}
