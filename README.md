# TaurisWeft

**One source. Many trusted voices.**

TaurisWeft 是一个面向专业人士与企业团队的 AI Social Content OS，帮助个人和团队把可信来源转化为适合不同成员、不同渠道的专业内容。

- 在线品牌预览：https://taurisweft.vercel.app
- GitHub：https://github.com/charltong0429/partbook-app
- 当前阶段：品牌方向（Signal Loom）已确认；已有一个 local-first 可交互原型（`index.html` / `app.js`），品牌介绍页迁至 `about.html`

## 当前阶段

项目处于 Focused Team MVP 的早期实现阶段。`index.html` 现在是可交互的工作台原型（今日工作台 / Research / Studio / Library / Brand Memory），覆盖 PRD Path A 的核心流程骨架：手工输入 source → 生成 Research Brief → LinkedIn/微信双版本草稿 → readiness 检查 → Copy/Download → 版本历史，全部数据保存在浏览器 `localStorage`。草稿内容目前由模板拼接生成（`lib/draft-engine.js`），尚未接入真实 AI provider、账号体系或后端持久化。旧版品牌预览页（voice tabs）保留在 `about.html`。

## 项目文档

- `outputs/PRD.md`：详细中文 PRD
- `outputs/product-discovery.md`：Product Discovery
- `outputs/brand/`：命名、定位、Logo 方向、品牌信息与使用规范

## 开发与部署

- Source control：GitHub
- Preview deployment：Vercel Preview
- Production branch：`main`
- Product language：简体中文为主，保留常用英文技术术语
