"use client";

import { useState, useRef, useCallback } from "react";
import { t, type Lang, type Strategy } from "@/lib/i18n";
import type { WorkflowResult } from "@/lib/types";
import {
  Zap, Globe, Target, FileText, Sparkles, Layers, Users, Factory, HelpCircle,
  Settings, Loader2, CheckCircle2, ChevronRight, Copy, Check, Trash2,
  AlertCircle, BookOpen, LayoutDashboard, Lightbulb, MousePointerClick,
  BrainCircuit, Sun, Moon, Share2, List, GitBranch,
} from "lucide-react";

type ViewMode = "list" | "flow";
type ActiveView = "generator" | "tutorial";

const STRATEGIES: { id: Strategy; icon: typeof Sparkles; color: string; activeColor: string; tagKey: string }[] = [
  { id: "auto", icon: Sparkles, color: "bg-gradient-to-br from-yellow-400 to-orange-500", activeColor: "border-yellow-400 bg-yellow-50/50", tagKey: "tagAuto" },
  { id: "wbs", icon: Layers, color: "bg-indigo-600", activeColor: "border-indigo-600 bg-indigo-50/50", tagKey: "tagWBS" },
  { id: "userStory", icon: Users, color: "bg-violet-600", activeColor: "border-violet-600 bg-violet-50/50", tagKey: "tagUserStory" },
  { id: "sipoc", icon: Factory, color: "bg-emerald-600", activeColor: "border-emerald-600 bg-emerald-50/50", tagKey: "tagSIPOC" },
  { id: "fiveW", icon: HelpCircle, color: "bg-blue-600", activeColor: "border-blue-600 bg-blue-50/50", tagKey: "tag5W1H" },
];

