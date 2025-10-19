# 更新日志

## v1.1.0 - 箭头放置策略增强

### 新增功能

#### 1. 纵向放置助手函数 `placeIconY`

位于 `d3/layout-g11.js`，支持 5 种垂直对齐策略：

- ✅ **middle** - 几何居中（默认）
- ✅ **baseline-line1** - 对齐第一行基线
- ✅ **baseline-line2** - 对齐第二行基线  
- ✅ **cap-middle** - Cap 高度中线
- ✅ **optical-bottom** - 光学下沉（视觉补偿）

#### 2. 左右箭头支持

- ✅ **right** - 箭头在右侧（默认）
- ✅ **left** - 箭头在左侧，文字自动右移

#### 3. 新增模板

在 `d3/templates.json` 中添加：

- `G1-1-baseline2` - 箭头对齐第二行基线
- `G1-1-left` - 左箭头 + 几何居中
- `G1-1-optical` - 光学下沉

#### 4. 批量测试脚本

- 新增 `playground/test-all.js`
- 运行 `npm test` 一次生成 4 个对比 SVG
- 自动输出详细的元数据对比

#### 5. SVG 渲染增强

- `d4/svg.js` 支持左箭头渲染
- 根据 `direction` 参数自动调整箭头形状

### 测试结果

| 测试用例 | 状态 | 箭头位置 | 垂直策略 | 箭头 Y |
|---------|------|---------|---------|--------|
| default | ✅ | right | middle | 4.38h |
| left | ✅ | left | middle | 4.38h |
| baseline2 | ✅ | right | baseline-line2 | 11.15h |
| optical | ✅ | right | optical-bottom | 5.21h |

**通过率**: 4/4 (100%)

### 文件变更

#### 新增文件
- `input-left.json` - 左箭头测试配置
- `input-baseline2.json` - 基线对齐测试配置
- `input-optical.json` - 光学下沉测试配置
- `playground/test-all.js` - 批量测试脚本
- `ARROW_PLACEMENT.md` - 详细功能文档
- `CHANGELOG.md` - 本文件

#### 修改文件
- `d3/layout-g11.js` (+60 行)
  - 新增 `placeIconY` 函数
  - 支持左右箭头放置
  - 更新元数据输出
  
- `d3/templates.json` (+48 行)
  - 所有模板添加 `arrow_v_place` 字段
  - 新增 3 个预设模板
  
- `d4/svg.js` (+25 行)
  - `renderArrow` 支持 `direction` 参数
  - 左右箭头分别渲染
  
- `playground/run.js` (+3 行)
  - 输出箭头放置策略信息
  
- `package.json`
  - 新增 `test` 脚本
  
- `README.md`, `USAGE.md`
  - 添加新功能说明

### API 变更

#### 模板配置

新增两个可选字段：

```json
{
  "arrow_placement": "left" | "right",  // 默认 "right"
  "arrow_v_place": "middle" | "baseline-line1" | "baseline-line2" | "cap-middle" | "optical-bottom"  // 默认 "middle"
}
```

#### 布局输出元数据

新增字段：

```javascript
{
  meta: {
    // ... 原有字段
    arrow_placement: "right",
    arrow_v_place: "middle",
    arrow_y_h: 4.375,
    arrow_y_px: 43.75,
  }
}
```

#### SVG 渲染项

箭头项新增字段：

```javascript
{
  t: 'arrow',
  // ... 原有字段
  direction: 'left' | 'right',
}
```

### 向后兼容性

✅ **完全向后兼容**

- 不指定 `arrow_v_place` 时默认为 `middle`（与之前行为一致）
- 不指定 `arrow_placement` 时默认为 `right`（与之前行为一致）
- 原有的 `input.json` 和 `G1-1` 模板无需修改即可继续使用

### 使用示例

#### 基本用法

```bash
# 默认：右箭头 + 几何居中
npm run demo

# 测试所有策略
npm test
```

#### 自定义模板

```json
{
  "G1-1-custom": {
    "font_series": "E",
    "letter_height_h": 8,
    "arrow_placement": "left",
    "arrow_v_place": "optical-bottom",
    // ... 其他配置
  }
}
```

### 实现亮点

1. **纯函数设计** - `placeIconY` 无副作用，易于测试
2. **h 空间抽象** - 所有计算在 h 单位完成，像素转换统一
3. **分离关注点** - 布局逻辑与渲染完全解耦
4. **可扩展性** - 添加新策略只需在 switch 中新增 case

### 下一步

可能的扩展方向：

- [ ] 支持三行文字
- [ ] 支持多个图标
- [ ] 支持自定义图标锚点
- [ ] 支持上下箭头放置
- [ ] 添加单元测试框架

---

## v1.0.0 - 初始版本

### 功能

- D1: Box 与排版原语（h 空间）
- D2: 几何转换器（文字/图标测量）
- D3: G1-1 模板布局
- D4: SVG 渲染器
- 基础右箭头支持
- 单一垂直居中策略

