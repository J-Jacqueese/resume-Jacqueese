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
react-three-fiber + drei + tailwind）和 apps/api（Node + Express +
TS + Prisma + SQLite）。用 concurrently 让 'pnpm dev' 一键启动两者，
并生成 README。`,
  },
  {
    id: "p2",
    title: "阶段 2 — 前端脚手架",
    blurb: "搭建包含 5 栋可点击建筑的 3D 场景。",
    traditional: "啃 three-fiber 文档，反复调相机和灯光。",
    prompt: `在 apps/web 中创建一个全屏 Canvas，放置 5 个 Box 网格代表：
图书馆、理科楼、艺术中心、体育馆、食堂。加入 OrbitControls。
点击建筑时，弹出右侧 Tailwind 面板，展示名称与（之后接入的）评论。`,
  },
  {
    id: "p3",
    title: "阶段 3 — 后端脚手架",
    blurb: "用 Express 暴露前端要调用的接口。",
    traditional: "搭 Express 模板、配 CORS、串通 ts-node。",
    prompt: `在 apps/api 中启动 Express 服务，端口 4000，允许 http://localhost:5173
跨域。提供以下路由：
  GET  /buildings
  GET  /buildings/:id/reviews
  POST /buildings/:id/reviews   { author, rating, text }`,
  },
  {
    id: "p4",
    title: "阶段 4 — 数据库 Schema 与迁移",
    blurb: "建模 Building 与 Review，执行迁移并填充种子数据。",
    traditional: "手写 SQL 迁移、调试外键。",
    prompt: `创建 Prisma 模型：
Building(id, slug 唯一, name, blurb)
Review(id, buildingId 外键, author, rating Int, text, createdAt)
执行 prisma migrate dev --name init，并写入 5 栋建筑的种子数据。`,
  },
  {
    id: "p5",
    title: "阶段 5 — 前后端联调",
    blurb: "通过类型化 client，把侧边栏接入真实数据。",
    traditional: "手写 fetch 封装，手敲响应类型。",
    prompt: `在 apps/web/src/api.ts 中实现一个类型化的 API client，
指向 http://localhost:4000。点击建筑时拉取其评论并渲染在右侧面板。
添加 POST 评论的表单，提交后乐观更新评论列表。`,
  },
  {
    id: "p6",
    title: "阶段 6 — 迭代打磨",
    blurb: "用一连串小提示打磨体验。",
    traditional: "提交大量小 commit，频繁上下文切换。",
    prompt: `给每栋建筑分配独立颜色，并使用 drei 的 <Html> 添加一个始终
朝向相机的悬浮标签。评论表单增加 1–5 星评分输入（用 lucide-react 的
Star 图标）。评论加载时显示骨架屏。`,
  },
  {
    id: "p7",
    title: "阶段 7 — 测试与调试",
    blurb: "让 Agent 写测试并定位失败。",
    traditional: "手写 vitest 用例，追踪闪烁的测试。",
    prompt: `为 apps/api 接入 vitest。为 POST /reviews 编写三类测试：
正常路径、缺少评分、建筑不存在。使用独立的测试 SQLite 文件。
在根目录串通 'pnpm test'。提交前运行 /code-review。`,
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
