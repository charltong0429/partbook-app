import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "about.html",
  "about.css",
  "about.js",
  "lib/draft-engine.js",
  "favicon.svg",
  "assets/brand/taurisweft-mark.svg",
  "assets/brand/taurisweft-lockup.svg",
  "outputs/PRD.md",
];

await Promise.all(requiredFiles.map((file) => access(file)));

const [appHtml, aboutHtml, aboutScript, mark] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("about.html", "utf8"),
  readFile("about.js", "utf8"),
  readFile("assets/brand/taurisweft-mark.svg", "utf8"),
]);

const assertions = [
  [appHtml.includes("TaurisWeft"), "index.html 缺少 TaurisWeft 品牌名"],
  [appHtml.includes('lang="zh-CN"'), "index.html 语言必须为 zh-CN"],
  [appHtml.includes('id="app-main"'), "index.html 缺少工作台挂载点"],
  [aboutHtml.includes("TaurisWeft"), "about.html 缺少 TaurisWeft 品牌名"],
  [aboutHtml.includes('lang="zh-CN"'), "about.html 语言必须为 zh-CN"],
  [aboutHtml.includes("data-voice"), "about.html 缺少可交互的 voice preview"],
  [aboutScript.includes("aria-selected"), "voice tabs 缺少可访问状态更新"],
  [mark.includes("#315CFF"), "Logo SVG 缺少 Signal Cobalt 纬线"],
  [mark.includes("#121826"), "Logo SVG 缺少 Editorial Ink 经线"],
];

const failures = assertions.filter(([passes]) => !passes).map(([, message]) => message);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`TaurisWeft preview check passed (${requiredFiles.length} required files).`);
