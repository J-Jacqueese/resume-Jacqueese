import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Terminal, Shield, Wand2, ExternalLink } from "lucide-react";

export function VibeCodingIntro() {
  return (
    <section id="vibe" className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Badge>模块 02 · 工具链</Badge>
        <h2 className="mt-2">什么是 Vibe Coding？</h2>
        <p className="text-muted-foreground">
          你描述"想要什么样的感觉"，Agent 给出实现，你来把舵、审阅、迭代。核心循环是：
          <b>表达意图 → 规划 → 构建 → 验证 → 迭代</b>。
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <a href="https://docs.anthropic.com/en/docs/claude-code/overview" target="_blank" rel="noopener noreferrer" className="block group">
          <Card className="h-full transition-shadow group-hover:shadow-md group-hover:border-primary/30">
            <CardHeader>
              <Terminal className="size-5 text-primary" />
              <CardTitle className="flex items-center gap-1.5">
                Claude Code
                <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Anthropic 出品的命令行 Agent，能读取仓库、编辑文件、执行命令、主动澄清需求，并维护一份可审阅的计划。
            </CardContent>
          </Card>
        </a>

        <a href="https://docs.anthropic.com/en/docs/claude-code/overview" target="_blank" rel="noopener noreferrer" className="block group">
          <Card className="h-full transition-shadow group-hover:shadow-md group-hover:border-primary/30">
            <CardHeader>
              <Shield className="size-5 text-primary" />
              <CardTitle className="flex items-center gap-1.5">
                Harness
                <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <div className="text-center py-2 px-3 bg-primary/10 rounded-lg font-semibold text-primary text-lg">
                Agent = Model + Harness
              </div>
              <p>
                模型负责推理，Harness 负责"剩下的所有事情"——工具系统、上下文管理、权限控制、反馈回路、记忆与协作。它是 Agent 的运行容器：沙箱、权限与 Hook，决定哪些命令可以放行，哪些需要你二次确认。
              </p>
            </CardContent>
          </Card>
        </a>

        <a href="https://github.com/obra/superpowers#claude-code" target="_blank" rel="noopener noreferrer" className="block group">
          <Card className="h-full transition-shadow group-hover:shadow-md group-hover:border-primary/30">
            <CardHeader>
              <Wand2 className="size-5 text-primary" />
              <CardTitle className="flex items-center gap-1.5">
                Superpowers
                <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-2">
              <p>一套面向 Coding Agent 的可组合技能框架，让 AI 从"代码生成器"进化为成熟的软件开发者。核心能力包括：</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><b>计划驱动</b>：/brainstorm、/write-plan、/execute-plan</li>
                <li><b>代码评审</b>：自动 review 与行为验证</li>
                <li><b>技能市场</b>：20+ 可插拔技能，按需组合</li>
                <li><b>会话管理</b>：上下文注入与 SessionStart</li>
              </ul>
            </CardContent>
          </Card>
        </a>
      </div>
    </section>
  );
}
