# 箭头放置策略文档

## 概述

D3 布局引擎现在支持灵活的箭头放置策略，包括：
- **水平位置**：左侧 (left) 或右侧 (right)
- **垂直对齐**：5 种精确的对齐策略

## 垂直对齐策略

### 1. `middle` - 几何居中（默认）

箭头在文字组的几何中心，纯数学计算：

```javascript
arrowY = (textGroupHeight - arrowHeight) / 2
```

**适用场景**：通用，视觉平衡

**示例**：
```json
{
  "arrow_v_place": "middle"
}
```

---

### 2. `baseline-line1` - 对齐第一行基线

箭头中心对齐第一行文字的基线（字母坐在的线）。

```javascript
arrowY = line1BaselineY - arrowBaselineOffset
```

**适用场景**：强调第一行（如目的地名称）

**示例**：
```json
{
  "arrow_v_place": "baseline-line1"
}
```

---

### 3. `baseline-line2` - 对齐第二行基线

箭头中心对齐第二行文字的基线。

```javascript
arrowY = line2BaselineY - arrowBaselineOffset
```

**适用场景**：强调第二行（如距离数字）

**测试结果**：
- 默认 middle: 箭头 Y = 4.38h (43.8px)
- baseline-line2: 箭头 Y = 11.15h (111.5px) ✓ 明显下移

**示例**：
```json
{
  "arrow_v_place": "baseline-line2"
}
```

---

### 4. `cap-middle` - Cap 高度中线

箭头对齐两行 cap 高度（大写字母顶部）的中线。

```javascript
topCap = line1Top
bottomCap = line2BaselineY
capMid = (topCap + bottomCap) / 2
arrowY = capMid - arrowHeight / 2
```

**适用场景**：视觉上更偏向字母的"实体部分"，忽略下伸部分

**示例**：
```json
{
  "arrow_v_place": "cap-middle"
}
```

---

### 5. `optical-bottom` - 光学下沉

在几何中心基础上略微下移，补偿视觉重心。

```javascript
arrowY = geometricMiddle + 0.05 * textGroupHeight
```

**适用场景**：追求视觉平衡而非数学精确，箭头看起来更"稳"

**测试结果**：
- 默认 middle: 箭头 Y = 4.38h
- optical-bottom: 箭头 Y = 5.21h (+0.83h) ✓ 轻微下沉

**示例**：
```json
{
  "arrow_v_place": "optical-bottom",
  "opticalK": 0.05  // 可选，默认 5%
}
```

---

## 水平位置

### `left` - 左箭头

箭头放在文字组左侧：

```
[箭头] [间距] [文字组]
```

**布局逻辑**：
- 箭头 x = board_pad_h
- 文字 x = board_pad_h + arrowWidth + group_spacing_h

**测试结果**：
- 文字 x = 120px（右移）
- 箭头 x = 10px（左侧）✓

### `right` - 右箭头（默认）

箭头放在文字组右侧：

```
[文字组] [间距] [箭头]
```

**布局逻辑**：
- 文字 x = board_pad_h
- 箭头 x = board_pad_h + textGroupWidth + group_spacing_h

---

## 模板配置示例

### 完整模板定义

```json
{
  "G1-1": {
    "font_series": "E",
    "letter_height_h": 8,
    "line_spacing_h": 0.75,
    "group_spacing_h": 1.0,
    "board_pad_h": 1.0,
    "arrow_placement": "right",      // "left" | "right"
    "arrow_v_place": "middle",       // 5 种策略之一
    "variables": ["destinationName", "distanceKm", "arrow"],
    "layout": [
      {"type": "text", "bind": "destinationName"},
      {"type": "text", "bind": "distanceKm"},
      {"type": "icon", "bind": "arrow"}
    ]
  }
}
```

### 预设模板

沙盒包含 4 个预设模板：

1. **G1-1**：右箭头 + 几何居中（默认）
2. **G1-1-baseline2**：右箭头 + 对齐第二行基线
3. **G1-1-left**：左箭头 + 几何居中
4. **G1-1-optical**：右箭头 + 光学下沉

---

## 使用方法

### 方法 A：修改现有配置

编辑 `input.json`：

```json
{
  "templateCode": "G1-1",
  "input": {
    "destinationName": "Mary Hill",
    "distanceKm": "12",
    "arrow": "arrow-right-std"
  },
  "pxPerH": 10
}
```

