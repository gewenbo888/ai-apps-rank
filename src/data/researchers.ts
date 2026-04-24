// Schema kept identical to the ranking-site template.
// Semantic relabels (in i18n.ts):
//   h_index   → Overall Score (0-100; weighted composite of 7 criteria)
//   citations → User Satisfaction (×10; 9.2 = 92)
//   papers    → Update Frequency (×10; 9 weekly = 90)
//   field     → Best use case (specific specialty)
//   native_province_*  → Use-case category (group axis for the second tab)
//   notable_work → Sub-scores (ease/features/auto/price) + pros/cons + pricing
//
// Weighting scheme used to compute the Overall Score:
//   Practical usefulness  : 25%   (does it solve real problems)
//   Ease of use           : 15%
//   Feature completeness  : 15%
//   Automation level      : 15%
//   User satisfaction     : 15%
//   Pricing / value       : 10%
//   Update frequency      :  5%
//
// Snapshot of the consumer-facing AI app market, April 2026.
// Numbers reflect a mix of vendor disclosures, third-party reviews, and
// direct hands-on use. Treat as descriptive, not endorsement.

export interface Researcher {
  id: number;
  name_en: string;
  name_zh: string;
  affiliation_en: string;
  affiliation_zh: string;
  field_en: string;
  field_zh: string;
  h_index: number;     // Overall Score (0-100)
  citations: number;   // User Satisfaction (×10)
  papers: number;      // Update Frequency (×10)
  notable_work_en: string;
  notable_work_zh: string;
  country: string;
  native_province_en: string;
  native_province_zh: string;
  homepage?: string;
}

export interface ProvinceStats {
  province_en: string;
  province_zh: string;
  count: number;
  researchers: Researcher[];
  avg_h_index: number;
  total_citations: number;
}

