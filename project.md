AI淘是一个对话式 AI 购物助手，通过端云协作的 Agent 架构将云端决策与客户端 MTOP 真实执行无缝连接，以 SSE 流式输出 + 三层 Prompt + 多轮上下文管理，让用户一句话走完搜索到售后的全链路，实现「说出来就能买到」的购物体验。

## 1. 项目概览

AI淘（AI Tao）是一个 AI Native 的淘宝购物助手：用户用自然语言表达需求（搜商品、看详情、选尺码、加购、下单、取消、退款等），Agent 自主规划工具调用顺序，通过 WebSocket Bridge 调用淘宝 MTOP 业务接口完成全链路操作，并以流式 Markdown 的方式回复结果。

「AI淘」——谐音"爱淘"，既是 AI + 淘宝的技术组合，也是对用户说：爱淘，就用 AI 淘。

与传统「搜索框 → 列表页 → 详情页 → 下单页」分步式 UI 相比，AI淘的差异在于：

| 维度 | 传统淘宝 | AI淘 |
|------|---------|------|
| 输入方式 | 搜索框打字 → 翻页 → 筛选 → 点击 | 自然语言："帮我找200以内的运动鞋" |
| 信息呈现 | 瀑布流列表，用户自行比较 | Agent 分类推荐 + 关键信息高亮 |
| 决策辅助 | 手动看评价、比价 | Agent 主动推荐尺码、总结亮点 |
| 操作路径 | 搜索→详情→SKU→加购→结算（5步） | "买这个42码的"（1句话闭环） |
| 数据来源 | 页面渲染 | MTOP 真实接口返回，禁止凭知识杜撰 |

### 1.1 核心技术挑战

- **端云协作：** MTOP 接口依赖客户端登录态，服务端 Agent 无法直接调用
- **多轮对话：** 用户的购物意图跨越多轮（搜索→尺码→加购→下单），Agent 需保持上下文连贯
- **实时交互：** 购物场景对响应速度敏感，需要流式输出
- **工具编排：** 16 个工具覆盖购物全链路，LLM 需在正确时机调用正确工具
- **可靠性：** 电商场景对准确性要求极高——错一个 itemId 用户就会买到错的商品，错一个数量可能造成真实资损
### 1.2 技术选型与决策

| 层级 | 技术方案 | 选型理由 | 备选 & 为什么没选 |
|------|---------|---------|-------------------|
| LLM | DashScope qwen-plus | 内网低延迟，原生 tool calling | qwen-max 延迟高；开源模型部署复杂 |
| Agent 框架 | AgentScope ReActAgent | 流式 msg_queue、工具编排、Skill 机制 | LangChain 太重；裸写 ReAct 缺流式 |
| 后端 | FastAPI + Uvicorn | 异步原生，SSE/WS 支持好 | Flask 无异步；Django 太重 |
| 前端 | ice.js + Streamdown | Markdown 流式渲染，淘宝 WebView 兼容 | Next.js 不兼容淘宝容器 |
| 工具执行 | WebSocket Bridge | 利用客户端登录态，前后端职责分离 | mock 数据不真实；Puppeteer 不稳定 |
| 流式输出 | SSE | 单向推送，浏览器原生支持 | WS 已用于工具调用，避免复用同一通道 |
## 2. 整体架构

### 2.1 系统架构图
┌─────────────────────────────────────────────────────────────────┐
│                        前端 (ice.js)                             │
│                                                                 │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────────┐ │
│  │ AiHelpPeople │   │ useAgentWs   │   │   agentTools.ts      │ │
│  │  页面组件    │   │  WS Hook     │   │   16个Tool Handler   │ │
│  │             │   │             │   │                      │ │
│  │ · 发送消息   │   │ · 注册session│   │ · search_products    │ │
│  │ · SSE解析   │   │ · 收tool_req │   │ · get_product_detail │ │
│  │ · 流式渲染   │   │ · 发tool_resp│   │ · add_to_cart / ...  │ │
│  └──────┬──────┘   └──────┬───────┘   └──────────┬───────────┘ │
│         │                 │                       │             │
│    POST /stream      WS /ws/agent-tool      Mtop.request()     │
│   (SSE 流式文本)    (工具请求/响应)        (客户端登录态)       │
└─────────┼─────────────────┼───────────────────────┼─────────────┘
          │                 │                       │
          ▼                 ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        后端 (FastAPI)                            │
