# Phase 2: 完整的澳大利亚指南牌规范实现

## 📋 需求清单

### 1. ✅ G1-1 改为两块板堆叠
- 当前：单块板，两行文字
- 目标：两块独立的板垂直堆叠
- 每块板是一个完整的指南牌单元

### 2. ✅ 移除 distance 参数
- G1-1 和 G1-2 都不需要 distanceKm
- 只保留 destination 文字

### 3. ✅ 增加 Road Name（白底黑字）
- 位置：在 destination 上方
- 样式：白色背景，黑色文字，圆角矩形
- 对齐：居中
- 可选：可以不显示

### 4. ✅ 增加向前箭头
- 当前：只有左右箭头
- 新增：向前箭头（↑）
- 3种方向：forward, left, right

### 5. ✅ 增加黄色 Road Number
- 样式：黄色背景，黑色文字
- 与 Shield 二选一
- 显示逻辑：`roadNumberType: 'number' | 'shield' | 'none'`

### 6. ✅ 方向逻辑重构
**当前问题**：
- A 部分只能选箭头图标
- B 部分统一设置方向
- 每个 panel 没有独立的方向控制

**目标**：
- 每个 panel 有独立的 `direction` 参数：`'forward' | 'left' | 'right'`
- direction 控制：
  1. 箭头方向
  2. 元素排列顺序
  3. 对齐方式

**排列规则**：
```
direction = 'forward' 或 'left':
  ┌────────────────────────┐
  │  [Road Name (白底)]     │
  │  ← [M1] Destination    │
  └────────────────────────┘
  排列：Arrow - RoadNumber - Destinations

direction = 'right':
  ┌────────────────────────┐
  │  [Road Name (白底)]     │
  │  Destination [A85] →   │
  └────────────────────────┘
  排列：Destinations - RoadNumber - Arrow
```

### 7. ✅ 对齐逻辑（Alignment）
**规则**：
- **Dominant Row**（横向最长的行）：保持标准 spacing
- **Non-dominant Rows**：分组对齐
  - **Left align** (forward/left 方向)：
    - Group 1: Arrow + RoadNumber（紧贴，小间距）
    - Group 2: Destinations（左对齐到 board）
  - **Right align** (right 方向)：
    - Group 1: Destinations（右对齐到 board）
    - Group 2: RoadNumber + Arrow（紧贴，小间距）

### 8. ✅ 支持多个 Destinations
- 每个 panel 可以有 1-3 个 destinations
- 垂直堆叠，居中或左/右对齐
- 统一字体大小

---

## 🏗️ 数据结构设计

### Panel Input 结构
```javascript
{
  // Road Name (可选)
  roadName: 'SALTASH HWY',  // 空字符串表示不显示
  
  // Road Number (二选一)
  roadNumberType: 'number' | 'shield' | 'none',
  roadNumber: 'A85',        // 黄色背景，黑字
  shieldLabel: 'M1',        // 盾形内的文字
  
  // Destinations (1-3个)
  destinations: [
    'Plumpton',
    'Hawker',     // 可选
    'Liverpool',  // 可选
  ],
  
  // 方向（控制布局和排列）
  direction: 'forward' | 'left' | 'right',
}
```

### State 结构
```javascript
state = {
  signType: 'G1-1',  // 'G1-1' | 'G1-2'
  
  content: {
    panels: [
      {
        roadName: 'SALTASH HWY',
        roadNumberType: 'shield',
        shieldLabel: 'M1',
        destinations: ['Plumpton'],
        direction: 'left',
      },
      {
        roadName: '',
        roadNumberType: 'number',
        roadNumber: 'A85',
        destinations: ['Hawker', 'Liverpool'],
        direction: 'right',
      },
      // G1-2 有第三个 panel
    ],
  },
  
  template: {
    letter_height_h: 8,
    line_spacing_h: 0.75,
    group_spacing_h: 1.0,
    board_pad_h: 1.0,
    panel_spacing_h: 0.3,
    
    // Road Name 样式
    roadName_letter_height_h: 6,
    roadName_bg_color: '#ffffff',
    roadName_text_color: '#000000',
    roadName_pad_h: 0.5,
    
    // Road Number 样式
    roadNumber_letter_height_h: 7,
    roadNumber_bg_color: '#ffd700',
    roadNumber_text_color: '#000000',
    roadNumber_pad_h: 0.3,
  },
  
  // ... 其他保持不变
}
```

---

## 🔧 实施步骤

### Step 1: 更新数据结构
- [ ] 修改 `state.content.panels[]` 结构
- [ ] 移除 `distanceKm`
- [ ] 添加 `roadName`, `roadNumberType`, `roadNumber`, `destinations[]`, `direction`

### Step 2: 增强 D2/converter.js
- [ ] 添加 `toBoxRoadName()` - 白底黑字矩形
- [ ] 添加 `toBoxRoadNumber()` - 黄底黑字矩形
- [ ] 更新 `toBoxIcon()` 支持向前箭头

### Step 3: 重构 D3/layout-g11.js
- [ ] 实现单个 panel 的完整布局逻辑
- [ ] 支持 roadName（顶部居中）
- [ ] 支持多个 destinations（1-3个）
- [ ] 实现方向控制的排列逻辑
- [ ] 实现对齐逻辑（dominant row vs grouped align）

### Step 4: 更新 D3/layout-g12.js
- [ ] 复用 layout-g11 的单 panel 逻辑
- [ ] 堆叠 3 个 panels

### Step 5: 更新 UI (app.js + index.html)
- [ ] 重新设计输入表单
- [ ] 每个 panel 独立的方向选择
- [ ] Road Name 输入框
- [ ] Road Number Type 选择（number/shield/none）
- [ ] Destinations 数量选择（1-3个）
- [ ] 移除统一的箭头方向设置

### Step 6: 测试
- [ ] 测试各种方向组合
- [ ] 测试对齐逻辑
- [ ] 测试多个 destinations
- [ ] 对比截图验证正确性

---

## 🎨 视觉效果示例

### Forward 方向示例
```
┌─────────────────────────────┐
│    ┌─ SALTASH HWY ─┐        │  ← Road Name (白底黑字)
│    │                │        │
│    ↑  M1  Sydney            │  ← Arrow - Shield - Destination
└─────────────────────────────┘
```

### Left 方向示例
```
┌─────────────────────────────┐
│                              │
│    ←  A85  Plumpton         │  ← Arrow - RoadNumber - Destination
└─────────────────────────────┘
```

### Right 方向示例
```
┌─────────────────────────────┐
│    ┌─ SALTASH HWY ─┐        │  ← Road Name (白底黑字)
│    │                │        │
│    Hawker  A85  →           │  ← Destination - RoadNumber - Arrow
└─────────────────────────────┘
```

---

## ⚠️ 技术难点

1. **对齐逻辑**：需要先计算所有行的宽度，找出 dominant row，然后对其他行应用分组对齐
2. **方向控制**：需要在布局阶段根据 direction 动态调整元素顺序
3. **多 destinations**：需要垂直堆叠，并根据对齐规则调整位置
4. **Road Name 样式**：白底黑字，需要特殊渲染逻辑

---

## 📅 预计工作量

- **Step 1-2**: 1小时（数据结构 + D2增强）
- **Step 3**: 2-3小时（核心布局逻辑重构）
- **Step 4**: 30分钟（复用逻辑）
- **Step 5**: 1-2小时（UI重构）
- **Step 6**: 1小时（测试调试）

**总计**: 5-8小时

---

**准备好开始实施了吗？** 🚀