export function getProvinceStats(data: Researcher[]): ProvinceStats[] {
  const map = new Map<string, Researcher[]>();
  for (const r of data) {
    const key = r.native_province_en;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const stats: ProvinceStats[] = [];
  for (const [province_en, rs] of map) {
    stats.push({
      province_en,
      province_zh: rs[0].native_province_zh,
      count: rs.length,
      researchers: rs.sort((a, b) => b.h_index - a.h_index),
      avg_h_index: Math.round(rs.reduce((s, r) => s + r.h_index, 0) / rs.length),
      total_citations: rs.reduce((s, r) => s + r.citations, 0),
    });
  }
  return stats.sort((a, b) => b.count - a.count || b.avg_h_index - a.avg_h_index);
}

type _R = {
  n: string; z: string;
  a: string; az: string;
  f: string; fz: string;
  h: number; c: number; p: number;
  w: string; wz: string;
  g: string;
  pn: string; pz: string;
  hp?: string;
};

const _data: _R[] = [
  // === GENERAL ASSISTANT ===
  {n:"ChatGPT",z:"ChatGPT",a:"OpenAI",az:"OpenAI",f:"General chat · plugins · voice · agents",fz:"通用对话 · 插件 · 语音 · 代理",h:93,c:90,p:46,w:"Use 10·Ease 9·Features 10·Auto 9·Price 8 ($20/Plus, free tier). Pros: largest ecosystem, plugins/GPTs, voice, image gen, agents. Cons: hallucinations, peak-hour throttling, alignment friction with edgy queries",wz:"实用 10 · 易用 9 · 功能 10 · 自动化 9 · 价格 8 ($20/月 Plus，有免费版)。优点：生态最大，GPTs 商店，语音模式，图像生成，代理；缺点：偶有幻觉，高峰排队，部分边缘问题被审查",g:"🇺🇸",pn:"General Assistant",pz:"通用助手",hp:"https://chatgpt.com"},
  {n:"Claude",z:"Claude",a:"Anthropic",az:"Anthropic",f:"Long-form writing · analysis · coding",fz:"长文写作 · 分析 · 编程",h:92,c:100,p:46,w:"Use 10·Ease 9·Features 9·Auto 8·Price 8 ($20/Pro). Pros: best long-form writing, top-rated honesty, 200K-1M context. Cons: smaller ecosystem than ChatGPT, fewer plugins, occasional over-cautious refusals",wz:"实用 10 · 易用 9 · 功能 9 · 自动化 8 · 价格 8 ($20/月 Pro)。优点：长文写作最强，诚实度评价高，20-100 万上下文；缺点：生态比 ChatGPT 小，插件少，偶尔过度拒绝",g:"🇺🇸",pn:"General Assistant",pz:"通用助手",hp:"https://claude.com"},
  {n:"Gemini",z:"Gemini",a:"Google",az:"谷歌",f:"Multimodal · Workspace integration",fz:"多模态 · Workspace 整合",h:88,c:80,p:100,w:"🏆 Use 10·Ease 9·Features 10·Auto 8·Price 9 (free + $20 Advanced). Pros: 1M-2M context, native video understanding, Workspace integration, free tier generous. Cons: regional gaps, occasional safety overshoot",wz:"实用 10 · 易用 9 · 功能 10 · 自动化 8 · 价格 9 (免费 + $20 Advanced)。优点：100-200 万上下文，原生视频理解，Workspace 整合，免费额度慷慨；缺点：部分地区受限，安全策略偶尔过度",g:"🇺🇸",pn:"General Assistant",pz:"通用助手",hp:"https://gemini.google.com"},
  {n:"Perplexity",z:"Perplexity",a:"Perplexity AI",az:"Perplexity AI",f:"AI search · cited answers · research",fz:"AI 搜索 · 引用回答 · 研究",h:87,c:90,p:44,w:"Use 9·Ease 10·Features 8·Auto 8·Price 8 ($20/Pro). Pros: cited sources by default, killed Google for many tasks, Spaces feature, free tier strong. Cons: occasional citation hallucination, less depth than Claude/GPT",wz:"实用 9 · 易用 10 · 功能 8 · 自动化 8 · 价格 8 ($20/月 Pro)。优点：默认带引用，对很多人取代谷歌，Spaces 功能强，免费版好用；缺点：偶有引用幻觉，深度不及 Claude/GPT",g:"🇺🇸",pn:"Research & Search",pz:"研究与搜索",hp:"https://perplexity.ai"},
  {n:"Grok",z:"Grok",a:"xAI",az:"xAI",f:"Real-time X data · uncensored",fz:"实时 X 数据 · 无审查",h:80,c:75,p:50,w:"Use 8·Ease 8·Features 9·Auto 7·Price 7 (X Premium $16/mo). Pros: real-time X access, less filter, native to your timeline, voice mode. Cons: tied to X subscription, quality varies on non-X topics",wz:"实用 8 · 易用 8 · 功能 9 · 自动化 7 · 价格 7 (X Premium $16/月)。优点：实时 X 数据，审查少，原生 X 集成，语音模式；缺点：必须订阅 X，非 X 话题质量参差",g:"🇺🇸",pn:"General Assistant",pz:"通用助手",hp:"https://grok.com"},

  // === WRITING ===
  {n:"Notion AI",z:"Notion AI",a:"Notion Labs",az:"Notion Labs",f:"In-doc writing · Q&A · summaries",fz:"文档内写作 · 问答 · 摘要",h:78,c:75,p:78,w:"Use 8·Ease 10·Features 7·Auto 6·Price 7 ($10/mo add-on). Pros: native to Notion workflow, AI Q&A across your wiki, no context-switching. Cons: weaker than standalone LLMs, $10 on top of Notion subscription, no API",wz:"实用 8 · 易用 10 · 功能 7 · 自动化 6 · 价格 7 ($10/月加购)。优点：与 Notion 工作流深度融合，跨 wiki 的 AI 问答，无切换；缺点：能力弱于独立 LLM，需在 Notion 订阅之上加购，无 API",g:"🇺🇸",pn:"Productivity",pz:"生产力",hp:"https://notion.com/product/ai"},
  {n:"Grammarly",z:"Grammarly",a:"Grammarly",az:"Grammarly",f:"Grammar · style · tone · plagiarism",fz:"语法 · 风格 · 语气 · 查重",h:82,c:85,p:68,w:"Use 9·Ease 10·Features 9·Auto 7·Price 7 ($12/mo Pro). Pros: works everywhere via extension, real-time, business tone tools, plagiarism checker. Cons: generic suggestions, expensive vs DIY LLM, GenAI features still maturing",wz:"实用 9 · 易用 10 · 功能 9 · 自动化 7 · 价格 7 ($12/月 Pro)。优点：浏览器/系统级扩展无处不在，实时建议，商务语气工具，查重；缺点：建议偏通用，相比 LLM 偏贵，生成式 AI 功能仍在打磨",g:"🇺🇸",pn:"Writing",pz:"写作"},
  {n:"Jasper",z:"Jasper",a:"Jasper AI",az:"Jasper AI",f:"Marketing copy · brand voice · campaigns",fz:"营销文案 · 品牌语气 · 投放",h:72,c:65,p:15,w:"Use 7·Ease 8·Features 9·Auto 7·Price 5 ($49/mo Creator). Pros: brand voice templates, campaign workflows, team features. Cons: pricey, mostly wraps GPT/Claude, declining mindshare since LLMs got better at marketing copy",wz:"实用 7 · 易用 8 · 功能 9 · 自动化 7 · 价格 5 ($49/月 Creator)。优点：品牌语气模板，营销活动流程，团队协作；缺点：偏贵，本质封装 GPT/Claude，LLM 进步后市场份额下滑",g:"🇺🇸",pn:"Writing",pz:"写作"},
  {n:"Sudowrite",z:"Sudowrite",a:"Sudowrite",az:"Sudowrite",f:"Fiction writing · brainstorming · scene gen",fz:"小说写作 · 灵感 · 场景生成",h:70,c:80,p:37,w:"Use 7·Ease 9·Features 8·Auto 6·Price 6 ($19/mo Hobby). Pros: built for fiction (canvas, character bible, story bible), beloved by indie authors. Cons: niche, monthly word caps, fiction-only",wz:"实用 7 · 易用 9 · 功能 8 · 自动化 6 · 价格 6 ($19/月 Hobby)。优点：为小说打造（画布、角色库、剧情库），独立作者口碑好；缺点：垂直，月度字数有上限，仅限虚构写作",g:"🇺🇸",pn:"Writing",pz:"写作"},
  {n:"Lex",z:"Lex",a:"Every Inc.",az:"Every Inc.",f:"Distraction-free AI document editor",fz:"无干扰 AI 文档编辑器",h:74,c:80,p:100,w:"🏆 Use 8·Ease 9·Features 7·Auto 7·Price 8 (free tier strong). Pros: clean Google-Docs-like editor + AI side-panel, multiplayer, generous free tier. Cons: less famous, smaller plugin ecosystem",wz:"实用 8 · 易用 9 · 功能 7 · 自动化 7 · 价格 8 (免费版好用)。优点：类 Google Docs 的简洁编辑器 + AI 侧边栏，多人协作，免费额度大；缺点：知名度低，插件生态小",g:"🇺🇸",pn:"Writing",pz:"写作",hp:"https://lex.page"},

  // === CODING ===
  {n:"Cursor",z:"Cursor",a:"Anysphere",az:"Anysphere",f:"AI-native IDE · agent mode · multi-file edits",fz:"AI 原生 IDE · 代理模式 · 多文件编辑",h:91,c:100,p:46,w:"Use 10·Ease 8·Features 9·Auto 9·Price 7 ($20/mo Pro). Pros: VSCode fork with deep Claude/GPT integration, agent mode (Composer), tab autocomplete that learns your style. Cons: $20 on top of model API costs at scale, occasional stability issues",wz:"实用 10 · 易用 8 · 功能 9 · 自动化 9 · 价格 7 ($20/月 Pro)。优点：基于 VSCode 深度整合 Claude/GPT，Composer 代理模式，自适应 Tab 补全；缺点：API 量大时再加 $20 偏贵，偶有稳定性问题",g:"🇺🇸",pn:"Coding",pz:"编程",hp:"https://cursor.com"},
  {n:"Claude Code",z:"Claude Code",a:"Anthropic",az:"Anthropic",f:"Terminal-native agentic coder",fz:"终端原生编程代理",h:90,c:95,p:45,w:"Use 10·Ease 7·Features 9·Auto 10·Price 8 (Pro/Max plans incl.). Pros: best agentic coding on hard tasks, runs in your terminal/IDE, strong tool use. Cons: terminal CLI may intimidate, requires Claude subscription/API",wz:"实用 10 · 易用 7 · 功能 9 · 自动化 10 · 价格 8 (Pro/Max 计划含)。优点：硬任务上代理编程最强，运行于终端/IDE，工具使用强；缺点：终端 CLI 略有门槛，需 Claude 订阅或 API",g:"🇺🇸",pn:"Coding",pz:"编程",hp:"https://claude.com/claude-code"},
  {n:"GitHub Copilot",z:"GitHub Copilot",a:"GitHub / OpenAI",az:"GitHub / OpenAI",f:"IDE autocomplete · chat · agent",fz:"IDE 补全 · 对话 · 代理",h:87,c:80,p:87,w:"Use 9·Ease 10·Features 9·Auto 8·Price 9 ($10/mo, $20 Pro+). Pros: native IDE plugins (VSCode/JetBrains/Vim), enterprise-friendly, model-router selects Claude/GPT/Gemini. Cons: feels behind Cursor on agent loops, output sometimes generic",wz:"实用 9 · 易用 10 · 功能 9 · 自动化 8 · 价格 9 ($10/月，$20 Pro+)。优点：IDE 原生插件全面，企业友好，模型路由器选 Claude/GPT/Gemini；缺点：代理循环不及 Cursor，输出有时偏通用",g:"🇺🇸",pn:"Coding",pz:"编程",hp:"https://github.com/features/copilot"},
  {n:"Windsurf",z:"Windsurf",a:"Codeium",az:"Codeium",f:"Cursor-style IDE · Cascade agent",fz:"类 Cursor IDE · Cascade 代理",h:85,c:85,p:57,w:"Use 9·Ease 9·Features 9·Auto 9·Price 8 ($15/mo Pro). Pros: Cascade agent rivals Cursor's Composer, generous free tier, fast iteration. Cons: still catching up on ecosystem maturity",wz:"实用 9 · 易用 9 · 功能 9 · 自动化 9 · 价格 8 ($15/月 Pro)。优点：Cascade 代理可比肩 Cursor Composer，免费版大方，迭代快；缺点：生态成熟度仍在追赶",g:"🇺🇸",pn:"Coding",pz:"编程",hp:"https://windsurf.com"},
  {n:"v0",z:"v0",a:"Vercel",az:"Vercel",f:"Prompt-to-UI · React + shadcn/ui",fz:"提示生成界面 · React + shadcn/ui",h:84,c:88,p:42,w:"Use 9·Ease 10·Features 8·Auto 8·Price 8 ($20/mo Premium). Pros: one prompt → working React + shadcn UI, deploys to Vercel, design-system aware. Cons: locked to React/shadcn, monthly credits cap heavy use",wz:"实用 9 · 易用 10 · 功能 8 · 自动化 8 · 价格 8 ($20/月 Premium)。优点：一句话生成 React + shadcn UI，可直接部署 Vercel，懂设计系统；缺点：仅限 React/shadcn，月度 credits 限制",g:"🇺🇸",pn:"Coding",pz:"编程",hp:"https://v0.app"},
  {n:"Bolt.new",z:"Bolt.new",a:"StackBlitz",az:"StackBlitz",f:"Browser-native full-stack gen",fz:"浏览器全栈生成",h:80,c:80,p:40,w:"Use 8·Ease 10·Features 8·Auto 9·Price 7 ($20/mo Pro). Pros: full-stack apps in the browser via WebContainers, Stripe/Supabase integrations, deploy in one click. Cons: token-burning, bugs with complex apps, browser-only constraints",wz:"实用 8 · 易用 10 · 功能 8 · 自动化 9 · 价格 7 ($20/月 Pro)。优点：基于 WebContainers 浏览器内全栈生成，集成 Stripe/Supabase，一键部署；缺点：消耗 token 快，复杂应用易 bug，仅限浏览器",g:"🇺🇸",pn:"Coding",pz:"编程",hp:"https://bolt.new"},
  {n:"Devin",z:"Devin",a:"Cognition",az:"Cognition",f:"Autonomous SWE agent",fz:"自主软件工程师代理",h:78,c:70,p:2,w:"Use 8·Ease 7·Features 9·Auto 10·Price 4 ($500/mo). Pros: long-running autonomous coding, plans + executes, slack/linear integrations. Cons: very expensive, mixed real-world results, demos > production",wz:"实用 8 · 易用 7 · 功能 9 · 自动化 10 · 价格 4 ($500/月)。优点：长时自主编程，计划+执行，集成 Slack/Linear；缺点：极贵，实战效果参差，演示效果优于生产",g:"🇺🇸",pn:"Coding",pz:"编程",hp:"https://devin.ai"},
  {n:"Aider",z:"Aider",a:"Open source",az:"开源",f:"Terminal pair-programmer · git-aware",fz:"终端结对编程 · 懂 git",h:82,c:90,p:100,w:"🏆 Use 9·Ease 7·Features 8·Auto 9·Price 10 (free, BYO API). Pros: git-aware (auto commits per change), works with any LLM API, terminal-first. Cons: terminal CLI, you pay model API costs",wz:"实用 9 · 易用 7 · 功能 8 · 自动化 9 · 价格 10 (免费，自带 API)。优点：懂 git（每次改动自动 commit），兼容任意 LLM API，终端优先；缺点：CLI 门槛，模型 API 自费",g:"🌍",pn:"Coding",pz:"编程",hp:"https://aider.chat"},

  // === DESIGN & IMAGE ===
  {n:"Figma AI",z:"Figma AI",a:"Figma",az:"Figma",f:"Design assist · prompt-to-mockup · auto-layout",fz:"设计辅助 · 提示生成稿 · 自动布局",h:74,c:70,p:100,w:"🏆 Use 7·Ease 9·Features 7·Auto 6·Price 8 (included in Figma). Pros: in-tool AI generation, auto-rename layers, included in subscription. Cons: shallow vs Adobe Firefly, still maturing",wz:"实用 7 · 易用 9 · 功能 7 · 自动化 6 · 价格 8 (Figma 已含)。优点：工具内 AI 生成，自动重命名图层，订阅已含；缺点：相比 Adobe Firefly 偏浅，仍在打磨",g:"🇺🇸",pn:"Design",pz:"设计",hp:"https://figma.com"},
  {n:"Adobe Firefly",z:"Adobe Firefly",a:"Adobe",az:"Adobe",f:"Image · text effects · IP-safe training",fz:"图像 · 文字特效 · 训练数据合规",h:81,c:75,p:100,w:"🏆 Use 8·Ease 9·Features 9·Auto 7·Price 7 (Creative Cloud add-on). Pros: deeply integrated into Photoshop/Illustrator, commercially safe, vector gen. Cons: weaker raw image quality vs Midjourney, locked to Adobe ecosystem",wz:"实用 8 · 易用 9 · 功能 9 · 自动化 7 · 价格 7 (Creative Cloud 加购)。优点：深度集成 Photoshop/Illustrator，商用合规，矢量生成；缺点：原始图像质量不及 Midjourney，绑定 Adobe 生态",g:"🇺🇸",pn:"Design",pz:"设计",hp:"https://firefly.adobe.com"},
  {n:"Canva Magic Studio",z:"Canva Magic Studio",a:"Canva",az:"Canva",f:"Templates · Magic Write · Magic Resize",fz:"模板 · Magic Write · Magic Resize",h:80,c:85,p:53,w:"Use 8·Ease 10·Features 9·Auto 7·Price 8 ($15/mo Pro). Pros: best for non-designers, beautiful defaults, brand kit, video editor. Cons: limited fine control, exports look 'Canva-y'",wz:"实用 8 · 易用 10 · 功能 9 · 自动化 7 · 价格 8 ($15/月 Pro)。优点：非设计师首选，模板美观，品牌套件，视频编辑器；缺点：精细控制弱，成品有'Canva 味'",g:"🇦🇺",pn:"Design",pz:"设计",hp:"https://canva.com"},
  {n:"Midjourney",z:"Midjourney",a:"Midjourney",az:"Midjourney",f:"Photorealistic image gen · style mastery",fz:"照片级图像生成 · 风格大师",h:88,c:95,p:88,w:"Use 9·Ease 8·Features 8·Auto 7·Price 7 ($10-60/mo). Pros: best aesthetic quality, V7 style consistency, web app replaced Discord. Cons: subscription required, no free tier, limited fine control vs SD",wz:"实用 9 · 易用 8 · 功能 8 · 自动化 7 · 价格 7 ($10-60/月)。优点：美感最强，V7 风格一致性高，已迁移网页版；缺点：必须订阅无免费版，相比 SD 精细控制弱",g:"🇺🇸",pn:"Image Generation",pz:"图像生成",hp:"https://midjourney.com"},
  {n:"DALL·E 3",z:"DALL·E 3",a:"OpenAI",az:"OpenAI",f:"Prompt-to-image · text rendering",fz:"提示生成图像 · 文字渲染",h:80,c:78,p:100,w:"🏆 Use 8·Ease 10·Features 7·Auto 7·Price 9 (in ChatGPT Plus). Pros: in ChatGPT (no separate sub), best at text-in-image at launch, easy revisions via chat. Cons: less photorealistic than Midjourney, heavy safety filter",wz:"实用 8 · 易用 10 · 功能 7 · 自动化 7 · 价格 9 (ChatGPT Plus 含)。优点：在 ChatGPT 内（无需另订阅），发布时图中文字最佳，对话内修改简单；缺点：照片真实感不及 Midjourney，安全过滤严",g:"🇺🇸",pn:"Image Generation",pz:"图像生成"},
  {n:"Ideogram",z:"Ideogram",a:"Ideogram",az:"Ideogram",f:"Text-in-image specialist · typography",fz:"图中文字专家 · 排版",h:78,c:82,p:98,w:"🏆 Use 8·Ease 9·Features 8·Auto 7·Price 8 ($8/mo Plus). Pros: best typography in images, magic prompt expansion, free tier. Cons: less artistic range than Midjourney, smaller community",wz:"实用 8 · 易用 9 · 功能 8 · 自动化 7 · 价格 8 ($8/月 Plus)。优点：图中文字最强，魔法提示扩展，有免费版；缺点：艺术风格广度不及 Midjourney，社区较小",g:"🇨🇦",pn:"Image Generation",pz:"图像生成",hp:"https://ideogram.ai"},
  {n:"Stable Diffusion",z:"Stable Diffusion",a:"Stability AI",az:"Stability AI",f:"Open-weights image · LoRA · ControlNet",fz:"开源图像 · LoRA · ControlNet",h:78,c:90,p:100,w:"🏆 Use 8·Ease 5·Features 10·Auto 6·Price 10 (free, self-host). Pros: open weights, run locally, infinite fine-tuning (LoRAs), ControlNet. Cons: needs GPU + setup, complex UIs (ComfyUI/A1111), commercial license shifts",wz:"实用 8 · 易用 5 · 功能 10 · 自动化 6 · 价格 10 (开源自部署)。优点：开源权重，本地运行，无限微调 (LoRA)，ControlNet；缺点：需 GPU 配置，UI 复杂 (ComfyUI/A1111)，商用授权多变",g:"🇬🇧",pn:"Image Generation",pz:"图像生成"},
  {n:"Recraft",z:"Recraft",a:"Recraft",az:"Recraft",f:"Vector design · brand asset gen",fz:"矢量设计 · 品牌资产生成",h:75,c:78,p:62,w:"Use 8·Ease 8·Features 8·Auto 7·Price 7 ($12/mo). Pros: vector output, brand styles, the SVG icon generator everyone uses. Cons: niche, limited to design output",wz:"实用 8 · 易用 8 · 功能 8 · 自动化 7 · 价格 7 ($12/月)。优点：矢量输出，品牌风格，大家都在用的 SVG 图标生成器；缺点：垂直，仅限设计输出",g:"🇺🇸",pn:"Design",pz:"设计",hp:"https://recraft.ai"},

  // === VIDEO ===
  {n:"Runway",z:"Runway",a:"Runway",az:"Runway",f:"Video gen · Gen-4 · multi-shot",fz:"视频生成 · Gen-4 · 多镜头",h:82,c:85,p:55,w:"Use 8·Ease 8·Features 9·Auto 7·Price 6 ($15-95/mo). Pros: industry standard for AI video, motion brush, camera control, character consistency. Cons: expensive credits, learning curve",wz:"实用 8 · 易用 8 · 功能 9 · 自动化 7 · 价格 6 ($15-95/月)。优点：AI 视频行业标准，动作笔刷，相机控制，角色一致性；缺点：credit 偏贵，有学习曲线",g:"🇺🇸",pn:"Video Generation",pz:"视频生成",hp:"https://runwayml.com"},
  {n:"Sora",z:"Sora",a:"OpenAI",az:"OpenAI",f:"Long-form video gen · physics-aware",fz:"长视频生成 · 物理感知",h:84,c:82,p:100,w:"🏆 Use 9·Ease 8·Features 9·Auto 8·Price 7 (in ChatGPT Plus/Pro). Pros: most coherent long video gen, physics-aware, in ChatGPT subscription. Cons: queue at peak, censorship-heavy",wz:"实用 9 · 易用 8 · 功能 9 · 自动化 8 · 价格 7 (ChatGPT Plus/Pro 含)。优点：长视频连贯性最强，物理感知，ChatGPT 订阅含；缺点：高峰排队，审查严",g:"🇺🇸",pn:"Video Generation",pz:"视频生成"},
  {n:"Veo 3",z:"Veo 3",a:"Google DeepMind",az:"谷歌 DeepMind",f:"Native sound + video · cinematic",fz:"原生音视频 · 电影感",h:86,c:88,p:100,w:"🏆 Use 9·Ease 8·Features 10·Auto 8·Price 7 (Gemini Advanced). Pros: native synced audio, best cinematic quality, in Gemini sub. Cons: rate-limited, not standalone product",wz:"实用 9 · 易用 8 · 功能 10 · 自动化 8 · 价格 7 (Gemini Advanced)。优点：原生同步音频，电影级画质，含于 Gemini 订阅；缺点：限流，无独立产品",g:"🇺🇸",pn:"Video Generation",pz:"视频生成"},
  {n:"HeyGen",z:"HeyGen",a:"HeyGen",az:"HeyGen",f:"Avatar video · multilingual dubbing",fz:"数字人视频 · 多语言配音",h:78,c:80,p:32,w:"Use 8·Ease 9·Features 8·Auto 8·Price 6 ($24/mo Creator). Pros: photorealistic avatars, lip-sync translation in 40+ langs, fast turnaround. Cons: stiff body language, expensive at scale",wz:"实用 8 · 易用 9 · 功能 8 · 自动化 8 · 价格 6 ($24/月 Creator)。优点：写实数字人，40+ 语种唇形同步翻译，出片快；缺点：肢体动作偏僵，规模化偏贵",g:"🇺🇸",pn:"Video Generation",pz:"视频生成",hp:"https://heygen.com"},

  // === AUDIO ===
  {n:"ElevenLabs",z:"ElevenLabs",a:"ElevenLabs",az:"ElevenLabs",f:"Voice cloning · multilingual TTS",fz:"声音克隆 · 多语言 TTS",h:88,c:92,p:100,w:"🏆 Use 9·Ease 9·Features 10·Auto 8·Price 7 ($5-330/mo). Pros: best voice cloning, 30+ languages, API for devs, podcast tooling. Cons: expensive at podcast scale, deepfake concerns",wz:"实用 9 · 易用 9 · 功能 10 · 自动化 8 · 价格 7 ($5-330/月)。优点：声音克隆最强，30+ 语种，开发者 API，播客工具链；缺点：播客量级偏贵，深伪争议",g:"🇬🇧",pn:"Audio",pz:"音频",hp:"https://elevenlabs.io"},
  {n:"Suno",z:"Suno",a:"Suno",az:"Suno",f:"Text-to-song · vocals + instruments",fz:"文本生成歌曲 · 人声+伴奏",h:80,c:88,p:80,w:"Use 8·Ease 10·Features 8·Auto 8·Price 7 ($10/mo Pro). Pros: full songs with vocals from a prompt, lyrics support, V4 vocals near-human. Cons: copyright lawsuits pending, limited fine control",wz:"实用 8 · 易用 10 · 功能 8 · 自动化 8 · 价格 7 ($10/月 Pro)。优点：一句话生成完整带人声歌曲，支持歌词，V4 人声接近真人；缺点：版权诉讼未决，精细控制有限",g:"🇺🇸",pn:"Audio",pz:"音频",hp:"https://suno.com"},
  {n:"Descript",z:"Descript",a:"Descript",az:"Descript",f:"Audio/video edit by editing transcript",fz:"通过编辑转录稿剪辑音视频",h:76,c:82,p:51,w:"Use 8·Ease 9·Features 8·Auto 7·Price 6 ($15/mo Creator). Pros: edit audio by deleting words in transcript, overdub voice cloning, AI removes filler words. Cons: render quality has cap, subscription pricing climbs",wz:"实用 8 · 易用 9 · 功能 8 · 自动化 7 · 价格 6 ($15/月 Creator)。优点：通过删字编辑音频，Overdub 声音克隆，AI 去口头禅；缺点：渲染质量有上限，订阅价格上涨",g:"🇺🇸",pn:"Audio",pz:"音频",hp:"https://descript.com"},

  // === RESEARCH & PRODUCTIVITY ===
  {n:"NotebookLM",z:"NotebookLM",a:"Google Labs",az:"谷歌实验室",f:"Source-grounded research · audio overviews",fz:"基于资料的研究 · 音频概览",h:85,c:92,p:100,w:"🏆 Use 9·Ease 10·Features 9·Auto 8·Price 10 (free). Pros: hallucination-free Q&A grounded in your sources, podcast-like 'Audio Overviews', completely free. Cons: Google login required, no API",wz:"实用 9 · 易用 10 · 功能 9 · 自动化 8 · 价格 10 (免费)。优点：基于你提供资料的零幻觉问答，类播客'音频概览'，完全免费；缺点：需谷歌登录，无 API",g:"🇺🇸",pn:"Research & Search",pz:"研究与搜索",hp:"https://notebooklm.google.com"},
  {n:"Granola",z:"Granola",a:"Granola",az:"Granola",f:"Meeting notes · system audio capture",fz:"会议笔记 · 系统音频抓取",h:80,c:90,p:80,w:"Use 9·Ease 10·Features 8·Auto 9·Price 7 ($10-18/mo). Pros: no bot in your meetings (system-audio capture), beautiful notes, beloved by founders. Cons: macOS-first, paid after free tier",wz:"实用 9 · 易用 10 · 功能 8 · 自动化 9 · 价格 7 ($10-18/月)。优点：会议中无机器人入侵（系统音频抓取），笔记美观，创始人圈口碑爆好；缺点：偏 macOS，免费版后需付费",g:"🇬🇧",pn:"Productivity",pz:"生产力",hp:"https://granola.ai"},
  {n:"Otter.ai",z:"Otter.ai",a:"Otter.ai",az:"Otter.ai",f:"Live meeting transcription · summary",fz:"会议实时转录 · 摘要",h:74,c:75,p:44,w:"Use 8·Ease 9·Features 8·Auto 8·Price 7 ($17/mo Pro). Pros: live transcription, calendar integration, OtterPilot bot joins meetings. Cons: bot joining is awkward, transcription quality drops with accents",wz:"实用 8 · 易用 9 · 功能 8 · 自动化 8 · 价格 7 ($17/月 Pro)。优点：实时转录，日历集成，OtterPilot 机器人入会；缺点：机器人入会尴尬，口音重时质量下降",g:"🇺🇸",pn:"Productivity",pz:"生产力",hp:"https://otter.ai"},
  {n:"Zapier MCP",z:"Zapier MCP",a:"Zapier",az:"Zapier",f:"AI workflow automation · 7000+ apps",fz:"AI 工作流自动化 · 7000+ 应用",h:82,c:78,p:41,w:"Use 9·Ease 8·Features 10·Auto 10·Price 6 ($20-69/mo). Pros: connects 7000+ apps, MCP support for Claude/ChatGPT, no-code AI agents. Cons: pricing tiers can balloon, complex flows still need debugging",wz:"实用 9 · 易用 8 · 功能 10 · 自动化 10 · 价格 6 ($20-69/月)。优点：连接 7000+ 应用，支持 MCP（Claude/ChatGPT），无代码 AI 代理；缺点：价格档容易上涨，复杂流程仍需调试",g:"🇺🇸",pn:"Productivity",pz:"生产力",hp:"https://zapier.com"},
  {n:"Manus",z:"Manus",a:"Butterfly Effect",az:"Butterfly Effect",f:"Autonomous research agent · multi-step tasks",fz:"自主研究代理 · 多步任务",h:76,c:80,p:25,w:"Use 8·Ease 8·Features 9·Auto 10·Price 5 (waitlist; credit-heavy). Pros: long-running autonomous browsing+coding, viral reasoning demos. Cons: credit expensive, results inconsistent, China-based access friction",wz:"实用 8 · 易用 8 · 功能 9 · 自动化 10 · 价格 5 (等候名单，credit 消耗大)。优点：长时自主浏览+编程，推理 demo 病毒式传播；缺点：credit 贵，结果不稳定，国内外访问友好度参差",g:"🇨🇳",pn:"Agent & Automation",pz:"代理与自动化",hp:"https://manus.im"},

  // === BROWSER ===
  {n:"Comet",z:"Comet",a:"Perplexity",az:"Perplexity",f:"AI-native browser · agent on web",fz:"AI 原生浏览器 · 网页代理",h:80,c:85,p:40,w:"Use 8·Ease 9·Features 9·Auto 9·Price 8 ($20/Pro for power features). Pros: built-in agent that books flights/orders/searches across tabs, fast, Perplexity research natively. Cons: macOS-first, privacy concerns, eats RAM",wz:"实用 8 · 易用 9 · 功能 9 · 自动化 9 · 价格 8 ($20/Pro 解锁高阶)。优点：内置代理可订机票/下单/跨标签搜索，速度快，原生 Perplexity 研究；缺点：偏 macOS，隐私担忧，吃内存",g:"🇺🇸",pn:"Browser",pz:"浏览器",hp:"https://comet.perplexity.ai"},
  {n:"Dia",z:"Dia",a:"The Browser Company",az:"The Browser Company",f:"Conversational browser · in-page AI",fz:"对话式浏览器 · 页内 AI",h:78,c:82,p:100,w:"🏆 Use 8·Ease 10·Features 8·Auto 8·Price 8 (free preview). Pros: ask any page anything, gorgeous UX, Arc lineage. Cons: still in preview, ecosystem smaller than Chrome",wz:"实用 8 · 易用 10 · 功能 8 · 自动化 8 · 价格 8 (免费预览)。优点：可对任意页面提问，UX 精美，Arc 团队血统；缺点：仍是预览版，生态比 Chrome 小",g:"🇺🇸",pn:"Browser",pz:"浏览器",hp:"https://diabrowser.com"},
  {n:"Raycast AI",z:"Raycast AI",a:"Raycast",az:"Raycast",f:"macOS launcher + AI commands",fz:"macOS 启动器 + AI 命令",h:82,c:90,p:82,w:"Use 9·Ease 10·Features 9·Auto 8·Price 8 ($10/mo Pro for AI). Pros: keyboard-first, swap models per command, scripts marketplace. Cons: macOS-only, paid for AI features",wz:"实用 9 · 易用 10 · 功能 9 · 自动化 8 · 价格 8 ($10/月 Pro 含 AI)。优点：键盘优先，按命令切换模型，脚本市场；缺点：仅 macOS，AI 功能需付费",g:"🇺🇸",pn:"Productivity",pz:"生产力",hp:"https://raycast.com"},
];

export const researchers: Researcher[] = _data.map((d, i) => ({
  id: i + 1,
  name_en: d.n, name_zh: d.z,
  affiliation_en: d.a, affiliation_zh: d.az,
  field_en: d.f, field_zh: d.fz,
  h_index: d.h, citations: d.c, papers: d.p,
  notable_work_en: d.w, notable_work_zh: d.wz,
  country: d.g,
  native_province_en: d.pn, native_province_zh: d.pz,
  homepage: d.hp,
}));

export type SortKey = "h_index" | "citations" | "papers";

export function sortResearchers(data: Researcher[], key: SortKey): Researcher[] {
  return [...data].sort((a, b) => (b[key] as number) - (a[key] as number));
}
