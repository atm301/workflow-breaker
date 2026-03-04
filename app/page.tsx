"use client";

import { useState, useRef, useCallback } from "react";
import { t, type Lang } from "@/lib/i18n";
import type { WorkflowResult } from "@/lib/types";

type ViewMode = "list" | "flow";

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh");
  const [dark, setDark] = useState(false);
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const d = t(lang);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleGenerate = useCallback(async () => {
    if (!goal.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    setCheckedSteps(new Set());

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim(), context: context.trim(), lang }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "quota_exhausted") {
          setError(d.apiExhausted);
        } else if (data.error === "rate_limit") {
          setError(lang === "zh" ? "請求太頻繁，請稍後再試" : "Too many requests. Please try again later.");
        } else {
          setError(data.message || d.apiError);
        }
        return;
      }

      setResult(data.data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      // GA4 event
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        if (w.gtag) w.gtag("event", "generate_workflow", { event_category: "engagement", event_label: goal.trim().slice(0, 50) });
      } catch { /* ignore */ }
    } catch {
      setError(d.apiError);
    } finally {
      setLoading(false);
    }
  }, [goal, context, lang, loading, d]);

  const toggleStep = (id: string) => {
    setCheckedSteps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyMarkdown = () => {
    if (!result) return;
    let md = `# ${result.goal}\n\n`;
    result.phases.forEach((phase, pi) => {
      md += `## ${phase.name} (${phase.duration})\n\n`;
      phase.steps.forEach((step, si) => {
        md += `### ${pi + 1}.${si + 1} ${step.title}\n`;
        md += `- ${d.duration}: ${step.estimatedTime}\n`;
        md += `- ${d.deliverable}: ${step.deliverable}\n`;
        md += `- ${step.description}\n`;
        if (step.tips) md += `- 💡 ${step.tips}\n`;
        md += "\n";
      });
    });
    md += `**${d.totalTime}**: ${result.totalEstimatedTime}\n\n`;
    if (result.risks.length) {
      md += `## ${d.risks}\n`;
      result.risks.forEach(r => { md += `- ⚠️ ${r}\n`; });
    }
    navigator.clipboard.writeText(md).then(() => showToast(d.copied));
  };

  const shareLink = () => {
    const payload = JSON.stringify({ goal, context, lang });
    const encoded = btoa(unescape(encodeURIComponent(payload)));
    const url = `${window.location.origin}?q=${encoded}`;
    navigator.clipboard.writeText(url).then(() => showToast(d.linkCopied));
  };

  const handleExample = (exGoal: string) => {
    setGoal(exGoal);
    setResult(null);
    setError("");
  };

  // Restore from share link on mount
  useState(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(q))));
        if (decoded.goal) setGoal(decoded.goal);
        if (decoded.context) setContext(decoded.context);
        if (decoded.lang) setLang(decoded.lang);
      } catch { /* ignore */ }
    }
  });

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border-light bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔀</span>
            <span className="font-bold text-brand-primary">{d.siteTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setLang(lang === "zh" ? "en" : "zh"); setResult(null); }}
              className="px-2.5 py-1 text-sm rounded-full border border-border-light hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {lang === "zh" ? "EN" : "中文"}
            </button>
            <button
              onClick={toggleDark}
              className="px-2.5 py-1 text-sm rounded-full border border-border-light hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title={dark ? d.lightMode : d.darkMode}
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            {d.heroTitle}
          </h1>
          <p className="text-text-muted text-lg">{d.heroDesc}</p>
        </section>

        {/* Input */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-border-light p-6">
            <label className="block text-sm font-semibold mb-2 text-text-main dark:text-gray-200">
              🎯 {d.goalLabel}
            </label>
            <input
              type="text"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder={d.goalPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-border-light bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-text-main dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition mb-4 text-base"
              onKeyDown={e => { if (e.key === "Enter") handleGenerate(); }}
            />
            <label className="block text-sm font-semibold mb-2 text-text-main dark:text-gray-200">
              📝 {d.contextLabel}
            </label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder={d.contextPlaceholder}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-border-light bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-text-main dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition mb-4 text-base resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={!goal.trim() || loading}
              className="btn-gradient w-full py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {d.generating}
                </>
              ) : (
                <>{lang === "zh" ? "🚀" : "🚀"} {d.generateBtn}</>
              )}
            </button>
          </div>
        </section>

        {/* Examples */}
        {!result && !loading && (
          <section className="mb-8">
            <p className="text-sm text-text-muted mb-3 font-medium">💡 {d.tryExamples}</p>
            <div className="flex flex-wrap gap-2">
              {d.examples.map(ex => (
                <button
                  key={ex.title}
                  onClick={() => handleExample(ex.goal)}
                  className="px-3 py-2 rounded-full bg-white dark:bg-gray-800 border border-border-light hover:border-brand-primary hover:text-brand-primary transition-colors text-sm"
                >
                  {ex.icon} {ex.title}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Loading skeleton */}
        {loading && (
          <section className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </section>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <section ref={resultRef}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex rounded-lg overflow-hidden border border-border-light">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "list" ? "bg-brand-primary text-white" : "bg-white dark:bg-gray-800 hover:bg-gray-50"}`}
                >
                  📋 {d.listView}
                </button>
                <button
                  onClick={() => setViewMode("flow")}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === "flow" ? "bg-brand-primary text-white" : "bg-white dark:bg-gray-800 hover:bg-gray-50"}`}
                >
                  🔀 {d.flowView}
                </button>
              </div>
              <div className="flex gap-2 ml-auto">
                <button onClick={copyMarkdown} className="px-3 py-1.5 text-sm rounded-lg border border-border-light hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  📋 {d.copyMd}
                </button>
                <button onClick={shareLink} className="px-3 py-1.5 text-sm rounded-lg border border-border-light hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  🔗 {d.shareLink}
                </button>
              </div>
            </div>

            {/* Goal summary */}
            <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/20 rounded-2xl p-4 mb-6">
              <h2 className="font-bold text-lg text-text-main dark:text-gray-100 mb-1">🎯 {result.goal}</h2>
              <p className="text-sm text-text-muted">
                ⏱ {d.totalTime}: <span className="font-semibold text-brand-primary">{result.totalEstimatedTime}</span>
                {" · "}
                {result.phases.length} {d.phase}{lang === "en" ? "s" : ""}
                {" · "}
                {result.phases.reduce((s, p) => s + p.steps.length, 0)} {d.step}{lang === "en" ? "s" : ""}
              </p>
            </div>

            {/* List view */}
            {viewMode === "list" && (
              <div className="space-y-6">
                {result.phases.map((phase, pi) => (
                  <div key={pi} className="animate-fade-in-up" style={{ animationDelay: `${pi * 0.1}s` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {pi + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-text-main dark:text-gray-100">{phase.name}</h3>
                        <span className="text-xs text-text-muted">⏱ {phase.duration}</span>
                      </div>
                    </div>
                    <div className="ml-4 pl-6 border-l-2 border-brand-primary/20 space-y-3">
                      {phase.steps.map((step, si) => {
                        const stepId = `${pi}-${si}`;
                        const checked = checkedSteps.has(stepId);
                        return (
                          <div
                            key={si}
                            className={`bg-white dark:bg-gray-800 rounded-xl border border-border-light p-4 transition-all animate-fade-in-up ${checked ? "opacity-60" : ""}`}
                            style={{ animationDelay: `${(pi * 0.1) + (si * 0.05)}s` }}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleStep(stepId)}
                                className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${checked ? "bg-brand-primary border-brand-primary text-white" : "border-gray-300 dark:border-gray-600 hover:border-brand-primary"}`}
                              >
                                {checked && <span className="text-xs">✓</span>}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h4 className={`font-semibold text-sm ${checked ? "line-through" : ""}`}>
                                    {pi + 1}.{si + 1} {step.title}
                                  </h4>
                                  <span className="text-xs text-text-muted whitespace-nowrap bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                    ⏱ {step.estimatedTime}
                                  </span>
                                </div>
                                <p className="text-sm text-text-muted mb-2">{step.description}</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  {step.deliverable && (
                                    <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                      📦 {step.deliverable}
                                    </span>
                                  )}
                                  {step.dependencies?.length > 0 && (
                                    <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                      🔗 {d.depends}: {step.dependencies.join(", ")}
                                    </span>
                                  )}
                                </div>
                                {step.tips && (
                                  <p className="mt-2 text-xs text-brand-primary bg-brand-primary/5 rounded-lg px-3 py-1.5">
                                    💡 {step.tips}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Flow chart view */}
            {viewMode === "flow" && (
              <div className="flex flex-col items-center gap-2">
                {result.phases.map((phase, pi) => (
                  <div key={pi} className="w-full max-w-lg animate-fade-in-up" style={{ animationDelay: `${pi * 0.1}s` }}>
                    {/* Phase header node */}
                    <div className="flow-node bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl px-4 py-3 text-center shadow-md">
                      <div className="font-bold text-sm">{phase.name}</div>
                      <div className="text-xs opacity-80">⏱ {phase.duration}</div>
                    </div>
                    {/* Steps */}
                    {phase.steps.map((step, si) => (
                      <div key={si} className="flex flex-col items-center">
                        {/* Connector arrow */}
                        <div className="w-0.5 h-4 bg-brand-primary/30" />
                        <div className="text-brand-primary/40 text-xs">▼</div>
                        <div className="w-0.5 h-2 bg-brand-primary/30" />
                        {/* Step node */}
                        <div className="flow-node w-full bg-white dark:bg-gray-800 border border-border-light rounded-xl px-4 py-3 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm">{pi + 1}.{si + 1} {step.title}</span>
                            <span className="text-xs text-text-muted">⏱ {step.estimatedTime}</span>
                          </div>
                          <p className="text-xs text-text-muted">{step.description}</p>
                          {step.deliverable && (
                            <div className="mt-1 text-xs text-green-600 dark:text-green-400">📦 {step.deliverable}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {/* Connector between phases */}
                    {pi < result.phases.length - 1 && (
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-brand-primary/30" />
                        <div className="text-brand-primary text-sm">⬇️</div>
                        <div className="w-0.5 h-4 bg-brand-primary/30" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Critical path */}
            {result.criticalPath?.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <h3 className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-2">📌 {d.criticalPath}</h3>
                <div className="flex flex-wrap gap-2">
                  {result.criticalPath.map((cp, i) => (
                    <span key={i} className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full">
                      {cp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {result.risks?.length > 0 && (
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-300 mb-2">⚠️ {d.risks}</h3>
                <ul className="space-y-1">
                  {result.risks.map((risk, i) => (
                    <li key={i} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                      <span className="mt-1 text-xs">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-text-muted">
          <span>{d.footer}</span>
          <a href="/privacy" className="hover:text-brand-primary transition-colors">{d.privacy}</a>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg z-[100] animate-fade-in-up">
          {toast}
        </div>
      )}
    </div>
  );
}
