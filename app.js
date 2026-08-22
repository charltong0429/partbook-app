import {
  ANGLES,
  PLATFORMS,
  createResearchBrief,
  evaluateReadiness,
  generateDraft,
  saveDraftVersion,
} from "./lib/draft-engine.js";

const STORAGE_KEY = "taurisweft.workspace.v1";
const VIEW_TITLES = {
  today: "今日工作台",
  research: "Research",
  studio: "Content Studio",
  library: "Draft Library",
  brand: "Brand Memory",
};

const DEFAULT_BRAND = {
  name: "我的专业品牌",
  role: "Product Director",
  expertise: "欧洲能源产品、市场与商业化",
  audience: "欧洲能源行业的产品、市场与业务负责人",
  pillars: "家庭能源管理\n热泵与储能\n动态电价与灵活性\n产品战略",
  tone: "专业、克制、有判断；用具体事实支撑观点",
  avoid: "革命性\n颠覆行业\n赋能\n显而易见\n作为一个 AI",
  language: "中文为主，保留常用英文行业术语",
  primaryTag: "EnergyTransition",
};

function createInitialState() {
  return {
    version: 1,
    brand: { ...DEFAULT_BRAND },
    briefs: [],
    drafts: [],
    ui: {
      view: readViewFromHash(),
      selectedBriefId: null,
      selectedDraftId: null,
      platform: "linkedin",
      angleKey: "product",
      libraryFilter: "all",
      bannerHidden: false,
    },
  };
}

function readViewFromHash() {
  const candidate = window.location.hash.replace("#", "");
  return VIEW_TITLES[candidate] ? candidate : "today";
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || saved.version !== 1) return createInitialState();
    return {
      ...createInitialState(),
      ...saved,
      brand: { ...DEFAULT_BRAND, ...saved.brand },
      briefs: Array.isArray(saved.briefs) ? saved.briefs : [],
      drafts: Array.isArray(saved.drafts) ? saved.drafts : [],
      ui: { ...createInitialState().ui, ...saved.ui, view: readViewFromHash() },
    };
  } catch {
    return createInitialState();
  }
}

let state = loadState();
const main = document.querySelector("#app-main");
const viewTitle = document.querySelector("#view-title");
const toastRegion = document.querySelector("#toast-region");
const banner = document.querySelector(".mode-banner");

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateChrome();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function excerpt(value, length = 150) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > length ? `${normalized.slice(0, length)}…` : normalized;
}

function statusLabel(status) {
  const labels = { draft: "Draft", review: "Review", ready: "Ready", published: "Published manually" };
  return labels[status] || "Draft";
}

function toast(message, type = "success") {
  const element = document.createElement("div");
  element.className = `toast ${type === "error" ? "error" : ""}`;
  element.textContent = message;
  toastRegion.append(element);
  window.setTimeout(() => element.remove(), 2800);
}

