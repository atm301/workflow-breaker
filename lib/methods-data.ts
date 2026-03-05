export interface MethodCase {
  title: string;
  description: string;
}

export interface MethodData {
  id: string;
  nameZh: string;
  nameEn: string;
  tagline: { zh: string; en: string };
  origin: { zh: string; en: string };
  definition: { zh: string; en: string };
  coreIdea: { zh: string; en: string };
  bestFor: { zh: string[]; en: string[] };
  notFor: { zh: string[]; en: string[] };
  steps: { zh: string[]; en: string[] };
  keyPrinciples: { zh: string[]; en: string[] };
  cases: { zh: MethodCase[]; en: MethodCase[] };
  comparison: { zh: string; en: string };
  color: string;
  gradient: string;
  strategy: string;
}

export const METHODS_DATA: MethodData[] = [
  {
    id: "wbs",
    nameZh: "WBS 工作分解結構",
    nameEn: "WBS (Work Breakdown Structure)",
    tagline: {
      zh: "把大象切成一口一口的肉排",
      en: "Slice the elephant into manageable steaks",
    },
    origin: {
      zh: "WBS 起源於 1960 年代美國國防部和 NASA 的大型專案管理。當時為了管理阿波羅登月計畫，需要一種系統性方法來分解複雜工程。PMI (Project Management Institute) 在 PMBOK 中將其標準化，至今仍是全球最主流的專案管理方法。",
      en: "WBS originated in the 1960s from the US Department of Defense and NASA for managing large-scale projects like the Apollo program. It was standardized by PMI in the PMBOK Guide and remains the most widely used project management method globally.",
    },
    definition: {
      zh: "WBS 是一種以「可交付成果」為核心的層級分解技術。它將專案範圍從上到下拆解為越來越小的工作單元，直到每個單元都可以被準確估算時間和資源。",
      en: "WBS is a deliverable-oriented hierarchical decomposition technique. It breaks project scope from top to bottom into smaller work units until each can be accurately estimated for time and resources.",
    },
    coreIdea: {
      zh: "100% 規則：WBS 的所有子層級加總，必須等於上一層級的 100%。不能多也不能少。這確保了沒有遺漏，也沒有重複。",
      en: "The 100% Rule: all child elements must represent 100% of the parent level. No more, no less. This ensures nothing is missed and nothing overlaps.",
    },
    bestFor: {
      zh: ["建築與工程專案", "大型活動籌辦（展覽、婚禮、研討會）", "產品製造與供應鏈", "政府採購與標案", "任何有明確產出物的專案"],
      en: ["Construction and engineering", "Large events (exhibitions, weddings, conferences)", "Manufacturing and supply chain", "Government procurement", "Any project with clear deliverables"],
    },
    notFor: {
      zh: ["探索性研究或創新專案", "需求經常變動的敏捷開發", "個人日常任務管理"],
      en: ["Exploratory research or innovation", "Agile development with changing requirements", "Personal daily task management"],
    },
    steps: {
      zh: [
        "定義專案最終目標與範圍",
        "識別主要可交付成果（Phase 1, 2, 3...）",
        "逐層分解每個交付成果為子任務",
        "持續分解直到每個工作包 (Work Package) 可以被估算（通常 8-80 小時）",
        "為每個工作包分配負責人、時間和資源",
        "驗證 100% 規則：確認所有子項加總涵蓋上層 100%",
      ],
      en: [
        "Define project goal and scope",
        "Identify major deliverables (Phase 1, 2, 3...)",
        "Decompose each deliverable into sub-tasks",
        "Continue until each Work Package is estimable (typically 8-80 hours)",
        "Assign owner, timeline, and resources to each package",
        "Validate the 100% Rule: all children cover 100% of parent",
      ],
    },
    keyPrinciples: {
      zh: [
        "100% 規則 — 子層級完整覆蓋上層",
        "互斥性 (MECE) — 各工作包之間不重疊",
        "8/80 法則 — 每個工作包最小 8 小時、最大 80 小時",
        "以產出為導向 — 定義的是「要交什麼」而非「要做什麼」",
        "不超過 6 層 — 避免過度分解導致管理負擔",
      ],
      en: [
        "100% Rule — children fully cover parent scope",
        "MECE — work packages don't overlap",
        "8/80 Rule — each package is 8-80 hours of effort",
        "Deliverable-oriented — define 'what to deliver' not 'what to do'",
        "Max 6 levels — avoid over-decomposition overhead",
      ],
    },
    cases: {
      zh: [
        { title: "建立公司官網", description: "Phase 1: 需求規格 > Phase 2: UI/UX 設計 > Phase 3: 前端開發 > Phase 4: 後端 API > Phase 5: 測試上線。每個 Phase 再拆成具體工作包（例如設計稿、切版、API 文件）。" },
        { title: "舉辦 200 人研討會", description: "Phase 1: 企劃與預算 > Phase 2: 場地與設備 > Phase 3: 講者邀約 > Phase 4: 行銷推廣 > Phase 5: 活動執行 > Phase 6: 後續追蹤。" },
      ],
      en: [
        { title: "Build company website", description: "Phase 1: Requirements > Phase 2: UI/UX Design > Phase 3: Frontend Dev > Phase 4: Backend API > Phase 5: Test & Launch. Each phase breaks into work packages." },
        { title: "Host 200-person conference", description: "Phase 1: Planning & Budget > Phase 2: Venue & Equipment > Phase 3: Speaker Invitations > Phase 4: Marketing > Phase 5: Execution > Phase 6: Follow-up." },
      ],
    },
    comparison: {
      zh: "WBS 聚焦「產出物」，而 User Story 聚焦「使用者價值」；WBS 適合瀑布式開發，User Story 適合敏捷。",
      en: "WBS focuses on 'deliverables' while User Story focuses on 'user value'. WBS suits waterfall, User Story suits agile.",
    },
    color: "bg-indigo-600",
    gradient: "from-indigo-500 to-indigo-700",
    strategy: "wbs",
  },
  {
    id: "user-story",
    nameZh: "User Story Map 使用者故事地圖",
    nameEn: "User Story Map",
    tagline: {
      zh: "站在使用者的角度，拆解每一個價值交付",
      en: "Decompose value delivery from the user's perspective",
    },
    origin: {
      zh: "由 Jeff Patton 在 2005 年提出，後在《User Story Mapping》一書中系統化。它是敏捷開發中最受歡迎的需求管理方法，被 Spotify、Atlassian、Basecamp 等公司廣泛採用。",
      en: "Proposed by Jeff Patton in 2005 and systematized in his book 'User Story Mapping'. It's the most popular requirements management method in agile, used by Spotify, Atlassian, Basecamp, and more.",
    },
    definition: {
      zh: "User Story Map 以使用者旅程為主軸，將需求組織成一張二維地圖。水平軸是使用者的活動流程（時間序），垂直軸是每個活動下的功能細節（優先級），形成一張完整的「使用者體驗地圖」。",
      en: "User Story Map organizes requirements into a 2D map. The horizontal axis shows user activity flow (chronological), the vertical axis shows feature details under each activity (priority), creating a complete 'user experience map'.",
    },
    coreIdea: {
      zh: "「作為 [角色]，我想要 [功能]，以便 [價值]」— 每個需求都必須回答：這對使用者有什麼價值？",
      en: "'As a [role], I want [feature], so that [value]' — every requirement must answer: what value does this create for the user?",
    },
    bestFor: {
      zh: ["APP 或網站開發", "SaaS 產品規劃", "新產品 MVP 定義", "產品改版規劃", "跨部門功能協作"],
      en: ["App or website development", "SaaS product planning", "MVP definition", "Product redesign", "Cross-team feature collaboration"],
    },
    notFor: {
      zh: ["純粹的基礎建設專案（如搬遷機房）", "法規遵循類任務", "沒有明確「使用者」的內部流程"],
      en: ["Pure infrastructure (e.g., server migration)", "Compliance tasks", "Internal processes without clear 'users'"],
    },
    steps: {
      zh: [
        "定義目標使用者角色 (Persona)",
        "列出使用者旅程的主要活動（左到右時間序）",
        "每個活動下方列出使用者故事（功能需求）",
        "用水平線劃分 MVP / V2 / V3（上方 = 最高優先級）",
        "驗收標準：為每個 Story 定義完成條件",
        "迭代規劃：按照水平線切割，每次交付一個完整的使用者體驗",
      ],
      en: [
        "Define target user personas",
        "Map major activities in user journey (left to right)",
        "List user stories under each activity",
        "Draw horizontal lines for MVP / V2 / V3 (top = highest priority)",
        "Define acceptance criteria for each story",
        "Sprint planning: deliver complete user experiences per iteration",
      ],
    },
    keyPrinciples: {
      zh: [
        "使用者為中心 — 每個需求都綁定使用者角色和價值",
        "走完整條路 — MVP 要能涵蓋完整使用者旅程（但每步用最簡版本）",
        "垂直切片 — 不要做「只有前端沒有後端」的半成品",
        "對話優先 — Story 是對話的起點，不是需求文件的替代",
        "持續演進 — 地圖是活的，隨著學習不斷調整",
      ],
      en: [
        "User-centered — every requirement tied to user role and value",
        "Walk the whole path — MVP covers full user journey (minimal per step)",
        "Vertical slicing — don't build 'frontend-only' half-products",
        "Conversation-first — stories start conversations, not replace specs",
        "Continuously evolving — the map is alive, adjust as you learn",
      ],
    },
    cases: {
      zh: [
        { title: "開發外送 APP", description: "使用者旅程：瀏覽餐廳 > 選擇餐點 > 加入購物車 > 結帳付款 > 追蹤訂單 > 評價。MVP 只做：精選 10 家餐廳 + 基本點餐 + 信用卡結帳。" },
        { title: "建立線上課程平台", description: "學生旅程：搜尋課程 > 試看預覽 > 購買 > 上課 > 作業 > 取得證書。老師旅程：上傳影片 > 設定課綱 > 批改 > 看數據。" },
      ],
      en: [
        { title: "Build delivery app", description: "User journey: Browse restaurants > Select dishes > Add to cart > Checkout > Track order > Review. MVP: 10 curated restaurants + basic ordering + credit card payment." },
        { title: "Build online course platform", description: "Student journey: Search > Preview > Purchase > Learn > Assignments > Certificate. Teacher journey: Upload videos > Set curriculum > Grade > View analytics." },
      ],
    },
    comparison: {
      zh: "User Story 以「使用者價值」為核心，WBS 以「產出物」為核心；User Story 適合產品開發，WBS 適合工程專案。",
      en: "User Story centers on 'user value', WBS centers on 'deliverables'. User Story suits product development, WBS suits engineering projects.",
    },
    color: "bg-violet-600",
    gradient: "from-violet-500 to-violet-700",
    strategy: "userStory",
  },
  {
    id: "sipoc",
    nameZh: "SIPOC 流程模型",
    nameEn: "SIPOC Process Model",
    tagline: {
      zh: "從供應端到客戶端，一張圖看透你的流程",
      en: "From supplier to customer, see your entire process in one diagram",
    },
    origin: {
      zh: "SIPOC 源自六標準差 (Six Sigma) 品質管理體系，在 1980 年代由 Motorola 推廣，後被 GE、Toyota 等企業廣泛應用。它是六標準差 DMAIC 改善流程中「Define（定義）」階段的核心工具。",
      en: "SIPOC originates from Six Sigma quality management, popularized by Motorola in the 1980s and widely adopted by GE, Toyota, and others. It's a core tool in the Define phase of DMAIC improvement.",
    },
    definition: {
      zh: "SIPOC 是 Supplier（供應商）、Input（輸入）、Process（流程）、Output（輸出）、Customer（客戶）的縮寫。它用一張表格來呈現一個流程的完整樣貌，讓所有利害關係人對流程有共同理解。",
      en: "SIPOC stands for Supplier, Input, Process, Output, Customer. It uses a single table to present the complete picture of a process, creating shared understanding among all stakeholders.",
    },
    coreIdea: {
      zh: "任何流程都是一條「價值鏈」：有人提供原料（Supplier），有輸入（Input），經過處理（Process），產生輸出（Output），交給客戶（Customer）。釐清這五個元素，就能快速找到瓶頸和改善點。",
      en: "Every process is a 'value chain': someone provides materials (Supplier), there's Input, it goes through Processing, produces Output, delivered to Customer. Clarifying these five elements quickly reveals bottlenecks.",
    },
    bestFor: {
      zh: ["製造業與供應鏈管理", "客服流程改善", "行銷漏斗優化", "跨部門協作流程", "品質管理與改善專案"],
      en: ["Manufacturing and supply chain", "Customer service improvement", "Marketing funnel optimization", "Cross-department collaboration", "Quality management projects"],
    },
    notFor: {
      zh: ["全新產品從零開始（還沒有流程可分析）", "個人創意發想", "一次性事件（如辦尾牙）"],
      en: ["Building from scratch (no existing process)", "Personal brainstorming", "One-time events"],
    },
    steps: {
      zh: [
        "定義要分析的流程名稱與範圍",
        "列出核心 Process（3-7 個主要步驟，先寫 P）",
        "識別每個步驟的 Output（產出什麼？）",
        "確認 Customer（誰接收這些 Output？）",
        "追溯 Input（每個步驟需要什麼輸入？）",
        "識別 Supplier（誰提供這些 Input？）",
        "標記瓶頸、浪費、風險點",
      ],
      en: [
        "Define process name and scope",
        "List core Process steps (3-7 main steps, start with P)",
        "Identify Output for each step",
        "Confirm Customer (who receives the Output?)",
        "Trace Input (what does each step need?)",
        "Identify Supplier (who provides the Input?)",
        "Mark bottlenecks, waste, and risk points",
      ],
    },
    keyPrinciples: {
      zh: [
        "先寫 P 再填 SIOC — 從流程核心往外展開",
        "高層視角 — SIPOC 是鳥瞰圖，不要陷入太多細節",
        "客戶定義品質 — Output 的好壞由 Customer 說了算",
        "量化指標 — 每個 Output 都應有可衡量的標準",
        "持續改善 — SIPOC 是起點，後續接 DMAIC 深入分析",
      ],
      en: [
        "Start with P then fill SIOC — expand from the process core",
        "High-level view — SIPOC is a bird's eye view, avoid too much detail",
        "Customer defines quality — Output quality is judged by Customer",
        "Measurable metrics — every Output should have measurable standards",
        "Continuous improvement — SIPOC is the starting point for DMAIC",
      ],
    },
    cases: {
      zh: [
        { title: "電商出貨流程優化", description: "S: 倉庫、物流商 | I: 訂單資訊、庫存 | P: 揀貨 > 包裝 > 出貨 > 配送 | O: 包裹、追蹤碼 | C: 消費者。發現瓶頸：揀貨效率低，導入自動分揀系統。" },
        { title: "內容行銷流程", description: "S: SEO 工具、設計師 | I: 關鍵字研究、素材 | P: 主題規劃 > 撰文 > 審稿 > 上架 > 推廣 | O: 文章、社群貼文 | C: 目標受眾。發現：審稿環節耗時最長。" },
      ],
      en: [
        { title: "E-commerce shipping optimization", description: "S: Warehouse, logistics | I: Orders, inventory | P: Pick > Pack > Ship > Deliver | O: Package, tracking code | C: Consumer. Bottleneck: slow picking, introduced auto-sorting." },
        { title: "Content marketing process", description: "S: SEO tools, designers | I: Keyword research, assets | P: Topic planning > Writing > Review > Publish > Promote | O: Articles, social posts | C: Target audience. Finding: review takes longest." },
      ],
    },
    comparison: {
      zh: "SIPOC 聚焦「現有流程的全貌」，WBS 聚焦「新專案的分解」；SIPOC 用於改善，WBS 用於規劃。",
      en: "SIPOC focuses on 'existing process overview', WBS on 'new project decomposition'. SIPOC for improvement, WBS for planning.",
    },
    color: "bg-emerald-600",
    gradient: "from-emerald-500 to-emerald-700",
    strategy: "sipoc",
  },
  {
    id: "5w1h",
    nameZh: "5W1H 分析法",
    nameEn: "5W1H Analysis",
    tagline: {
      zh: "六個問題，問出任務的完整面貌",
      en: "Six questions to reveal the complete picture of any task",
    },
    origin: {
      zh: "5W1H 的起源可追溯到亞里斯多德的修辭學。現代版本由新聞學的「六何法」發展而來，並被管理學者 Rudyard Kipling 在詩句中推廣：「我有六個忠實的僕人，他們教會我一切 — What, Why, When, How, Where, Who。」豐田汽車將其融入 TPS（豐田生產系統），成為問題分析的標準工具。",
      en: "5W1H traces back to Aristotle's rhetoric. The modern version evolved from journalism's 'Five Ws' and was popularized by Rudyard Kipling. Toyota integrated it into TPS (Toyota Production System) as a standard problem analysis tool.",
    },
    definition: {
      zh: "5W1H 是一種全方位掃描工具，透過回答六個基本問題來確保對任務的理解完整而無遺漏：Who（誰）、What（什麼）、When（何時）、Where（哪裡）、Why（為什麼）、How（如何）。",
      en: "5W1H is a comprehensive scanning tool that answers six fundamental questions to ensure complete understanding: Who, What, When, Where, Why, and How.",
    },
    coreIdea: {
      zh: "「沒問過這六個問題，就不算真正理解這件事。」5W1H 的力量在於它的簡單和完整性 — 適用於任何領域、任何層級的問題分析。",
      en: "'If you haven't asked these six questions, you don't truly understand it.' The power of 5W1H lies in its simplicity and completeness — applicable to any domain and any level of analysis.",
    },
    bestFor: {
      zh: ["新任務或新專案的初期釐清", "撰寫企劃書或提案", "會議討論與決策", "問題根因分析 (Root Cause)", "跨團隊溝通對齊"],
      en: ["Initial clarification of new tasks", "Writing proposals or plans", "Meeting discussions and decisions", "Root cause analysis", "Cross-team alignment"],
    },
    notFor: {
      zh: ["已經很清楚的重複性任務", "需要深入技術細節的分析", "長期專案的持續追蹤管理"],
      en: ["Clear repetitive tasks", "Deep technical analysis", "Long-term project tracking"],
    },
    steps: {
      zh: [
        "What — 要做什麼？目標和範圍是什麼？",
        "Why — 為什麼要做？背後的動機和期待效益？",
        "Who — 誰來做？誰是利害關係人？",
        "When — 什麼時候做？截止日期？里程碑？",
        "Where — 在哪裡做？線上還是實體？哪個市場？",
        "How — 怎麼做？用什麼方法、工具、資源？預算多少？",
      ],
      en: [
        "What — What needs to be done? What's the scope?",
        "Why — Why do it? What's the motivation and expected benefit?",
        "Who — Who does it? Who are the stakeholders?",
        "When — When to do it? Deadlines? Milestones?",
        "Where — Where to do it? Online or physical? Which market?",
        "How — How to do it? What methods, tools, resources, and budget?",
      ],
    },
    keyPrinciples: {
      zh: [
        "先 Why 後 How — 確認「為什麼做」比「怎麼做」更重要",
        "不要停在表面 — 每個 W 都可以追問「為什麼？」至少 3 層",
        "具體化 — 答案要具體到可以行動，避免模糊描述",
        "視覺化 — 用表格或心智圖呈現，方便團隊共享",
        "迭代更新 — 隨著專案推進，答案可能會改變",
      ],
      en: [
        "Why before How — confirming 'why' matters more than 'how'",
        "Go deeper — each W can be followed by 'why?' at least 3 levels",
        "Be specific — answers should be actionable, avoid vague descriptions",
        "Visualize — use tables or mind maps for team sharing",
        "Iterate — answers may change as the project progresses",
      ],
    },
    cases: {
      zh: [
        { title: "規劃公司年度尾牙", description: "What: 200 人年度晚宴 | Why: 犒賞員工、凝聚向心力 | Who: HR 主辦、全體員工參加 | When: 1/15 晚上 6-10 點 | Where: 台北寒舍艾美 | How: 預算 50 萬、找活動公司協辦、包含表演和抽獎。" },
        { title: "轉職為 UX 設計師", description: "What: 轉職 UX 設計 | Why: 興趣+薪資成長 | Who: 我自己 + 業界人脈 | When: 6 個月內 | Where: 台灣科技業 | How: 線上課程 + 3 個作品集 + LinkedIn 經營 + 投遞 50 間公司。" },
      ],
      en: [
        { title: "Plan company year-end party", description: "What: 200-person dinner | Why: Reward employees, build team spirit | Who: HR organizes, all staff attend | When: Jan 15, 6-10 PM | Where: W Hotel | How: $15K budget, event planner, performances + lottery." },
        { title: "Career switch to UX designer", description: "What: Switch to UX | Why: Interest + salary growth | Who: Myself + industry contacts | When: Within 6 months | Where: Tech industry | How: Online courses + 3 portfolio pieces + LinkedIn + apply to 50 companies." },
      ],
    },
    comparison: {
      zh: "5W1H 是最簡單的「全面掃描」工具，適合快速釐清；WBS 和 User Story 則更適合深入分解執行細節。",
      en: "5W1H is the simplest 'comprehensive scan' tool for quick clarification. WBS and User Story go deeper into execution details.",
    },
    color: "bg-blue-600",
    gradient: "from-blue-500 to-blue-700",
    strategy: "fiveW",
  },
];
