# TaskFlow 课件改造 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将课件实验项目从「校园 3D 漫游（Three.js）」完整替换为「TaskFlow 任务管理看板」，改 6 个源文件，构建单 HTML。

**Architecture:** 纯文本替换类改动，不动组件结构和 UI 框架。6 个文件中 4 个重写（ProjectBrief / StepByStepManual / labManualHtml），2 个局部修改（AssessmentSection / HandoutsSection / conceptHandoutHtml），最后 `pnpm build` 产出单 HTML。

**Tech Stack:** React 18 + TypeScript + TailwindCSS + Vite + vite-plugin-singlefile

---

### Task 1: 重写 ProjectBrief.tsx — 实验项目介绍

**Files:**
- Modify: `src/app/components/ProjectBrief.tsx`（整个组件重写）

- [ ] **Step 1: 替换 ProjectBrief 组件内容**

用以下代码完整替换 [ProjectBrief.tsx](src/app/components/ProjectBrief.tsx)：

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Database, Server, MonitorSmartphone, Lightbulb } from "lucide-react";

const alts = [
  { title: "招聘需求看板", body: "HR 管理候选人，拖拽卡片在多轮面试间流转，数据持久化到后端。" },
  { title: "课程作业追踪", body: "学生管理各科作业进度，按截止日期排序，完成后归档。" },
  { title: "Bug 追踪面板", body: "开发团队管理缺陷，按优先级排列，分配修复人，标记已解决。" },
];

