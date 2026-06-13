# AI Daily Insight Engine — 系统设计规格书

> **项目**：AI 舆情分析日报系统 MVP  
> **日期**：2026-06-13  
> **策略**：技术创新优先 — 多 Agent Workflow 编排 × 对抗性验证 × 多模型混合

---

## 1. 设计概述

### 1.1 核心策略

本方案选择 **技术创新优先** 路线，通过 Claude Code Workflow 的多 Agent 编排能力，构建一个 6 Phase 扇出/扇入 Pipeline。核心理念：**不只是完成任务，而是展示 AI Coding 的工程化上限**。

### 1.2 技术栈

| 层级 | 技术 | 理由 |
|------|------|------|
| 编排层 | TypeScript (Claude Code Workflow) | 多 Agent 编排原生支持，Pipeline/Parallel/Barrier 组合 |
| 数据层 | Python 3.x | 数据处理生态成熟，`jsonschema` 验证，`difflib` 去重 |
| 可视化 | HTML + D3.js + ECharts | 交互式 Dashboard，GitHub Pages 一键部署 |
| 数据桥 | JSON | Python 输出 → Web 消费，简单可验证 |

### 1.3 架构全景

```
Phase 1: 多源并行采集（3 Agent 并行）
    Agent A (英文科技媒体) ─┐
    Agent B (聚合平台)     ─┼─→ Phase 2: 去重 + 质量打分（Barrier 汇聚）
    Agent C (中文科技媒体) ─┘         │
                                      ▼
                              Phase 3: 结构化抽取（Pipeline: 每篇文章 → 独立 Agent）
                                      │
                                      ▼
                              Phase 4: 多维分析（3 分析 Agent 并行 + 1 关系构建 Agent）
                                Agent D: 热点识别 ─┐
                                Agent E: 趋势判断 ─┼─→ Agent G: 关系网络构建
                                Agent F: 风险/机会 ─┘
                                      │
                                      ▼
                              Phase 5: 对抗性验证（每个结论 × 3 Skeptic Agent）
                                      │
                                      ▼
                              Phase 6: 报告合成 + 可视化生成
```

---

## 2. 结构化数据模型（Schema）

### 2.1 设计哲学：三层递进式信息模型

不采用扁平字段堆砌，而是构建从"事实"到"属性"到"关系"的递进模型。

### 2.2 Layer 1：原始事实层 (RawRecord)

```json
{
  "id": "uuid",
  "source": {
    "name": "TechCrunch",
    "type": "tech_media",
    "url": "https://...",
    "credibility": 0.92
  },
  "fetch_metadata": {
    "fetched_at": "2026-06-13T08:00:00Z",
    "method": "websearch",
    "agent_id": "collection_agent_1"
  },
  "raw": {
    "title": "OpenAI Releases GPT-5 with Enhanced Reasoning",
    "body": "...",
    "published_at": "2026-06-13T06:30:00Z",
    "language": "en"
  }
}
```

**设计理由**：
- `source.credibility`：来源可信度量化，后续分析可据此加权
- `fetch_metadata`：记录数据获取方式和时间，保证可复现性和可追溯性
- `raw` 对象隔离：原始数据永不修改，处理后的数据独立存储

### 2.3 Layer 2：结构化属性层 (StructuredInsight)

```json
{
  "id": "uuid",
  "raw_record_id": "ref→Layer1",
  "classification": {
    "category": "product_launch|funding|research|policy|acquisition|partnership",
    "sub_category": "large_language_model",
    "ai_domain": ["LLM", "AGI"],
    "confidence": 0.95
  },
  "entities": {
    "organizations": [{"name": "OpenAI", "role": "developer"}],
    "people": [{"name": "Sam Altman", "title": "CEO", "org": "OpenAI"}],
    "technologies": [{"name": "GPT-5", "maturity": "released", "category": "LLM"}],
    "metrics": [{"name": "benchmark_score", "value": 94.5, "unit": "percentile"}]
  },
  "sentiment": {
    "overall": "positive",
    "certainty": 0.88,
    "signals": ["技术突破", "行业领先"]
  },
  "impact_assessment": {
    "scope": "global",
    "timeframe": "long_term",
    "magnitude": 5
  }
}
```

**关键字段设计理由**：