│                                                                 │
│  ┌──────────┐    ┌────────────┐    ┌──────────────────────────┐│
│  │ chat.py  │    │ToolBridge  │    │     tb_agent.py          ││
│  │ SSE路由  │    │ WS中继     │    │     Agent管理            ││
│  │          │    │            │    │                          ││
│  │·event_gen│    │·session→WS │    │ · _register_all_skills() ││
│  │·history  │    │·reqId→Fut  │    │ · _create_bridge_tool()  ││
│  │ 注入     │    │·30s超时    │    │ · get_agent(缓存)        ││
│  └────┬─────┘    └─────┬──────┘    └──────────┬───────────────┘│
│       │                │                      │                │
│       ▼                ▼                      ▼                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  ReActAgent (AgentScope)                  │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────┐  ┌────────────────────┐ │  │
│  │  │  3层 Prompt   │  │ Toolkit  │  │  InMemoryMemory    │ │  │
│  │  │              │  │          │  │                    │ │  │
│  │  │ L1:core/*.md │  │ 16个工具 │  │ 按sessionId缓存   │ │  │
│  │  │ L2:SKILL.md  │  │ 自动注册 │  │ 多轮历史累积      │ │  │
│  │  │ L3:动态上下文 │  │ Bridge包装│  │ history注入兜底   │ │  │
│  │  └──────────────┘  └────┬─────┘  └────────────────────┘ │  │
│  │                         │                                │  │
│  │                    _reasoning() ←→ _acting()             │  │
│  │                    (LLM推理)        (工具执行)            │  │
│  └─────────────────────────┼────────────────────────────────┘  │
│                            │                                   │
│                            ▼                                   │
│                 ┌────────────────────┐                         │
│                 │  DashScope API     │                         │
│                 │  qwen-plus (LLM)   │                         │
│                 │  stream + tools    │                         │
│                 └────────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
### 2.2 关键路径

用户消息 → 前端 POST /api/agentScope/stream → SSE 建立
后端按 user_id:session_id 查缓存 → 复用或创建 ReActAgent
Agent 进入 ReAct 循环：_reasoning() → LLM 推理 → 决定调用工具
工具执行：通过 ToolBridge WS 转发到前端 → 前端执行 MTOP → WS 回传结果
Agent 继续推理 → 生成回复文本 → msg_queue → SSE 流式推送前端
前端 Streamdown 渲染 Markdown + 工具状态卡片（⏳/✅/❌）
## 3. Agent 框架

### 3.1 ReAct 循环与干预点
ReAct（推理 → 行动 → 观察 → 继续推理）由 AgentScope ReActAgent 内部管理，在没有 tool_call 产生时结束本轮。我们在以下关键点做了干预：

用户消息进入
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│  预处理层                                                  │
│  ┌────────────────────────────────────────────────────┐   │
│  │  1. 按 user_id:session_id 查缓存 → 复用/创建 Agent  │   │
│  │  2. history 注入（memory 为空时触发兜底）             │   │
│  │  3. 三层 Prompt 拼接（Core + SKILL + Dynamic）       │   │
│  └────────────────────────────────────────────────────┘   │
│                        │                                   │
│                        ▼                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │  ReAct 循环                                         │   │
│  │                                                    │   │
│  │   _reasoning()                                     │   │
│  │      │  LLM 推理 → 判断是否需要工具                  │   │
│  │      │  ├─ 有 tool_call → 进入 _acting()            │   │
│  │      │  └─ 无 tool_call → 输出文本 → 结束循环        │   │
│  │      ▼                                              │   │
│  │   _acting()                                         │   │
│  │      │  工具执行前：参数映射 + 固定参数注入           │   │
│  │      │  工具执行中：WS Bridge 转发 → 30s 超时保护    │   │
│  │      │  工具执行后：结果写入 msg_queue                │   │
│  │      │  └─ 失败时返回 {success:false, error}         │   │
│  │      ▼                                              │   │
│  │   回到 _reasoning()（携带工具结果继续推理）            │   │
│  └────────────────────────────────────────────────────┘   │
│                        │                                   │
│                        ▼                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │  后处理层                                            │   │
│  │  · reply() 自动写入 InMemoryMemory                   │   │
│  │  · SSE 发送 [DONE] 标志                              │   │
│  │  · Token 使用量统计                                   │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
关键设计决策：工具失败返回 {success: false, error: "..."} 而非抛异常 —— Agent 看到错误原因后可自主决策（重试、换参数、或告知用户），避免整个 ReAct 循环崩溃。

### 3.2 三层 Prompt 架构

System Prompt 是 Agent 的「行为说明书」，我们拆成三层，各层职责分离，支持独立热更新：

Layer 1 (Core Identity) ──── prompt/core/*.md ──── 启动时拼接，常驻
  ├── identity.md        → 身份 + 能力声明
  ├── meta_rules.md      → 元规则（诚实、确认、隐私）
  ├── business_rules.md  → 搜索策略、下单流程、尺码追问
  ├── interaction.md     → 响应规范
  └── output_format.md   → 输出格式

Layer 2 (Domain Skills) ──── skills/*/SKILL.md ──── AgentScope 自动注入
  └── game-gold-shopping  → 工具清单、使用流程、注意事项

