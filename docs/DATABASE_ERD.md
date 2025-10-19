# 数据库实体关系图 (ERD)

## 完整架构图

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          ausSignMaster Database                           │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│       User          │
│─────────────────────│
│ id (PK)             │
│ email               │◆───────┐
│ name                │        │
│ passwordHash        │        │
│ avatar              │        │
│ role                │        │
│ preferences (JSON)  │        │
└─────────────────────┘        │
         △                      │
         │                      │
         │ 1:N                  │ 1:N
         │                      │
    ┌────┴──────────────┬───────┴──────────────┐
    │                   │                      │
    │                   │                      │
┌───┴──────────────┐ ┌──┴──────────────────┐ ┌┴────────────────────────┐
│ Sign             │ │ ElementTemplate     │ │ TemplateCollection      │
│──────────────────│ │─────────────────────│ │─────────────────────────│
│ id (PK)          │ │ id (PK)             │ │ id (PK)                 │
│ userId (FK)      │ │ userId (FK)         │ │ userId (FK)             │
│ signTemplateId   │◇ │ name                │ │ name                    │
│ name             │ │ type                │ │ description             │
│ family           │ │ category            │ │ signTemplates (Array)   │
│ layout           │ │ svgPath             │ │ elements (Array)        │
│ data (JSON)      │ │ svgData (JSON)      │ │ thumbnail               │
│ thumbnail        │ │ defaultWidth        │ │ isPublic                │
│ svg              │ │ defaultHeight       │ │ isDefault               │
│ tags (Array)     │ │ aspectRatio         │ └─────────────────────────┘
│ isFavorite       │ │ defaultColors (JSON)│
└──────────────────┘ │ parameters (JSON)   │
         △           │ tags (Array)        │
         │           │ isPublic            │
         │ N:1       │ isDefault           │
         │           │ usageCount          │
         │           │ thumbnail           │
         │           └─────────────────────┘
         │
         │
┌────────┴────────────────┐
│ SignTemplate            │
│─────────────────────────│
│ id (PK)                 │
│ code (UNIQUE)           │────── 例如: "G1-1", "G1-2", "G1-1-FOCAL"
│ name                    │
│ description             │
│ panelCount              │────── 2 或 3
│ layoutType              │────── STANDARD | OFFSET | FOCAL_POINT
│ defaultWidth            │────── 默认尺寸 (mm)
│ defaultHeight           │
│ minWidth                │
│ maxWidth                │
│ specifications (JSON)   │────── { borderRadius, padding, etc }
│ category                │────── DIRECTION | GUIDE | DISTANCE
│ family                  │────── G1 | G2 | G4 等
│ isActive                │
│ sortOrder               │
└─────────────────────────┘
         △
         │
         │ 1:N
         │
┌────────┴────────────────┐
│ PanelTemplate           │
│─────────────────────────│
│ id (PK)                 │
│ signTemplateId (FK)     │
│ position                │────── 0, 1, 2 (从上到下)
│ name                    │────── "Top Panel", "Middle Panel", etc
│ type                    │────── PRIMARY | SECONDARY | SERVICE
│ layout (JSON)           │────── { zones, flexGrow, alignment }
│ allowedElements (Array) │────── ["ROUTE", "DESTINATION", "ARROW"]
│ backgroundColor         │────── "#006747" (澳洲绿)
│ borderColor             │
│ minHeight               │
└─────────────────────────┘


┌─────────────────────────┐
│ ColorScheme             │
│─────────────────────────│
│ id (PK)                 │
│ name (UNIQUE)           │────── "AS1742.3 Standard"
│ description             │
│ colors (JSON)           │────── { green, white, yellow, blue, etc }
│ usageRules (JSON)       │
│ isDefault               │
└─────────────────────────┘


┌─────────────────────────┐
│ TypographyTemplate      │
│─────────────────────────│
│ id (PK)                 │
│ name (UNIQUE)           │────── "AS1744 Standard", "Transport"
│ description             │
│ fontFamily              │
│ fontFiles (JSON)        │
│ sizeRules (JSON)        │────── { h1: 260, h2: 200, body: 180 }
│ weights (JSON)          │
│ letterSpacing (JSON)    │
│ lineHeight (JSON)       │
│ isDefault               │
└─────────────────────────┘


