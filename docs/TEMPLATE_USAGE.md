# 模板系统使用指南

## 访问模板库

启动开发服务器后，访问：

```
http://localhost:3000/templates
```

## 页面功能

### 1. 标志模板 (Signs)

展示所有可用的标志类型模板，包括：

**G1-1 (两面板方向标志)**
```
┌─────────────────────────┐
│     Top Panel           │
├─────────────────────────┤
│     Bottom Panel        │
└─────────────────────────┘
```
- 用途：简单路口的方向指示
- 面板数：2
- 布局：标准 (STANDARD)

**G1-2 (三面板方向标志)**
```
┌─────────────────────────┐
│     Top Panel           │
├─────────────────────────┤
│     Middle Panel        │
├─────────────────────────┤
│     Bottom Panel        │
└─────────────────────────┘
```
- 用途：复杂路口的多方向指示
- 面板数：3
- 布局：标准 (STANDARD)

**G1-1-FOCAL (焦点式)**
```
┌─────────────────────────┐
│   Focal Panel (大)      │
│                         │
├─────────────────────────┤
│   Direction Panel       │
└─────────────────────────┘
```
- 用途：突出显示远距离目的地
- 面板数：2
- 布局：焦点式 (FOCAL_POINT)

### 2. 元素库 (Elements)

#### 箭头元素 (4个)

- **Arrow Up** (⬆️) - 直行
- **Arrow Right** (➡️) - 右转
- **Arrow Left** (⬅️) - 左转
- **Arrow Up Right** (↗️) - 斜向

每个箭头显示：
- 元素名称
- 使用次数
- 标签

#### 路线盾牌 (4个)

- **National Highway Shield** (国道)
  - 白底黑字
  - 带 "NATIONAL HIGHWAY" 标签
  
- **State Route Shield** (州道)
  - 白底黑字
  - A/B 系列编号
  
- **Metro Route Shield** (都市路线)
  - 黄底黑字
  - 都市区快速路
  
- **Tourist Route Shield** (旅游路线)
  - 棕底白字
  - 旅游景点路线

每个盾牌显示：
- 盾牌样式预览
- 类别标签
- 使用次数

#### 服务设施图标 (3个)

- **Petrol Station** (加油站)
- **Restaurant** (餐厅)
- **Accommodation** (住宿)

所有服务图标使用蓝底白图设计。

### 3. 配色方案 (Colors)

展示 **AS1742.3 Standard** 配色方案：

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| Green | #006747 | 方向指示标志背景 |
| White | #FFFFFF | 文字和边框 |
| Yellow | #FFC72C | 警告标志/都市路线 |
| Blue | #0066B3 | 服务设施标志 |
| Brown | #6B4423 | 旅游景点标志 |
| Black | #000000 | 文字（白底时使用） |
| Red | #C8102E | 禁止标志 |

每个颜色显示：
- 色块预览
- 颜色名称
- 十六进制色值

### 4. 字体规范 (Typography)

展示 **AS1744 Standard** 字体规范：

**字体家族**: Transport

**字号规范 (mm)**:
- **h1**: 260mm - 主要目的地
- **h2**: 200mm - 次要目的地
- **body**: 180mm - 道路名称
- **small**: 150mm - 距离、VIA等
- **caption**: 120mm - 说明文字

## API 端点

### 获取标志模板

```typescript
GET /api/templates/signs

// 按家族筛选
GET /api/templates/signs?family=G1

// 响应示例
[
  {
    "id": "...",
    "code": "G1-1",
    "name": "Direction Sign (Two-Panel)",
    "description": "双面板方向指示标志",
    "panelCount": 2,
    "layoutType": "STANDARD",
    "family": "G1",
    "category": "DIRECTION",
    "panels": [
      {
        "id": "...",
        "position": 0,
        "name": "Top Panel",
        "type": "PRIMARY",
        "backgroundColor": "#006747"
      },
      // ...
    ]
  }
]
```

### 获取元素模板

```typescript
GET /api/templates/elements

// 按类型筛选
GET /api/templates/elements?type=ARROW
GET /api/templates/elements?type=ROUTE_SHIELD

// 按类别筛选
GET /api/templates/elements?category=NATIONAL

// 响应示例
[
  {
    "id": "...",
    "name": "Arrow Up",
    "type": "ARROW",
    "category": "DIRECTIONAL",
    "defaultWidth": 180,
    "defaultHeight": 180,
    "usageCount": 0,
    "tags": ["arrow", "up", "straight"]
  }
]
```

### 获取配色方案

```typescript
GET /api/templates/colors

// 响应示例
[
  {
    "id": "...",
    "name": "AS1742.3 Standard",
    "description": "澳大利亚标准道路标志配色方案",
    "colors": {
      "green": "#006747",
      "white": "#FFFFFF",
      // ...
    },
    "isDefault": true
  }
]
```

