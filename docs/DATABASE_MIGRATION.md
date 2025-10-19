# 数据库迁移指南

## 新模板系统概述

新的模板系统提供了更强大和灵活的方式来管理澳大利亚道路标志设计。

### 主要改进

**之前 (旧系统):**
- ❌ 简单的 `Template` 模型，所有数据存储在 JSON 中
- ❌ 难以查询和过滤特定类型的模板
- ❌ 缺乏结构化的面板和元素管理

**现在 (新系统):**
- ✅ `SignTemplate` - 标志类型（G1-1, G1-2 等）
- ✅ `PanelTemplate` - 面板结构（每个标志的子面板）
- ✅ `ElementTemplate` - 可重用元素（箭头、盾牌等）
- ✅ `TypographyTemplate` - 字体规范
- ✅ `ColorScheme` - 配色方案
- ✅ `TemplateCollection` - 模板集合

## 迁移步骤

### 1. 生成新的 Prisma Client

```bash
pnpm prisma generate
```

### 2. 创建迁移

```bash
pnpm prisma migrate dev --name add_template_system
```

如果提示数据丢失警告，输入 `yes` 确认（建议先备份数据库）。

### 3. 执行种子数据

```bash
pnpm prisma db seed
```

这将创建：
- 1 个配色方案（AS1742.3 Standard）
- 1 个字体模板（AS1744 Standard）
- 3 个标志模板（G1-1, G1-2, G1-1-FOCAL）
- 多个面板模板
- 箭头元素（上、下、左、右）
- 路线盾牌元素（国道、州道、都市、旅游）
- 服务设施图标
- 1 个模板集合
- 1 个示例标志

## 数据库结构

### 关系图

```
User
  ├── Signs (多个标志)
  ├── ElementTemplates (自定义元素)
  └── TemplateCollections (模板集合)

SignTemplate (标志类型)
  ├── PanelTemplates (面板配置)
  └── Signs (使用此模板的标志)

Sign (标志文档)
  ├── User (所有者)
  └── SignTemplate (使用的模板)
```

## 使用示例

### 查询所有可用的标志模板

```typescript
import { prisma } from '@/lib/prisma'

const templates = await prisma.signTemplate.findMany({
  where: { isActive: true },
  include: {
    panels: {
      orderBy: { position: 'asc' }
    }
  },
  orderBy: { sortOrder: 'asc' }
})

// 结果示例:
// [
//   {
//     code: 'G1-1',
//     name: 'Direction Sign (Two-Panel)',
//     panelCount: 2,
//     panels: [
//       { position: 0, name: 'Top Panel', ... },
//       { position: 1, name: 'Bottom Panel', ... }
//     ]
//   },
//   ...
// ]
```

### 创建基于模板的新标志

```typescript
// 1. 获取模板
const template = await prisma.signTemplate.findUnique({
  where: { code: 'G1-2' },
  include: { panels: true }
})

// 2. 创建标志
const sign = await prisma.sign.create({
  data: {
    userId: currentUser.id,
    name: 'Sydney Direction Sign',
    family: template.family,
    signTemplateId: template.id,
    layout: 'LANDSCAPE',
    data: {
      templateCode: template.code,
      panels: template.panels.map(panel => ({
        position: panel.position,
        elements: []  // 用户稍后添加元素
      })),
      board: {
        width: template.defaultWidth,
        height: template.defaultHeight
      }
    },
    tags: ['direction', 'G1-2']
  }
})
```

### 查询元素模板

```typescript
// 获取所有箭头
const arrows = await prisma.elementTemplate.findMany({
  where: { 
    type: 'ARROW',
    isDefault: true 
  }
})

// 获取路线盾牌
const shields = await prisma.elementTemplate.findMany({
  where: { 
    type: 'ROUTE_SHIELD'
  },
  orderBy: { category: 'asc' }
})

// 按类别分组
const shieldsByCategory = {
  NATIONAL: shields.filter(s => s.category === 'NATIONAL'),
  STATE: shields.filter(s => s.category === 'STATE'),
  METRO: shields.filter(s => s.category === 'METRO'),
  TOURIST: shields.filter(s => s.category === 'TOURIST')
}
```

### 获取配色方案

