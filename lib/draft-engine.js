export const ANGLES = {
  product: {
    label: "产品判断",
    role: "Product Director",
    opening: "从产品角度看，真正值得关注的不是信息本身，而是它会改变哪个用户决定。",
    closing: "我的判断是：先把复杂度变成一个可执行的产品选择，再讨论规模。",
  },
  market: {
    label: "市场变化",
    role: "Market Intelligence",
    opening: "这条信息背后更重要的，是市场竞争边界正在发生变化。",
    closing: "接下来值得持续观察的，是价值从单一产品向系统能力迁移的速度。",
  },
  founder: {
    label: "创始人观点",
    role: "Founder",
    opening: "我越来越相信，专业内容的价值不在于重复新闻，而在于公开自己的判断。",
    closing: "好的判断不需要夸张，但必须让读者知道下一步该看什么。",
  },
};

export const PLATFORMS = {
  linkedin: { label: "LinkedIn", softLimit: 1800 },
  wechat: { label: "微信", softLimit: 900 },
};

export function normalizeLines(value = "") {
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•\d.)\s]+/, "").trim())
    .filter(Boolean);
}

export function summarize(value = "", maxLength = 240) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).replace(/[，。；、,.!?！？\s]+$/, "")}……`;
}

export function createResearchBrief(input, id = crypto.randomUUID()) {
  const claims = normalizeLines(input.claims).map((text, index) => ({
    id: `${id}-claim-${index + 1}`,
    text,
    citation: "S1",
    supported: Boolean(input.sourceText?.trim()),
  }));

  const now = new Date().toISOString();
  return {
    id,
    title: input.title.trim(),
    sourceName: input.sourceName.trim() || "用户提供材料",
    sourceUrl: input.sourceUrl.trim(),
    sourceText: input.sourceText.trim(),
    summary: summarize(input.sourceText),
    claims,
    tags: normalizeLines(input.tags.replaceAll(",", "\n")),
    createdAt: now,
    updatedAt: now,
  };
}

function buildClaimBullets(brief, limit = 4) {
  const claims = brief.claims.slice(0, limit);
  if (!claims.length) return [brief.summary];
  return claims.map((claim) => claim.text);
}

function buildLinkedInDraft(brief, brand, angle) {
  const bullets = buildClaimBullets(brief)
    .map((claim) => `• ${claim}`)
    .join("\n");
  const audience = brand.audience ? `对于${brand.audience}来说，` : "";
  const sourceLine = brief.sourceUrl
    ? `来源：${brief.sourceName} · ${brief.sourceUrl}`
    : `来源：${brief.sourceName}（用户提供材料）`;

  return `${brief.title}\n\n${angle.opening}\n\n${audience}${brief.summary}\n\n三个值得带走的事实：\n${bullets}\n\n${angle.closing}\n\n${sourceLine}\n\n#${brand.primaryTag || "ProfessionalVoice"}`;
}

function buildWechatDraft(brief, brand, angle) {
  const bullets = buildClaimBullets(brief, 3)
    .map((claim, index) => `${index + 1}. ${claim}`)
    .join("\n");
  const sourceLine = brief.sourceUrl
    ? `资料：${brief.sourceName}\n${brief.sourceUrl}`
    : `资料：${brief.sourceName}（用户提供）`;

  return `【${angle.label}】${brief.title}\n\n${brief.summary}\n\n我关注的不是转发这条信息，而是它带来的三个判断：\n\n${bullets}\n\n${angle.closing}\n\n${sourceLine}`;
}

export function generateDraft({ brief, brand, platform, angleKey, id = crypto.randomUUID() }) {
  const angle = ANGLES[angleKey] || ANGLES.product;
  const now = new Date().toISOString();
  const content = platform === "wechat"
    ? buildWechatDraft(brief, brand, angle)
    : buildLinkedInDraft(brief, brand, angle);

  return {
    id,
    briefId: brief.id,
    title: brief.title,
    platform,
    angleKey,
    authorRole: angle.role,
    content,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    copiedAt: null,
    versions: [{ id: `${id}-v1`, content, createdAt: now }],
  };
}

export function evaluateReadiness(draft, brief) {
  const supportedClaims = brief?.claims?.filter((claim) => claim.supported).length || 0;
  const claimCount = brief?.claims?.length || 0;
  const checks = [
    { id: "content", label: "草稿已有正文", pass: draft.content.trim().length >= 120 },
    { id: "source", label: "保留来源说明", pass: draft.content.includes("来源：") || draft.content.includes("资料：") },
    { id: "claims", label: "事实有材料支持", pass: claimCount > 0 && supportedClaims === claimCount },
    { id: "length", label: "长度适合当前平台", pass: draft.content.length <= PLATFORMS[draft.platform].softLimit },
  ];

  return {
    checks,
    ready: checks.every((check) => check.pass),
    score: checks.filter((check) => check.pass).length,
  };
}

export function saveDraftVersion(draft, content, id = crypto.randomUUID()) {
  if (draft.content === content) return draft;
  const now = new Date().toISOString();
  return {
    ...draft,
    content,
    updatedAt: now,
    status: draft.status === "ready" ? "draft" : draft.status,
    versions: [...draft.versions, { id, content, createdAt: now }],
  };
}