┌─────────────────────────┐
│ Activity                │
│─────────────────────────│
│ id (PK)                 │
│ userId (FK)             │
│ action                  │────── created | updated | exported
│ entityType              │────── sign | template
│ entityId                │
│ metadata (JSON)         │
│ createdAt               │
└─────────────────────────┘

```

## 核心关系说明

### 1. User → Sign (1:N)
- 一个用户可以创建多个标志
- 删除用户时级联删除其所有标志

### 2. SignTemplate → PanelTemplate (1:N)
- 一个标志模板包含多个面板模板
- 面板按 `position` 字段排序 (0, 1, 2)
- 删除标志模板时级联删除其面板

### 3. SignTemplate → Sign (1:N)
- 一个标志模板可被多个标志使用
- 标志通过 `signTemplateId` 引用模板
- 删除模板时，标志的 `signTemplateId` 设为 NULL (SetNull)

### 4. User → ElementTemplate (1:N)
- 用户可创建自定义元素
- 系统元素的 `userId` 为 NULL
- 删除用户时级联删除其自定义元素

### 5. User → TemplateCollection (1:N)
- 用户可创建模板集合
- 系统集合的 `userId` 为 NULL

## 数据流向

### 创建标志的流程

```
1. 用户选择模板
   User → SignTemplate (查询可用模板)
          ↓
   获取模板详情和面板配置
   SignTemplate → PanelTemplate
          ↓
2. 创建新标志
   User → Sign (创建，引用 SignTemplate)
          ↓
3. 添加元素
   查询可用元素 → ElementTemplate
          ↓
4. 保存标志数据
   Sign.data (JSON) 存储面板和元素配置
```

### 渲染标志的流程

```
1. 加载标志
   Sign → SignTemplate (获取模板配置)
        → PanelTemplate (获取面板布局)
          ↓
2. 应用样式
   ColorScheme (获取配色方案)
   TypographyTemplate (获取字体规范)
          ↓
3. 渲染元素
   Sign.data.panels[].elements (从 JSON 读取)
        → ElementTemplate (获取元素 SVG)
          ↓
4. 生成输出
   SVG / PDF / PNG
```

## 表大小估算

基于典型使用场景的估算：

| 表名 | 预计记录数 | 说明 |
|-----|-----------|------|
| User | 100-10,000 | 注册用户 |
| Sign | 1,000-100,000 | 用户创建的标志 |
| SignTemplate | 20-50 | 官方标志类型（缓慢增长） |
| PanelTemplate | 40-150 | 每个模板 2-3 个面板 |
| ElementTemplate | 100-500 | 箭头、盾牌、图标等 |
| ColorScheme | 5-20 | 不同州/国家的配色 |
| TypographyTemplate | 3-10 | 字体规范 |
| TemplateCollection | 10-100 | 模板分组 |
| Activity | 无限增长 | 考虑定期归档 |

## 索引策略

### 现有索引

```sql
-- User
CREATE UNIQUE INDEX users_email_key ON users(email);

-- Sign
CREATE INDEX signs_userId_idx ON signs(userId);
CREATE INDEX signs_family_idx ON signs(family);
CREATE INDEX signs_signTemplateId_idx ON signs(signTemplateId);

-- SignTemplate
CREATE UNIQUE INDEX sign_templates_code_key ON sign_templates(code);
CREATE INDEX sign_templates_family_idx ON sign_templates(family);

-- PanelTemplate
CREATE INDEX panel_templates_signTemplateId_idx ON panel_templates(signTemplateId);

-- ElementTemplate
CREATE INDEX element_templates_userId_idx ON element_templates(userId);
CREATE INDEX element_templates_type_idx ON element_templates(type);
CREATE INDEX element_templates_category_idx ON element_templates(category);

-- TemplateCollection
CREATE INDEX template_collections_userId_idx ON template_collections(userId);

-- Activity
CREATE INDEX activities_userId_idx ON activities(userId);
CREATE INDEX activities_createdAt_idx ON activities(createdAt);
```

### 建议的额外索引（按需添加）

```sql
-- 如果经常按标签搜索标志
CREATE INDEX signs_tags_gin ON signs USING GIN(tags);

