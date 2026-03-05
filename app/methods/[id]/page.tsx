import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { METHODS_DATA } from "@/lib/methods-data";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  return METHODS_DATA.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const method = METHODS_DATA.find((m) => m.id === id);
  if (!method) return {};
  return {
    title: `${method.nameZh} 完整教學 — WorkFlow Breaker`,
    description: `${method.nameZh}（${method.nameEn}）的原理、步驟、案例與實戰教學。${method.tagline.zh}`,
    openGraph: {
      title: `${method.nameZh} 完整教學`,
      description: method.tagline.zh,
    },
  };
}

export default async function MethodDetail({ params }: { params: Params }) {
  const { id } = await params;
  const method = METHODS_DATA.find((m) => m.id === id);
  if (!method) notFound();

  const others = METHODS_DATA.filter((m) => m.id !== id);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-border-light dark:border-gray-700 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-brand-primary font-black hover:opacity-80 transition-opacity">
            <span className="text-xl">&#9889;</span> WorkFlow Breaker
          </Link>
          <Link href="/methods" className="text-sm font-bold text-text-muted hover:text-brand-primary transition-colors">
            &#8592; All Methods
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        {/* Hero */}
        <div className={`bg-gradient-to-r ${method.gradient} rounded-2xl p-8 md:p-12 text-white mb-10 relative overflow-hidden`}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="text-sm font-bold text-white/70 mb-2">{method.nameEn}</div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">{method.nameZh}</h1>
            <p className="text-lg text-white/90 italic">{method.tagline.zh}</p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Origin */}
          <Section title="起源與背景" anchor="origin">
            <p className="text-text-muted leading-relaxed">{method.origin.zh}</p>
          </Section>

          {/* Definition */}
          <Section title="什麼是？" anchor="definition">
            <p className="text-text-muted leading-relaxed">{method.definition.zh}</p>
            <div className="mt-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4">
              <p className="text-sm font-bold text-brand-primary">核心概念</p>
              <p className="text-sm text-text-main dark:text-gray-200 mt-1 leading-relaxed">{method.coreIdea.zh}</p>
            </div>
          </Section>

          {/* Best For / Not For */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="最適合" anchor="best-for">
              <ul className="space-y-2">
                {method.bestFor.zh.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="text-green-500 mt-0.5 font-bold">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="不適合" anchor="not-for">
              <ul className="space-y-2">
                {method.notFor.zh.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                    <span className="text-red-500 mt-0.5 font-bold">&#10007;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {/* Steps */}
          <Section title="操作步驟" anchor="steps">
            <div className="space-y-4">
              {method.steps.zh.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br ${method.gradient} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-text-muted pt-1.5 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Key Principles */}
          <Section title="核心金律" anchor="principles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {method.keyPrinciples.zh.map((principle, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-xl p-4">
                  <p className="text-sm text-text-main dark:text-gray-200 font-medium leading-relaxed">{principle}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Cases */}
          <Section title="實戰案例" anchor="cases">
            <div className="space-y-4">
              {method.cases.zh.map((c, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-xl p-5">
                  <h4 className="font-black text-text-main dark:text-gray-100 mb-2">{c.title}</h4>
                  <p className="text-sm text-text-muted leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* vs Others */}
          <Section title="與其他方法的比較" anchor="comparison">
            <p className="text-text-muted leading-relaxed">{method.comparison.zh}</p>
          </Section>

          {/* CTA: Try it */}
          <div className={`bg-gradient-to-r ${method.gradient} rounded-2xl p-8 text-white text-center`}>
            <h3 className="text-2xl font-black mb-3">用 {method.nameZh} 拆解你的目標</h3>
            <p className="text-white/80 mb-6">AI 會自動套用此策略，為你生成結構化工作流程。</p>
            <Link
              href={`/?strategy=${method.strategy}`}
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-xl font-black hover:bg-gray-50 transition-all shadow-lg"
            >
              立即使用 {method.nameZh} &rarr;
            </Link>
          </div>

          {/* Other methods */}
          <section>
            <h2 className="text-xl font-black text-text-main dark:text-gray-100 mb-4">探索其他方法</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {others.map((m) => (
                <Link
                  key={m.id}
                  href={`/methods/${m.id}`}
                  className="bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:border-brand-primary transition-all group"
                >
                  <div className={`w-10 h-10 ${m.color} text-white rounded-lg flex items-center justify-center mb-3 text-lg font-black group-hover:scale-110 transition-transform`}>
                    {m.id === "wbs" && "W"}
                    {m.id === "user-story" && "U"}
                    {m.id === "sipoc" && "S"}
                    {m.id === "5w1h" && "?"}
                  </div>
                  <h4 className="font-bold text-sm text-text-main dark:text-gray-100">{m.nameZh}</h4>
                  <p className="text-[11px] text-text-muted mt-1">{m.tagline.zh}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-border-light dark:border-gray-700 py-6 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-text-muted">
          &copy; 2026 WorkFlow Breaker — Free AI Tool
        </div>
      </footer>
    </div>
  );
}

function Section({ title, anchor, children }: { title: string; anchor: string; children: React.ReactNode }) {
  return (
    <section id={anchor}>
      <h2 className="text-xl font-black text-text-main dark:text-gray-100 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-brand-primary rounded-full" />
        {title}
      </h2>
      {children}
    </section>
  );
}