Layer 3 (Dynamic Context) ── 每轮动态生成
  └── 当前时间、用户画像（预留）
拼接顺序决定 LLM 注意力优先级：identity → meta_rules → business_rules → interaction → output_format。各层用 --- 分隔，markdown 格式。

**Token 效率优化：**
- `_EXCLUDE_SKILL_LIST` 排除未用 skill，减少 prompt 长度
- `@_mtop` 的 `fixed_params` 隐藏固定参数，不暴露给 LLM
- Agent 按 `sessionId` 缓存复用，避免重复注入
### 3.3 工具体系设计

AI淘拥有 16 个原子工具，覆盖购物全链路五大域：

| 域 | 工具 | 说明 |
|------|------|------|
| 搜索发现 | `search_products`, `search_shop_items` | 商品搜索与店铺内搜索 |
| 商品决策 | `get_product_detail`, `get_product_reviews` | 详情提取与评价获取 |
| 购物车 | `add_to_shopping_cart`, `query_shopping_cart` | 购物车加购与查询 |
| 立购下单 | `build_buy_now_order`, `create_buy_now_order` | 立即购买两阶段提交 |
| 购物车下单 | `confirm_order`, `submit_order` | 购物车结算两阶段提交 |
| 订单管理 | `query_bought_list`, `query_order_detail`, `cancel_order` | 订单查询与取消 |
| 售后 | `query_refund_list`, `query_refund_detail`, `submit_refund` | 退款全链路 |
工具签名即 Schema —— 零冗余设计：

开发者写的 Python 函数                    LLM 看到的 tool schema（自动生成）
──────────────────────                   ──────────────────────────────
@_mtop(                                  {
  api="mtop.trade.order.build",            "type": "function",
  param_mapping={                          "function": {
    "item_id": "itemId",                     "name": "build_buy_now_order",
    "sku_id": "skuId"                        "description": "立购确认订单...",
  }                                          "parameters": {
)                                              "item_id": {"type":"string"},
def build_buy_now_order(                       "sku_id": {"type":"string"},
  item_id: str,              ──自动转换──▶     "quantity": {"type":"integer"}
  sku_id: str = "",                          }
  quantity: int = 1                        }
) -> dict:                               }
  """立购确认订单（结算页预览）。
  需要商品ID，返回订单预览。"""
一个 Python 函数同时服务三个角色：开发者文档、LLM 工具说明、MTOP 接口配置。新增工具只需后端加一个 @_mtop 函数，_register_all_skills 自动扫描注册，前端 fallback handler 自动执行 mtopRequest(api, data, v)，零前端改动。

## 4. 核心技术方案

### 4.1 WebSocket Bridge 工具执行
痛点：MTOP 接口需客户端登录态，服务端无法直接调用。mock 数据无法反映真实业务场景，服务端模拟登录有安全合规问题。