-- 如果经常查询收藏的标志
CREATE INDEX signs_userId_isFavorite_idx ON signs(userId, isFavorite) 
  WHERE isFavorite = true;

-- 如果经常按更新时间排序
CREATE INDEX signs_updatedAt_idx ON signs(updatedAt DESC);

-- 如果经常查询公共元素
CREATE INDEX element_templates_isPublic_usageCount_idx 
  ON element_templates(isPublic, usageCount DESC) 
  WHERE isPublic = true;
```

## JSON 字段结构

### Sign.data

```json
{
  "templateCode": "G1-2",
  "panels": [
    {
      "position": 0,
      "name": "Top Panel",
      "elements": [
        {
          "type": "ROUTE",
          "code": "A30",
          "network": "NATIONAL"
        },
        {
          "type": "DESTINATION",
          "text": "Sydney",
          "fontSize": 260
        },
        {
          "type": "ARROW",
          "direction": "UP"
        }
      ]
    },
    {
      "position": 1,
      "elements": [...]
    }
  ],
  "board": {
    "width": 3800,
    "height": 2000
  }
}
```

### SignTemplate.specifications

```json
{
  "borderRadius": 30,
  "borderWidth": 20,
  "panelSpacing": 0,
  "padding": {
    "top": 100,
    "right": 120,
    "bottom": 100,
    "left": 120
  },
  "minPanelHeight": 550,
  "focalPanelHeight": 700
}
```

### PanelTemplate.layout

```json
{
  "zones": ["route-left", "destination-center", "arrow-right"],
  "flexGrow": [0.3, 1, 0.3],
  "alignment": "center",
  "fontSize": "large"
}
```

### ElementTemplate.svgData (路线盾牌)

```json
{
  "type": "shield",
  "shape": "rounded-rect",
  "width": 200,
  "height": 240,
  "borderRadius": 20,
  "backgroundColor": "#FFFFFF",
  "borderColor": "#000000",
  "borderWidth": 8,
  "textFormat": "{code}",
  "textSize": 180,
  "textColor": "#000000",
  "labelText": "NATIONAL HIGHWAY",
  "labelSize": 40
}
```

## 查询性能优化建议

### 1. 预加载关联数据

```typescript
// ✅ 好的做法 - 使用 include
const signs = await prisma.sign.findMany({
  where: { userId },
  include: {
    signTemplate: {
      include: { panels: true }
    }
  }
})

// ❌ 避免 N+1 查询
const signs = await prisma.sign.findMany({ where: { userId } })
for (const sign of signs) {
  // 每次循环都会查询数据库！
  const template = await prisma.signTemplate.findUnique({
    where: { id: sign.signTemplateId }
  })
}
```

### 2. 选择必要的字段

```typescript
// 如果只需要基本信息，不要查询大字段
const signs = await prisma.sign.findMany({
  select: {
    id: true,
    name: true,
    thumbnail: true,
    // 不选择 data 和 svg 字段（可能很大）
  }
})
```

### 3. 分页

```typescript
// 大量记录时使用分页
const signs = await prisma.sign.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { updatedAt: 'desc' }
})
```

### 4. 缓存常用数据

```typescript
// 标志模板变化不频繁，可以缓存
import { cache } from 'react'

export const getSignTemplates = cache(async () => {
  return await prisma.signTemplate.findMany({
    where: { isActive: true },
    include: { panels: true }
  })
})
```

## 备份和维护

### 定期备份

```bash
# 导出整个数据库
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 只备份数据（不含表结构）
pg_dump $DATABASE_URL --data-only > data_backup_$(date +%Y%m%d).sql
```

### Activity 表清理

```typescript
// 定期清理旧的活动记录（例如保留 90 天）
await prisma.activity.deleteMany({
  where: {
    createdAt: {
      lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    }
  }
})
```

## 扩展计划

未来可能添加的表：

1. **Version** - 模板版本控制
2. **Comment** - 标志评论和反馈
3. **Share** - 标志分享链接
4. **Export** - 导出历史记录
5. **Team** - 团队协作功能
6. **License** - 授权和订阅管理

## 参考

- [Prisma 关系](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [PostgreSQL 索引](https://www.postgresql.org/docs/current/indexes.html)
- [JSON 字段查询](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields)

