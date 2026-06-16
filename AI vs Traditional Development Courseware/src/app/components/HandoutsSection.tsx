import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, FileText, FlaskConical } from "lucide-react";
import { conceptHandoutHtml } from "./handouts/conceptHandoutHtml";
import { labManualHtml } from "./handouts/labManualHtml";

function download(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function preview(html: string) {
  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); }
}

export function HandoutsSection() {
  return (
    <section id="handouts" className="bg-secondary">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Badge>模块 05 · 教学材料</Badge>
          <h2 className="mt-2">课程讲义（HTML 版）</h2>
          <p className="text-muted-foreground">
            两份独立、可打印的 HTML 文档，发给学生即可。任何浏览器直接打开，无需依赖、无需构建。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <FileText className="size-5 text-primary" />
              <CardTitle>概念讲义</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                术语定义、对比表、Vibe Coding 循环、AI 辅助的适用边界，以及学术诚信指南。
              </p>
              <div className="flex gap-2">
                <Button onClick={() => download("concept-handout.html", conceptHandoutHtml)}>
                  <Download className="size-4 mr-1" /> 下载
                </Button>
                <Button variant="outline" onClick={() => preview(conceptHandoutHtml)}>预览</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FlaskConical className="size-5 text-primary" />
              <CardTitle>实验手册 — TaskFlow 任务看板</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                九个阶段，从 <code>mkdir</code> 到部署上线，附带可复制的 Claude Code 提示词与提交清单。
              </p>
              <div className="flex gap-2">
                <Button onClick={() => download("lab-manual.html", labManualHtml)}>
                  <Download className="size-4 mr-1" /> 下载
                </Button>
                <Button variant="outline" onClick={() => preview(labManualHtml)}>预览</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