核心思路：将"思考能力"和"执行能力"解耦 —— 后端负责思考（LLM 推理 + 工具选择），前端负责执行（MTOP 调用），WebSocket 作为异步通信桥梁。

用户: "帮我搜运动鞋"
         │
         ▼
┌──────────────────┐
│  ReActAgent      │  ① LLM 推理 → 决定调用 search_products(keyword="运动鞋")
│  _reasoning()    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  bridge_wrapper  │  ② 构造 payload: { api: "mtop.xxx", data: {q:"运动鞋"} }
│  (tb_agent.py)   │     参数映射: keyword → q (param_mapping)
└────────┬─────────┘     固定参数注入: pageSize=20 (fixed_params)
         │
         ▼
┌──────────────────┐
│  ToolBridge      │  ③ 通过 sessionId 找到 WS 连接
│  (tool_bridge.py)│     创建 requestId → asyncio.Future 映射
└────────┬─────────┘     30 秒超时保护
         │ WS: tool_request
         ▼
┌──────────────────┐
│  useAgentWs      │  ④ 前端收到请求 → getToolHandler("search_products")
│  (前端 WS Hook)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  agentTools.ts   │  ⑤ handler 调用 Mtop.request() (利用淘宝登录态)
│  search_products │     → 返回真实商品数据
└────────┬─────────┘
         │ WS: tool_response
         ▼
┌──────────────────┐
│  ReActAgent      │  ⑥ 收到结果 → LLM 继续推理 → 生成推荐文本
│  _reasoning()    │
└──────────────────┘
参数映射三级流水线：

LLM 输出参数         @_mtop 映射            前端 MTOP 调用
(snake_case)        (param_mapping)        (camelCase)
──────────────      ──────────────         ──────────────
item_id       →     itemId            →    Mtop.request({data:{itemId}})
tab_code      →     tabCode           →    Mtop.request({data:{tabCode}})
sku_id        →     skuId             →    Mtop.request({data:{skuId}})
前端做双命名兼容：data?.tabCode || data?.tab_code，防止链路中任何一环映射遗漏导致参数丢失。

### 4.2 SSE 流式输出
为什么需要流式：ReAct 循环（推理→执行→推理→...）耗时 10-30 秒。流式让用户第一秒就能看到文字，工具执行时看到进度卡片。

┌────────────┐    push     ┌────────────┐   SSE yield   ┌──────────────┐
│ ReActAgent │ ──────────▶ │ msg_queue  │ ────────────▶ │   前端       │
│            │   每个token  │(asyncio Q) │  data: {...}  │ processSSE   │
│ _reasoning │   每次tool   │            │  \n\n         │ Data()       │
│ _acting    │   result     │            │               │              │
└────────────┘              └────────────┘               └──────────────┘
                                                              │
                                                    ┌─────────┴─────────┐
                                                    │                   │
                                              text chunks          tool_calls
                                                    │                   │
                                              流式渲染文字        工具状态卡片
                                              (Streamdown)       (⏳/✅/❌)
双端兼容：PC 端用 Fetch ReadableStream，iOS 淘宝 App 用 XHR onprogress 降级（WebView 不支持 ReadableStream）。

前端去重机制：工具调用前的意图确认文本（如"好的，正在为您搜索..."）锁定为 preToolContent，工具执行后的总结文本单独累积，避免 LLM 流式输出中前后段文字重复或闪烁。

### 4.3 多轮对话与上下文管理
购物场景中"尺码追问与多轮澄清"要求多轮对话保持连贯。若 Agent 第 2 轮不知道第 1 轮聊的是哪个商品，整个购物体验将断裂。

