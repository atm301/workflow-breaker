"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 animate-fade-in-up">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
          🍪 本站使用 Cookie 改善您的瀏覽體驗，包含 Google Analytics 與 Meta Pixel 匿名數據。
          <a href="/privacy" className="underline text-indigo-600 dark:text-indigo-400 ml-1">隱私權政策</a>
        </p>
        <button
          onClick={accept}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl whitespace-nowrap transition-colors"
        >
          我了解了
        </button>
      </div>
    </div>
  );
}
