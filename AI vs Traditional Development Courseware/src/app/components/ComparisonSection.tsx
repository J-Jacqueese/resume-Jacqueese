import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from "recharts";
import { Hammer, Sparkles } from "lucide-react";

const rows = [
  ["主要输入", "手工敲键盘", "自然语言意图 + 审阅"],
  ["原型耗时", "数小时到数天", "数分钟到数小时"],
  ["样板代码", "手动搭脚手架", "按需自动生成"],
  ["代码质量", "取决于开发者经验", "取决于提示词与审阅习惯"],
  ["调试方式", "日志、断点、搜索", "Agent 读取报错并提出修复"],
  ["技术栈门槛", "需要先掌握", "可在构建中边学边用"],
  ["最佳场景", "高可靠核心模块", "原型、UI、胶水代码、探索性开发"],
];

const chartData = [
  { phase: "初始化", traditional: 60, vibe: 8 },
  { phase: "前端", traditional: 180, vibe: 30 },
  { phase: "后端", traditional: 150, vibe: 25 },
  { phase: "数据库", traditional: 90, vibe: 15 },
  { phase: "调试", traditional: 120, vibe: 40 },
  { phase: "部署", traditional: 90, vibe: 35 },
];

export function ComparisonSection() {
  return (
    <section id="comparison" className="bg-secondary">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Badge>模块 01 · 对比</Badge>
          <h2 className="mt-2">传统开发 vs. AI 辅助开发</h2>
          <p className="text-muted-foreground">
            同一个应用、两种构建方式，各自都有适合的场景。重点是判断什么时候用哪一种。
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <Hammer className="size-5 text-primary" />
              <CardTitle>传统开发</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <p>开发者亲自编写每一行代码，依赖文档和编辑器自动补全。</p>
              <p>可预测、可追责，但速度较慢。适合需要逐行理解的关键代码。</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Sparkles className="size-5 text-primary" />
              <CardTitle>Claude Code 的 Vibe Coding</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <p>你描述意图，Agent 读取仓库、编写代码、执行命令并自我迭代。</p>
              <p>快速、探索性强，需要良好的审阅习惯。适合原型、UI 与不熟悉的技术栈。</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>各阶段耗时示意（分钟）</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height: 288 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="phase" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="traditional" name="传统开发" fill="var(--chart-3)" radius={[6,6,0,0]} />
                  <Bar dataKey="vibe" name="Vibe Coding" fill="var(--chart-1)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-muted-foreground mt-2">
              数据来自内部教学试验，仅供参考。实际效果取决于提示词技巧与任务的新颖程度。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>对比速查表</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>维度</TableHead>
                  <TableHead>传统开发</TableHead>
                  <TableHead>Vibe Coding</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(([d, t, v]) => (
                  <TableRow key={d}>
                    <TableCell>{d}</TableCell>
                    <TableCell className="text-muted-foreground">{t}</TableCell>
                    <TableCell className="text-muted-foreground">{v}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
