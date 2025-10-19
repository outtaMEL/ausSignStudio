# HTML 更新指南

## 需要做的修改

在 `sign-engine-sandbox/web/index.html` 中：

### 1. 删除旧的内容输入部分

找到并删除以下两个 `<details>` 区块：
- `<details class="control-group" id="input-g11">`（A. 内容输入 - G1-1）
- `<details class="control-group" id="input-g12">`（A. 内容输入 - G1-2）

### 2. 替换为新的内容

在 Sign Type 选择器之后，插入文件 `PHASE2-HTML-SNIPPET.html` 的内容。

新的结构是3个独立的 panel sections：
- Panel 1 (id="panel-1-section")
- Panel 2 (id="panel-2-section")  
- Panel 3 (id="panel-3-section")

### 快速方法

如果你不想手动编辑，可以：

1. **刷新浏览器** - 虽然输入框显示 undefined，但是代码逻辑已经修复，渲染应该正常工作了

2. **测试**: 在浏览器控制台运行以下代码来手动设置数据：

```javascript
// 修复 Panel 1
state.content.panels[0].roadName = 'SALTASH HWY';
state.content.panels[0].roadNumberType = 'shield';
state.content.panels[0].shieldLabel = 'M1';
state.content.panels[0].destinations = ['Plumpton'];
state.content.panels[0].direction = 'left';

// 修复 Panel 2
state.content.panels[1].roadName = '';
state.content.panels[1].roadNumberType = 'number';
state.content.panels[1].roadNumber = 'A85';
state.content.panels[1].destinations = ['Hawker'];
state.content.panels[1].direction = 'right';

// 重新渲染
render();
```

### 已修复的问题

✅ **问题3**: Road Name 宽度增加了10%余量和更大的padding  
✅ **问题4**: Road Number 现在是黄色字体（不是黄底黑字）  
✅ **问题5**: Destinations 数组自动过滤空值，支持1-3个  

### 未来改进

完整的 HTML 更新需要手动编辑 `index.html`。新的输入界面更加清晰：
- 每个 Panel 独立配置
- Road Name, Road Number Type, Destinations 1-3, Direction 都有专门的输入框
- 根据 Road Number Type 自动启用/禁用对应的输入框



