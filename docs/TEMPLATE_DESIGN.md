# 澳大利亚路标模板数据库设计

## 概述

本文档详细说明基于 AS1742 澳大利亚道路标志标准的模板数据库设计，特别是方向指示标志（Direction Signs）系列。

## 数据库架构

### 1. SignTemplate（标志类型模板）

存储标志的基本类型和结构配置，例如 G1-1、G1-2 等。

**关键字段：**
- `code`: 标志编号（如 "G1-1", "G1-2"）
- `panelCount`: 面板数量（2或3个）
- `layoutType`: 布局类型
  - `STANDARD`: 标准布局
  - `OFFSET`: 偏移侧道布局
  - `FOCAL_POINT`: 焦点式布局（用于远程目的地）
- `specifications`: 设计规范（圆角、边框、间距等）

**标志类型示例：**

#### G1-1 (两面板)
```
┌─────────────────────────────────────┐
│  🛡️ A30   Sydney            ⬆️     │
├─────────────────────────────────────┤
│  ⬅️   Plumpton  A85  →  Hawker    │
└─────────────────────────────────────┘
```

#### G1-2 (三面板)
```
┌─────────────────────────────────────┐
│  ⬆️   A30  Sydney                  │
├─────────────────────────────────────┤
│  SALTASH HWY                        │
│  Plumpton  A85  →                  │
│  Hawker                             │
├─────────────────────────────────────┤
│  ⬅️   Holley  A15                  │
│  ➡️   Sunnyside                     │
└─────────────────────────────────────┘
```

#### G1-1 Focal Point (焦点式)
```
┌─────────────────────────────────────┐
│     ⬆️  A32  Melbourne              │  ← 较大，用于远程目的地
│                                      │
├─────────────────────────────────────┤
│  ⬅️  Martins Ck  B97               │  ← 标准高度，本地方向
│  ➡️  Holley  B97                    │
└─────────────────────────────────────┘
```

### 2. PanelTemplate（面板模板）

定义每个标志内部各个面板的结构和布局规则。

**关键字段：**
- `position`: 面板位置（0=顶部，1=中间，2=底部）
- `type`: 面板类型
  - `PRIMARY`: 主要方向面板
  - `SECONDARY`: 次要方向面板
  - `SERVICE`: 服务设施面板
- `layout`: 布局配置（区域、对齐方式等）
- `allowedElements`: 允许的元素类型数组
- `backgroundColor`: 背景色（澳洲标准绿 #006747）

**布局区域（zones）：**
- `route-left`: 左侧路线盾牌区
- `destination-center`: 中央目的地文字区
- `arrow-right`: 右侧箭头区
- `road-name`: 道路名称区（如 "SALTASH HWY"）

### 3. ElementTemplate（元素模板）

存储可重用的设计元素：箭头、路线盾牌、图标等。

#### 3.1 箭头 (ARROW)
- Arrow Up (⬆️): 直行
- Arrow Right (➡️): 右转
- Arrow Left (⬅️): 左转
- Arrow Up Right: 斜向

#### 3.2 路线盾牌 (ROUTE_SHIELD)

**类别：**
- `NATIONAL`: 国道（白底黑字）
  ```
  ┌────────────────┐
  │ NATIONAL       │
  │   HIGHWAY      │
  │      M1        │
  └────────────────┘
  ```

- `STATE`: 州道（白底黑字，字母+数字）
  ```
  ┌──────┐
  │      │
  │  A85 │
  │      │
  └──────┘
  ```

- `METRO`: 都市路线（黄底黑字）
  ```
  ┌──────┐
  │      │
  │  B97 │
  │      │
  └──────┘
  ```

- `TOURIST`: 旅游路线（棕底白字）
  ```
  ┌──────┐
  │      │
  │ T302 │
  │      │
  └──────┘
  ```

#### 3.3 服务设施图标 (SERVICE_SIGN)
- 加油站（蓝底白图）
- 餐厅
- 住宿
- 其他服务设施

### 4. TypographyTemplate（字体规范）

存储字体和排版规则。

**澳大利亚标准字体规范 (AS1744)：**
- `h1`: 260mm（主要目的地）
- `h2`: 200mm（次要目的地）
- `body`: 180mm（道路名称）
- `small`: 150mm（距离、VIA等连接词）
- `caption`: 120mm（说明文字）

**字体家族：**
- Transport（标准）
- Clearview（可选，提高夜间可读性）

### 5. ColorScheme（配色方案）

澳大利亚道路标志标准配色。

**AS1742.3 标准配色：**
```json
{
  "green": "#006747",    // 方向指示标志背景
  "white": "#FFFFFF",    // 文字和边框
  "yellow": "#FFC72C",   // 警告标志/都市路线
  "blue": "#0066B3",     // 服务设施标志
  "brown": "#6B4423",    // 旅游景点标志
  "black": "#000000",    // 文字（白底时）
  "red": "#C8102E"       // 禁止标志
}
```