```typescript
const colorScheme = await prisma.colorScheme.findFirst({
  where: { isDefault: true }
})

// 使用颜色
const backgroundColor = colorScheme.colors.green  // "#006747"
const textColor = colorScheme.colors.white        // "#FFFFFF"
```

### 获取字体规范

```typescript
const typography = await prisma.typographyTemplate.findFirst({
  where: { isDefault: true }
})

// 使用字体大小
const headingSize = typography.sizeRules.h1    // 260mm
const bodySize = typography.sizeRules.body     // 180mm
```

### 创建自定义元素

```typescript
// 用户创建自己的箭头变体
const customArrow = await prisma.elementTemplate.create({
  data: {
    userId: currentUser.id,
    name: 'My Custom Arrow',
    type: 'ARROW',
    category: 'DIRECTIONAL',
    svgPath: 'M ...',  // 自定义 SVG 路径
    defaultWidth: 200,
    defaultHeight: 200,
    aspectRatio: 1.0,
    defaultColors: {
      fill: '#FFFFFF',
      stroke: '#000000'
    },
    tags: ['custom', 'arrow'],
    isPublic: false  // 私有元素
  }
})
```

### 查询用户的标志（带模板信息）

```typescript
const userSigns = await prisma.sign.findMany({
  where: { userId: currentUser.id },
  include: {
    signTemplate: {
      include: { panels: true }
    }
  },
  orderBy: { updatedAt: 'desc' }
})

// 可以获取每个标志使用的模板信息
userSigns.forEach(sign => {
  console.log(`Sign: ${sign.name}`)
  console.log(`Template: ${sign.signTemplate?.name}`)
  console.log(`Panels: ${sign.signTemplate?.panelCount}`)
})
```

### 更新模板使用计数

```typescript
// 当用户使用某个元素时，增加使用计数
await prisma.elementTemplate.update({
  where: { id: elementId },
  data: {
    usageCount: { increment: 1 }
  }
})

// 查询最常用的元素
const popularElements = await prisma.elementTemplate.findMany({
  where: { isPublic: true },
  orderBy: { usageCount: 'desc' },
  take: 10
})
```

## API 路由示例

### GET /api/templates/signs

```typescript
// app/api/templates/signs/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const family = searchParams.get('family') // 例如 'G1'
  
  const templates = await prisma.signTemplate.findMany({
    where: family ? { family, isActive: true } : { isActive: true },
    include: {
      panels: {
        orderBy: { position: 'asc' }
      }
    },
    orderBy: { sortOrder: 'asc' }
  })
  
  return NextResponse.json(templates)
}
```

### GET /api/templates/elements

```typescript
// app/api/templates/elements/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'ARROW', 'ROUTE_SHIELD', etc.
  
  const elements = await prisma.elementTemplate.findMany({
    where: {
      type: type as string,
      OR: [
        { isPublic: true },
        { userId: currentUser.id } // 包含用户自己的元素
      ]
    },
    orderBy: [
      { isDefault: 'desc' },
      { usageCount: 'desc' }
    ]
  })
  
  return NextResponse.json(elements)
}
```

### POST /api/signs/from-template

```typescript
// app/api/signs/from-template/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { templateCode, name } = await request.json()
  
  // 获取模板
  const template = await prisma.signTemplate.findUnique({
    where: { code: templateCode },
    include: { panels: true }
  })
  
  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    )
  }
  
  // 创建标志
  const sign = await prisma.sign.create({
    data: {
      userId: currentUser.id,
      name: name || `New ${template.name}`,
      family: template.family,
      signTemplateId: template.id,
      layout: 'LANDSCAPE',
      data: {
        templateCode: template.code,
        panels: template.panels.map(panel => ({
          position: panel.position,
          name: panel.name,
          type: panel.type,
          elements: []
        })),
        board: {
          width: template.defaultWidth,
          height: template.defaultHeight
        }
      }
    },
    include: {
      signTemplate: true
    }
  })
  
  return NextResponse.json(sign)
}
```

## 前端使用示例 (React/Next.js)

### 模板选择器组件