export function ProjectBrief() {
  return (
    <section id="project" className="bg-secondary">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Badge>模块 03 · 实验项目</Badge>
          <h2 className="mt-2">TaskFlow — 极简任务流 Kanban</h2>
          <p className="text-muted-foreground">
            一个支持多用户、自定义列的 Kanban 全栈应用，复杂度适中，既能完整跑通技术栈，又能在一次实验内完成。
            学生输入用户名即可创建看板，拖拽卡片在列间流转，为任务添加标签、指派人、评论，数据全部写入真实数据库。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <MonitorSmartphone className="size-5 text-primary" />
              <CardTitle>前端</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>React + react-dnd 构建拖拽 Kanban，支持列增删、卡片拖拽排序、任务详情弹窗（标题/描述/优先级/截止日期/标签/指派人/评论），以及用户名登录。</p>
              <div className="flex flex-wrap gap-1.5">
                {["React", "Vite", "react-dnd", "react-dnd-html5-backend", "TailwindCSS"].map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Server className="size-5 text-primary" />
              <CardTitle>后端</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>Express REST API，提供 <code>/boards</code>、<code>/columns</code>、<code>/tasks</code>、<code>/comments</code> 接口，支持拖拽排序持久化、输入校验与 CORS。</p>
              <div className="flex flex-wrap gap-1.5">
                {["Node", "Express"].map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Database className="size-5 text-primary" />
              <CardTitle>数据库</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>Prisma 定义 User → Board → Column → Task → Comment → Tag 六张表，本地用 SQLite，生产环境切换 PostgreSQL。</p>
              <div className="flex flex-wrap gap-1.5">
                {["Prisma", "PostgreSQL"].map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Lightbulb className="size-5 text-primary" />
            <CardTitle>可替换的项目主题</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {alts.map((a) => (
                <div key={a.title} className="rounded-lg border border-border p-4 bg-background">
                  <div>{a.title}</div>
                  <p className="text-muted-foreground mt-1">{a.body}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/components/ProjectBrief.tsx
git commit -m "feat(taskflow): 实验项目从 3D 漫游改为 TaskFlow 看板"
```

---

### Task 2: 重写 StepByStepManual.tsx — 9 阶段提示词

**Files:**
- Modify: `src/app/components/StepByStepManual.tsx`（替换 phases 数组）

- [ ] **Step 1: 替换 phases 数组**

在 [StepByStepManual.tsx](src/app/components/StepByStepManual.tsx) 中，替换 `const phases: Phase[] = [...]` 整个数组为：

```typescript
const phases: Phase[] = [
  {
    id: "p0",
    title: "阶段 0 — 环境准备",
    blurb: "安装 Node、pnpm、Claude Code，并启用 Harness + Superpowers。",
    traditional: "翻阅三份安装文档、排查 PATH 问题，期望各版本兼容。",
    prompt: `# 在任意 shell 中执行
npm i -g pnpm @anthropic-ai/claude-code
claude login
/plugin install superpowers@claude-plugins-official
claude doctor`,
  },
  {
    id: "p1",
    title: "阶段 1 — 项目初始化",
    blurb: "用一段描述让 Agent 搭好整个 monorepo。",
    traditional: "手写 pnpm-workspace.yaml、两个 package.json 和 tsconfig 路径。",
    prompt: `初始化一个 pnpm monorepo，包含 apps/web（Vite + React + TS +
react-dnd + react-dnd-html5-backend + tailwind）和 apps/api（Node + Express +
TS + Prisma + SQLite）。用 concurrently 让 'pnpm dev' 一键启动两者，
并生成 README。`,
  },
  {
    id: "p2",
    title: "阶段 2 — 前端脚手架",
    blurb: "搭建可拖拽的三列 Kanban 看板布局。",
    traditional: "读 react-dnd 文档，手写拖拽逻辑和状态管理。",
    prompt: `在 apps/web 中创建一个三列 Kanban 看板（待办、进行中、完成），
使用 react-dnd 实现卡片在列间拖拽移动。每列顶部显示列名，
底部有"添加卡片"按钮。点击卡片弹出右侧 Tailwind 详情面板，
显示标题和（之后接入的）评论。`,
  },
  {
    id: "p3",
    title: "阶段 3 — 后端脚手架",
    blurb: "用 Express 暴露看板需要的全部接口。",
    traditional: "搭 Express 模板、配 CORS、串通 ts-node。",
    prompt: `在 apps/api 中启动 Express 服务，端口 4000，允许 http://localhost:5173
跨域。提供以下路由：
  GET    /boards/:userId
  POST   /boards              { title }
  GET    /boards/:id/columns
  POST   /columns              { boardId, title }
  DELETE /columns/:id
  GET    /columns/:id/tasks
  POST   /tasks                { columnId, title }
  PATCH  /tasks/:id/move       { targetColumnId, position }
  PATCH  /tasks/:id            { title?, description?, priority?, dueDate?, assignee? }
  GET    /tasks/:id/comments
  POST   /tasks/:id/comments   { author, text }`,
  },
  {
    id: "p4",
    title: "阶段 4 — 数据库 Schema 与迁移",
    blurb: "建模 User → Board → Column → Task → Comment → Tag，执行迁移并填充种子数据。",
    traditional: "手写 SQL 迁移、调试外键。",
    prompt: `创建 Prisma 模型：
User(id, name 唯一, createdAt)
Board(id, title, userId FK, createdAt)
Column(id, boardId FK, title, position Int, createdAt)
Task(id, columnId FK, title, description?, priority Enum(LOW/MEDIUM/HIGH),
  dueDate?, assignee?, position Int, createdAt)
Comment(id, taskId FK, author, text, createdAt)
Tag(id, name 唯一)
TaskTag(taskId FK, tagId FK)
执行 prisma migrate dev --name init，并写入种子数据：1 个用户 + 1 个看板 + 3 列 + 若干示例任务。`,
  },
  {
    id: "p5",
    title: "阶段 5 — 前后端联调",
    blurb: "通过类型化 client，把 Kanban 接入真实 API。",
    traditional: "手写 fetch 封装，手敲响应类型。",
    prompt: `在 apps/web/src/api.ts 中实现一个类型化的 API client，
指向 http://localhost:4000。看板加载时拉取列和任务，渲染到 Kanban 中。
拖拽卡片到新列后调用 PATCH /tasks/:id/move 持久化列和位置。
添加列功能调用 POST /columns，删除列调用 DELETE /columns/:id。
任务详情面板中的编辑操作同步到后端。`,
  },
  {
    id: "p6",
    title: "阶段 6 — 迭代打磨",
    blurb: "用一连串小提示打磨体验。",
    traditional: "提交大量小 commit，频繁上下文切换。",
    prompt: `给每列分配独立颜色条（待办=蓝、进行中=黄、完成=绿）。
任务卡片显示优先级角标（红/橙/灰）和截止日期。
任务详情面板增加：标签输入（TagInput，可新建/删除标签）、
指派人输入、评论列表 + 发表评论表单。
评论加载时显示骨架屏。`,
  },
  {
    id: "p7",
    title: "阶段 7 — 测试与调试",
    blurb: "让 Agent 写测试并定位失败。",
    traditional: "手写 vitest 用例，追踪闪烁的测试。",
    prompt: `为 apps/api 接入 vitest。编写以下测试：
1. POST /columns — 正常创建、缺少 boardId 返回 400
2. PATCH /tasks/:id/move — 拖拽到另一列、缺少 targetColumnId 返回 400
3. POST /tasks/:id/comments — 正常添加评论、空文本返回 400
4. GET /boards/:id/columns — 列按 position 排序
使用独立的测试 SQLite 文件。在根目录串通 'pnpm test'。
提交前运行 /code-review。`,
  },
  {
    id: "p8",
    title: "阶段 8 — 部署上线",
    blurb: "前端部署到 Vercel，后端 + Postgres 部署到 Render。",
    traditional: "对照三份部署文档，反复排查生产环境的 CORS。",
    prompt: `准备生产部署：将 Prisma provider 切换为 postgresql，构建步骤
执行 'prisma migrate deploy'。为 API 增加 /health 路由。
在 README 中写清 Vercel（web）与 Render（api + pg）的部署步骤，
并列出需要配置的环境变量。`,
  },
];
```

- [ ] **Step 2: 提交**

```bash
git add src/app/components/StepByStepManual.tsx
git commit -m "feat(taskflow): 9 阶段提示词从 3D 漫游改为 TaskFlow 看板"
```

---

### Task 3: 修改 AssessmentSection.tsx — 评分量规

**Files:**
- Modify: `src/app/components/AssessmentSection.tsx:5-5`（rubric 数组第 1 行）

- [ ] **Step 1: 替换评分量规第一行**

在 [AssessmentSection.tsx](src/app/components/AssessmentSection.tsx) 第 5-11 行，将 rubric 数组第一行替换：

旧：
```typescript
const rubric = [
  ["功能完整度", "30%", "3D 场景可加载，建筑可点击，评论可持久化。"],
```

新：
```typescript
const rubric = [
  ["功能完整度", "30%", "看板列可增删，卡片可拖拽排序，评论与标签可持久化。"],
```

其余行不变。

- [ ] **Step 2: 提交**

```bash
git add src/app/components/AssessmentSection.tsx
git commit -m "feat(taskflow): 评分量规从 3D 场景改为看板拖拽"
```

---

### Task 4: 修改 HandoutsSection.tsx — 讲义标题和描述

**Files:**
- Modify: `src/app/components/HandoutsSection.tsx:59-59`（CardTitle 文本）

- [ ] **Step 1: 替换讲义 CardTitle**

在 [HandoutsSection.tsx](src/app/components/HandoutsSection.tsx) 第 59 行：

旧：
```tsx
<CardTitle>实验手册 — 校园 3D 漫游</CardTitle>
```

新：
```tsx
<CardTitle>实验手册 — TaskFlow 任务看板</CardTitle>
```

第 44-45 行的概念讲义描述中，「3D 画廊」→「任务看板」：
旧：
```tsx
<p className="text-muted-foreground">
  术语定义、对比表、Vibe Coding 循环、AI 辅助的适用边界，以及学术诚信指南。
</p>
```
（这行没有 3D 相关内容，保持不变）

第 62-63 行的实验手册描述：
旧：
```tsx
<p className="text-muted-foreground">
  九个阶段，从 <code>mkdir</code> 到部署上线，附带可复制的 Claude Code 提示词与提交清单。
</p>
```
（也没有 3D 相关，保持不变。但实际在第 56-63 行间，实验手册的 Card 描述需要确认）

实际检查：第 62-63 行内容已经是通用的，不需要改。只需改第 59 行的 CardTitle。

- [ ] **Step 2: 提交**

```bash
git add src/app/components/HandoutsSection.tsx
git commit -m "feat(taskflow): 讲义标题从 3D 漫游改为 TaskFlow 看板"
```

---

### Task 5: 重写 labManualHtml.ts — 实验手册 HTML

**Files:**
- Modify: `src/app/components/handouts/labManualHtml.ts`（整个字符串重写）

- [ ] **Step 1: 完整替换 HTML 字符串**

用以下代码完整替换 [labManualHtml.ts](src/app/components/handouts/labManualHtml.ts)：

```typescript
export const labManualHtml = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>实验手册 — 使用 Claude Code Vibe Coding 构建 TaskFlow 任务看板</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  :root{--bg:#fff;--fg:#0b0b14;--muted:#5b5b6e;--accent:#2563eb;--card:#f7f7fa;--border:#e5e5ec;--codebg:#0b0b14;--codefg:#e6e6f0}
  *{box-sizing:border-box}
  body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fg);background:var(--bg);line-height:1.6}
  .wrap{max-width:920px;margin:0 auto;padding:48px 32px}
  header{border-bottom:1px solid var(--border);padding-bottom:24px;margin-bottom:32px}
  h1{font-size:32px;margin:0 0 8px}
  h2{font-size:22px;margin:36px 0 12px;border-left:4px solid var(--accent);padding-left:12px}
  h3{font-size:18px;margin:20px 0 8px}
  .meta{color:var(--muted);font-size:14px}
  pre{background:var(--codebg);color:var(--codefg);padding:14px 16px;border-radius:10px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.5;position:relative}
  .copy-btn{position:absolute;top:8px;right:8px;padding:4px 8px;border:none;border-radius:6px;background:var(--accent);color:#fff;font-size:12px;cursor:pointer;opacity:0;transition:opacity .2s}
  pre:hover .copy-btn{opacity:1}
  .copy-btn.copied{background:#16a34a}
  code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
  p code, li code{background:#f1f1f5;padding:2px 6px;border-radius:4px;font-size:13px}
  .card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;margin:12px 0}
  .phase{border:1px solid var(--border);border-radius:14px;padding:18px 22px;margin:18px 0;background:#fff}
  .phase h3{margin-top:0}
  .pill{display:inline-block;background:var(--accent);color:#fff;border-radius:999px;padding:2px 10px;font-size:12px;margin-right:8px}
  .twocol{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  @media(max-width:720px){.twocol{grid-template-columns:1fr}}
  .label{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:4px}
  footer{margin-top:48px;padding-top:16px;border-top:1px solid var(--border);color:var(--muted);font-size:13px}
  @media print{.wrap{padding:0}pre{font-size:11px}}
</style>
</head>
<body>
<div class="wrap">
<header>
  <span class="pill">实验手册</span><span class="pill">项目：TaskFlow 任务看板</span>
  <h1>使用 Vibe Coding 构建 Kanban 全栈应用</h1>
  <p class="meta">从 <code>mkdir</code> 到部署上线，由 Claude Code、Harness 和 Superpowers 全程引导。</p>
</header>

<h2>项目概述</h2>
<div class="card">
  <p><b>TaskFlow — 极简任务流 Kanban</b>— 一个支持多用户、自定义列的任务管理看板。用户输入用户名即可创建看板，拖拽卡片在列间流转，为任务添加标签、指派人、评论，数据全部写入真实数据库。</p>
  <p><b>技术栈：</b>React + Vite、react-dnd（拖拽）、Node/Express、Prisma ORM、PostgreSQL（开发环境使用 SQLite）。</p>
  <p><b>预计耗时：</b>两人一组约 4-6 小时。</p>
</div>

<h2>阶段 0 — 环境准备</h2>
<div class="phase">
  <h3>安装前置依赖</h3>
  <pre># Node 20+（如果没有，请使用 nvm 安装）
node -v
# pnpm
npm i -g pnpm
# Claude Code CLI
npm i -g @anthropic-ai/claude-code
# 登录认证
claude login</pre>
  <h3>启用 Harness 和 Superpowers</h3>
  <p>在任意工作目录下执行：</p>
  <pre># 安装 Superpowers 插件包（技能 + Agent）
/plugin install superpowers@claude-plugins-official
# 确认 Harness 沙箱已激活
claude doctor</pre>
</div>

<h2>阶段 1 — 项目初始化（Vibe Coding）</h2>
<div class="phase">
  <pre>mkdir taskflow && cd taskflow
claude</pre>
  <p>在 Claude Code 会话中，粘贴以下提示词：</p>
  <pre>初始化一个 pnpm monorepo，包含两个子包：
- apps/web   → Vite + React + TypeScript + react-dnd + react-dnd-html5-backend + tailwind
- apps/api   → Node + Express + TypeScript + Prisma + SQLite
添加根目录的 pnpm-workspace.yaml。设置脚本使 'pnpm dev' 能通过
concurrently 同时运行两个服务。创建 README 文档说明如何运行。</pre>
  <div class="twocol">
    <div class="card"><div class="label">传统方式</div>手动编写两个 package.json、配置 tsconfig 路径、调试 Vite 插件顺序。需要 1-2 小时。</div>
    <div class="card"><div class="label">Vibe 方式</div>Agent 自动搭建两个项目，<code>pnpm dev</code> 报错时自行修复。约 10 分钟。</div>
  </div>
</div>

<h2>阶段 2 — 前端 Kanban 搭建</h2>
<div class="phase">
  <pre>在 apps/web 中创建一个三列 Kanban 看板（待办、进行中、完成），
使用 react-dnd 实现卡片在列间拖拽移动。每列顶部显示列名，
底部有"添加卡片"按钮。点击卡片弹出右侧 Tailwind 详情面板，
显示标题和（稍后）从 API 获取的评论。</pre>
  <p>让 Agent 使用 <code>/verify</code> 超能力在浏览器中验证效果。</p>
</div>

<h2>阶段 3 — 后端搭建</h2>
<div class="phase">
  <pre>在 apps/api 中，搭建一个运行在 4000 端口的 Express 服务器，
启用 CORS 允许 http://localhost:5173 访问。添加路由：
  GET    /boards/:userId
  POST   /boards              { title }
  GET    /boards/:id/columns
  POST   /columns              { boardId, title }
  DELETE /columns/:id
  GET    /columns/:id/tasks
  POST   /tasks                { columnId, title }
  PATCH  /tasks/:id/move       { targetColumnId, position }
  PATCH  /tasks/:id            { title?, description?, priority?, dueDate?, assignee? }
  GET    /tasks/:id/comments
  POST   /tasks/:id/comments   { author, text }
使用 Prisma + SQLite，数据库文件位于 apps/api/dev.db。</pre>
</div>

<h2>阶段 4 — 数据库 Schema 与迁移</h2>
<div class="phase">
  <pre>创建以下 Prisma schema：

model User {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  createdAt DateTime @default(now())
  boards    Board[]
}
model Board {
  id        Int      @id @default(autoincrement())
  title     String
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  columns   Column[]
}
model Column {
  id        Int      @id @default(autoincrement())
  boardId   Int
  board     Board    @relation(fields: [boardId], references: [id])
  title     String
  position  Int
  createdAt DateTime @default(now())
  tasks     Task[]
}
model Task {
  id          Int       @id @default(autoincrement())
  columnId    Int
  column      Column    @relation(fields: [columnId], references: [id])
  title       String
  description String?
  priority    Priority  @default(MEDIUM)
  dueDate     String?
  assignee    String?
  position    Int
  createdAt   DateTime  @default(now())
  comments    Comment[]
  tags        TaskTag[]
}
model Comment {
  id        Int      @id @default(autoincrement())
  taskId    Int
  task      Task     @relation(fields: [taskId], references: [id])
  author    String
  text      String
  createdAt DateTime @default(now())
}
model Tag {
  id    Int       @id @default(autoincrement())
  name  String    @unique
  tasks TaskTag[]
}
model TaskTag {
  taskId Int
  tagId  Int
  task   Task @relation(fields: [taskId], references: [id])
  tag    Tag  @relation(fields: [tagId], references: [id])
  @@id([taskId, tagId])
}
enum Priority { LOW MEDIUM HIGH }

执行 prisma migrate dev --name init，然后填充种子数据：
1 个用户 + 1 个看板 + 3 列 + 若干示例任务。</pre>
</div>

<h2>阶段 5 — 将 API 接入 Kanban</h2>
<div class="phase">
  <pre>在 apps/web 中，添加一个带类型的 API 客户端（fetch 封装），
指向 http://localhost:4000。看板加载时，拉取列和任务并渲染。
拖拽卡片到新列后，调用 PATCH /tasks/:id/move 持久化列和位置。
添加/删除列时调用相应 API。任务详情面板中的编辑操作同步到后端。
提交评论后乐观更新评论列表。</pre>
</div>

<h2>阶段 6 — 迭代优化</h2>
<div class="phase">
  <p>可以复制粘贴的后续优化提示词：</p>
  <pre>给每列设置独立颜色条（待办=蓝、进行中=黄、完成=绿）。
任务卡片显示优先级角标（红色高、橙色中、灰色低）和截止日期。</pre>
  <pre>在任务详情面板中添加：标签输入（可新建/删除标签）、
指派人输入字段、评论列表 + 发表评论表单。
验证评论不为空。</pre>
  <pre>在评论加载时，显示骨架屏加载效果。拖拽卡片时添加
半透明占位效果。</pre>
</div>

<h2>阶段 7 — 测试与调试</h2>
<div class="phase">
  <pre>在 apps/api 中添加 vitest。编写以下测试：
1. POST /columns — 正常创建、缺少 boardId 返回 400
2. PATCH /tasks/:id/move — 拖拽到另一列、缺少 targetColumnId 返回 400
3. POST /tasks/:id/comments — 正常添加评论、空文本返回 400
4. GET /boards/:id/columns — 列按 position 排序
使用单独的测试 SQLite 文件。在根目录配置 'pnpm test' 命令。</pre>
  <p>当出现问题时，将报错输出粘贴回 Claude Code 并要求 <i>"诊断并修复"</i>。提交代码前使用 <code>/code-review</code> 超能力进行代码审阅。</p>
</div>

<h2>阶段 8 — 部署上线</h2>
<div class="phase">
  <h3>前端 → Vercel</h3>
  <pre>cd apps/web
pnpm build
npx vercel --prod</pre>
  <h3>后端 + 数据库 → Render 或 Railway</h3>
  <ul>
    <li>从 Git 仓库创建新的 Web 服务，根目录设为 <code>apps/api</code>。</li>
    <li>创建托管的 Postgres 附加组件。</li>
    <li>设置 <code>DATABASE_URL</code>；将 Prisma 的 provider 从 <code>sqlite</code> 切换为 <code>postgresql</code>。</li>
    <li>在构建步骤中执行 <code>prisma migrate deploy</code>。</li>
  </ul>
  <h3>前后端连接</h3>
  <p>在 Vercel 中设置 <code>VITE_API_URL</code> 为 Render 的 URL，然后重新部署前端。</p>
</div>

<h2>提交清单</h2>
<ul>
  <li>公开的 Git 仓库，README 中说明系统架构。</li>
  <li>前端和 API <code>/health</code> 端点的在线 URL。</li>
  <li>一份 2 页的总结反思：AI 做对了什么、你在哪里进行了干预、你学到了什么。</li>
  <li>至少导出一次 Claude Code 会话的对话记录。</li>
</ul>

<footer>Vibe Coding 教学课件 · TaskFlow 任务看板实验手册</footer>
</div>
<script>
document.querySelectorAll('pre').forEach(function(pre){
  var btn=document.createElement('button');
  btn.className='copy-btn';btn.textContent='复制';
  btn.onclick=function(){
    navigator.clipboard.writeText(pre.textContent.replace('复制','').replace('已复制','').trim()).then(function(){
      btn.textContent='已复制';btn.classList.add('copied');
      setTimeout(function(){btn.textContent='复制';btn.classList.remove('copied')},2000);
    });
  };
  pre.appendChild(btn);
});
</script>
</body>
</html>`;
```

- [ ] **Step 2: 提交**

```bash
git add src/app/components/handouts/labManualHtml.ts
git commit -m "feat(taskflow): 实验手册 HTML 从 3D 漫游改为 TaskFlow 看板"
```

---

### Task 6: 修改 conceptHandoutHtml.ts — 概念讲义延伸阅读

**Files:**
- Modify: `src/app/components/handouts/conceptHandoutHtml.ts:103-106`（延伸阅读第 7 节）

- [ ] **Step 1: 替换延伸阅读中的 Three.js 链接**

在 [conceptHandoutHtml.ts](src/app/components/handouts/conceptHandoutHtml.ts) 第 101-106 行，替换「延伸阅读」部分：

旧：
```html
  <h2>7. 延伸阅读</h2>
  <ul>
    <li>Anthropic — Claude Code 官方文档</li>
    <li>Three.js 基础 — threejs.org</li>
    <li>React Three Fiber — docs.pmnd.rs</li>
  </ul>
```

新：
```html
  <h2>7. 延伸阅读</h2>
  <ul>
    <li>Anthropic — Claude Code 官方文档</li>
    <li>React DnD — react-dnd.github.io</li>
    <li>Prisma ORM — prisma.io</li>
  </ul>
```

- [ ] **Step 2: 提交**

```bash
git add src/app/components/handouts/conceptHandoutHtml.ts
git commit -m "feat(taskflow): 概念讲义延伸阅读替换为 TaskFlow 技术栈"
```

---

### Task 7: 构建并验证

**Files:**
- No source changes — 构建并检查产物

- [ ] **Step 1: 安装依赖并构建**

```bash
cd "/Users/lucismarvin/Desktop/简历+资料/面试/AI vs Traditional Development Courseware"
pnpm install
pnpm build
```

Expected: Build succeeds with `dist/index.html` created.

- [ ] **Step 2: 检查残留的 3D 关键词**

```bash
grep -ri "three\.js\|three-fiber\|3d 场景\|3d 漫游\|orbitcontrols\|building\|建筑\|drei\|react-three" dist/index.html || echo "✅ No 3D residue found"
```

Expected: `✅ No 3D residue found` （如果 hit 了检查是否误报）

- [ ] **Step 3: 在浏览器中打开验证**

```bash
open dist/index.html
```

在浏览器中滚动检查所有 Section：ProjectBrief 标题为 TaskFlow、StepByStepManual 提示词无 3D 术语、AssessmentSection 量规更新、HandoutsSection 标题更新。

- [ ] **Step 4: 提交最终版本**

```bash
git add dist/index.html
git commit -m "feat(taskflow): 构建 — 课件完整迁移至 TaskFlow 看板主题"
```