| 字段 | 设计理由 |
|------|----------|
| `classification.confidence` | 体现对 AI 不确定性的认知，后续分析可过滤低置信度结果 |
| `entities` 独立拆分 | 便于聚合分析（如"本周最受关注的公司 Top 5"） |
| `sentiment.certainty` | 情感分析的确定性，与 overall 配合使用 |
| `impact_assessment.magnitude` | 1-5 定量化影响力，支持排序和可视化 |
| `ai_domain` 数组 | 一条新闻可能跨多个 AI 子领域（如 LLM + Policy） |

### 2.4 Layer 3：关系网络层 (RelationGraph)

```json
{
  "nodes": ["insight_id_1", "insight_id_2"],
  "edges": [
    {
      "from": "id_1", "to": "id_2",
      "relation": "competes_with|enables|contradicts|extends|responds_to",
      "strength": 0.85,
      "explanation": "OpenAI GPT-5 与 Google Gemini Ultra 形成直接竞争"
    }
  ],
  "clusters": [
    {
      "theme": "LLM 商业竞争加剧",
      "members": ["id_1", "id_3", "id_7"],
      "coverage": 0.78
    }
  ]
}
```

**设计理由**：Layer 3 是"信息聚合"到"情报分析"的质变点。关系网络让系统不只是罗列新闻，而是理解事件间的因果、竞争、延续关系——直接支撑"深度总结"和"趋势判断"。

---

## 3. 6 Phase Workflow 详细设计

### 3.1 Phase 1：多源并行数据采集

**编排模式**：3 Agent 并行（无依赖关系）

| Agent | 渠道 | 工具 | 目标产出 |
|-------|------|------|----------|
| A: 英文科技媒体 | TechCrunch, The Verge, VentureBeat | WebSearch + WebFetch | 8-10 条英文 AI 新闻 |
| B: 聚合平台 | Hacker News, Product Hunt, GitHub Trending | WebSearch + WebFetch | 5-8 条产品/技术动态 |
| C: 中文科技媒体 | 机器之心, 量子位, 36氪 AI | WebSearch + WebFetch | 5-8 条中文 AI 新闻 |

**技巧**：
- 每个 Agent 的搜索 prompt 带有时间限定（"past 24 hours"）
- 使用 StructuredOutput 确保返回格式一致
- 3 个 Agent 完全并行，总耗时 = max(A耗时, B耗时, C耗时)

### 3.2 Phase 2：去重 + 质量打分

**编排模式**：Barrier（需要所有 Phase 1 结果）

**为什么用 Barrier**：去重需要拿到所有 Agent 结果后才能执行——这是数据依赖关系决定的架构选择。

**处理逻辑**：
1. 标题相似度去重：Python `difflib.SequenceMatcher`，阈值 0.75
2. 质量打分：`Score = credibility × log(content_length) × information_density`
3. 筛选 Top 15-20 条高质量条目

### 3.3 Phase 3：结构化抽取

**编排模式**：Pipeline（每篇文章独立，无 Barrier 等待）

**为什么用 Pipeline 而非 Parallel + Barrier**：每篇文章的抽取互不依赖。Pipeline 让 item 流转，不阻塞——文章 A 抽取完就可以开始后续处理。

```javascript
pipeline(
  articles,
  article => agent(extractPrompt(article), {
    schema: STRUCTURED_INSIGHT_SCHEMA
  })
)
```

**质量保障**：
- 每个 Agent 使用 JSON Schema 约束输出格式
- Python `jsonschema` 库校验：必填字段、类型、枚举值、数值范围
- 不合规条目自动重试（最多 3 次）

### 3.4 Phase 4：多维分析

**编排模式**：Fan-out / Fan-in

| Agent | 分析维度 | 输入 | 输出 |
|-------|----------|------|------|
| D: 热点识别 | Top 3-5 关键事件，按影响力排序 | 所有 StructuredInsight | HotTopic[] |
| E: 趋势判断 | 技术/应用/政策/资本 4 方向 | 所有 StructuredInsight | TrendAnalysis |
| F: 风险/机会 | 风险信号 + 投资/战略机会 | 所有 StructuredInsight | RiskOpportunity[] |
| G: 关系网络 | 事件间因果/竞争/延续关系 | D+E+F 输出 | RelationGraph |

