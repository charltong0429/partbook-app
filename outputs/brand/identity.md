# Partbook Visual Identity Brief

## 01 — Identity Strategy

Partbook 的视觉应像一间现代编辑室，而不是一个“AI 魔法工具”。系统感来自严格网格、谱线与清晰状态；人性来自纸张质感、编辑批注和可见的个人声部。整体应专业、克制、可信，但不能像传统 Enterprise SaaS 那样冷硬。

## 02 — Logo Direction

### Primary Direction

采用 **symbol + wordmark**。符号由一条竖直书脊与 3–4 条平行“声部线”构成：线条从同一源点进入，在右侧形成不同长度和节奏，同时负空间读出字母 `P`。它同时像：

- 打开的 Partbook；
- 乐谱中的多个声部；
- 编辑器中的多行文字；
- 从共同 source 分出的多平台内容。

### Character

精确、沉着、有节奏；不是未来主义、不是娱乐型社交应用，也不是传统出版机构。

### Style Notes

- 构造型几何 Logo，线端略带人文切角。
- 1 色时必须成立，优先横向 lockup。
- App icon 使用 `P + 三条声部线`，在 16px 仍可辨认。
- Motion 版本可让一条输入线分成多声部，再在末端停成发布就绪状态。

### Avoid

- AI sparkle、机器人头、脑神经网络、火箭、魔法棒。
- 通用 speech bubble、点赞手势、LinkedIn 蓝。
- 复杂的节点网络、渐变霓虹、3D 玻璃球。
- 把书本画得过于字面或教育产品化。

### Reference Qualities

- **Linear**：借鉴其紧凑几何与产品精度，不复制其字形或紫色光效。
- **Stripe**：借鉴其专业而不官僚的 wordmark 可信度。
- **IBM 8-bar mark**：借鉴“平行线能构成一个强符号”的原则，不复制条纹数量和轮廓。

## 03 — Color Palette

| Role | Name | Hex | Use |
|---|---|---:|---|
| Primary | Editorial Ink | `#121826` | Logo、正文、深色背景 |
| Primary accent | Signal Cobalt | `#315CFF` | 主要 CTA、选中态、声部线 |
| Background | Paper | `#F6F4EE` | 主背景、编辑面板 |
| Neutral | Mist | `#E7E9EE` | 分隔线、禁用态、卡片 |
| Accent | Editor Coral | `#FF6B4A` | 批注、需要人工确认的状态 |
| Success | Proof Mint | `#72D6AE` | 来源已核验、发布就绪 |

主组合为 Ink on Paper；Cobalt 只用于动作与焦点。Coral 不用于错误，专门代表“Human judgment required”。错误使用更深的 red，避免把人工审核语义和失败混在一起。

## 04 — Typography

- **Display / Brand**：Instrument Sans，使用 600–700，紧凑字距，适合 wordmark 与产品标题。
- **Editorial accent**：Newsreader，使用在研究摘要、观点标题和品牌内容，而非大面积 UI。
- **Product UI**：Geist Sans 或系统 sans fallback，保证 Vercel 环境、表格和多语言可读性。
- **中文 fallback**：`PingFang SC`, `Noto Sans SC`, system-ui。

层级建议：H1 48–64 / 1.05；H2 32–40 / 1.15；Body 16–18 / 1.55；UI Label 12–14 / 1.3。

## 05 — Imagery

- 使用真实的编辑过程：source cards、标注、草稿差异、多人观点，而不是办公桌前微笑的 stock photo。
- 行业图像应体现真实环境与证据，例如能源设备、市场图表、文件片段；保留出处和拍摄/授权信息。
- AI 生成图需要标记来源，并避免冒充新闻现场或真实人物。

## 06 — Iconography

使用 1.75px–2px 的线性图标，圆角适中。图标表达 Source、Angle、Voice、Review、Ready、Channel 六类核心状态；高风险发布动作必须有明确文字标签，不仅依靠图标。

## 07 — Design Principles

1. **Evidence before effect**：先显示来源、状态与可核验性，再显示视觉效果。
2. **Many voices, one rhythm**：组件允许个性变化，但网格、间距与状态语言保持一致。
3. **Human judgment is visible**：审核、修改和拒绝不是隐藏步骤，而是视觉系统的一部分。
4. **Editorial density, product clarity**：允许信息密度，但每屏只突出一个主要动作。

## 08 — Brand Expressions

- **Website**：首屏使用 Partbook 符号的“单线分声部”动效，主 CTA 指向创建第一份 Research Brief。
- **App**：左侧 source 与 workflow，中央 editor，右侧 platform preview；颜色用于状态而非装饰。
- **Social cards**：Paper 背景、Ink 文字、Cobalt 声部线；右下角使用小型 `P` mark 与 source count。
- **Deck**：每页只保留一个关键观点，引用与证据固定在底部 rail。
- **Profile assets**：头像框、banner 和 Featured cards 均使用相同声部线，不用重复 Logo 满版。

