# TaskFlow — 极简任务流 Kanban

一个支持多用户、自定义列的 Kanban 全栈应用。

## 快速开始

```bash
pnpm install
pnpm dev
```

- 前端：http://localhost:5173
- 后端：http://localhost:4000

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React + Vite + TypeScript + react-dnd + TailwindCSS |
| 后端 | Node + Express + TypeScript |
| 数据库 | Prisma + SQLite（开发）/ PostgreSQL（生产） |

## 项目结构

```
apps/
├── web/    → React SPA
└── api/    → Express REST API
```
