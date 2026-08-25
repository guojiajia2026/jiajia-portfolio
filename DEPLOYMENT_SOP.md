# 佳佳AI实验室 - 网站部署与更新SOP

## 🚀 首次部署指南（Vercel + GitHub）

### 前置准备
- 一个 GitHub 账号
- 一个 Vercel 账号（可用 GitHub 账号直接登录）
- DeepSeek API Key（推荐，性价比高）或 OpenAI API Key

---

### 步骤一：上传代码到 GitHub

1. 在 GitHub 创建一个新仓库（建议命名为 `jiajia-portfolio` 或 `jiajia-ai-lab`）
2. 将项目代码推送到仓库：

```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

> ⚠️ 注意：`.env` 文件不要上传到 GitHub（已在 `.gitignore` 中排除）

---

### 步骤二：在 Vercel 导入项目

1. 打开 [vercel.com](https://vercel.com) 并登录
2. 点击 **"Add New..."** → **"Project"**
3. 选择你刚创建的 GitHub 仓库
4. 点击 **"Import"**

---

### 步骤三：配置项目

在配置页面确认以下设置：

| 设置项 | 值 | 说明 |
|--------|-----|------|
| Framework Preset | Vite | 自动识别 |
| Build Command | `npm run build` | 自动识别 |
| Output Directory | `dist` | 自动识别 |
| Install Command | `npm install` | 自动识别 |

---

### 步骤四：配置环境变量（重要！）

在 "Environment Variables" 部分添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `DEEPSEEK_API_KEY` | 你的 DeepSeek API Key | Production, Preview, Development |

> 💡 获取 DeepSeek API Key：https://platform.deepseek.com/api_keys

> 如果你用 OpenAI，就添加 `OPENAI_API_KEY` 变量

点击 **"Deploy"** 开始部署，等待 1-2 分钟。

---

### 步骤五：验证部署

1. 部署完成后，Vercel 会给你一个域名，类似 `xxx.vercel.app`
2. 打开网址，检查以下功能：
   - ✅ 首页正常显示，图片加载正常
   - ✅ 右下角悬浮聊天按钮可用，AI能回复
   - ✅ Explore 页面的岗位匹配功能正常
   - ✅ 点击"开始匹配" → 输入JD → 能返回匹配结果

---

### 步骤六：绑定自定义域名（可选）

1. 在 Vercel 项目页面 → **Settings** → **Domains**
2. 输入你的域名，点击 **Add**
3. 按照提示在域名服务商处配置 DNS 解析
4. 等待 SSL 证书自动生成（通常几分钟）

---

## 📝 更新网站SOP（修改内容后重新部署）

### 场景一：修改知识库内容 / AI回答风格

**目标文件**：`server/knowledge.js`

#### 操作步骤：

1. **打开知识库文件**
   - 找到 `server/knowledge.js` 文件
   - 找到 `buildSystemPrompt` 函数

2. **修改内容**
   - 修改个人信息：直接编辑 `knowledgeData` 对象中的对应字段
   - 修改回答风格：编辑 `buildSystemPrompt` 函数末尾的"回答规则"部分
   - 修改岗位匹配逻辑：编辑 `buildMatchSystemPrompt` 函数

3. **本地测试**（可选但推荐）
   ```bash
   npm run dev
   ```
   打开 http://localhost:3000 测试修改效果

4. **提交并部署**
   ```bash
   git add .
   git commit -m "更新知识库内容/回答风格"
   git push
   ```
   - Vercel 会自动检测到 push 并重新部署
   - 等待 1-2 分钟后访问线上网址验证

---

### 场景二：修改岗位匹配小组件

**目标文件**：`src/components/explore/ExplorePanel.tsx`

#### 可修改的内容：

| 修改项 | 位置 | 说明 |
|--------|------|------|
| 匹配结果展示样式 | `matchStep === 'result'` 部分 | 修改UI布局、颜色、动画 |
| 匹配维度名称 | `getScoreColor` / `getLevelColor` | 修改分数对应的颜色和等级 |
| 预设岗位选项 | `positions` 数组 | 添加/修改预设岗位标签 |
| Loading动画文案 | `matchStep === 'loading'` 部分 | 修改加载状态的步骤文案 |

#### 操作步骤：

1. 修改 `ExplorePanel.tsx` 中的对应代码
2. 本地测试：`npm run dev`
3. 提交代码：
   ```bash
   git add .
   git commit -m "优化岗位匹配组件"
   git push
   ```
4. 等待 Vercel 自动部署完成

---

### 场景三：修改AI聊天界面

**目标文件**：
- 悬浮聊天：`src/components/chat/FloatingChat.tsx`
- 全屏聊天面板：`src/components/chat/ChatPanel.tsx`

#### 可修改的内容：

| 修改项 | 位置 |
|--------|------|
| 开场白消息 | `messages` 初始值 |
| 快捷问题 | `mockStarterQuestions` (在 `mockData.ts` 中) |
| 聊天界面样式 | 组件内的 className |
| 头像图片 | `src` 属性，替换图片路径 |

#### 操作步骤：

1. 修改对应组件文件
2. 本地测试
3. git push 自动部署

---

### 场景四：修改个人资料数据

**目标文件**：`src/data/mockData.ts`

#### 可修改的内容：
- 个人简介
- 技能树
- 实习经历
- 产品案例
- 获奖经历
- 兴趣爱好
- 等等

#### 操作步骤：

1. 修改 `mockData.ts` 中的数据
2. **重要**：同步修改 `server/knowledge.js` 中的知识库数据（因为AI回答用的是这个文件）
3. 本地测试
4. git push 自动部署

> ⚠️ 注意：`mockData.ts` 用于前端展示，`server/knowledge.js` 用于AI知识库。两处都要修改才能保持一致！

---

### 场景五：更换 API Key

#### 方式一：通过 Vercel 控制台（推荐）

1. 进入 Vercel 项目 → **Settings** → **Environment Variables**
2. 找到 `DEEPSEEK_API_KEY`，点击编辑
3. 输入新的 API Key，保存
4. 重新部署：**Deployments** → 最新部署 → **Redeploy**

#### 方式二：修改 .env 文件（仅本地开发）

修改项目根目录的 `.env` 文件：
```
DEEPSEEK_API_KEY=新的key
```

---

## 🔧 常见问题

### Q: 部署后AI功能不工作？
A: 检查环境变量是否正确配置：
1. Vercel 项目 → Settings → Environment Variables
2. 确认 `DEEPSEEK_API_KEY` 已添加且值正确
3. 确认 Production 环境已勾选
4. 重新部署一次

### Q: 图片加载不出来？
A: 确认图片文件在 `public/assets/` 目录下，并且路径引用正确。

### Q: 如何回滚到上一个版本？
A: Vercel → Deployments → 找到之前的成功部署 → 点击 **"..."** → **"Promote to Production"**

### Q: 部署失败怎么办？
A: 
1. 查看 Vercel 部署日志中的错误信息
2. 本地运行 `npm run build` 确认能正常构建
3. 检查是否有新的依赖需要安装
4. 确认 TypeScript 没有类型错误

---

## 📁 关键文件速查表

| 功能模块 | 前端文件 | 后端/AI文件 |
|----------|----------|-------------|
| AI聊天 | `src/components/chat/FloatingChat.tsx` | `api/chat.js` |
| 岗位匹配 | `src/components/explore/ExplorePanel.tsx` | `api/match.js` |
| 知识库 | - | `server/knowledge.js` |
| API客户端 | `src/lib/ai/apiClient.ts` | - |
| 个人资料 | `src/data/mockData.ts` | `server/knowledge.js` |
| Vercel配置 | `vercel.json` | - |
| 环境变量 | `.env` (本地) | Vercel控制台 (线上) |

---

## 💡 部署优化建议

1. **开启 Vercel Analytics**：查看网站访问数据
2. **配置 Speed Insights**：监控性能
3. **设置自定义 404 页面**：提升用户体验
4. **开启 Preview Deployments**：每次PR自动生成预览链接
5. **配置 Webhook**：部署成功通知
