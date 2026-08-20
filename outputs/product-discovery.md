# TaurisWeft 产品发现结论

日期：2026-08-20  
状态：Discovery synthesis complete；允许生成 PRD，但保留待验证假设。

## 0. 标记规则

- **[已确认]**：用户在原对话或本次请求中明确提出。
- **[推断]**：根据上下文形成的合理判断，尚未由用户逐项确认。
- **[建议]**：基于产品发现方法给出的收敛方案。
- **[待验证]**：会显著影响范围、商业模式或架构的未知项。

用户本次明确要求“完成产品发现并生成详细中文 PRD”，因此本文件在已有信息足够形成方向时继续产出，不追加阻塞式访谈；缺口进入 PRD 的待确认与验证计划。

## 1. 产品原点

**[已确认]** 起点是创始用户希望直接用 AI/Agent 持续控制和优化自己的 LinkedIn 专业形象，但不满足于本地命令行工具。

**[已确认]** 产品必须成为可与同事共享的 Web 应用，覆盖：

- 行业信息检索与选题；
- 写稿、改写与配图；
- 平台页面预览；
- 一键复制、下载与打开目标平台；
- 个人 LinkedIn Profile / CV 优化；
- 团队员工账号与 Company Page 构成的信息矩阵；
- LinkedIn、Facebook、微信及未来更多平台；
- 有 API 时合规接入，无 API 时接受 Copy/Paste 模式；
- GitHub 仓库开发，Vercel Preview 在线验收。

## 2. 第一个真实用户

### 第一用户

**[推断，置信度高]** 第一用户是创始用户本人：欧洲能源行业的 Product Director，需要围绕 PV、BESS、Heat Pump、EMS/VPP、欧洲市场与 AI + Energy 持续输出专业内容，并优化个人职业定位。

成功标准不是“生成了一篇文章”，而是：

> 在 3 分钟左右，从可信 source 到一份本人愿意署名、只差按 Publish 的 LinkedIn/微信内容。

### 第二批用户

**[已确认方向，待验证行为]** DifferPower 的产品、销售、市场、技术与国家经理。他们共享公司知识与 campaign，但需要不同角度和个人语气。

### 使用者、付费者、决策者

- **MVP 使用者**：[推断] 创始用户 + 3–8 名 DifferPower 同事。
- **内部决策者**：[推断] 创始用户/产品负责人。
- **外部 SaaS 付费者**：[待验证] 企业市场负责人、Employee Advocacy 负责人或团队负责人。
- **个人版付费者**：[待验证] 独立专业人士、顾问、销售与高管。

## 3. 真实触发场景

用户打开产品前的典型 5 分钟：

1. 看到一条行业新闻、政策变化、产品资料或公司 Campaign。
2. 知道“应该发点什么”，但没有清晰角度、证据结构或平台版本。
3. 在搜索、ChatGPT/Claude、Notion/Docs、Canva 与社交平台之间来回复制。
4. 担心事实不准、AI 味太重、员工文案重复或平台语气不自然。
5. 因为准备成本高而推迟发布，或发布一条本人不够满意的内容。

## 4. 问题深度

### 已确认痛点

- **高频创作摩擦**：Research、Draft、Visual、Preview、Publish handoff 被多个工具割裂。
- **个人声音缺失**：通用 AI 输出不能持续反映角色、经历、观点与表达禁区。
- **跨平台失真**：LinkedIn 文案不能直接翻译成朋友圈或 Facebook 内容。
- **团队同质化**：员工转发同一公司文案无法形成可信的信息矩阵。
- **Profile 与内容脱节**：Headline/About/Experience 与日常内容没有共享职业定位。

### 成本

- **[待量化]** 每周选题、写稿、配图和改平台版本所耗时间。
- **[待量化]** 因事实错误、口径冲突或低质量 AI 文案产生的品牌风险。
- **[推断]** 最大机会成本不是单篇写作时间，而是长期不稳定输出导致专业影响力无法积累。

## 5. 当前替代方案

当前最强竞争对手不是单个 SaaS，而是拼接流程：

`Search/RSS → ChatGPT/Claude → Notion/Docs → Canva → 手工预览 → Copy/Paste → 各平台`

团队还会增加：

`Campaign 文档 → 群聊/会议分工 → 多人重复改稿 → 手工审批`

不足：上下文不能持续、source 与 claim 断开、个人 voice 无法沉淀、不同平台版本难管理、修改反馈不回流、团队角度无法系统去重。

## 6. 需求证据

### 中等信号

- 创始用户明确把个人 Profile/CV 优化定义为“刚需”。
- Research → Draft → Visual → Preview → Copy 被定义为“极度需要”。
- 用户接受无 API 的复制粘贴，说明核心需求是 ready-to-publish，而非自动发布。
- 用户主动要求建立 GitHub/Vercel 开发路径，投入意愿高于口头兴趣。

### 仍缺少的强证据

- 尚无外部用户付费、预付或签署设计伙伴承诺。
- 尚未观察 5 名同事在无指导状态下完成现状流程。
- 尚未量化每周耗时、发布频率、返工率与错误成本。
- 尚未证明外部企业愿意为 Brand Memory + Content Matrix 而非通用 AI 工具付费。

**结论**：有充分理由做内部 MVP；没有充分证据直接建设完整多租户 SaaS 或 Billing。

## 7. 核心 Jobs-to-be-Done

### 个人

> 当我发现一个值得讨论的行业主题时，我想快速得到有来源、符合我职业定位、适配目标平台的内容和配图，以便我能放心修改并发布，而不是从空白页开始。

