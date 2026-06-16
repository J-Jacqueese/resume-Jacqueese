import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Copy, Check } from "lucide-react";

type Phase = {
  id: string;
  title: string;
  blurb: string;
  traditional: string;
  prompt: string;
};

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

export function StepByStepManual() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyPrompt(id: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <section id="manual" className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Badge>模块 04 · 实验手册</Badge>
        <h2 className="mt-2">分阶段实操手册</h2>
        <p className="text-muted-foreground">
          每个阶段都给出"传统做法"与"可直接复制的 Claude Code 提示词"。点击展开查看详情。
        </p>
      </div>

      <Accordion type="multiple" className="space-y-3">
        {phases.map((p) => (
          <AccordionItem key={p.id} value={p.id} className="border border-border rounded-lg px-4 bg-card">
            <AccordionTrigger className="hover:no-underline">
              <div className="text-left">
                <div>{p.title}</div>
                <div className="text-muted-foreground">{p.blurb}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-muted-foreground mb-2">传统做法</div>
                    <p>{p.traditional}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-muted-foreground mb-2">Vibe Coding 提示词</div>
                    <div className="relative group">
                      <pre className="bg-[#0f172a] text-[#e2e8f0] rounded-lg p-4 overflow-auto whitespace-pre-wrap text-sm leading-relaxed font-mono">{p.prompt}</pre>
                      <button
                        onClick={() => copyPrompt(p.id, p.prompt)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        title="复制提示词"
                      >
                        {copiedId === p.id ? <Check className="size-4" /> : <Copy className="size-4" />}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