双保险机制：

                    同一 sessionId 的多轮请求
                    ┌─────┐ ┌─────┐ ┌─────┐
                    │轮1  │ │轮2  │ │轮3  │
                    │搜鞋 │ │42码 │ │下单 │
                    └──┬──┘ └──┬──┘ └──┬──┘
                       │      │      │
        ┌──────────────▼──────▼──────▼──────────────┐
        │          _agent_cache                      │
        │   key = "default:session_123"              │
        │                                            │
        │   ┌────────────────────────────────────┐   │
  主    │   │      InMemoryMemory                │   │
  路    │   │                                    │   │
  径    │   │  [user: 搜运动鞋]                  │   │  ← 轮1 reply() 自动写入
        │   │  [asst: 找到3款...Nike/Adidas/...]  │   │
        │   │  [user: 42码的]                     │   │  ← 轮2 reply() 自动写入
        │   │  [asst: Nike 42码 skuId=xxx...]     │   │
        │   │  [user: 帮我下单]                   │   │  ← 轮3 reply() 自动写入
        │   └────────────────────────────────────┘   │
        └────────────────────────────────────────────┘

        ┌────────────────────────────────────────────┐
  兜    │  history 注入（memory 为空时触发）           │
  底    │                                            │
  路    │  if memory.size() == 0:                    │
  径    │    for msg in request.history/messages:    │
        │      memory.add(Msg(role, content))        │
        │                                            │
        │  场景：服务重启 / 外部系统不复用 sessionId    │
        └────────────────────────────────────────────┘
三个 SSE/Chat 端点统一兜底：/stream、/chat、/query 三个入口都实现了相同的 history 注入逻辑，确保任何入口进来的请求都能恢复上下文。

### 4.4 SKU 解析与尺码推荐
MTOP 返回的 SKU 数据结构层级深，需要 3 步解析：

MTOP 原始响应
  │
  ▼
apiStack[0].value (JSON字符串，需先 parse)
  │
  ├─ skuBase.props ───────▶ 属性定义
  │   [{ pid:"颜色", values: [{vid:"28320", name:"蓝色"}] }]
  │
  ├─ skuBase.skus ────────▶ SKU 列表
  │   [{ skuId:"123", propPath:"20549:28320;1627207:6215318" }]
  │
  └─ skuCore.sku2info ────▶ 价格/库存
      { "123": { price:{priceMoney:79800}, quantity:200 } }
                                │
          ┌─────────────────────┘
          │ 解析算法
          ▼
  ① 构建映射: propValueMap["20549:28320"] = "颜色:蓝色"
  ② 拆分 propPath → 查映射 → 组合为 "颜色:蓝色 / 尺码:XL"
  ③ 价格 79800分 → "798.00元"
          │
          ▼
  前端展示: { skuId:"123", specs:["颜色:蓝色","尺码:XL"], price:"798.00", stock:200 }
尺码推荐强制流程：Prompt 中用 ⚠️ 标记 —— 加购服装/鞋类时必须先获取 SKU、列出尺码选项、根据用户身高体重推荐、等用户确认后才用对应 skuId 执行。禁止跳过尺码选择直接加购。

### 4.5 订单全链路
立购路径（用户直接买）                    购物车路径（先加购再结算）
─────────────────────                   ─────────────────────────
search_products                         add_to_shopping_cart
       │                                       │
get_product_detail                       query_shopping_cart
       │                                       │
 [用户选 SKU]                             [用户确认商品]
       │                                       │
build_buy_now_order ◄─── Gzip+Base64 ──► confirm_order
       │                  编码回传              │
 [用户确认预览]            缓存模式        [用户确认预览]
       │                                       │
create_buy_now_order ◄── 缓存响应编码 ──► submit_order
       │                                       │
query_bought_list (核验)                  query_bought_list (核验)
       │                                       │
cancel_order (取消待付款订单)              cancel_order
Gzip+Base64 编码回传：MTOP 订单接口要求将 build 阶段的完整响应编码后回传给 create 阶段，确保服务端状态一致性。前端缓存 build 响应 → gzip 压缩 → Base64 编码 → 作为 create 请求的 params 字段提交。

## 5. 可靠性设计
电商场景对「准确」「不胡说」的要求远高于一般问答应用。我们从三个维度构建可靠性保障：