### 获取字体规范

```typescript
GET /api/templates/typography

// 响应示例
[
  {
    "id": "...",
    "name": "AS1744 Standard",
    "description": "澳大利亚标准道路标志字体规范",
    "fontFamily": "Transport",
    "sizeRules": {
      "h1": 260,
      "h2": 200,
      "body": 180,
      // ...
    },
    "isDefault": true
  }
]
```

## 在代码中使用

### 客户端获取模板

```tsx
'use client'

import { useState, useEffect } from 'react'

export function TemplateSelector() {
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    fetch('/api/templates/signs?family=G1')
      .then(res => res.json())
      .then(data => setTemplates(data))
  }, [])

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>
          <h3>{template.code}</h3>
          <p>{template.name}</p>
          <p>{template.panelCount} 面板</p>
        </div>
      ))}
    </div>
  )
}
```

### 服务端获取模板

```tsx
import { prisma } from '@/lib/prisma'

export default async function Page() {
  const templates = await prisma.signTemplate.findMany({
    where: { isActive: true },
    include: { panels: true }
  })

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>
          {/* 渲染模板 */}
        </div>
      ))}
    </div>
  )
}
```

## 扩展模板

### 添加新的标志模板

```typescript
const newTemplate = await prisma.signTemplate.create({
  data: {
    code: 'G4-1',
    name: 'Advance Direction Sign',
    description: '提前方向指示标志',
    panelCount: 2,
    layoutType: 'STANDARD',
    family: 'G4',
    category: 'DIRECTION',
    specifications: {
      borderRadius: 30,
      borderWidth: 20,
      padding: { top: 100, right: 120, bottom: 100, left: 120 }
    }
  }
})

// 添加面板
await prisma.panelTemplate.createMany({
  data: [
    {
      signTemplateId: newTemplate.id,
      position: 0,
      name: 'Top Panel',
      type: 'PRIMARY',
      layout: { /* ... */ },
      allowedElements: ['ROUTE', 'DESTINATION', 'ARROW'],
      backgroundColor: '#006747'
    },
    // ...
  ]
})
```

### 添加新的元素

```typescript
const customArrow = await prisma.elementTemplate.create({
  data: {
    name: 'Arrow Down',
    type: 'ARROW',
    category: 'DIRECTIONAL',
    svgPath: 'M 50 90 L 10 50 L 30 50 L 30 10 L 70 10 L 70 50 L 90 50 Z',
    defaultWidth: 180,
    defaultHeight: 180,
    aspectRatio: 1.0,
    defaultColors: {
      fill: '#FFFFFF',
      stroke: '#000000'
    },
    tags: ['arrow', 'down'],
    isPublic: true,
    isDefault: true
  }
})
```

## 数据统计

当前数据库包含：

- ✅ 3 个标志模板 (G1-1, G1-2, G1-1-FOCAL)
- ✅ 7 个面板配置
- ✅ 4 个箭头元素
- ✅ 4 个路线盾牌
- ✅ 3 个服务图标
- ✅ 1 个配色方案
- ✅ 1 个字体规范
- ✅ 1 个模板集合
- ✅ 1 个示例标志

## 界面特性

### 响应式设计
- 移动端：单列布局
- 平板：2列布局
- 桌面：3-6列布局（根据内容类型）

### 交互效果
- 卡片悬停放大
- 阴影变化
- 默认模板高亮显示（绿色边框）

### 视觉反馈
- 加载状态显示旋转图标
- 使用次数统计
- 标签分类

## 下一步开发

1. **模板详情页**
   - 点击模板查看完整规格
   - 显示使用示例
   - 提供下载选项

2. **元素预览**
   - 实时渲染 SVG
   - 可配置参数预览
   - 颜色变体展示

3. **搜索和筛选**
   - 按名称搜索
   - 按类别筛选
   - 按使用频率排序

4. **收藏功能**
   - 用户收藏模板
   - 快速访问常用元素

5. **模板导出**
   - 导出为 JSON
   - 分享模板链接
   - 导入自定义模板

## 故障排除

### 模板不显示

检查：
1. 数据库连接是否正常
2. 是否执行了 `pnpm prisma db seed`
3. API 路由是否返回数据

```bash
# 测试 API
curl http://localhost:3000/api/templates/signs
```

### 样式问题

确保 Tailwind CSS 配置正确：

```bash
# 重新构建样式
pnpm dev
```

### 数据库错误

重置数据库：

```bash
pnpm prisma db push --force-reset
pnpm prisma db seed
```

## 参考文档

- [数据库设计](./TEMPLATE_DESIGN.md)
- [迁移指南](./DATABASE_MIGRATION.md)
- [实体关系图](./DATABASE_ERD.md)
- [Prisma 文档](https://www.prisma.io/docs)