### 6. TemplateCollection（模板集合）

将相关模板组织成集合，便于用户选择和管理。

**示例集合：**
- "AS1742.6 Standard Direction Signs"（方向指示标志）
- "Service Facility Signs"（服务设施标志）
- "Tourist Signs"（旅游标志）

## 标志组成元素

### 面板结构

每个面板通常包含以下元素（从左到右）：

1. **路线盾牌** (可选)
   - 显示路线编号
   - 多个盾牌可横向排列

2. **道路名称** (可选)
   - 较小字体
   - 显示在目的地上方
   - 例如："SALTASH HWY", "BURKE RD"

3. **目的地文字**
   - 主要内容
   - 较大字体
   - 可以有多个目的地

4. **连接词** (可选)
   - "VIA"（经由）
   - "TO"（前往）
   - 较小字体

5. **箭头**
   - 指示方向
   - 通常在右侧
   - 大小可配置

## 设计规范

### 尺寸约束（以 G1 系列为例）

- **默认宽度**: 3800mm
- **最小宽度**: 2400mm
- **最大宽度**: 6000mm
- **面板最小高度**: 550-700mm（取决于类型）
- **边框宽度**: 20mm
- **圆角半径**: 30mm

### 间距规范

```json
{
  "padding": {
    "top": 100,
    "right": 120,
    "bottom": 100,
    "left": 120
  },
  "panelSpacing": 0,
  "elementSpacing": 80,
  "lineGap": 0.75
}
```

## 数据流程

### 创建标志的流程：

1. **选择标志模板** (SignTemplate)
   - 用户选择 G1-1、G1-2 等
   
2. **配置面板** (PanelTemplate)
   - 系统根据模板自动创建面板
   - 每个面板有预定义的布局
   
3. **添加元素** (ElementTemplate)
   - 用户从元素库选择：
     - 路线盾牌
     - 箭头
     - 服务图标
   - 输入目的地文字
   
4. **应用样式**
   - 使用 ColorScheme 配色
   - 应用 TypographyTemplate 字体规范
   
5. **生成输出**
   - SVG 矢量图
   - PDF 打印文件
   - PNG/JPG 预览图

## 使用场景

### 场景 1：简单路口标志

使用 **G1-1** 模板：
- 顶部面板：主路方向
- 底部面板：岔路方向

### 场景 2：复杂路口标志

使用 **G1-2** 模板：
- 顶部面板：远距离目的地
- 中间面板：中距离目的地或主路
- 底部面板：近距离目的地或岔路

### 场景 3：焦点式标志

使用 **G1-1 Focal Point** 模板：
- 顶部面板（较大）：重要远程目的地
- 底部面板（标准）：本地方向

## 扩展性

数据库设计支持以下扩展：

1. **新标志类型**
   - 添加新的 SignTemplate（如 G2、G4 系列）
   
2. **自定义元素**
   - 用户可创建自己的 ElementTemplate
   - 可以是自定义箭头、图标等
   
3. **主题定制**
   - 创建新的 ColorScheme
   - 支持不同州/地区的配色变化
   
4. **多语言支持**
   - TypographyTemplate 支持不同字体
   - 可配置不同语言的排版规则

## API 查询示例

### 获取所有 G1 系列模板

```typescript
const g1Templates = await prisma.signTemplate.findMany({
  where: { family: 'G1', isActive: true },
  include: { panels: true },
  orderBy: { sortOrder: 'asc' }
})
```

### 获取所有箭头元素

```typescript
const arrows = await prisma.elementTemplate.findMany({
  where: { 
    type: 'ARROW',
    isDefault: true 
  }
})
```

### 创建新标志

```typescript
const newSign = await prisma.sign.create({
  data: {
    userId: user.id,
    name: 'My Direction Sign',
    signTemplateId: g11Template.id,
    family: 'G1',
    layout: 'LANDSCAPE',
    data: {
      panels: [
        { /* panel 0 config */ },
        { /* panel 1 config */ }
      ]
    }
  }
})
```

## 参考标准

- **AS1742.6**: Direction and position signs
- **AS1744**: Forms of letters and numerals
- **AS1742.3**: Traffic control devices for works on roads

## 总结

这个模板数据库设计提供了：

✅ **灵活性**: 支持多种标志类型和布局  
✅ **可扩展性**: 易于添加新模板和元素  
✅ **标准化**: 遵循澳大利亚道路标志标准  
✅ **重用性**: 元素和样式可在多个标志间共享  
✅ **用户友好**: 清晰的层级结构便于理解和使用  

用户可以通过选择预定义模板快速创建标准化的道路标志，同时也保留了高度定制的能力。