### 5.1 工具执行错误恢复
工具执行结果
    │
    ├── 成功 → {success: true, data: {...}}  → Agent 正常处理
    │
    ├── 业务失败 → {success: false, error: "库存不足"}
    │              → Agent 看到原因后自主决策（换 SKU / 告知用户）
    │
    ├── WS 超时 → 30s 未响应 → 返回超时错误
    │              → Agent 提示用户稍后重试
    │
    └── WS 断连 → 连接丢失 → 自动重连 + 重新注册 session
                   → 前端显示 WS 状态指示器
关键原则：工具失败返回错误信息而非抛异常，Agent 可自主决策下一步行动。这与传统 try-catch 模式的区别在于：决策权交给 LLM 而非硬编码。

### 5.2 系统参数自动注入
用户参数 vs 系统参数 —— 安全边界
─────────────────────────────────

  用户显式提供               系统自动注入（对 LLM 透明）
  ─────────────              ─────────────────────────
  · keyword（搜索词）         · userId   ← window.__userInfo__
  · item_id（商品ID）         · userNick ← 页面初始化 MTOP 获取
  · sku_id（SKU ID）          · pageSize ← @_mtop fixed_params
  · quantity（数量）          · bizType  ← @_mtop fixed_params
设计原则：LLM 不需要知道 userId —— 退款查询等需要用户身份的工具，由前端 handler 从 window.__userInfo__ 自动注入，避免 LLM 向用户索要敏感信息。

### 5.3 大数量下单拦截
Prompt 中明确约束：当用户请求的购买数量异常（如 99999 件）时，Agent 必须先提醒数量异常并要求二次确认，不得直接执行下单操作。这通过 Prompt 规则而非代码硬编码实现，保持了 Agent 的灵活性。

## 6. 特色场景

### 6.1 搜索推荐 → 多轮续问
用户: "帮我搜运动鞋"
  │
  ▼ Agent 调用 search_products(keyword="运动鞋")
  │ → 返回商品列表，流式输出推荐文案
  │
用户: "200块以内的有吗"
  │
  ▼ Agent 关联上下文（运动鞋）→ search_products(keyword="运动鞋", maxPrice=200)
  │ → 价格筛选后的结果
  │
用户: "第一款详情"
  │
  ▼ Agent 从上一轮结果取第一款 itemId → get_product_detail(item_id=xxx)
关键设计：Agent 通过 InMemoryMemory 中积累的对话历史理解"第一款"、"200以内"等指代和追问，无需用户重复完整指令。

### 6.2 尺码追问 → 关联下单
用户: "我身高170，体重65kg，穿什么码？商品 itemid：995878258325"
  │
  ▼ Agent 调用 get_product_detail → 获取 SKU 尺码表
  │ → 分析身高体重 → 推荐 2XL（130斤适合）
  │
用户: "那M码和L码差多少？"
  │
  ▼ Agent 不重新调工具 → 直接从上一轮 SKU 数据对比
  │ → M(100-110斤) vs L(110-120斤)，建议都不适合
  │
用户: "那帮我买2XL的吧"
  │
  ▼ Agent 关联 itemid + 2XL 对应的 skuId → 发起下单
### 6.3 售后退款（系统参数自动注入）
用户: "查看我的退款进度"
  │
  ▼ Agent 调用 query_refund_list({})  ← LLM 不传 userId
  │
  ▼ 前端 handler 自动注入:
  │   userId  ← window.__userInfo__.userId
  │   userNick ← window.__userInfo__.userNick
  │
  ▼ → 返回退款列表（不向用户索要任何身份信息）
### 6.4 购物车完整链路
用户: "加购3件羽绒服 itemid:1038825370248 skuid:6057166340427"
  ▼ add_to_shopping_cart(item_id=..., sku_id=..., quantity=3)  ← quantity=3 正确传递

用户: "帮我看下购物车"
  ▼ query_shopping_cart → 列出购物车内容

用户: "帮我买购物车里的羽绒服"
  ▼ 从购物车找到商品 → confirm_order → 展示预览

用户: "确认下单"
  ▼ submit_order → 提交订单
## 7. 前后端联调关键问题与解决

