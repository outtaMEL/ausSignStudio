# 数据库设置指南

## 📦 安装 Prisma

已在 `package.json` 中添加 Prisma 依赖，运行：

```bash
npm install
```

## 🗄️ 数据库 Schema

已创建 `prisma/schema.prisma`，包含以下表：

### 1. **users** - 用户表
```sql
- id (CUID)
- email (unique)
- name
- passwordHash
- avatar
- role (user/admin)
- preferences (JSON)
- createdAt, updatedAt, lastLoginAt
```

### 2. **signs** - 标志文档表
```sql
- id (CUID)
- userId (外键)
- name
- family (G1-wide, G2, etc)
- templateId
- layout
- data (JSON - 完整 SignDoc)
- thumbnail, svg
- tags, isFavorite
- createdAt, updatedAt, lastOpenedAt
```

### 3. **templates** - 模板表
```sql
- id (CUID)
- userId (可选 - 系统模板为 null)
- name, description
- type (board/element)
- category (shield/arrow/service/symbol)
- data (JSON)
- isPublic, isDefault
- usageCount
- createdAt, updatedAt
```

### 4. **activities** - 活动日志表（可选）
```sql
- id (CUID)
- userId
- action (created/updated/exported)
- entityType, entityId
- metadata (JSON)
- createdAt
```

## 🚀 初始化数据库

### 方法 1：使用 Prisma Push (开发环境推荐)

```bash
# 1. 生成 Prisma Client
npm run db:generate

# 2. 推送 schema 到数据库（不创建迁移文件）
npm run db:push
```

### 方法 2：使用 Prisma Migrate (生产环境推荐)

```bash
# 1. 创建初始迁移
npm run db:migrate

# 输入迁移名称，例如：init
```

## 🔑 环境变量配置

1. 复制 `.env.example` 为 `.env.local`
2. 填入你的 Neon 数据库凭据（已在 `.env.local` 中预填）

## 🎯 验证安装

运行 Prisma Studio 查看数据库：

```bash
npm run db:studio
```

这会在浏览器打开可视化数据库管理界面（通常是 http://localhost:5555）

## 📝 使用示例

### 创建用户

```typescript
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

const hashedPassword = await bcrypt.hash('password123', 10)

const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'Test User',
    passwordHash: hashedPassword,
  }
})
```

### 创建标志

```typescript
const sign = await prisma.sign.create({
  data: {
    userId: user.id,
    name: 'G1-Wide Test Sign',
    family: 'G1-wide',
    layout: 'LANDSCAPE',
    data: {
      // 完整的 SignDoc JSON
      id: 'sign-123',
      family: 'G1-wide',
      directions: [...],
      tokens: {...},
      board: {...}
    }
  }
})
```

### 查询用户的所有标志

```typescript
const userSigns = await prisma.sign.findMany({
  where: { userId: user.id },
  orderBy: { updatedAt: 'desc' },
  take: 10
})
```

## 🔐 安全注意事项

1. **密码加密**：使用 bcryptjs 加密密码
2. **环境变量**：`.env.local` 已添加到 `.gitignore`，不要提交
3. **数据库凭据**：不要在代码中硬编码
4. **验证**：始终验证用户输入

## 📊 数据库关系

```
User (1) ──── (N) Sign
User (1) ──── (N) Template
User (1) ──── (N) Activity
```

## 🛠️ 常用命令

```bash
# 生成 Prisma Client
npm run db:generate

# 推送 schema 到数据库
npm run db:push

# 创建迁移
npm run db:migrate

# 打开 Prisma Studio
npm run db:studio

# 重置数据库（谨慎使用）
npx prisma migrate reset
```

## 🔄 下一步

1. 运行 `npm install` 安装 Prisma 依赖
2. 运行 `npm run db:push` 创建数据库表
3. 运行 `npm run db:studio` 验证表已创建
4. 在代码中使用 `import { prisma } from '@/lib/db'` 访问数据库

---

**准备好后运行以下命令初始化数据库：**

```bash
npm install
npm run db:generate
npm run db:push
```