const stratTitleKey: Record<Strategy, string> = {
  auto: "stratAuto", wbs: "stratWBS", userStory: "stratUserStory", sipoc: "stratSIPOC", fiveW: "strat5W1H",
};
const stratDescKey: Record<Strategy, string> = {
  auto: "descAuto", wbs: "descWBS", userStory: "descUserStory", sipoc: "descSIPOC", fiveW: "desc5W1H",
};

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("generator");
  const [lang, setLang] = useState<Lang>("zh");
  const [dark, setDark] = useState(false);
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("auto");
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
        body: JSON.stringify({ goal: goal.trim(), context: context.trim(), lang, strategy }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "quota_exhausted") setError(d.apiExhausted);
        else if (data.error === "rate_limit") setError(lang === "zh" ? "請求太頻繁，請稍後再試" : "Too many requests.");
        else setError(data.message || d.apiError);
        return;
      }

      setResult(data.data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        if (w.gtag) w.gtag("event", "generate_workflow", { event_category: "engagement", event_label: goal.trim().slice(0, 50), strategy });
      } catch { /* ignore */ }
    } catch {
      setError(d.apiError);
    } finally {
      setLoading(false);
    }
  }, [goal, context, lang, strategy, loading, d]);

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
    if (result.risks?.length) {
      md += `## ${d.risks}\n`;
      result.risks.forEach(r => { md += `- ⚠️ ${r}\n`; });
    }
    navigator.clipboard.writeText(md).then(() => showToast(d.copied));
  };

  const shareLink = () => {
    const payload = JSON.stringify({ goal, context, lang, strategy });
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
        if (decoded.strategy) setStrategy(decoded.strategy);
      } catch { /* ignore */ }
    }
  });

  // Helper to get i18n string by key
  const dk = (key: string) => (d as Record<string, unknown>)[key] as string || key;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-border-light dark:border-gray-700 sticky top-0 z-30 px-4 md:px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-2.5 rounded-xl shadow-lg">
              <Zap className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-text-main dark:text-gray-100 leading-none">{d.siteTitle}</h1>
              <p className="text-[10px] text-text-muted font-bold uppercase mt-0.5 tracking-wider">{d.siteSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex-1 md:flex-none">
              <button onClick={() => setActiveView("generator")} className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${activeView === "generator" ? "bg-white dark:bg-gray-700 text-brand-primary shadow-sm" : "text-text-muted hover:text-text-main"}`}>
                <LayoutDashboard className="w-4 h-4" />{d.navGenerator}
              </button>
              <button onClick={() => setActiveView("tutorial")} className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${activeView === "tutorial" ? "bg-white dark:bg-gray-700 text-brand-primary shadow-sm" : "text-text-muted hover:text-text-main"}`}>
                <BookOpen className="w-4 h-4" />{d.navTutorial}
              </button>
            </div>

            <button onClick={() => { setLang(lang === "zh" ? "en" : "zh"); setResult(null); }} className="px-3 py-2 rounded-lg border border-border-light dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-bold text-text-muted flex items-center gap-1.5 transition-colors">
              <Globe className="w-4 h-4 text-brand-primary" />{lang === "zh" ? "EN" : "中文"}
            </button>
            <button onClick={toggleDark} className="px-3 py-2 rounded-lg border border-border-light dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm transition-colors" title={dark ? d.lightMode : d.darkMode}>
              {dark ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-text-muted" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 md:py-8">

        {/* === GENERATOR VIEW === */}
        {activeView === "generator" && (
          <>
            {/* Hero */}
            <section className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-black mb-2 bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                {d.heroTitle}
              </h2>
              <p className="text-text-muted">{d.heroDesc}</p>
            </section>

            {/* Input Card */}
            <section className="mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-border-light dark:border-gray-700 p-5 md:p-6 space-y-5">
                {/* Goal */}
                <div>
                  <label className="text-sm font-black text-text-main dark:text-gray-200 flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-brand-primary" />{d.goalLabel}
                  </label>
                  <input
                    value={goal} onChange={e => setGoal(e.target.value)}
                    placeholder={d.goalPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 focus:border-brand-primary outline-none transition-all text-text-main dark:text-gray-100 font-medium"
                    onKeyDown={e => { if (e.key === "Enter") handleGenerate(); }}
                  />
                </div>

                {/* Strategy Selector */}
                <div>
                  <label className="text-sm font-black text-text-main dark:text-gray-200 flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-brand-primary" />{d.methodLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {STRATEGIES.map(s => {
                      const Icon = s.icon;
                      const active = strategy === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setStrategy(s.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${active ? s.activeColor : "border-gray-100 dark:border-gray-600 hover:border-gray-300 bg-white dark:bg-gray-700"} ${s.id === "auto" ? "col-span-2 sm:col-span-1" : ""}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${active ? s.color + " text-white shadow-md" : "bg-gray-100 dark:bg-gray-600 text-text-muted"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className={`text-xs font-black mb-0.5 ${active ? "text-text-main dark:text-gray-100" : "text-text-muted"}`}>
                            {dk(stratTitleKey[s.id])}
                          </div>
                          <div className={`text-[10px] font-bold ${active ? "text-brand-primary" : "text-gray-400"}`}>
                            {dk(s.tagKey)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Context */}
                <div>
                  <label className="text-sm font-black text-text-main dark:text-gray-200 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-brand-primary" />{d.contextLabel}
                  </label>
                  <textarea
                    value={context} onChange={e => setContext(e.target.value)}
                    rows={2} placeholder={d.contextPlaceholder}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 focus:border-brand-primary outline-none transition-all text-text-main dark:text-gray-100 font-medium resize-none"
                  />
                </div>

                {/* Generate button */}
                <button onClick={handleGenerate} disabled={!goal.trim() || loading} className="btn-gradient w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-lg">
                  {loading ? <><Loader2 className="animate-spin w-5 h-5" />{d.generating}</> : <><Sparkles className="w-5 h-5" />{d.generateBtn}</>}
                </button>
              </div>
            </section>

            {/* Examples */}
            {!result && !loading && (
              <section className="mb-8">
                <p className="text-sm text-text-muted mb-3 font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />{d.tryExamples}
                </p>
                <div className="flex flex-wrap gap-2">
                  {d.examples.map(ex => (
                    <button key={ex.title} onClick={() => handleExample(ex.goal)} className="px-3 py-2 rounded-full bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 hover:border-brand-primary hover:text-brand-primary transition-colors text-sm font-medium">
                      {ex.icon} {ex.title}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Loading */}
            {loading && (
              <div className="min-h-[400px] bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center p-12 space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gray-100 border-t-brand-primary rounded-full animate-spin" />
                  <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary w-8 h-8 animate-pulse" />
                </div>
                <p className="font-black text-text-muted animate-pulse">{d.generating}</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 rounded-2xl flex flex-col items-center gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h3 className="font-black text-red-800 dark:text-red-300">{error}</h3>
                <button onClick={handleGenerate} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">{d.retryBtn}</button>
              </div>
            )}

            {/* Onboarding (no result yet) */}
            {!result && !loading && !error && (
              <div className="min-h-[300px] bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center p-8 md:p-12">
                <div className="max-w-lg w-full">
                  <div className="text-center mb-8">
                    <div className="inline-flex bg-brand-primary/10 text-brand-primary p-3 rounded-2xl mb-3">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-black text-text-main dark:text-gray-100">{d.guideTitle}</h2>
                  </div>
                  <div className="space-y-5">
                    {[
                      { num: "1", icon: Target, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", title: d.guideStep1, desc: d.guideStep1Desc },
                      { num: "2", icon: Settings, color: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400", title: d.guideStep2, desc: d.guideStep2Desc },
                      { num: "3", icon: Copy, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", title: d.guideStep3, desc: d.guideStep3Desc },
                    ].map(step => (
                      <div key={step.num} className="flex items-start gap-4">
                        <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-black text-sm ${step.color}`}>{step.num}</div>
                        <div>
                          <h3 className="font-black text-text-main dark:text-gray-100 flex items-center gap-2">
                            <step.icon className="w-4 h-4 text-brand-primary" />{step.title}
                          </h3>
                          <p className="text-sm text-text-muted mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <section ref={resultRef} className="animate-fade-in-up">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg"><CheckCircle2 className="text-green-600 w-5 h-5" /></div>
                    <span className="font-black text-text-main dark:text-gray-100">{lang === "zh" ? "拆解結果" : "Result"}</span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <div className="flex rounded-lg overflow-hidden border border-border-light dark:border-gray-600">
                      <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-sm font-bold transition-colors flex items-center gap-1 ${viewMode === "list" ? "bg-brand-primary text-white" : "bg-white dark:bg-gray-800 hover:bg-gray-50 text-text-muted"}`}>
                        <List className="w-3.5 h-3.5" />{d.listView}
                      </button>
                      <button onClick={() => setViewMode("flow")} className={`px-3 py-1.5 text-sm font-bold transition-colors flex items-center gap-1 ${viewMode === "flow" ? "bg-brand-primary text-white" : "bg-white dark:bg-gray-800 hover:bg-gray-50 text-text-muted"}`}>
                        <GitBranch className="w-3.5 h-3.5" />{d.flowView}
                      </button>
                    </div>
                    <button onClick={copyMarkdown} className="px-3 py-1.5 text-sm font-bold rounded-lg border border-border-light dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" />{d.copyMd}
                    </button>
                    <button onClick={shareLink} className="px-3 py-1.5 text-sm font-bold rounded-lg border border-border-light dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" />{d.shareLink}
                    </button>
                    <button onClick={() => setResult(null)} className="p-1.5 rounded-lg border border-border-light dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 text-text-muted hover:text-red-500 transition-all" title={d.clearBtn}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Goal summary */}
                <div className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/20 rounded-2xl p-4 mb-6">
                  <h2 className="font-bold text-lg text-text-main dark:text-gray-100 mb-1 flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-primary" />{result.goal}
                  </h2>
                  <p className="text-sm text-text-muted">
                    {d.totalTime}: <span className="font-semibold text-brand-primary">{result.totalEstimatedTime}</span>
                    {" · "}{result.phases.length} {d.phase}{lang === "en" ? "s" : ""}
                    {" · "}{result.phases.reduce((s, p) => s + p.steps.length, 0)} {d.step}{lang === "en" ? "s" : ""}
                  </p>
                </div>

                {/* List view */}
                {viewMode === "list" && (
                  <div className="space-y-8">
                    {result.phases.map((phase, pi) => (
                      <div key={pi} className="relative pl-10 animate-fade-in-up" style={{ animationDelay: `${pi * 0.1}s` }}>
                        <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-700 rounded-full" />
                        <div className="absolute left-0 top-0 w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md">
                          {pi + 1}
                        </div>
                        <div className="mb-4">
                          <h3 className="text-lg font-black text-text-main dark:text-gray-100">{phase.name}</h3>
                          <span className="text-xs text-text-muted font-bold">{d.duration}: {phase.duration}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {phase.steps.map((step, si) => {
                            const stepId = `${pi}-${si}`;
                            const checked = checkedSteps.has(stepId);
                            return (
                              <div key={si} className={`bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-gray-700 p-4 transition-all hover:shadow-md ${checked ? "opacity-50" : ""}`}>
                                <div className="flex items-start gap-3">
                                  <button onClick={() => toggleStep(stepId)} className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${checked ? "bg-brand-primary border-brand-primary text-white" : "border-gray-300 dark:border-gray-600 hover:border-brand-primary"}`}>
                                    {checked && <Check className="w-3 h-3" />}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <h4 className={`font-bold text-sm text-text-main dark:text-gray-100 ${checked ? "line-through" : ""}`}>
                                        <ChevronRight className="w-4 h-4 text-brand-primary inline mr-1" />{step.title}
                                      </h4>
                                      <span className="text-[10px] text-text-muted whitespace-nowrap bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full font-bold">{step.estimatedTime}</span>
                                    </div>
                                    <p className="text-xs text-text-muted mb-2 leading-relaxed">{step.description}</p>
                                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                                      {step.deliverable && (
                                        <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">📦 {step.deliverable}</span>
                                      )}
                                      {step.dependencies?.length > 0 && (
                                        <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">🔗 {step.dependencies.join(", ")}</span>
                                      )}
                                    </div>
                                    {step.tips && (
                                      <p className="mt-2 text-[11px] text-brand-primary bg-brand-primary/5 rounded-lg px-3 py-1.5 font-medium">💡 {step.tips}</p>
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
                        <div className="flow-node bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl px-4 py-3 text-center shadow-md">
                          <div className="font-bold text-sm">{phase.name}</div>
                          <div className="text-xs opacity-80">{phase.duration}</div>
                        </div>
                        {phase.steps.map((step, si) => (
                          <div key={si} className="flex flex-col items-center">
                            <div className="w-0.5 h-3 bg-brand-primary/30" />
                            <div className="text-brand-primary/40 text-xs">▼</div>
                            <div className="w-0.5 h-1.5 bg-brand-primary/30" />
                            <div className="flow-node w-full bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm text-text-main dark:text-gray-100">{pi + 1}.{si + 1} {step.title}</span>
                                <span className="text-[10px] text-text-muted font-bold">{step.estimatedTime}</span>
                              </div>
                              <p className="text-xs text-text-muted">{step.description}</p>
                              {step.deliverable && <div className="mt-1 text-[10px] text-green-600 dark:text-green-400 font-bold">📦 {step.deliverable}</div>}
                            </div>
                          </div>
                        ))}
                        {pi < result.phases.length - 1 && (
                          <div className="flex flex-col items-center">
                            <div className="w-0.5 h-4 bg-brand-primary/30" />
                            <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs">⬇</div>
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
                    <h3 className="font-bold text-sm text-blue-800 dark:text-blue-300 mb-2">📌 {d.criticalPath}</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.criticalPath.map((cp, i) => (
                        <span key={i} className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full font-bold">{cp}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risks */}
                {result.risks?.length > 0 && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <h3 className="font-bold text-sm text-amber-800 dark:text-amber-300 mb-2">⚠️ {d.risks}</h3>
                    <ul className="space-y-1">
                      {result.risks.map((risk, i) => (
                        <li key={i} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2 font-medium"><span className="mt-1 text-xs">•</span>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* === TUTORIAL VIEW === */}
        {activeView === "tutorial" && (
          <div className="max-w-4xl mx-auto space-y-12 pb-16 animate-fade-in-up">
            <div className="text-center pt-4">
              <h2 className="text-3xl font-black text-text-main dark:text-gray-100 mb-2">{d.tutorialTitle}</h2>
              <p className="text-text-muted text-lg">{d.tutorialSub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {STRATEGIES.filter(s => s.id !== "auto").map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-border-light dark:border-gray-700 hover:shadow-xl transition-all group">
                    <div className={`w-14 h-14 ${s.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-text-main dark:text-gray-100 mb-3">{dk(stratTitleKey[s.id])}</h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-6">{dk(stratDescKey[s.id])}</p>
                    <button
                      onClick={() => { setStrategy(s.id); setActiveView("generator"); }}
                      className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1"
                    >
                      {lang === "zh" ? "使用此策略" : "Use this strategy"} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* AI Tips CTA */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl">
              <div className="bg-white/20 p-6 rounded-full shrink-0 backdrop-blur-sm">
                <Lightbulb className="w-10 h-10" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black mb-3">{d.howToAiTitle}</h3>
                <p className="text-white/80 leading-relaxed mb-4">{d.howToAiContent}</p>
                <button onClick={() => setActiveView("generator")} className="inline-flex items-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-xl font-black hover:bg-gray-50 transition-all">
                  <MousePointerClick className="w-4 h-4" />{d.backToTool}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light dark:border-gray-700 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-text-muted">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4" />
            <span>{d.footer}</span>
          </div>
          <a href="/privacy" className="hover:text-brand-primary transition-colors">{d.privacy}</a>
        </div>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg z-[100] animate-fade-in-up flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />{toast}
        </div>
      )}
    </div>
  );
}
