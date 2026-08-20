# Project language

- 项目文档、产品界面、PRD 与用户沟通以简体中文为主。
- 保留通用英文技术术语，例如 AI、MVP、PRD、SaaS、API、RAG、Agent、GitHub、Vercel Preview。
- 代码标识符、文件名、提交信息和 API 字段使用英文。

## Deploy Configuration

- Platform: Vercel
- Deployment target: Preview only until the user explicitly authorizes Production
- Preview command: `vercel --yes`
- Explicit Preview command: `vercel deploy --target preview --yes`
- Protected Preview URL: `https://taurisweft-p40ykb4ps-shaochen-jis-projects.vercel.app`
- Public URL: `https://taurisweft.vercel.app`
- Note: the project's first plain `vercel --yes` deployment was classified by Vercel as Production; use the explicit Preview command above for future previews.
- Health check: load Preview URL, verify page content, interaction, console errors, and responsive layout