D/E/F **3 个 Agent 并行启动**（独立分析维度），G 在 D/E/F 完成后运行（依赖分析结果）。

### 3.5 Phase 5：对抗性验证

**编排模式**：每个结论 × 3 Skeptic Agent 并行

**核心理念**：AI 生成的结论不能直接采信。每个重要结论必须经过 3 个独立视角的质疑。

**3 个 Skeptic 视角**：

| 视角 | 质疑方向 |
|------|----------|
| 事实核查 | "结论的原始数据支持它吗？有没有被曲解或过度解读？" |
| 逻辑一致性 | "推理链条有漏洞吗？因果倒置了没？是否有遗漏的替代解释？" |
| 统计代表性 | "从个别案例推出一般趋势合理吗？样本量够吗？是否存在选择偏差？" |

**投票规则**：
- ≥2/3 通过 → 保留结论
- 1/3 通过 → 降级标记（标注"存在争议"）但保留
- 0/3 → 丢弃

### 3.6 Phase 6：报告合成 + 可视化

**输出物**：
1. **Markdown 日报**：结构化分析报告（热点 + 深度分析 + 趋势 + 风险/机会）
2. **dashboard_data.json**：Python 脚本从结构化数据生成可视化数据
3. **HTML Dashboard**：交互式可视化报告（6 个图表组件）

---

## 4. 可视化方案

### 4.1 技术选型

| 组件 | 技术 | 理由 |
|------|------|------|
| 关系网络图 | D3.js force simulation | 力导向图是关系网络的标准可视化 |
| 热力图/柱状图/雷达图 | ECharts CDN | 开箱即用，中文友好，图表类型丰富 |
| 统计卡片/布局 | 纯 CSS Grid + Flexbox | 零依赖，展示前端基础能力 |
| 深色主题 | CSS 变量 | 专业数据 Dashboard 标准配色 |

### 4.2 6 个可视化组件

1. **数据概览卡片**：文章总数、热点数、风险数、情感占比
2. **热点事件时间线**：横轴时间，纵轴影响力
3. **实体关系网络图**：节点=公司/人物/技术，边=竞争/合作/投资
4. **分类 × 情感热力图**：X=AI 子领域，Y=情感倾向，颜色=文章密度
5. **影响力排行**：横向柱状图 Top 10
6. **趋势雷达图**：6 维度（LLM/CV/Robotics/Policy/Capital/Application）

### 4.3 数据流

```
Python 脚本 → dashboard_data.json → HTML JS 读取渲染
```

Python 和 Web 之间的接口是一个 JSON 文件——干净、可验证、可替换。

---

## 5. 模型分层策略

| Phase | 模型 | 理由 |
|-------|------|------|
| Phase 1 数据采集 | Haiku | 搜索词生成 + 简单筛选，不需要深度推理 |
| Phase 3 结构化抽取 | Sonnet | Schema 抽取需要准确性，但规模大（~15 篇） |
| Phase 4 多维分析 | Opus | 趋势判断和深度分析需要最强推理能力 |
| Phase 5 对抗性验证 | Sonnet × 3 | 独立视角质疑，中等模型并行 = 高效 |
| Phase 6 报告合成 | Opus | 最终文案质量，值得最强模型 |

**关键洞察**：不是所有任务都需要最强模型。展示成本/质量权衡意识本身就是加分项。

---

## 6. 工程质量设计

### 6.1 错误处理：四级分级

| 等级 | 场景 | 策略 |
|------|------|------|
| L1 致命 | 所有数据源均失败、Schema 完全不匹配 | 终止 Pipeline，生成错误报告 |
| L2 降级 | 某个数据源失败、某篇文章抽取失败 | 跳过问题条目，报告中标注 |
| L3 可恢复 | StructuredOutput 格式错误、单次 API 超时 | 自动重试（3 次），指数退避 |
| L4 质量警告 | Confidence 低于阈值、文章数不足 10 | 继续执行，报告中显著标注 |

### 6.2 AI 输出验证

**核心原则**：AI 的输出必须经过确定性代码验证。

- Schema 验证：Python `jsonschema` 库校验结构
- 逻辑验证：confidence ∈ [0,1]、magnitude ∈ [1,5]、日期格式 ISO8601
- 一致性验证：多维数据交叉检查