| 问题 | 根因 | 解决方案 |
|------|------|---------|
| CORS 跨域 | 192.168.x.x:3000 → 30.x.x.x:8000，OPTIONS 被拦截 | CORS 正则覆盖所有 IP `(\d+\.){3}\d+` + ice proxy 转发 |
| SSE 解析断裂 | 前端按 `\n` 分割，不完整事件被误解析 | 改为 `\n\n` 分割 SSE 事件，再提取 `data:` 行 |
| 参数映射不匹配 | 后端 `tab_code`→`tabCode`，前端按 `tab_code` 取值 | 前端双命名兼容：`data?.tabCode \|\| data?.tab_code` |
| userId 取不到 | 退款查询需 userId，LLM 不知道用户身份 | 前端初始化时 MTOP 获取 → `window.__userInfo__` → handler 自动注入 |
| 工具不调用 | "三段式" prompt 让 LLM 只输出文字不带 tool_use | 改为"同一轮同时输出文字和调用工具" |
| SSE 不流式 | ice proxy 缓冲了 SSE 响应 | proxy 加 `X-Accel-Buffering: no` 禁用缓冲 |
| WS 代理冲突 | `/ws` 路径拦截了 webpack HMR WebSocket | 收窄代理路径为 `/ws/agent-tool` |
| 移动端兼容 | iOS 淘宝 WebView 不支持 ReadableStream | XHR onprogress 降级方案 |
## 8. 总结与展望

AI淘的工程实现遵循两条核心信条：永远不 mock 数据 —— 所有商品、价格、订单均来自 MTOP 真实接口返回；永远不让模型独自承担事实性责任 —— 凡是模型"想起来"的商品信息都视为未经证实，必须有可追溯的接口数据支撑。

### 8.1 技术亮点

- **WebSocket Bridge 端云协作：** 后端编排工具，前端真实执行 MTOP，新增工具零前端改动
- **三层 Prompt 架构：** markdown 文件拆分，热更新，各层职责清晰
- **工具签名即 Schema：** Python docstring 同时服务开发者和 LLM，零冗余
- **SSE+WS 双通道：** 流式文本和工具调用职责分离，互不阻塞
- **错误恢复而非异常中断：** 工具失败返回错误信息，决策权交给 Agent
- **系统参数透明注入：** userId 等敏感信息前端自动注入，LLM 无感知

### 8.2 经验教训

- Prompt 措辞必须与 Agent 框架对齐："先输出文字再调工具"导致 ReActAgent 提前退出，改为"同轮同时输出"后解决
- 前后端参数映射做双命名兼容：Bridge 链路中参数经过 3 次转换（Python→JSON→TypeScript），必须兼容 snake_case 和 camelCase
- 上下文是多轮对话的灵魂：购物助手体验的核心差距就在于 Agent 能否记住前面说了什么
- 系统参数不能依赖 LLM 传递：userId 等信息前端自动注入，对 LLM 透明
- 永远不让模型独自承担事实性责任：所有商品数据必须来自 MTOP 接口返回，禁止凭训练知识杜撰

### 8.3 可优化方向

**短期：**
- 搜索结果 LLM 智能分类（按价格/品牌/场景），提升宽泛搜索推荐质量
- 商品对比：同时获取两个商品详情，输出结构化对比表格
- 上下文实体追踪：显式维护 ConversationContext，提供商品实体列表和焦点商品
- 搜索关键词预处理：接入同义词/纠错词典（"耐可"→"Nike"）

**中期：**
- 多 Agent 协作（Orchestrator）：搜索/详情/订单/售后拆分为独立 Agent 并行调度
- RAG 知识库增强：面料知识、尺码对照表、保养指南注入 Agent
- 上下文压缩：长对话自动摘要化，释放上下文窗口
- 工具执行结果裁剪：超大 MTOP 响应自动截断，保留关键字段
- 工具后处理管线化：Pipeline 模式替代 if-elif 分发

**长期：**
- 端上 Agent：浏览器操控（navigate + read_page + click），绕过 MTOP 接口限制
- 多模态理解：商品截图识别 + 搜同款
- 个性化推荐：用户画像注入 Layer 3 Dynamic Context
- 持久化记忆：跨会话记忆存储 + 向量检索，记住用户偏好
- A/B 测试框架：量化 Prompt 变体对用户体验的影响