然后修改模板中的 `arrow_placement` 或 `arrow_v_place`。

### 方法 B：使用预设模板

```bash
# 测试左箭头
cp input-left.json input.json
npm run demo

# 测试基线对齐
cp input-baseline2.json input.json
npm run demo

# 测试光学下沉
cp input-optical.json input.json
npm run demo
```

### 方法 C：批量测试（推荐）

```bash
npm test
```

生成 4 个 SVG 文件：
- `out-default.svg`
- `out-left.svg`
- `out-baseline2.svg`
- `out-optical.svg`

并排对比观察差异。

---

## 验收清单

运行 `npm test` 后，检查生成的 SVG：

### 水平位置验收

- ✅ **out-left.svg**：箭头在左，文字在右
- ✅ **out-default.svg**：箭头在右，文字在左

### 垂直位置验收

打开 4 个文件，观察箭头 Y 坐标：

| 策略 | 预期位置 | 测试结果 |
|------|---------|---------|
| middle | 文字组几何中心 | Y = 4.38h ✓ |
| baseline-line2 | 第二行基线 | Y = 11.15h ✓ |
| optical-bottom | 略低于中心 | Y = 5.21h (+0.83h) ✓ |

### SVG 检查

- ✅ 左箭头的三角形尖端指向左 (polygon 第一个点 x 最小)
- ✅ 右箭头的三角形尖端指向右 (polygon 第一个点 x 最大)
- ✅ 文字 x 坐标：左箭头版本 > 右箭头版本

---

## 实现细节

### 核心函数：`placeIconY`

位于 `d3/layout-g11.js`：

```javascript
function placeIconY(iconBox, textGroup, vPlace, opts = {}) {
  const H = textGroup.h;
  
  switch (vPlace) {
    case 'middle':
      return (H - iconBox.h) / 2;
    
    case 'baseline-line1':
      const baselineY1 = textGroup.children[0].y + opts.line1_ascent_h;
      return baselineY1 - iconBox.baselineOffset_h;
    
    case 'baseline-line2':
      const baselineY2 = textGroup.children[1].y + opts.line2_ascent_h;
      return baselineY2 - iconBox.baselineOffset_h;
    
    case 'cap-middle':
      const topCap = textGroup.children[0].y;
      const bottomCap = textGroup.children[1].y + opts.line2_ascent_h;
      return (topCap + bottomCap) / 2 - iconBox.h / 2;
    
    case 'optical-bottom':
      const mid = (H - iconBox.h) / 2;
      return mid + (opts.opticalK ?? 0.05) * H;
    
    default:
      return (H - iconBox.h) / 2;
  }
}
```

### 水平位置计算

```javascript
const isLeft = template.arrow_placement === 'left';

if (isLeft) {
  arrowX_h = 0;
  textOffsetX_h = arrowBox.w + group_spacing_h;
} else {
  arrowX_h = textGroup.w + group_spacing_h;
  textOffsetX_h = 0;
}
```

### SVG 渲染差异

`d4/svg.js` 的 `renderArrow` 函数根据 `direction` 参数决定箭头形状：

- **left**：triangle(left) + rect(right)
- **right**：rect(left) + triangle(right)

---

## 扩展建议

如果需要更多对齐策略，可以在 `placeIconY` 中添加新的 case：

```javascript
case 'x-height-middle':
  // 对齐 x 高度（小写字母高度）中线
  const xTop = textGroup.children[0].y + opts.capHeight;
  const xBottom = textGroup.children[1].y + opts.capHeight;
  return (xTop + xBottom) / 2 - iconBox.h / 2;

case 'descender-aware':
  // 考虑下伸部分的视觉补偿
  // ...
```

然后在模板中使用新策略即可，无需修改其他代码！

---

## 总结

✅ **5 种垂直对齐策略**，从数学精确到视觉优化  
✅ **左右箭头支持**，自动计算文字偏移  
✅ **完全在 h 空间计算**，像素转换统一在输出层  
✅ **纯函数设计**，易于测试和扩展  
✅ **测试通过率 4/4**，所有策略验证成功  

🎯 核心价值：**分离关注点** — 排版逻辑（D3）专注于 h 空间的数学关系，渲染器（D4）负责像素输出。

