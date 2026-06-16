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
