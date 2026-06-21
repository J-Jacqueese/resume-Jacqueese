import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Target, Users, Clock, GraduationCap } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "教学目标",
    body: "理解 AI 辅助开发工具的核心概念，对比传统开发与 AI 协同开发的差异，建立对 Vibe Coding 工作流的认知。",
  },
  {
    icon: Users,
    title: "适用对象",
    body: "对 AI 辅助开发感兴趣的开发者、技术管理者，以及希望了解 AI 工具如何改变研发流程的相关人员。",
  },
  {
    icon: Clock,
    title: "课时安排",
    body: "约 20 分钟的集中讲解，快速掌握 AI 开发工具的概念与传统模式的核心差异。",
  },
  {
    icon: GraduationCap,
    title: "先修要求",
    body: "无需编程基础，只需对软件开发流程有基本了解即可。",
  },
];

export function CourseOverview() {
  return (
    <section id="overview" className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h2>课程概览</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="size-5 text-primary" />
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">{body}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