function updateChrome() {
  viewTitle.textContent = VIEW_TITLES[state.ui.view];
  document.querySelector("#brief-count").textContent = state.briefs.length;
  document.querySelector("#draft-count").textContent = state.drafts.length;
  document.querySelectorAll("[data-view]").forEach((button) => {
    const active = button.dataset.view === state.ui.view;
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  banner.classList.toggle("is-hidden", state.ui.bannerHidden);
}

function setView(view, { focus = true } = {}) {
  if (!VIEW_TITLES[view]) return;
  state.ui.view = view;
  window.location.hash = view;
  document.body.classList.remove("nav-open");
  document.querySelector("#mobile-menu").setAttribute("aria-expanded", "false");
  persist();
  render();
  if (focus) main.focus();
}

function render() {
  updateChrome();
  const renderers = {
    today: renderToday,
    research: renderResearch,
    studio: renderStudio,
    library: renderLibrary,
    brand: renderBrand,
  };
  main.innerHTML = renderers[state.ui.view]();
  bindViewForms();
}

function viewHeader(kicker, title, description, action = "") {
  return `
    <header class="view-header">
      <div>
        <p class="view-kicker">${escapeHtml(kicker)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </div>
      ${action}
    </header>`;
}

function renderToday() {
  const readyCount = state.drafts.filter((draft) => draft.status === "ready").length;
  const recentDrafts = [...state.drafts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const hasBrand = Boolean(state.brand.role && state.brand.audience && state.brand.tone);
  const hasBrief = state.briefs.length > 0;
  const hasDraft = state.drafts.length > 0;
  const hasReady = readyCount > 0;

  const recent = recentDrafts.length
    ? `<div class="recent-list">${recentDrafts.map((draft) => `
        <div class="recent-item">
          <button type="button" data-action="open-draft" data-id="${escapeHtml(draft.id)}">
            <strong>${escapeHtml(draft.title)}</strong>
            <small>${escapeHtml(PLATFORMS[draft.platform].label)} · ${escapeHtml(draft.authorRole)} · ${formatDate(draft.updatedAt)}</small>
          </button>
          <span class="status-pill ${escapeHtml(draft.status)}">${escapeHtml(statusLabel(draft.status))}</span>
        </div>`).join("")}</div>`
    : `<div class="empty-state"><div><div class="empty-mark">W</div><h2>从第一份可信材料开始</h2><p>粘贴 source、整理 claims，然后生成 LinkedIn 和微信两个结构不同的草稿。</p><button class="primary-button" type="button" data-action="new-brief">创建第一份 Brief</button></div></div>`;

  return `
    ${viewHeader("Today / Ready-to-publish loop", "今天要完成什么？", "从可信来源开始，在一个工作台里完成 Brief、双平台草稿、人工编辑和发布交接。")}
    <section class="stats-grid" aria-label="工作台统计">
      <article class="stat-card"><span>Research Briefs</span><strong>${state.briefs.length}</strong><em>已保存的可信材料</em></article>
      <article class="stat-card"><span>Drafts</span><strong>${state.drafts.length}</strong><em>LinkedIn 与微信版本</em></article>
      <article class="stat-card"><span>Ready outputs</span><strong>${readyCount}</strong><em>通过 readiness checks</em></article>
    </section>
    <section class="workbench-grid">
      <article class="panel">
        <div class="panel-header"><h2>核心工作流</h2><span>Source → Ready</span></div>
        <div class="flow-list">
          ${renderFlowStep("Brand Memory", "记录角色、受众、专业领域与禁用表达。", hasBrand)}
          ${renderFlowStep("Research Brief", "把材料整理成 summary、claims 与 citation。", hasBrief)}
          ${renderFlowStep("Platform drafts", "生成结构不同的 LinkedIn 与微信版本。", hasDraft)}
          ${renderFlowStep("Human approval", "编辑并通过检查后，由你标记为 Ready。", hasReady)}
        </div>
      </article>
      <article class="panel">
        <div class="panel-header"><h2>最近草稿</h2><button class="quiet-button" type="button" data-view="library">打开 Library</button></div>
        <div class="panel-body">${recent}</div>
      </article>
    </section>`;
}

function renderFlowStep(title, description, done) {
  return `<div class="flow-step ${done ? "is-done" : ""}"><span class="flow-node">✓</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(description)}</p></div>`;
}

function renderResearch() {
  const cards = state.briefs.length
    ? `<div class="brief-list">${[...state.briefs].reverse().map(renderBriefCard).join("")}</div>`
    : `<div class="empty-state"><div><div class="empty-mark">S1</div><h2>还没有 Research Brief</h2><p>填写左侧表单，或先载入示例看看完整流程。</p><button class="secondary-button" type="button" data-action="load-example">载入能源行业示例</button></div></div>`;

  return `
    ${viewHeader("Source-grounded research", "从材料创建 Research Brief", "粘贴你有权使用的原始材料。系统会保留 source，并把每条 claim 映射到引用 S1。")}
    <section class="split-layout">
      <article class="panel form-panel">
        <div class="panel-header"><h2>新建 Brief</h2><span>所有字段保存在本浏览器</span></div>
        <form class="panel-body" id="research-form">
          <div class="field-grid">
            <div class="field full"><label for="brief-title">主题 / 标题 *</label><input id="brief-title" name="title" required placeholder="例如：动态电价正在成为家庭能源控制层" /></div>
            <div class="field"><label for="source-name">来源名称</label><input id="source-name" name="sourceName" placeholder="报告、采访或内部材料" /></div>
            <div class="field"><label for="source-url">来源 URL</label><input id="source-url" name="sourceUrl" inputmode="url" placeholder="https://…（可选）" /></div>
            <div class="field full"><label for="source-text">原始材料 / 摘要 *</label><textarea class="tall" id="source-text" name="sourceText" required placeholder="粘贴原文、访谈笔记或你整理的材料。失败不会删除输入。"></textarea><p class="hint">没有 URL 也可以。系统会明确标记为“用户提供材料”。</p></div>
            <div class="field full"><label for="claims">可引用的关键事实 *</label><textarea id="claims" name="claims" required placeholder="每行一条事实或 claim&#10;例如：动态电价正在与设备控制融合"></textarea></div>
            <div class="field full"><label for="brief-tags">标签</label><input id="brief-tags" name="tags" placeholder="energy, pricing, Europe" /></div>
          </div>
          <div class="form-actions"><button class="primary-button" type="submit">保存 Research Brief</button><button class="secondary-button" type="button" data-action="load-example">载入示例</button></div>
        </form>
      </article>
      <div>${cards}</div>
    </section>`;
}

function renderBriefCard(brief) {
  return `
    <article class="brief-card">
      <div class="brief-card-head">
        <div><h3>${escapeHtml(brief.title)}</h3><div class="brief-meta"><span class="citation-pill">S1</span><span>${escapeHtml(brief.sourceName)}</span><span>${formatDate(brief.updatedAt)}</span></div></div>
        <span class="status-pill ready">${brief.claims.length} claims</span>
      </div>
      <p>${escapeHtml(brief.summary)}</p>
      <div class="claim-list">${brief.claims.slice(0, 4).map((claim) => `<div class="claim-row"><span class="citation-pill">${escapeHtml(claim.citation)}</span><span>${escapeHtml(claim.text)}</span></div>`).join("")}</div>
      <div class="brief-actions"><button class="primary-button" type="button" data-action="use-brief" data-id="${escapeHtml(brief.id)}">进入 Studio</button>${brief.sourceUrl ? `<a class="quiet-button" href="${escapeHtml(brief.sourceUrl)}" target="_blank" rel="noreferrer">打开 Source</a>` : ""}</div>
    </article>`;
}

function renderStudio() {
  if (!state.briefs.length) {
    return `${viewHeader("Content Studio", "先创建一份 Research Brief", "Studio 需要可信材料、claims 和 Brand Memory 才能形成可核验的草稿。")}
      <div class="empty-state"><div><div class="empty-mark">S1</div><h2>Studio 正在等待 source</h2><p>创建 Brief 后，这里会生成 LinkedIn 与微信两个结构不同的版本。</p><button class="primary-button" type="button" data-action="new-brief">创建 Brief</button></div></div>`;
  }

  const selectedBrief = getSelectedBrief();
  const selectedDraft = getSelectedDraft(selectedBrief);
  const briefOptions = state.briefs.map((brief) => `<option value="${escapeHtml(brief.id)}" ${brief.id === selectedBrief.id ? "selected" : ""}>${escapeHtml(brief.title)}</option>`).join("");
  const angleOptions = Object.entries(ANGLES).map(([key, angle]) => `<option value="${key}" ${key === state.ui.angleKey ? "selected" : ""}>${escapeHtml(angle.label)} · ${escapeHtml(angle.role)}</option>`).join("");

  return `
    ${viewHeader("Human-in-the-loop editor", "把 Brief 变成可发布内容", "先选择 source 和个人角度，再生成双平台草稿。你可以编辑、保存版本、复制并标记 Ready。")}
    <section class="studio-layout">
      <aside class="panel studio-rail">
        <div class="panel-header"><h2>输入</h2><span>Source + Voice</span></div>
        <div class="panel-body">
          <div class="rail-section"><label for="studio-brief">Research Brief</label><select class="studio-select" id="studio-brief">${briefOptions}</select></div>
          <div class="source-summary"><strong>${escapeHtml(selectedBrief.title)}</strong><p>${escapeHtml(excerpt(selectedBrief.summary, 120))}</p></div>
          <div class="rail-section"><label for="studio-angle">专业角度</label><select class="studio-select" id="studio-angle">${angleOptions}</select></div>
          <div class="rail-section"><label>Brand Memory</label><div class="source-summary"><strong>${escapeHtml(state.brand.role)}</strong><p>${escapeHtml(state.brand.tone)}</p></div></div>
          <button class="primary-button" type="button" data-action="generate-drafts">生成双平台草稿</button>
        </div>
      </aside>
      ${selectedDraft ? renderEditor(selectedDraft, selectedBrief) : renderStudioEmpty(selectedBrief)}
      ${selectedDraft ? renderReadinessRail(selectedDraft, selectedBrief) : renderStudioGuide()}
    </section>`;
}

function getSelectedBrief() {
  return state.briefs.find((brief) => brief.id === state.ui.selectedBriefId) || state.briefs[0];
}

function getSelectedDraft(brief) {
  const explicit = state.drafts.find((draft) => draft.id === state.ui.selectedDraftId && draft.briefId === brief.id);
  if (explicit) return explicit;
  return [...state.drafts].reverse().find((draft) => draft.briefId === brief.id && draft.platform === state.ui.platform) || null;
}

function renderStudioEmpty(brief) {
  return `<div class="empty-state editor-panel"><div><div class="empty-mark">W</div><h2>准备生成双平台草稿</h2><p>当前 Brief：${escapeHtml(brief.title)}。点击左侧按钮，会同时创建 LinkedIn 和微信版本。</p><button class="primary-button" type="button" data-action="generate-drafts">生成草稿</button></div></div>`;
}

function renderStudioGuide() {
  return `<aside class="panel studio-rail"><div class="panel-header"><h2>完成标准</h2><span>4 checks</span></div><div class="panel-body"><div class="readiness-list"><div class="readiness-item"><span class="check-dot">1</span><span>正文不少于 120 字</span></div><div class="readiness-item"><span class="check-dot">2</span><span>保留 source 说明</span></div><div class="readiness-item"><span class="check-dot">3</span><span>claims 有材料支持</span></div><div class="readiness-item"><span class="check-dot">4</span><span>长度符合平台范围</span></div></div></div></aside>`;
}

function renderEditor(draft, brief) {
  const versions = [...draft.versions].reverse();
  return `<article class="panel editor-panel">
    <div class="editor-toolbar">
      <div class="platform-tabs" role="tablist" aria-label="平台版本">
        ${Object.entries(PLATFORMS).map(([key, platform]) => `<button class="tab-button" type="button" role="tab" data-action="switch-platform" data-platform="${key}" aria-selected="${String(key === draft.platform)}">${escapeHtml(platform.label)}</button>`).join("")}
      </div>
      <span class="toolbar-spacer"></span><span class="editor-meta" id="save-state">已保存 · V${draft.versions.length}</span>
    </div>
    <textarea class="editor-area" id="draft-editor" aria-label="草稿正文">${escapeHtml(draft.content)}</textarea>
    <div class="editor-footer"><span id="character-count">${draft.content.length} 字符 · ${escapeHtml(PLATFORMS[draft.platform].label)}</span><div class="form-actions"><button class="secondary-button" type="button" data-action="save-editor">保存版本</button><button class="secondary-button" type="button" data-action="copy-draft" data-id="${escapeHtml(draft.id)}">复制文字</button></div></div>
  </article>`;
}

function renderReadinessRail(draft, brief) {
  const readiness = evaluateReadiness(draft, brief);
  const versions = [...draft.versions].reverse().slice(0, 5);
  return `<aside class="panel studio-rail">
    <div class="panel-header"><h2>Readiness</h2><span>${readiness.score}/4</span></div>
    <div class="panel-body">
      <div class="score-card"><span>READY SCORE</span><strong>${readiness.score}/4</strong><em>${readiness.ready ? "可以由你确认 Ready" : "修正未通过项目后再确认"}</em></div>
      <div class="readiness-list">${readiness.checks.map((check) => `<div class="readiness-item ${check.pass ? "pass" : ""}"><span class="check-dot">${check.pass ? "✓" : "!"}</span><span>${escapeHtml(check.label)}</span></div>`).join("")}</div>
      <button class="primary-button" type="button" data-action="mark-ready" ${readiness.ready ? "" : "disabled"}>${draft.status === "ready" ? "已标记 Ready ✓" : "标记为 Ready"}</button>
      <button class="secondary-button" type="button" data-action="download-draft" data-id="${escapeHtml(draft.id)}">下载 Markdown</button>
      <div class="rail-section"><label>版本记录</label><div class="version-list">${versions.map((version, index) => `<button class="version-button" type="button" data-action="restore-version" data-version-id="${escapeHtml(version.id)}"><span>V${draft.versions.length - index}</span><span>${formatDate(version.createdAt)}</span></button>`).join("")}</div></div>
    </div>
  </aside>`;
}

function renderLibrary() {
  const filters = ["all", "draft", "ready"];
  const drafts = state.ui.libraryFilter === "all" ? state.drafts : state.drafts.filter((draft) => draft.status === state.ui.libraryFilter);
  const content = drafts.length
    ? `<div class="library-grid">${[...drafts].reverse().map(renderDraftCard).join("")}</div>`
    : `<div class="empty-state"><div><div class="empty-mark">L</div><h2>这个筛选条件下没有草稿</h2><p>从 Studio 生成草稿后，它们会自动进入 Library。</p><button class="primary-button" type="button" data-view="studio">进入 Studio</button></div></div>`;

  return `
    ${viewHeader("Saved work", "Draft Library", "按状态查看已生成内容。每个草稿都可以继续编辑、复制、下载或标记为手工发布。")}
    <div class="library-toolbar">${filters.map((filter) => `<button class="tab-button" type="button" data-action="filter-library" data-filter="${filter}" aria-selected="${String(filter === state.ui.libraryFilter)}">${filter === "all" ? "全部" : statusLabel(filter)}</button>`).join("")}</div>
    ${content}`;
}

function renderDraftCard(draft) {
  return `<article class="draft-card">
    <div class="draft-card-head"><div><h3>${escapeHtml(draft.title)}</h3><div class="draft-meta"><span>${escapeHtml(PLATFORMS[draft.platform].label)}</span><span>${escapeHtml(draft.authorRole)}</span><span>V${draft.versions.length}</span></div></div><span class="status-pill ${escapeHtml(draft.status)}">${escapeHtml(statusLabel(draft.status))}</span></div>
    <p class="draft-excerpt">${escapeHtml(excerpt(draft.content))}</p>
    <div class="draft-actions"><button class="primary-button" type="button" data-action="open-draft" data-id="${escapeHtml(draft.id)}">继续编辑</button><button class="secondary-button" type="button" data-action="copy-draft" data-id="${escapeHtml(draft.id)}">复制</button><button class="secondary-button" type="button" data-action="download-draft" data-id="${escapeHtml(draft.id)}">下载</button></div>
  </article>`;
}

function renderBrand() {
  const pillars = state.brand.pillars.split(/\r?\n/).filter(Boolean).slice(0, 4);
  return `
    ${viewHeader("Personal voice system", "Brand Memory", "这些信息会进入每一次草稿生成。请写真实角色、受众和表达边界，不要写空泛品牌形容词。")}
    <section class="brand-layout">
      <article class="panel">
        <div class="panel-header"><h2>个人专业记忆</h2><span>Version 1 · local</span></div>
        <form class="panel-body" id="brand-form">
          <div class="field-grid">
            <div class="field"><label for="brand-name">显示名称</label><input id="brand-name" name="name" value="${escapeHtml(state.brand.name)}" /></div>
            <div class="field"><label for="brand-role">职业角色 *</label><input id="brand-role" name="role" required value="${escapeHtml(state.brand.role)}" /></div>
            <div class="field full"><label for="brand-expertise">专业领域 *</label><input id="brand-expertise" name="expertise" required value="${escapeHtml(state.brand.expertise)}" /></div>
            <div class="field full"><label for="brand-audience">目标受众 *</label><input id="brand-audience" name="audience" required value="${escapeHtml(state.brand.audience)}" /></div>
            <div class="field full"><label for="brand-pillars">Content pillars</label><textarea id="brand-pillars" name="pillars">${escapeHtml(state.brand.pillars)}</textarea><p class="hint">每行一个长期主题。</p></div>
            <div class="field full"><label for="brand-tone">语气与判断方式 *</label><textarea id="brand-tone" name="tone" required>${escapeHtml(state.brand.tone)}</textarea></div>
            <div class="field full"><label for="brand-avoid">禁用表达</label><textarea id="brand-avoid" name="avoid">${escapeHtml(state.brand.avoid)}</textarea><p class="hint">每行一个词或句式。</p></div>
            <div class="field"><label for="brand-language">语言偏好</label><input id="brand-language" name="language" value="${escapeHtml(state.brand.language)}" /></div>
            <div class="field"><label for="brand-tag">默认标签</label><input id="brand-tag" name="primaryTag" value="${escapeHtml(state.brand.primaryTag)}" /></div>
          </div>
          <div class="form-actions"><button class="primary-button" type="submit">保存 Brand Memory</button><button class="secondary-button" type="button" data-action="reset-brand">恢复默认内容</button></div>
        </form>
      </article>
      <aside class="memory-preview">
        <span class="mini-label">Voice fingerprint</span><h2>${escapeHtml(state.brand.role)}</h2><p>${escapeHtml(state.brand.tone)}</p>
        <div class="memory-lines"><div><span>Expertise</span><strong>${escapeHtml(state.brand.expertise)}</strong></div><div><span>Audience</span><strong>${escapeHtml(state.brand.audience)}</strong></div><div><span>Pillars</span><strong>${pillars.map(escapeHtml).join(" · ") || "尚未填写"}</strong></div><div><span>Language</span><strong>${escapeHtml(state.brand.language)}</strong></div></div>
      </aside>
    </section>`;
}

function bindViewForms() {
  document.querySelector("#research-form")?.addEventListener("submit", handleResearchSubmit);
  document.querySelector("#brand-form")?.addEventListener("submit", handleBrandSubmit);
  document.querySelector("#studio-brief")?.addEventListener("change", (event) => {
    state.ui.selectedBriefId = event.target.value;
    state.ui.selectedDraftId = null;
    persist();
    render();
  });
  document.querySelector("#studio-angle")?.addEventListener("change", (event) => {
    state.ui.angleKey = event.target.value;
    persist();
  });
  document.querySelector("#draft-editor")?.addEventListener("input", (event) => {
    document.querySelector("#character-count").textContent = `${event.target.value.length} 字符 · ${PLATFORMS[state.ui.platform].label}`;
    document.querySelector("#save-state").textContent = "有未保存修改";
  });
}

function handleResearchSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const input = Object.fromEntries(form.entries());
  const brief = createResearchBrief(input);
  state.briefs.push(brief);
  state.ui.selectedBriefId = brief.id;
  persist();
  toast("Research Brief 已保存");
  setView("studio");
}

function handleBrandSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.brand = { ...state.brand, ...Object.fromEntries(form.entries()) };
  persist();
  render();
  toast("Brand Memory 已保存");
}

function loadExample() {
  const fields = {
    "brief-title": "动态电价正在成为家庭能源系统的控制层",
    "source-name": "欧洲家庭能源市场观察",
    "source-url": "https://example.com/energy-market-note",
    "source-text": "欧洲市场正在把动态电价、热泵、家庭储能和电动汽车控制组合到同一套家庭能源系统中。用户价值正在从查看价格与手工设置，转向系统根据价格、舒适度和设备状态自动执行。对于设备厂商和能源零售商，竞争边界也从单一产品扩展到长期调度入口。",
    claims: "动态电价正在与热泵、储能和 EV 控制融合\n用户价值从查看价格转向自动执行\n竞争焦点正在从单一设备转向家庭能源控制入口",
    "brief-tags": "energy, dynamic pricing, HEMS, Europe",
  };
  Object.entries(fields).forEach(([id, value]) => {
    const field = document.querySelector(`#${id}`);
    if (field) field.value = value;
  });
  toast("示例已载入，请检查后保存");
}

function generateDraftPair() {
  const brief = getSelectedBrief();
  const drafts = ["linkedin", "wechat"].map((platform) => generateDraft({ brief, brand: state.brand, platform, angleKey: state.ui.angleKey }));
  state.drafts.push(...drafts);
  state.ui.platform = "linkedin";
  state.ui.selectedDraftId = drafts[0].id;
  persist();
  render();
  toast("LinkedIn 与微信草稿已生成");
}

function saveCurrentEditor({ silent = false } = {}) {
  const editor = document.querySelector("#draft-editor");
  const draft = state.drafts.find((item) => item.id === state.ui.selectedDraftId);
  if (!editor || !draft) return draft;
  const updated = saveDraftVersion(draft, editor.value);
  const index = state.drafts.findIndex((item) => item.id === draft.id);
  state.drafts[index] = updated;
  persist();
  if (!silent) {
    render();
    toast(updated === draft ? "没有新的修改" : "新版本已保存");
  }
  return updated;
}

async function copyDraft(id) {
  const draft = state.drafts.find((item) => item.id === id);
  if (!draft) return;
  try {
    await navigator.clipboard.writeText(draft.content);
  } catch {
    const fallback = document.createElement("textarea");
    fallback.value = draft.content;
    document.body.append(fallback);
    fallback.select();
    document.execCommand("copy");
    fallback.remove();
  }
  draft.copiedAt = new Date().toISOString();
  persist();
  toast("草稿已复制，可打开目标平台粘贴");
}

function downloadDraft(id) {
  const draft = state.drafts.find((item) => item.id === id);
  if (!draft) return;
  const brief = state.briefs.find((item) => item.id === draft.briefId);
  const markdown = `# ${draft.title}\n\n- Platform: ${PLATFORMS[draft.platform].label}\n- Status: ${statusLabel(draft.status)}\n- Role: ${draft.authorRole}\n- Source: ${brief?.sourceUrl || brief?.sourceName || "用户提供材料"}\n\n${draft.content}\n`;
  downloadBlob(markdown, `${slugify(draft.title)}-${draft.platform}.md`, "text/markdown;charset=utf-8");
  toast("Markdown 已下载");
}

function downloadBlob(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 60) || "taurisweft-draft";
}

