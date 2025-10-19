# 快速参考

## 命令速查

```bash
# 生成单个 SVG（使用 input.json）
npm run demo

# 测试所有箭头放置策略（生成 4 个 SVG）
npm test
```

## 箭头放置策略速查

### 垂直对齐（`arrow_v_place`）

| 策略 | 说明 | 箭头 Y (测试结果) | 适用场景 |
|------|------|------------------|---------|
| `middle` | 几何居中 | 4.38h | 通用，默认 |
| `baseline-line1` | 对齐第一行基线 | - | 强调目的地 |
| `baseline-line2` | 对齐第二行基线 | 11.15h | 强调距离 |
| `cap-middle` | Cap 高度中线 | - | 视觉实体部分 |
| `optical-bottom` | 光学下沉 | 5.21h (+0.83h) | 视觉平衡 |

### 水平位置（`arrow_placement`）

| 值 | 说明 | 文字 X | 箭头 X |
|----|------|-------|--------|
| `right` | 右箭头（默认） | 10px | 452px |
| `left` | 左箭头 | 120px | 10px |

## 模板速查

| 模板 | 箭头位置 | 垂直策略 |
|------|---------|---------|
| `G1-1` | right | middle |
| `G1-1-left` | left | middle |
| `G1-1-baseline2` | right | baseline-line2 |
| `G1-1-optical` | right | optical-bottom |

## 测试用例

```bash
# 快速切换测试
cp input-left.json input.json && npm run demo       # 左箭头
cp input-baseline2.json input.json && npm run demo  # 基线对齐
cp input-optical.json input.json && npm run demo    # 光学下沉
```

## 配置示例

### 最简配置
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

### 自定义箭头放置
```json
{
  "G1-1-custom": {
    "arrow_placement": "left",        // ← 左箭头
    "arrow_v_place": "optical-bottom" // ← 光学下沉
  }
}
```

## 验收要点

打开生成的 SVG，检查：

- ✅ **文字对齐**：两行垂直排列，行距 0.75h
- ✅ **箭头位置**：left 版本箭头在左，文字在右
- ✅ **垂直策略**：baseline2 版本箭头明显下移
- ✅ **边距**：板面四周 1.0h 边距
- ✅ **像素对齐**：边缘清晰不模糊

## 核心函数

### `placeIconY(iconBox, textGroup, vPlace, opts)`

计算箭头垂直位置（h 单位）。

**参数**：
- `iconBox` - 箭头盒子
- `textGroup` - 文字组（含 children）
- `vPlace` - 垂直策略字符串
- `opts` - 可选参数（ascent, opticalK 等）

**返回**：箭头 Y 坐标（h 单位）

## 文档索引

- [完整使用指南](./USAGE.md)
- [箭头放置详细文档](./ARROW_PLACEMENT.md)
- [更新日志](./CHANGELOG.md)
- [项目说明](./README.md)

## 故障排查

### 箭头未按预期对齐

检查：
1. 模板中的 `arrow_v_place` 拼写
2. `opts` 参数是否正确传递（如 `line2_ascent_h`）
3. 运行 `npm test` 查看元数据对比

### 左箭头位置错误

检查：
1. 模板中的 `arrow_placement` 是否为 `"left"`
2. SVG 中文字 x 坐标是否 > 箭头 x 坐标
3. 箭头三角形尖端是否指向左（polygon 第一个点 x 最小）

### 生成的 SVG 模糊

检查：
1. `pxPerH` 是否为合理值（推荐 10-20）
2. `snapToPixel` 是否启用（默认启用）
3. 浏览器缩放是否为 100%

## 关键数据

- **字母高度**：8h = 80px (pxPerH=10)
- **行间距**：0.75h = 7.5px
- **组间距**：1.0h = 10px
- **板边距**：1.0h = 10px
- **文字组高度**：16.75h = 167.5px
- **箭头宽高**：11h × 8h = 110px × 80px

## 扩展建议

添加新的垂直策略：

```javascript
// 在 placeIconY 中添加
case 'custom-strategy':
  // 自定义计算逻辑
  return calculatedY;
```

然后在模板中使用：

```json
{
  "arrow_v_place": "custom-strategy"
}
```

---

💡 **提示**：运行 `npm test` 可一次生成所有策略的对比 SVG，直观观察差异！

