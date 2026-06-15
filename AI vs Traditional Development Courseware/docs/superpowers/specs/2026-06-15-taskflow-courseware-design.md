# TaskFlow — 课件改造设计文档

**日期**: 2026-06-15
**范围**: 将 `AI vs Traditional Development Courseware` 课件的实验项目从「校园 3D 漫游（Three.js）」改为「TaskFlow 任务管理看板」

---

## 背景

当前课件以一个 **react-three-fiber + Express + Prisma** 的 3D 校园漫游项目贯穿全部教学模块。
用户不再想用 Three.js 做 3D，改为做一个任务管理看板（Kanban Board）。

## 决策记录

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 项目名称 | **TaskFlow** — 极简任务流 | 简洁好记 |
| 用户系统 | 简单用户名登录（无密码） | 教学场景最简单 |
| 看板列 | 用户可自定义增删 | 灵活性好 |
| 任务卡片字段 | 标题、描述、优先级（高/中/低）、截止日期、标签、指派人、评论 | 功能完整，覆盖多种前端模式 |
| 改造范围 | **完整重写** 4 个受影响的 Section | 确保课件内容沉浸统一 |

---

## 技术栈映射

| 层 | 旧（3D 漫游） | 新（TaskFlow） | 说明 |
|----|-------------|--------------|------|
| 前端 | react-three-fiber + drei | react-dnd + react-dnd-html5-backend | 依赖已安装 |
| 后端 | Node + Express | Node + Express | 不变 |
| 数据库 | Prisma + SQLite/PostgreSQL | Prisma + SQLite/PostgreSQL | 不变 |
| 状态管理 | React 内置 | React 内置 | 不变 |
| 构建 | Vite + TailwindCSS | Vite + TailwindCSS | 不变 |

## 数据模型

```
User (id, name, createdAt)
  └─ Board (id, title, userId FK, createdAt)
       └─ Column (id, boardId FK, title, position)
            └─ Task (id, columnId FK, title, description, priority, dueDate, assignee, position, createdAt)
                 ├─ Comment (id, taskId FK, author, text, createdAt)
                 └─ Tag (id, name) ←→ TaskTag (taskId, tagId)
```

## 改造文件清单

### 1. `src/app/components/ProjectBrief.tsx` — 实验项目

**改动**: 重写整个组件
- 标题：校园 3D 漫游 Campus 3D Explorer → TaskFlow — 极简任务流 Kanban
- 描述：Three.js 全栈项目 → react-dnd 拖拽看板全栈项目
- 技术栈 Badge：react-three-fiber / drei → react-dnd / react-dnd-html5-backend
- 项目描述：3D 校园飞行漫游 → 多用户 Kanban 看板拖拽
- 可替换主题：太阳系/3D画廊/宿舍设计器 → 招聘看板/作业追踪/Bug面板

### 2. `src/app/components/StepByStepManual.tsx` — 实验手册

**改动**: 重写 phases 数组中的 9 个阶段内容

| 阶段 | 旧传统做法 | 新传统做法 | 旧提示词 | 新提示词 |
|------|----------|----------|--------|--------|
| P0 | 不变 | 不变 | 不变 | 不变 |
| P1 | react-three-fiber + drei | react-dnd + react-dnd-html5-backend | 3D 初始化提示词 | Kanban monorepo 提示词 |
| P2 | Box 建筑 + OrbitControls | 三列 Kanban 布局 + 拖拽 | 全屏 Canvas 提示词 | 列 + 卡片拖拽提示词 |
| P3 | /buildings + /reviews | /boards /columns /tasks /comments | 2 资源路由 | 4 资源路由 + 排序 |
| P4 | Building + Review 2 表 | User → Board → Column → Task → Comment → Tag 6 表 | 2 表 Prisma | 6 表 Prisma + 种子 |
| P5 | fetch 封装 + 建筑点击 | API client + 拖拽乐观更新 + 任务 CRUD | 建筑评论 | 看板 CRUD + 排序持久化 |
| P6 | 建筑颜色 + Html 标签 + 骨架屏 | 任务详情弹窗 + 优先级/标签/指派人/评论 + 骨架屏 | 3D 打磨 | 弹窗 + 表单完整性 |
| P7 | POST /reviews 测试 | 拖拽排序 + 列 CRUD + 评论 + 优先级校验 | 评论测试 | 看板业务测试 |
| P8 | 不变 | 不变 | 不变 | 不变 |

### 3. `src/app/components/AssessmentSection.tsx` — 考核评估

**改动**: 仅修改 rubric 数组第 1 行

- 旧：`["功能完整度", "30%", "3D 场景可加载，建筑可点击，评论可持久化。"]`
- 新：`["功能完整度", "30%", "看板列可增删，卡片可拖拽排序，评论与标签可持久化。"]`

其余评分维度（后端正确性、代码质量、AI 协作、部署上线）、反思题、权重均不变。

### 4. `src/app/components/HandoutsSection.tsx` — 课程讲义

**改动**:
- 标题从「实验手册 — 校园 3D 漫游」→「实验手册 — TaskFlow 任务看板」
- 描述中去掉「3D 漫游」相关字样
- 按钮文字和下载文件名相应更新

### 5. `src/app/components/handouts/labManualHtml.ts` — 实验手册 HTML

**改动**: 重写整个 HTML 字符串
- 标题：校园 3D 漫游 → TaskFlow 任务管理看板
- 9 阶段内容与 `StepByStepManual.tsx` 保持一致
- 移除所有 Three.js / 3D 相关术语

### 6. `src/app/components/handouts/conceptHandoutHtml.ts` — 概念讲义 HTML

**改动**: 局部替换
- 术语表中删除 Three.js / 3D 渲染相关内容
- 案例部分从「3D 场景搭建」改为「看板拖拽实现」
- 其余概念定义（Vibe Coding、Harness、Superpowers）保持不变

### 7. 不动的文件

- `src/app/App.tsx` — nav 标签无需改动（「实验项目」「实验手册」已是通用名）
- `src/app/components/Hero.tsx` — AI vs 传统开发双图对比，与具体项目无关
- `src/app/components/CourseOverview.tsx` — 教学目标/对象/课时/先修，通用内容
- `src/app/components/ComparisonSection.tsx` — 传统 vs AI 对比 + Recharts 图表，通用
- `src/app/components/VibeCodingIntro.tsx` — Claude Code / Harness / Superpowers 介绍，通用
- `src/app/components/SuperpowersSection.tsx` — 技能生态卡片，通用
- `src/app/components/Footer.tsx` — 页脚，通用
- 所有 `src/app/components/ui/*` — 基础组件库，不动

---

## 验证方式

1. `pnpm dev` 启动开发服务器，浏览器检查所有 Section
2. `pnpm build` 构建单文件 HTML，确认能正常打开
3. 逐 Section 检查：无残留 "3D"、"Three.js"、"three-fiber"、"building"、"建筑" 等词
4. 两份讲义 HTML 可正确下载和预览

## 已知不做

- 不新增依赖（react-dnd 已安装）
- 不改变现有 UI 风格和布局
- 不修改对比图（Hero 中的两张流程图）
- 不修改 Recharts 耗时对比图