### 6.3 项目结构

```
ai-daily-insight/
├── data/raw/          # 原始采集数据（只写一次，不可变）
├── data/processed/    # 清洗 & 去重后
├── data/structured/   # Schema 结构化抽取结果
├── output/reports/    # Markdown 日报
├── output/dashboard/  # HTML Dashboard
├── src/workflow/      # Workflow 编排脚本 (JS)
├── src/extractors/    # Python 数据处理脚本
├── src/prompts/       # Prompt 模板（集中管理）
└── docs/              # 设计文档 + ADR
```

### 6.4 附加加分项

- 🏷️ 每个 Phase 独立 Git commit，message 描述设计意图
- 📦 零外部依赖部署（除 `jsonschema` 外 Python 仅用标准库）
- 🌐 HTML Dashboard 通过 GitHub Pages 一键访问
- 📊 仓库内直接可查看输出示例
- 🧪 `schema_validator.py` 包含测试用例

---

## 7. 关键架构决策记录 (ADR)

### ADR-1：为什么选择 Workflow 编排而非单脚本？

**决策**：使用 Claude Code Workflow 的 Pipeline/Parallel/Barrier 组合模式。

**理由**：
- 展示多 Agent 编排能力（单脚本无法体现）
- 并行阶段减少总耗时
- 对抗性验证需要独立 Agent 视角
- 面试官看到的不是"调 API"，而是"设计系统"

### ADR-2：为什么 Phase 2 用 Barrier 而 Phase 3 用 Pipeline？

**决策**：Phase 2 Barrier（需要全量数据才能去重），Phase 3 Pipeline（每篇文章独立抽取）。

**理由**：
- Barrier 的正确使用场景是"数据依赖"，而非"编程便利"
- 每个架构决策都有明确的数据依赖分析支撑
- 文档中明确说明选择理由，展示工程判断力

### ADR-3：为什么设计三层 Schema 而非扁平模型？

**决策**：三层递进式模型（RawRecord → StructuredInsight → RelationGraph）。

**理由**：
- 数据溯源与信息提取解耦
- 每层有独立的职责和消费者
- 体现信息架构设计能力，而非简单字段堆砌
- confidence 字段系统性嵌入，展示 AI 不确定性认知

### ADR-4：为什么用 HTML Dashboard 而非 Python 可视化？

**决策**：交互式 Web Dashboard 替代静态 Matplotlib/Plotly 图片。

**理由**：
- 交互式图表信息密度远高于静态图片
- GitHub Pages 一键部署，面试官无需安装任何环境
- 展示全栈工程能力
- 数据通过标准 JSON 接口连接 Python 和 Web

---

## 8. 数据源策略

### 8.1 三渠道并行采集

| 渠道 | 来源 | 语言 | 特点 |
|------|------|------|------|
| 英文科技媒体 | TechCrunch, The Verge, VentureBeat | EN | 一手资讯，时效性高，可信度高 |
| 聚合平台 | Hacker News, Product Hunt, GitHub Trending | EN | 社区驱动，反映开发者关注焦点 |
| 中文科技媒体 | 机器之心, 量子位, 36氪 AI | ZH | 中国市场视角，政策解读 |

### 8.2 选择理由

- **多样性**：中英文混合，覆盖媒体/社区/官方三种视角
- **互补性**：英文源提供一手资讯，中文源提供中国视角解读
- **可获取性**：全部通过 WebSearch/WebFetch 获取，无需 API Key
- **可信度**：优先选择知名科技媒体，避免内容农场

---

## 9. 实施计划预览

1. **Phase 0**：项目初始化（目录结构、.gitignore、Python 环境）
2. **Phase 1 实现**：数据采集 Workflow 脚本
3. **Phase 2 实现**：Python 去重 + 质量打分脚本
4. **Phase 3 实现**：结构化抽取 Workflow + Schema 验证脚本
5. **Phase 4-5 实现**：分析 + 验证 Workflow
6. **Phase 6 实现**：报告生成 + HTML Dashboard
7. **文档编写**：README.md（ADR 式文档）
8. **最终检查**：验证完整流程，生成示例输出

详细实施计划将在下一阶段（writing-plans）中制定。