### 团队

> 当公司需要围绕一个主题形成市场声量时，我想让不同岗位基于同一事实基础表达互补观点，以便建立可信的团队专业形象，而不是让所有人机械转发。

### Profile

> 当我的职业目标、职责或专业重点变化时，我想让 Profile/CV 与长期内容定位一起更新，以便别人看到的身份与我持续表达的观点一致。

## 8. 价值时刻

第一次“值了”的时刻不是登录或生成，而是：

1. 用户选择一个 Research Brief；
2. 系统引用可信 source 并生成一个本人认可的 angle；
3. LinkedIn 与微信版本明显不同但事实一致；
4. 用户只需轻度修改，就复制文字、下载图片并打开目标平台。

## 9. 最窄切口

**[建议]** 第一版只服务一个 workspace、一个行业团队、两类渠道：LinkedIn personal + WeChat Moments。

最小闭环：

`Paste URL / 输入主题 → Source-grounded Brief → 选择个人 angle → LinkedIn + 微信版本 → 编辑/配图 → Preview → Copy/Download`

同时保留一个窄版 Profile Optimizer，因为这是创始用户明确刚需，也是 Personal Brand Memory 的初始数据来源。

故意不做：自动发帖、自动点赞评论、Company Page API、Facebook/Instagram/X 全量适配、公开 Billing、复杂 Campaign、企业 SSO、实时协作。

## 10. 三条产品路径

### A. Concierge Validation

- **形态**：不登录或单用户；人工整理 source，AI 生成，用户复制。
- **成本**：最低，可在数天内验证。
- **风险**：无法验证团队协作、Brand Memory 和长期留存。
- **适合**：需求证据仍非常弱时。

### B. Focused Team MVP — 推荐

- **形态**：Web App；单 workspace；基础成员邀请；Brand Memory；source-grounded content loop；Profile Optimizer。
- **成本**：中等。
- **优势**：同时验证个人价值与 DifferPower 团队扩展，不提前承担多租户/Billing/API 发布复杂度。
- **主要风险**：P0 仍较多，需要严格限制平台、视觉模板与权限层级。

### C. Platform-first SaaS

- **形态**：多租户、Billing、Channel API、Content Matrix、Company Page interaction、Analytics 一次到位。
- **成本**：高。
- **风险**：在需求和分发未验证前建设大量基础设施；最容易把产品做成“功能很多、留存未知”。
- **结论**：不推荐作为第一版。

## 11. AI 的角色

AI 是核心工作流加速器，但不是最终责任主体：

- **Search / Synthesis**：把 sources 组织成 Research Brief。
- **Recommendation**：建议 angle、content pillar、平台版本。
- **Generation**：草稿、标题、配图 brief、图表与模板内容。
- **Transformation**：在语言、平台、受众之间改写。
- **Analysis**：Profile/CV gap、voice consistency、内容重复度。
- **不承担**：未经确认的对外发布、自动互动、无法解释的事实判断。

必须具备 source citation、editable draft、human approval、version history、retry/fallback 和 audit log。

## 12. 商业模式假设

- **内部 Pilot**：不收费，验证真实工作流。
- **个人 Pro**：[待验证] 月订阅 + AI 用量公平上限。
- **Team**：[待验证] workspace 基础费 + seat + 高用量包。
- **Enterprise**：未来为 SSO、审计、治理、定制数据源和合规付费。

在 10 名以上外部活跃设计伙伴或 3 个付费承诺出现前，不实现复杂 Billing。

## 13. 三年适配判断

**[推断]** 通用模型会让“生成一篇帖子”越来越便宜，因此单次生成不会成为护城河。TaurisWeft 只有在以下能力持续增强时才会更必要：

- 私有 Brand Memory 与用户修改反馈；
- source、claim 与版本的信任链；
- 团队 Content Matrix 与审批关系；
- 平台适配知识与合规 handoff；
- 可替换模型的任务级 eval 与成本路由。

## 14. 前提挑战

当前方案依赖五个关键前提：

1. 第一批用户愿意持续输入真实 Profile、source 与修改反馈。
2. “有来源 + 个人 voice”比通用 AI 文案带来足够明显的质量差异。
3. 用户愿意在 TaurisWeft 完成编辑，再手工发布，而不会嫌流程多一层。
4. 团队成员确实需要互补角度，而不仅是市场部门统一代写。
5. 用户会每周复用，产品不是一次性 Profile 优化工具。

**风险最大的是第 3 条**：如果 Copy/Paste handoff 仍然摩擦过大，用户会回到原工具。MVP 必须把 Ready → Copy text → Download images → Open channel 做到几乎无思考成本。

## 15. 48 小时验证建议

1. 找 5 名目标用户，其中至少 3 名为 DifferPower 不同岗位同事。
2. 不指导，观察他们完成一次“从 source 到 LinkedIn/朋友圈”的现状流程。
3. 记录总时间、切换工具数、复制次数、事实核验方式、放弃点。
4. 用 Figma/可点击原型或 Concierge 流程交付同一结果。
5. 询问并观察：是否愿意导入真实 Profile；是否愿意下周再用；是否愿意让团队共享 source；是否愿意为结果付费或承诺固定试用周期。

## 16. Discovery Decision

**推荐进入 Focused Team MVP 的设计与实现，但先完成 48 小时观察验证。** PRD 可以立即用于信息架构、原型和技术骨架；多租户 Billing、外部发布 API 与企业治理保持在 Roadmap，不能混入 MVP 完成定义。
