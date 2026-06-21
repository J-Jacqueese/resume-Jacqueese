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
