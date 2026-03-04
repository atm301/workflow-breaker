# PRD — WorkFlow Breaker 工作流拆解器

## 產品概述

**產品名稱**：WorkFlow Breaker（工作流拆解器）
**一句話描述**：輸入你的目標，AI 幫你拆解成可執行的工作流程步驟
**目標用戶**：自由工作者、專案經理、創業者、行銷人、任何需要規劃工作的人
**預計部署**：Linode (workflow.atmarketing.tw)

---

## 問題與機會

### 痛點
1. 面對大目標時不知道從何下手（「我想開一間咖啡店」→ 然後呢？）
2. 工作流程只存在腦中，缺乏系統化拆解
3. 現有工具（Miro、Notion）需要手動建構，門檻高
4. 中文市場缺乏好用的 AI 工作流拆解工具

### 機會
- AI 可以根據目標自動生成結構化步驟
- 視覺化流程圖讓複雜工作一目了然
- 中英文雙語切換，可觸及國際市場

---

## 核心功能

### MVP（第一版）

#### 1. 目標輸入
- 使用者輸入：**目標**（必填）+ **補充說明**（選填，如預算、時間限制、團隊規模）
- 範例模板：提供 5-8 個常見場景讓使用者快速體驗
  - 🚀 「我想在 3 個月內上線一個 SaaS 產品」
  - 📱 「我想經營一個 IG 帳號到 1 萬粉」
  - 🎓 「我想轉職成為前端工程師」
  - 🏪 「我想開一間咖啡店」
  - 📊 「我想建立每月行銷報告的自動化流程」

#### 2. AI 工作流生成
- 呼叫 Gemini 2.5 Flash API
- 輸出結構化 JSON：
  ```json
  {
    "goal": "上線 SaaS 產品",
    "phases": [
      {
        "name": "Phase 1: 驗證想法",
        "duration": "2 週",
        "steps": [
          {
            "title": "定義目標用戶",
            "description": "...",
            "deliverable": "用戶人物誌文件",
            "estimatedTime": "2-3 天",
            "dependencies": [],
            "tips": "可以用 Google Forms 做快速訪談"
          }
        ]
      }
    ],
    "totalEstimatedTime": "12 週",
    "criticalPath": ["步驟1", "步驟3", "步驟7"],
    "risks": ["市場驗證不足", "技術選型錯誤"]
  }
  ```

#### 3. 視覺化呈現
- **列表視圖**（預設）：分階段的卡片列表，每步驟有勾選框
- **流程圖視圖**：垂直流程圖，節點 + 箭頭連線
- 每個步驟卡片顯示：
  - 標題 + 說明
  - 預估時間
  - 產出物
  - 依賴關係
  - 實用提示

#### 4. 中英文切換
- 頁面 UI 支援繁體中文 / English 一鍵切換
- AI 生成內容隨語言切換（重新生成或翻譯）
- URL 路徑：`/zh` 和 `/en`（或 query param `?lang=zh`）

#### 5. 匯出與分享
- **複製為文字**：Markdown 格式
- **下載為圖片**：流程圖截圖（html2canvas）
- **分享連結**：將結果編碼到 URL（無後端儲存）

---

## 技術架構

### 方案：Next.js + Gemini API（與現有專案一致）