```tsx
// components/TemplateSelector.tsx
'use client'

import { useState, useEffect } from 'react'

interface SignTemplate {
  id: string
  code: string
  name: string
  description: string
  panelCount: number
  thumbnail?: string
}

export function TemplateSelector({ 
  onSelect 
}: { 
  onSelect: (template: SignTemplate) => void 
}) {
  const [templates, setTemplates] = useState<SignTemplate[]>([])
  
  useEffect(() => {
    fetch('/api/templates/signs?family=G1')
      .then(res => res.json())
      .then(data => setTemplates(data))
  }, [])
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {templates.map(template => (
        <div 
          key={template.id}
          className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => onSelect(template)}
        >
          <h3 className="font-bold">{template.code}</h3>
          <p className="text-sm text-gray-600">{template.name}</p>
          <p className="text-xs text-gray-500">
            {template.panelCount} 面板
          </p>
        </div>
      ))}
    </div>
  )
}
```

### 元素选择器组件

```tsx
// components/ElementPicker.tsx
'use client'

import { useState, useEffect } from 'react'

interface ElementTemplate {
  id: string
  name: string
  type: string
  thumbnail?: string
}

export function ElementPicker({ 
  type,
  onSelect 
}: { 
  type: 'ARROW' | 'ROUTE_SHIELD' | 'SERVICE_SIGN'
  onSelect: (element: ElementTemplate) => void 
}) {
  const [elements, setElements] = useState<ElementTemplate[]>([])
  
  useEffect(() => {
    fetch(`/api/templates/elements?type=${type}`)
      .then(res => res.json())
      .then(data => setElements(data))
  }, [type])
  
  return (
    <div className="flex flex-wrap gap-2">
      {elements.map(element => (
        <button
          key={element.id}
          className="border rounded p-2 hover:bg-blue-50"
          onClick={() => onSelect(element)}
          title={element.name}
        >
          {element.thumbnail ? (
            <img src={element.thumbnail} alt={element.name} className="w-12 h-12" />
          ) : (
            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs">
              {element.name}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
```

## 测试数据

种子数据创建了以下测试账户：

- **邮箱**: test@example.com
- **密码**: password123

可以使用此账户登录并查看示例标志。

## 常见问题

### Q: 如何添加新的标志类型？

A: 创建新的 `SignTemplate` 记录：

```typescript
const newTemplate = await prisma.signTemplate.create({
  data: {
    code: 'G4-1',
    name: 'Advance Direction Sign',
    panelCount: 2,
    layoutType: 'STANDARD',
    // ... 其他配置
  }
})

// 然后添加面板
await prisma.panelTemplate.createMany({
  data: [
    { signTemplateId: newTemplate.id, position: 0, ... },
    { signTemplateId: newTemplate.id, position: 1, ... }
  ]
})
```

### Q: 如何导入自定义 SVG 元素？

A: 创建 `ElementTemplate`：

```typescript
const customElement = await prisma.elementTemplate.create({
  data: {
    userId: currentUser.id,
    name: 'Custom Icon',
    type: 'SYMBOL',
    svgPath: '<svg>...</svg>',  // 完整的 SVG 字符串
    // 或使用 svgData 存储参数化定义
    tags: ['custom', 'icon']
  }
})
```

### Q: 旧的标志数据会丢失吗？

A: `Sign` 模型保留了 `data` JSON 字段，旧数据仍然存在。新系统通过 `signTemplateId` 关联到模板，但不强制要求。可以逐步迁移旧标志到新系统。

### Q: 如何实现模板版本控制？

A: 可以添加 `version` 字段到 `SignTemplate`：

```prisma
model SignTemplate {
  // ... 现有字段
  version       Int       @default(1)
  previousVersionId String?
}
```

## 下一步

1. **实现前端 UI**
   - 模板选择界面
   - 元素拖放编辑器
   - 实时预览

2. **SVG 渲染引擎**
   - 根据模板和元素生成 SVG
   - 支持导出 PDF

3. **模板市场**
   - 用户可以分享模板
   - 社区投票和评分

4. **批量生成**
   - 从 CSV 批量生成标志
   - 模板批量应用

## 参考资料

- [Prisma 文档](https://www.prisma.io/docs)
- [AS1742.6 标准](https://www.standards.org.au/)
- [模板设计文档](./TEMPLATE_DESIGN.md)

