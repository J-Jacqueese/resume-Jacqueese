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