```
workflow-breaker/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首頁（輸入 + 結果）
│   │   ├── layout.tsx            # 全域 Layout
│   │   ├── globals.css           # 全域樣式
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts      # Gemini API 端點
│   ├── components/
│   │   ├── GoalInput.tsx         # 目標輸入表單
│   │   ├── WorkflowResult.tsx    # 結果容器
│   │   ├── PhaseCard.tsx         # 階段卡片
│   │   ├── StepCard.tsx          # 步驟卡片
│   │   ├── FlowChart.tsx         # 流程圖視圖
│   │   ├── LanguageToggle.tsx    # 中英切換
│   │   ├── ExampleTemplates.tsx  # 範例模板
│   │   └── ExportButtons.tsx     # 匯出按鈕
│   ├── lib/
│   │   ├── gemini.ts             # Gemini API 封裝
│   │   └── i18n.ts               # 多語系文字
│   └── types/
│       └── workflow.ts           # TypeScript 型別
├── public/
│   ├── og-image.png              # OG 圖片 1200×630
│   └── favicon.ico
├── next.config.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

### 技術選型
| 項目 | 選擇 | 理由 |
|------|------|------|
| 框架 | Next.js 16 | 與 AI101、contract-scanner 一致 |
| 樣式 | Tailwind CSS v4 | 快速開發，一致性 |
| AI | Gemini 2.5 Flash | 免費額度高，速度快 |
| 流程圖 | 純 CSS/SVG | 輕量，不需額外依賴 |
| 匯出圖片 | html2canvas | 成熟方案 |
| 多語系 | 自建 i18n (輕量) | 不需 next-intl 的複雜度 |

---

## UI/UX 設計

### 頁面結構

```
┌─────────────────────────────────────────┐
│  🔀 WorkFlow Breaker    [中/EN] [🌙]   │  ← Navbar
├─────────────────────────────────────────┤
│                                         │
│   ✨ 把大目標變成可執行的步驟            │  ← Hero
│   輸入你想達成的目標，AI 幫你拆解工作流  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🎯 你的目標是什麼？              │    │  ← 輸入區
│  │ [                              ] │    │
│  │ 📝 補充說明（選填）              │    │
│  │ [                              ] │    │
│  │        [🚀 開始拆解]             │    │
│  └─────────────────────────────────┘    │
│                                         │
│  💡 試試看這些範例：                     │  ← 範例模板
│  [開 SaaS] [經營 IG] [轉職工程師] [...]  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  📋 結果區                              │
│  [列表視圖] [流程圖]  [複製] [下載] [分享]│
│                                         │
│  ── Phase 1: 驗證想法 (2 週) ────────   │
│  ☐ 1.1 定義目標用戶      ⏱ 2-3天       │
│  ☐ 1.2 競品分析          ⏱ 3天         │
│  ☐ 1.3 製作 MVP 原型     ⏱ 5天         │
│                                         │
│  ── Phase 2: 開發 (4 週) ────────────   │
│  ☐ 2.1 技術選型          ⏱ 1天         │
│  ☐ 2.2 核心功能開發      ⏱ 2週         │
│  ...                                    │
│                                         │
├─────────────────────────────────────────┤
│  ⚠️ 風險提醒                            │
│  • 市場驗證不足                          │
│  • 技術選型錯誤                          │
├─────────────────────────────────────────┤
│  Footer: © 2026 | 隱私權政策             │
└─────────────────────────────────────────┘
```

### 設計風格
- **色系**：藍紫漸層主色（#6366F1 → #8B5CF6），專業且現代
- **風格**：乾淨、空間感、卡片式佈局
- **動效**：步驟逐一淡入、進度條動畫、流程圖連線動畫

---

## 多語系內容

| Key | 繁體中文 | English |
|-----|---------|---------|
| title | 工作流拆解器 | WorkFlow Breaker |
| subtitle | 把大目標變成可執行的步驟 | Break big goals into actionable steps |
| goalPlaceholder | 例如：我想在 3 個月內上線一個 SaaS 產品 | e.g., Launch a SaaS product in 3 months |
| generateBtn | 開始拆解 | Break it down |
| phase | 階段 | Phase |
| step | 步驟 | Step |
| duration | 預估時間 | Est. time |
| deliverable | 產出物 | Deliverable |
| risks | 風險提醒 | Risk alerts |

---

## API 設計

### POST `/api/generate`

**Request:**
```json
{
  "goal": "我想在 3 個月內上線一個 SaaS 產品",
  "context": "一人團隊，預算 5 萬台幣",
  "lang": "zh"
}
```

**Response:** 結構化工作流 JSON（見上方格式）

**Rate Limit:** 10 次/小時/IP（與 contract-scanner 相同邏輯）

---

## SEO 與行銷

- **目標關鍵字**：工作流拆解、workflow breakdown、AI 任務規劃、project planning AI
- **OG 圖片**：展示流程圖範例的 1200×630 圖
- **JSON-LD**：WebApplication schema
- **Landing 文案**：強調「免費」「即時」「AI 驅動」

---

## 競品分析

| 工具 | 優勢 | 劣勢 | 我們的差異化 |
|------|------|------|-------------|
| Goblin Tools Magic ToDo | 簡單好用 | 只有簡單列表，無流程圖 | 有階段化 + 視覺化 |
| FunBlocks AI Planner | 功能完整 | 需註冊，英文為主 | 免費免登入，中文優先 |
| ChatGPT 手動問 | 靈活 | 無結構化輸出、無視覺化 | 結構化 + 可匯出 + 一鍵完成 |
| Miro / Notion | 強大協作 | 需手動建構，學習曲線 | AI 自動生成，零門檻 |

---

## 成功指標

| 指標 | 目標（上線 30 天） |
|------|-------------------|
| 總訪客 | 1,000+ |
| 工作流生成次數 | 500+ |
| 平均停留時間 | > 2 分鐘 |
| 分享/匯出次數 | 100+ |
| 回訪率 | > 20% |

---

## 開發里程碑

| 階段 | 內容 | 預估工時 |
|------|------|---------|
| Phase 1 | 核心功能（輸入 → AI 生成 → 列表視圖） | 今天完成 |
| Phase 2 | 流程圖視圖 + 匯出功能 | +1 天 |
| Phase 3 | SEO + 追蹤碼 + 部署 | +0.5 天 |
| Phase 4 | 優化（動效、範例擴充、效能） | 持續迭代 |

---

## 參考資源

- [AI Task Decomposition Step-by-Step](https://skywork.ai/blog/ai-agent/ai-task-decomposition-step-by-step/) — AI 任務拆解核心框架
- [Work Breakdown Structure Guide](https://monday.com/blog/project-management/work-breakdown-structure/) — WBS 方法論與模板
- [Business Process Decomposition](https://www.blueprintsys.com/blog/process-decomposition-why-its-so-important) — 企業流程拆解重要性
- [AI Workflow Automation 2026](https://botpress.com/blog/ai-workflow-automation) — AI 工作流自動化趨勢
- [Mitchell Hashimoto AI Agent 方法論](https://www.bnext.com.tw/article/90057/mitchell-hashimoto-ai-agent-workflow-guide) — 拆解「規劃→執行」雙階段
- [Goblin Tools Magic ToDo](https://forum.asana.com/t/free-handy-ai-assisted-goblin-tools-breaks-down-tasks-and-more-designed-for-neurodivergent-people-and-useful-to-all/868466) — 競品參考
- [FunBlocks AI Task Planner](https://www.funblocks.net/aitools/planner) — 競品參考
