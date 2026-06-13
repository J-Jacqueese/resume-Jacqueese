export const conceptHandoutHtml = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>概念讲义 — AI 辅助开发 vs 传统开发</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  :root{
    --bg:#ffffff;--fg:#0b0b14;--muted:#5b5b6e;--accent:#2563eb;
    --card:#f7f7fa;--border:#e5e5ec;--code:#0b0b14;--codebg:#f1f1f5;
  }
  *{box-sizing:border-box}
  body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fg);background:var(--bg);line-height:1.6}
  .wrap{max-width:880px;margin:0 auto;padding:48px 32px}
  header{border-bottom:1px solid var(--border);padding-bottom:24px;margin-bottom:32px}
  h1{font-size:32px;margin:0 0 8px}
  h2{font-size:22px;margin:32px 0 12px;border-left:4px solid var(--accent);padding-left:12px}
  h3{font-size:18px;margin:24px 0 8px}
  p{margin:8px 0}
  .meta{color:var(--muted);font-size:14px}
  table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px}
  th,td{border:1px solid var(--border);padding:10px;text-align:left;vertical-align:top}
  th{background:var(--card)}
  .card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;margin:12px 0}
  ul{padding-left:20px}
  code{background:var(--codebg);padding:2px 6px;border-radius:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px}
  pre{position:relative;background:var(--codebg);padding:14px 16px;border-radius:10px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.5}
  .copy-btn{position:absolute;top:8px;right:8px;padding:4px 8px;border:none;border-radius:6px;background:var(--accent);color:#fff;font-size:12px;cursor:pointer;opacity:0;transition:opacity .2s}
  pre:hover .copy-btn{opacity:1}
  .copy-btn.copied{background:#16a34a}
  .badge{display:inline-block;background:var(--accent);color:#fff;border-radius:999px;padding:2px 10px;font-size:12px;margin-right:6px}
  footer{margin-top:48px;padding-top:16px;border-top:1px solid var(--border);color:var(--muted);font-size:13px}
  @media print { .wrap{padding:0} body{font-size:12px} }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <span class="badge">课程讲义</span>
    <span class="badge">模块 01</span>
    <h1>AI 辅助开发 vs. 传统开发</h1>
    <p class="meta">概念参考手册 · Vibe Coding 实验课配套材料</p>
  </header>

  <h2>1. 学习目标</h2>
  <ul>
    <li>理解传统软件开发与 AI 辅助 "Vibe Coding" 的区别。</li>
    <li>从效率、代码质量、调试和学习等维度对比两种开发方式。</li>
    <li>判断何时适合使用 AI 辅助，何时不适合。</li>
    <li>掌握使用 Claude Code 配合 Harness 与 Superpowers 工具链构建全栈应用的方法。</li>
  </ul>

  <h2>2. 核心术语</h2>
  <div class="card">
    <p><b>传统开发：</b>开发者手动编写每一行代码，借助 IDE 自动补全、文档和 Stack Overflow 等工具辅助。</p>
    <p><b>AI 辅助开发：</b>开发者与一个能感知代码仓库的大语言模型协作，该模型能读取代码、编写文件、执行命令并迭代优化。</p>
    <p><b>Vibe Coding：</b>一种工作流程——人类用自然语言表达<i>意图</i>（即"感觉"），AI Agent 负责生成、运行和优化实现。人类负责审阅、把控方向和验证结果。</p>
    <p><b>Claude Code：</b>Anthropic 出品的命令行 Agent，能把终端变成一个多功能编程队友。</p>
    <p><b>Harness：</b>Claude Code 运行所在的执行环境（沙箱、权限、Hook）。</p>
    <p><b>Superpowers：</b>一组可扩展的技能库（专用提示词 + 工具），为 Claude Code 增加设计稿导入、代码验证、代码评审等能力。</p>
  </div>

  <h2>3. 对比一览表</h2>
  <table>
    <thead><tr><th>维度</th><th>传统开发</th><th>使用 Claude Code 的 Vibe Coding</th></tr></thead>
    <tbody>
      <tr><td>主要输入</td><td>手写代码</td><td>自然语言意图 + 审阅</td></tr>
      <tr><td>原型耗时</td><td>数小时到数天</td><td>数分钟到数小时</td></tr>
      <tr><td>样板代码</td><td>手动搭建</td><td>按需生成</td></tr>
      <tr><td>代码质量</td><td>取决于开发者经验</td><td>取决于提示词质量 + 审阅纪律</td></tr>
      <tr><td>调试方式</td><td>打印/日志、断点、搜索</td><td>Agent 读取堆栈信息、提出修复方案、重新运行测试</td></tr>
      <tr><td>技术栈门槛</td><td>需要预先掌握</td><td>可以在构建过程中边学边用</td></tr>
      <tr><td>风险特征</td><td>慢但可预测</td><td>快但需要验证</td></tr>
      <tr><td>最佳场景</td><td>关键性、高可靠性模块</td><td>原型、胶水代码、技术探索、UI</td></tr>
    </tbody>
  </table>

  <h2>4. 何时使用 AI 辅助</h2>
  <ul>
    <li><b>推荐：</b>项目脚手架、UI 组件、CRUD API、编写测试、解读不熟悉的代码、重构。</li>
    <li><b>谨慎使用：</b>安全敏感代码、新颖算法、任何你无法评估正确性的场景。</li>
    <li><b>禁止：</b>提交你不理解的代码、在提示词中暴露密钥、跳过代码评审。</li>
  </ul>

  <h2>5. Vibe Coding 循环</h2>
  <ol>
    <li><b>表达意图</b> — 用 2-4 句话描述你想要什么。</li>
    <li><b>规划</b> — 让 Agent 提出计划，你来纠正。</li>
    <li><b>构建</b> — Agent 编辑文件并执行命令。</li>
    <li><b>验证</b> — 运行应用、检查 UI、审阅代码差异。</li>
    <li><b>迭代</b> — 将结果反馈给 Agent："按钮没有对齐，修复一下"。</li>
  </ol>

  <h2>6. 伦理与学术诚信</h2>
  <ul>
    <li>在作业中注明 AI 工具的使用情况。</li>
    <li>无论代码由谁编写，你都要对最终提交的每一行代码负责。</li>
    <li>不要提交你在答辩中无法解释的 AI 生成内容。</li>
  </ul>

  <h2>7. 延伸阅读</h2>
  <ul>
    <li>Anthropic — Claude Code 官方文档</li>
    <li>Three.js 基础 — threejs.org</li>
    <li>React Three Fiber — docs.pmnd.rs</li>
  </ul>

  <footer>由 Vibe Coding 教学课件生成 · 可自由分发用于教学目的。</footer>
</div>
<script>
document.querySelectorAll('pre').forEach(function(pre){
  var btn=document.createElement('button');
  btn.className='copy-btn';btn.textContent='复制';
  btn.onclick=function(){
    navigator.clipboard.writeText(pre.textContent.replace('复制','').replace('已复制','').trim()).then(function(){
      btn.textContent='已复制';btn.classList.add('copied');
      setTimeout(function(){btn.textContent='复制';btn.classList.remove('copied')},2000);
    });
  };
  pre.style.position='relative';pre.appendChild(btn);
});
</script>
</body>
</html>`;
