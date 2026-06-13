import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const rubric = [
  ["功能完整度", "30%", "3D 场景可加载，建筑可点击，评论可持久化。"],
  ["后端正确性", "20%", "API 校验输入并妥善处理异常。"],
  ["代码质量", "20%", "可读、类型完整、组织清晰，包含测试。"],
  ["AI 协作", "20%", "反思报告体现出有思考的提示词与审阅过程。"],
  ["部署上线", "10%", "前端与后端均可通过公网访问。"],
];

const prompts = [
  "AI 在哪些环节最显著地提升了你的效率？为什么？",
  "你在哪些地方覆盖、改写或拒绝了 AI 的建议？",
  "通过这次实验，你掌握了哪些手写代码时不容易理解的东西？",
  "在过度依赖 AI 方面，你注意到了哪些潜在风险？",
];

export function AssessmentSection() {
  return (
    <section id="assessment" className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Badge>模块 06 · 评估</Badge>
        <h2 className="mt-2">考核与反思</h2>
        <p className="text-muted-foreground">用一份评分量规与几道反思题，固化学习成果。</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>评分量规</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>评分维度</TableHead>
                <TableHead>权重</TableHead>
                <TableHead>评分要点</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rubric.map(([c, w, d]) => (
                <TableRow key={c}>
                  <TableCell>{c}</TableCell>
                  <TableCell className="text-muted-foreground">{w}</TableCell>
                  <TableCell className="text-muted-foreground">{d}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>反思题（约 2 页）</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
            {prompts.map((p) => <li key={p}>{p}</li>)}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}
