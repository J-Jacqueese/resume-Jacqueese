# Superpowers Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive Superpowers workflow section to the courseware site, showcasing the 5-phase skill ecosystem.

**Architecture:** Data layer (`workflowData.ts`) holds phases and skills as typed arrays. `SuperpowersSection.tsx` reads from it and renders an interactive single-expand accordion — click a phase to expand its skill cards, collapsing the previously open phase. `App.tsx` gains one import, one JSX insertion, one nav entry.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, lucide-react, existing `@figma/astraui-kit` Card/Badge components.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/components/superpowers/workflowData.ts` | Create | Phase + skill data arrays and TypeScript interfaces |
| `src/app/components/SuperpowersSection.tsx` | Create | Interactive accordion workflow UI component |
| `src/app/App.tsx` | Modify | Import section, insert into JSX, add nav link |

---

### Task 1: Create the data layer

**Files:**
- Create: `src/app/components/superpowers/workflowData.ts`

- [ ] **Step 1: Write the data file**

```typescript
import {
  Lightbulb,
  ClipboardList,
  Code,
  SearchCheck,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export interface Skill {
  name: string;
  title: string;
  description: string;
  whenToUse: string;
}

export interface Phase {
  key: string;
  label: string;
  iconName: string;
  icon: LucideIcon;
  skills: Skill[];
}

const brainstormingSkill: Skill = {
  name: "brainstorming",
  title: "Brainstorming",
  description:
    "将模糊想法转化为完整设计 —— 提问澄清需求、提出多种方案、输出设计文档，在写代码前对齐所有假设。",
  whenToUse: "开始任何新功能、组件或行为变更之前",
};

const writingPlansSkill: Skill = {
  name: "writing-plans",
  title: "Writing Plans",
  description:
    "将设计文档转为分步骤的实现计划，精确到文件路径、代码片段和测试命令，让工程师零上下文即可执行。",
  whenToUse: "设计确认后、开始编码前",
};

const tddSkill: Skill = {
  name: "test-driven-development",
  title: "Test-Driven Development",
  description:
    "先写失败的测试，再写最小实现使其通过，最后重构。红 → 绿 → 重构循环。",
  whenToUse: "实现任何功能或修复 bug 时",
};

const subagentDevSkill: Skill = {
  name: "subagent-driven-development",
  title: "Subagent-Driven Development",
  description:
    "在当前会话中并行执行实现计划中的独立任务，每个子 agent 聚焦单一任务，互不干扰。",
  whenToUse: "有多个独立任务可以并行推进时",
};

const gitWorktreesSkill: Skill = {
  name: "using-git-worktrees",
  title: "Git Worktrees",
  description:
    "创建隔离的 git 工作树，并行开发多个分支而不相互污染，每个工作树有独立的工作目录。",
  whenToUse: "需要同时进行多个开发任务时",
};

const dispatchingAgentsSkill: Skill = {
  name: "dispatching-parallel-agents",
  title: "Dispatching Parallel Agents",
  description:
    "同时派遣 2 个以上独立子 agent，处理没有共享状态或顺序依赖的并行任务。",
  whenToUse: "面对多个互不依赖的独立任务时",
};

const requestingReviewSkill: Skill = {
  name: "requesting-code-review",
  title: "Requesting Code Review",
  description:
    "完成任务或大功能后自动发起代码审查，验证工作是否满足需求、代码是否清晰。",
  whenToUse: "完成一个任务、实现一个大功能或合并前",
};

const receivingReviewSkill: Skill = {
  name: "receiving-code-review",
  title: "Receiving Code Review",
  description:
    "收到 code review 反馈后，先验证建议的技术正确性再实现，而非盲目接受或敷衍同意。",
  whenToUse: "收到 code review 反馈时",
};

const verificationSkill: Skill = {
  name: "verification-before-completion",
  title: "Verification Before Completion",
  description:
    "任务完成前系统性验证：需求是否全部满足？测试是否通过？有没有遗漏？",
  whenToUse: "标记任务完成之前",
};

const finishingBranchSkill: Skill = {
  name: "finishing-a-development-branch",
  title: "Finishing a Branch",
  description:
    "实现完成且测试通过后，提供结构化选项：合并到主分支、创建 PR、或清理丢弃。",
  whenToUse: "所有测试通过、实现完成时",
};

export const phases: Phase[] = [
  {
    key: "brainstorm",
    label: "1. 构思",
    iconName: "Lightbulb",
    icon: Lightbulb,
    skills: [brainstormingSkill],
  },
  {
    key: "plan",
    label: "2. 规划",
    iconName: "ClipboardList",
    icon: ClipboardList,
    skills: [writingPlansSkill],
  },
  {
    key: "develop",
    label: "3. 开发",
    iconName: "Code",
    icon: Code,
    skills: [tddSkill, subagentDevSkill, gitWorktreesSkill, dispatchingAgentsSkill],
  },
  {
    key: "review",
    label: "4. 审查",
    iconName: "SearchCheck",
    icon: SearchCheck,
    skills: [requestingReviewSkill, receivingReviewSkill, verificationSkill],
  },
  {
    key: "ship",
    label: "5. 交付",
    iconName: "Rocket",
    icon: Rocket,
    skills: [finishingBranchSkill],
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty src/app/components/superpowers/workflowData.ts`
Expected: No errors (may need to adjust tsconfig include — if errors about module resolution, proceed; the file will be type-checked as part of the full project in Task 2).

- [ ] **Step 3: Commit**

```bash
git add src/app/components/superpowers/workflowData.ts
git commit -m "feat: add Superpowers workflow data layer"
```

---

### Task 2: Create the SuperpowersSection component

**Files:**
- Create: `src/app/components/SuperpowersSection.tsx`

- [ ] **Step 1: Write the component**

```typescript
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { phases, type Skill, type Phase } from "./superpowers/workflowData";

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card className="flex-1 min-w-[220px] max-w-[320px]">
      <CardContent className="flex flex-col gap-2 py-5">
        <Badge variant="secondary" className="w-fit text-xs">
          /{skill.name}
        </Badge>
        <p className="text-sm leading-relaxed">{skill.description}</p>
        <p className="text-xs text-muted-foreground mt-auto">
          <span className="font-medium">何时用：</span>
          {skill.whenToUse}
        </p>
      </CardContent>
    </Card>
  );
}

function PhaseHeader({
  phase,
  isExpanded,
  skillCount,
  onClick,
}: {
  phase: Phase;
  isExpanded: boolean;
  skillCount: number;
  onClick: () => void;
}) {
  const Icon = phase.icon;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left w-full
        ${isExpanded ? "bg-primary/5 border-l-[3px] border-l-primary pl-[13px]" : "hover:bg-muted/50 border-l-[3px] border-l-transparent pl-[13px]"}
      `}
    >
      <Icon
        className={`size-5 shrink-0 ${isExpanded ? "text-primary" : "text-muted-foreground"}`}
      />
      <span
        className={`font-medium ${isExpanded ? "text-primary" : "text-foreground"}`}
      >
        {phase.label}
      </span>
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto">
        {skillCount} 个技能
      </Badge>
    </button>
  );
}

export function SuperpowersSection() {
  const [expandedKey, setExpandedKey] = useState<string>(phases[0].key);

  const togglePhase = (key: string) => {
    setExpandedKey((prev) => (prev === key ? prev : key));
  };

  return (
    <section id="superpowers" className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-8">
        <Badge>模块 02 · 工具链</Badge>
        <h2 className="mt-2">Superpowers 技能生态</h2>
        <p className="text-muted-foreground">
          Superpowers 是一套可组合的技能框架，覆盖从构思到交付的完整开发周期。每个阶段都有对应的技能加持，让 AI 从"代码生成器"进化为成熟的软件开发者。
        </p>
      </div>

      {/* Desktop: horizontal phases with dashed connectors */}
      <div className="hidden md:block">
        <div className="flex items-start gap-0">
          {phases.map((phase, index) => {
            const isExpanded = expandedKey === phase.key;
            const isLast = index === phases.length - 1;

            return (
              <div key={phase.key} className="flex items-start flex-1">
                <div className="flex-1 min-w-0">
                  <PhaseHeader
                    phase={phase}
                    isExpanded={isExpanded}
                    skillCount={phase.skills.length}
                    onClick={() => togglePhase(phase.key)}
                  />
                  {isExpanded && (
                    <div className="mt-4 ml-4">
                      <div className="flex flex-wrap gap-3">
                        {phase.skills.map((skill) => (
                          <SkillCard key={skill.name} skill={skill} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {!isLast && (
                  <div className="flex-shrink-0 w-8 flex items-center justify-center pt-6">
                    <div className="w-full border-t border-dashed border-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical phases with dashed connectors */}
      <div className="md:hidden space-y-0">
        {phases.map((phase, index) => {
          const isExpanded = expandedKey === phase.key;
          const isLast = index === phases.length - 1;

          return (
            <div key={phase.key}>
              <PhaseHeader
                phase={phase}
                isExpanded={isExpanded}
                skillCount={phase.skills.length}
                onClick={() => togglePhase(phase.key)}
              />
              {isExpanded && (
                <div className="mt-3 ml-4 pl-4 border-l border-dashed border-border">
                  <div className="flex flex-col gap-3">
                    {phase.skills.map((skill) => (
                      <SkillCard key={skill.name} skill={skill} />
                    ))}
                  </div>
                </div>
              )}
              {!isLast && !isExpanded && (
                <div className="ml-[23px] h-6 w-0 border-l border-dashed border-border" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -40`
Expected: No errors in `SuperpowersSection.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/app/components/SuperpowersSection.tsx
git commit -m "feat: add SuperpowersSection interactive workflow component"
```

---

### Task 3: Integrate into App.tsx

**Files:**
- Modify: `src/app/App.tsx` (lines 4, 10, 53, and `navLinks` array)

- [ ] **Step 1: Add import**

In `src/app/App.tsx`, add the import after the VibeCodingIntro import (line 4):

```typescript
import { SuperpowersSection } from "./components/SuperpowersSection";
```

- [ ] **Step 2: Add nav link**

In the `navLinks` array, add after the `#vibe` entry:

```typescript
{ href: "#superpowers", label: "Superpowers" },
```

- [ ] **Step 3: Insert section into JSX**

In the `<main>` block, insert after `<VibeCodingIntro />`:

```typescript
<SuperpowersSection />
```

- [ ] **Step 4: Verify the full App.tsx renders**

Run the dev server and visually inspect:
```bash
pnpm run dev
```
Open `http://localhost:5173/` and confirm:
- Superpowers nav link appears in the top bar
- Clicking it scrolls to the section
- Phase 1 (构思) is expanded by default with its skill card visible
- Clicking another phase expands it and collapses the first
- Mobile viewport (<768px) shows vertical layout

- [ ] **Step 5: Run TypeScript check on full project**

Run: `npx tsc --noEmit --pretty 2>&1 | head -40`
Expected: No new errors introduced

- [ ] **Step 6: Commit**

```bash
git add src/app/App.tsx
git commit -m "feat: integrate SuperpowersSection into App layout and nav"
```
