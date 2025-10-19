# Sign Engine Sandbox

D1–D4 最小闭环：h 空间排版引擎 + SVG 渲染器

## 快速开始

### 命令行模式

```bash
# 生成单个 SVG
npm run demo

# 测试所有箭头放置策略
npm test
```

### 🌐 Web 交互模式（推荐）

```bash
# 启动 Web 调参界面
npm run web

# 浏览器访问
http://localhost:3000
```

**Web 模式特性**：
- ✨ 实时调整所有 D1-D4 参数
- 📊 数值面板显示 h 与 px 的转换
- 🔍 证据叠加层（基线、盒框、网格等）
- 💾 导出/导入配置 JSON
- 📥 下载 SVG 文件

详见：[Web Playground 文档](./web/README.md)

## ✨ 新功能

### 灵活的箭头放置策略

支持 **5 种垂直对齐** + **左右位置**：

- **垂直对齐**：
  - `middle` - 几何居中（默认）
  - `baseline-line1` - 对齐第一行基线
  - `baseline-line2` - 对齐第二行基线
  - `cap-middle` - Cap 高度中线
  - `optical-bottom` - 光学下沉（视觉补偿）

- **水平位置**：
  - `right` - 右箭头（默认）
  - `left` - 左箭头

详见：[箭头放置策略文档](./ARROW_PLACEMENT.md)

## 验收方法

### 方式 A：直接打开 SVG
```bash
# 运行后直接双击或用浏览器打开
out.svg
```

### 方式 B：使用预览页面
```bash
# 用浏览器打开
playground/view.html
```

## 架构

- **D1** (`d1/`): Box 定义与排版原语（h 单位）
- **D2** (`d2/`): 几何转换器（文字/图标测量）
- **D3** (`d3/`): G1-1 模板布局策略
- **D4** (`d4/`): SVG 渲染器

## 预期结果

- 两行文字 "Mary Hill" / "12" 垂直排列
- 右侧箭头与文字组保持指定间距
- 箭头垂直居中
- 板面四周留出边距
- 改变 `pxPerH` 时布局保持一致

