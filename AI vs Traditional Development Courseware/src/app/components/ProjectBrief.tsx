import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Database, Server, MonitorSmartphone, Lightbulb } from "lucide-react";

const alts = [
  { title: "太阳系知识竞答", body: "围绕行星的 3D 场景，点击行星弹出问答，成绩持久化。" },
  { title: "3D 作品集画廊", body: "在三维空间旋转的卡片，访客可以点赞和留言，数据保存到后端。" },
  { title: "宿舍空间设计器", body: "拖拽家具到三维房间内，登录用户可保存自己的布局方案。" },
];

export function ProjectBrief() {
  return (
    <section id="project" className="bg-secondary">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Badge>模块 03 · 实验项目</Badge>
          <h2 className="mt-2">校园 3D 漫游 Campus 3D Explorer</h2>
          <p className="text-muted-foreground">
            一个为高校实验课量身定制的 Three.js 全栈项目：复杂度适中，既能完整跑通技术栈，又能在一次实验内完成。
            学生在 3D 校园中飞行漫游，点击建筑查看介绍，并发表评价（数据写入真实数据库）。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <MonitorSmartphone className="size-5 text-primary" />
              <CardTitle>前端</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>React + react-three-fiber 构建场景，包含 OrbitControls、建筑模型、悬浮 HTML 标签，以及右侧详情/评价面板。</p>
              <div className="flex flex-wrap gap-1.5">
                {["React", "Vite", "react-three-fiber", "drei", "TailwindCSS"].map((s) => <Badge key={s} variant="outline">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Server className="size-5 text-primary" />
              <CardTitle>后端</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>Express REST API，提供 <code>/buildings</code> 与 <code>/buildings/:id/reviews</code> 接口，支持输入校验与 CORS。</p>
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
              <p>Prisma 定义 <code>Building</code> 与 <code>Review</code> 两张表，本地用 SQLite，生产环境切换 PostgreSQL。</p>
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
