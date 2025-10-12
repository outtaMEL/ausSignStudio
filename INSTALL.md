# 安装指南

## 系统要求

- **Node.js**: 18.17 或更高版本
- **包管理器**: npm, pnpm, 或 yarn
- **操作系统**: Windows, macOS, 或 Linux
- **浏览器**: Chrome, Firefox, Safari, Edge（最新版本）

## 安装步骤

### 1. 克隆或下载项目

如果从 Git 仓库克隆：
\`\`\`bash
git clone <repository-url>
cd ausSignMaster
\`\`\`

### 2. 安装依赖

**选项 A: 使用 npm**
\`\`\`bash
npm install
\`\`\`

**选项 B: 使用 pnpm（推荐，更快）**
\`\`\`bash
# 如果没有安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install
\`\`\`

**选项 C: 使用 yarn**
\`\`\`bash
yarn install
\`\`\`

### 3. 启动开发服务器

\`\`\`bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
\`\`\`

服务器将在 http://localhost:3000 启动

### 4. 验证安装

打开浏览器访问 http://localhost:3000

你应该看到：
- ✅ Dashboard 主页
- ✅ 导航栏（Dashboard, New Sign, Editor, Library, Templates, Audit, Export）
- ✅ 欢迎信息和快速操作卡片

### 5. 测试基本功能

#### 测试向导流程
1. 点击"新建标志"或访问 http://localhost:3000/new
2. 选择任意标志类型（例如 G1-wide）
3. 点击"下一步"
4. 填写至少一个目的地
5. 查看右侧实时预览
6. 点击"下一步"查看审计结果

#### 测试编辑器
1. 完成向导后点击"在编辑器中打开"
2. 查看左侧图层树
3. 查看中央画布
4. 切换右侧标签：属性、间距、审计

## 常见问题排查

### 问题 1: 依赖安装失败

**症状**: npm install 报错

**解决方案**:
\`\`\`bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
\`\`\`

### 问题 2: 端口 3000 被占用

**症状**: "Port 3000 is already in use"

**解决方案**:
\`\`\`bash
# 选项 A: 使用其他端口
PORT=3001 npm run dev

# 选项 B: 杀死占用端口的进程（Windows）
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# 选项 B: 杀死占用端口的进程（Mac/Linux）
lsof -ti:3000 | xargs kill -9
\`\`\`

### 问题 3: TypeScript 错误

**症状**: 启动时显示 TypeScript 类型错误

**解决方案**:
\`\`\`bash
# 检查 TypeScript 版本
npx tsc --version

# 重新生成类型
rm -rf .next
npm run dev
\`\`\`

### 问题 4: 样式不显示

**症状**: 页面无样式或样式错乱

**解决方案**:
\`\`\`bash
# 清除 Next.js 缓存
rm -rf .next

# 重新启动
npm run dev
\`\`\`

## 生产部署

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

### 启动生产服务器

\`\`\`bash
npm start
\`\`\`

### 部署到 Vercel

1. 安装 Vercel CLI:
\`\`\`bash
npm install -g vercel
\`\`\`

2. 部署:
\`\`\`bash
vercel
\`\`\`

### 部署到其他平台

项目是标准的 Next.js 应用，可以部署到：
- Vercel（推荐）
- Netlify
- AWS Amplify
- Google Cloud Platform
- 自托管（Node.js 服务器）

## 环境变量（可选）

创建 `.env.local` 文件（参考 `.env.example`）：

\`\`\`env
NEXT_PUBLIC_APP_NAME="AU Direction Sign Studio"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_ENABLE_PDF_EXPORT=false
NEXT_PUBLIC_ENABLE_DWG_EXPORT=false
\`\`\`

## 开发工具推荐

- **IDE**: VS Code
- **扩展**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## 下一步

- 阅读 [QUICKSTART.md](./QUICKSTART.md) 了解如何使用
- 阅读 [README.md](./README.md) 了解完整功能
- 阅读 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) 了解项目结构

## 支持

如遇到问题：
1. 查看本文档的常见问题部分
2. 检查 GitHub Issues（如果适用）
3. 联系项目维护者

---

**祝使用愉快！** 🎉

