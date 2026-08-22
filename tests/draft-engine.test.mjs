import test from "node:test";
import assert from "node:assert/strict";
import {
  createResearchBrief,
  evaluateReadiness,
  generateDraft,
  normalizeLines,
  saveDraftVersion,
} from "../lib/draft-engine.js";

const brand = {
  audience: "欧洲能源行业的产品与市场负责人",
  primaryTag: "EnergyTransition",
};

const input = {
  title: "动态电价正在成为家庭能源控制层",
  sourceName: "行业研究",
  sourceUrl: "https://example.com/report",
  sourceText: "欧洲市场正在把动态电价、热泵、储能和电动汽车控制组合到同一套家庭能源系统中。",
  claims: "动态电价正在与设备控制融合\n用户价值从看价格转向自动执行",
  tags: "energy, pricing",
};

test("normalizeLines removes bullets and blanks", () => {
  assert.deepEqual(normalizeLines("- one\n\n2. two"), ["one", "two"]);
});

test("createResearchBrief maps claims to a source", () => {
  const brief = createResearchBrief(input, "brief-1");
  assert.equal(brief.claims.length, 2);
  assert.equal(brief.claims[0].citation, "S1");
  assert.equal(brief.claims[0].supported, true);
});

test("platform variants use distinct structures", () => {
  const brief = createResearchBrief(input, "brief-2");
  const linkedin = generateDraft({ brief, brand, platform: "linkedin", angleKey: "product", id: "li" });
  const wechat = generateDraft({ brief, brand, platform: "wechat", angleKey: "product", id: "wx" });
  assert.match(linkedin.content, /三个值得带走的事实/);
  assert.match(wechat.content, /【产品判断】/);
  assert.notEqual(linkedin.content, wechat.content);
});

test("readiness passes for a complete sourced draft", () => {
  const brief = createResearchBrief(input, "brief-3");
  const draft = generateDraft({ brief, brand, platform: "linkedin", angleKey: "market", id: "draft" });
  assert.equal(evaluateReadiness(draft, brief).ready, true);
});

test("editing a ready draft creates a new version and resets status", () => {
  const brief = createResearchBrief(input, "brief-4");
  const draft = { ...generateDraft({ brief, brand, platform: "wechat", angleKey: "founder", id: "draft" }), status: "ready" };
  const updated = saveDraftVersion(draft, `${draft.content}\n补充判断`, "version-2");
  assert.equal(updated.status, "draft");
  assert.equal(updated.versions.length, 2);
});