function markReady() {
  let draft = saveCurrentEditor({ silent: true });
  const brief = state.briefs.find((item) => item.id === draft?.briefId);
  if (!draft || !evaluateReadiness(draft, brief).ready) {
    toast("仍有 readiness check 未通过", "error");
    render();
    return;
  }
  draft.status = draft.status === "ready" ? "draft" : "ready";
  draft.updatedAt = new Date().toISOString();
  persist();
  render();
  toast(draft.status === "ready" ? "已标记 Ready，可以复制发布" : "已恢复为 Draft");
}

function restoreVersion(versionId) {
  const draft = state.drafts.find((item) => item.id === state.ui.selectedDraftId);
  const version = draft?.versions.find((item) => item.id === versionId);
  if (!draft || !version) return;
  const restored = saveDraftVersion(draft, version.content);
  state.drafts[state.drafts.findIndex((item) => item.id === draft.id)] = restored;
  persist();
  render();
  toast("历史版本已恢复为新版本");
}

function exportWorkspace() {
  const payload = { ...state, exportedAt: new Date().toISOString() };
  downloadBlob(JSON.stringify(payload, null, 2), `taurisweft-workspace-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
  toast("Workspace 数据已导出");
}

async function importWorkspace(file) {
  try {
    const payload = JSON.parse(await file.text());
    if (payload.version !== 1 || !Array.isArray(payload.briefs) || !Array.isArray(payload.drafts) || !payload.brand) throw new Error("invalid");
    state = { ...createInitialState(), ...payload, ui: { ...createInitialState().ui, ...payload.ui, view: "today" } };
    persist();
    window.location.hash = "today";
    render();
    toast("Workspace 数据已导入");
  } catch {
    toast("导入失败：请选择 TaurisWeft 导出的 JSON 文件", "error");
  }
}

main.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-view]");
  if (!target) return;
  if (target.dataset.view) {
    setView(target.dataset.view);
    return;
  }
  const { action, id, platform, filter, versionId } = target.dataset;
  if (action === "new-brief") setView("research");
  if (action === "load-example") loadExample();
  if (action === "use-brief") { state.ui.selectedBriefId = id; state.ui.selectedDraftId = null; persist(); setView("studio"); }
  if (action === "generate-drafts") generateDraftPair();
  if (action === "open-draft") {
    const draft = state.drafts.find((item) => item.id === id);
    state.ui.selectedDraftId = id;
    state.ui.selectedBriefId = draft?.briefId || null;
    state.ui.platform = draft?.platform || "linkedin";
    persist();
    setView("studio");
  }
  if (action === "switch-platform") {
    const brief = getSelectedBrief();
    state.ui.platform = platform;
    state.ui.selectedDraftId = [...state.drafts].reverse().find((draft) => draft.briefId === brief.id && draft.platform === platform)?.id || null;
    persist();
    render();
  }
  if (action === "save-editor") saveCurrentEditor();
  if (action === "copy-draft") copyDraft(id || state.ui.selectedDraftId);
  if (action === "download-draft") downloadDraft(id || state.ui.selectedDraftId);
  if (action === "mark-ready") markReady();
  if (action === "restore-version") restoreVersion(versionId);
  if (action === "filter-library") { state.ui.libraryFilter = filter; persist(); render(); }
  if (action === "reset-brand") { state.brand = { ...DEFAULT_BRAND }; persist(); render(); toast("Brand Memory 已恢复默认内容"); }
});

document.querySelector(".primary-nav").addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (button) setView(button.dataset.view);
});

document.querySelector("[data-view-link]").addEventListener("click", (event) => {
  event.preventDefault();
  setView(event.currentTarget.dataset.viewLink);
});

document.querySelectorAll("[data-action='new-brief']").forEach((button) => button.addEventListener("click", () => setView("research")));
document.querySelector("[data-dismiss-banner]").addEventListener("click", () => { state.ui.bannerHidden = true; persist(); });
document.querySelector("#export-workspace").addEventListener("click", exportWorkspace);
document.querySelector("#import-workspace").addEventListener("change", (event) => { if (event.target.files[0]) importWorkspace(event.target.files[0]); event.target.value = ""; });
document.querySelector("#mobile-menu").addEventListener("click", (event) => {
  const open = document.body.classList.toggle("nav-open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", () => {
  const view = readViewFromHash();
  if (view !== state.ui.view) { state.ui.view = view; persist(); render(); }
});

render();
