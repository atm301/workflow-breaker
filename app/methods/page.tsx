import type { Metadata } from "next";
import Link from "next/link";
import { METHODS_DATA } from "@/lib/methods-data";

export const metadata: Metadata = {
  title: "工作流拆解方法全集 — WorkFlow Breaker",
  description: "WBS、User Story Map、SIPOC、5W1H 四大工作流拆解方法的完整教學，含原理、步驟、案例與比較。",
  openGraph: {
    title: "工作流拆解方法全集 — WorkFlow Breaker",
    description: "WBS、User Story Map、SIPOC、5W1H 四大方法完整教學",
  },
};

export default function MethodsIndex() {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-border-light dark:border-gray-700 px-4 md:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-brand-primary font-black hover:opacity-80 transition-opacity">
            <span className="text-xl">&#9889;</span> WorkFlow Breaker
          </Link>
          <Link href="/" className="text-sm font-bold text-text-muted hover:text-brand-primary transition-colors">
            &#8592; Back to Tool
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        {/* Hero */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-gray-100 mb-4">
            工作流拆解方法全集
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            四種經典工作流拆解方法的完整教學 — 從原理到實戰案例。
            <br />選對方法，事半功倍。
          </p>
        </section>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-text-main dark:text-gray-100 mb-4">一張表看懂四大方法</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border-light dark:border-gray-700 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3 font-black text-text-main dark:text-gray-200">方法</th>
                  <th className="text-left p-3 font-black text-text-main dark:text-gray-200">核心問題</th>
                  <th className="text-left p-3 font-black text-text-main dark:text-gray-200">最適合</th>
                  <th className="text-left p-3 font-black text-text-main dark:text-gray-200">視角</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-gray-700">
                <tr className="bg-white dark:bg-gray-900">
                  <td className="p-3 font-bold text-indigo-600">WBS</td>
                  <td className="p-3 text-text-muted">要交付什麼？</td>
                  <td className="p-3 text-text-muted">工程/大型專案</td>
                  <td className="p-3 text-text-muted">產出物導向</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="p-3 font-bold text-violet-600">User Story</td>
                  <td className="p-3 text-text-muted">對使用者有什麼價值？</td>
                  <td className="p-3 text-text-muted">軟體/產品開發</td>
                  <td className="p-3 text-text-muted">使用者導向</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="p-3 font-bold text-emerald-600">SIPOC</td>
                  <td className="p-3 text-text-muted">流程的全貌是什麼？</td>
                  <td className="p-3 text-text-muted">流程優化/供應鏈</td>
                  <td className="p-3 text-text-muted">流程導向</td>
                </tr>
                <tr className="bg-white dark:bg-gray-900">
                  <td className="p-3 font-bold text-blue-600">5W1H</td>
                  <td className="p-3 text-text-muted">這件事的全貌？</td>
                  <td className="p-3 text-text-muted">任務釐清/企劃</td>
                  <td className="p-3 text-text-muted">全面掃描</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Method Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {METHODS_DATA.map((method) => (
            <Link
              key={method.id}
              href={`/methods/${method.id}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-border-light dark:border-gray-700 p-6 md:p-8 hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 ${method.color} text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform text-2xl font-black`}>
                {method.id === "wbs" && "W"}
                {method.id === "user-story" && "U"}
                {method.id === "sipoc" && "S"}
                {method.id === "5w1h" && "?"}
              </div>
              <h3 className="text-xl font-black text-text-main dark:text-gray-100 mb-2">{method.nameZh}</h3>
              <p className="text-sm text-text-muted mb-1 font-medium">{method.nameEn}</p>
              <p className="text-sm text-text-muted leading-relaxed mb-4 italic">{method.tagline.zh}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {method.bestFor.zh.slice(0, 3).map((item, i) => (
                  <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-text-muted px-2 py-0.5 rounded-full font-bold">{item}</span>
                ))}
              </div>
              <span className="text-sm font-bold text-brand-primary group-hover:underline">
                閱讀完整教學 &rarr;
              </span>
            </Link>
          ))}
        </section>

        {/* Decision Guide */}
        <section className="bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl p-8 md:p-10 text-white mb-12">
          <h2 className="text-2xl font-black mb-4">不知道選哪個？</h2>
          <div className="space-y-3 text-white/90">
            <p>&#10148; 你在做一個<strong>有明確產出物</strong>的專案（蓋房子、辦活動）&#8594; <strong>WBS</strong></p>
            <p>&#10148; 你在開發<strong>軟體或產品</strong>，需要理解使用者需求 &#8594; <strong>User Story</strong></p>
            <p>&#10148; 你想<strong>改善現有流程</strong>的效率或品質 &#8594; <strong>SIPOC</strong></p>
            <p>&#10148; 你剛接到一個<strong>新任務</strong>，需要快速釐清全貌 &#8594; <strong>5W1H</strong></p>
            <p>&#10148; 你不確定 &#8594; 選<strong>「AI 智能判斷」</strong>，讓 AI 幫你選！</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-xl font-black mt-6 hover:bg-gray-50 transition-all">
            開始拆解 &rarr;
          </Link>
        </section>
      </main>

      <footer className="border-t border-border-light dark:border-gray-700 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-text-muted">
          &copy; 2026 WorkFlow Breaker — Free AI Tool
        </div>
      </footer>
    </div>
  );
}
