/**
 * D4: SVG 渲染器
 * 将布局模型渲染为 SVG 字符串
 */

/**
 * 生成 SVG 字符串
 * @param {Object} model - layoutG11 的输出模型
 * @returns {string} SVG 标记
 */
export function toSVG(model) {
  const { board, items } = model;
  
  // SVG 头部
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${board.w}" height="${board.h}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect x="0" y="0" width="${board.w}" height="${board.h}" fill="#2d7a3e" rx="4" />
  
`;

  // 渲染每个元素
  for (const item of items) {
    if (item.t === 'text') {
      svg += `  <!-- Text: ${item.text} -->
  <text x="${item.x}" y="${item.y}" font-size="${item.fontSize}" font-family="Arial, sans-serif" fill="white" font-weight="bold">${escapeXml(item.text)}</text>
  
`;
    } else if (item.t === 'arrow') {
      // 渲染简单的右箭头
      svg += `  <!-- Arrow: ${item.iconId} -->
`;
      svg += renderArrow(item);
    }
  }

  // SVG 尾部
  svg += `</svg>`;
  
  return svg;
}

/**
 * 渲染箭头图标
 */
function renderArrow(item) {
  const { x, y, w, h, direction = 'right' } = item;
  
  let arrow = `  <g id="arrow">\n`;
  
  if (direction === 'left') {
    // 左箭头：三角形在左，矩形在右
    const headWidth = w * 0.4;
    const headHeight = h * 0.8;
    const headY = y + (h - headHeight) / 2;
    
    const bodyWidth = w * 0.6;
    const bodyHeight = h * 0.3;
    const bodyX = x + headWidth;
    const bodyY = y + (h - bodyHeight) / 2;
    
    // 箭头三角形（指向左）
    const tipX = x;
    const tipY = y + h / 2;
    const topX = x + headWidth;
    const topY = headY;
    const bottomX = x + headWidth;
    const bottomY = headY + headHeight;
    
    arrow += `    <polygon points="${tipX},${tipY} ${topX},${topY} ${bottomX},${bottomY}" fill="white" />\n`;
    
    // 箭身（矩形）
    arrow += `    <rect x="${bodyX}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" fill="white" />\n`;
    
  } else {
    // 右箭头：矩形在左，三角形在右
    const bodyWidth = w * 0.6;
    const bodyHeight = h * 0.3;
    const bodyY = y + (h - bodyHeight) / 2;
    
    const headWidth = w * 0.4;
    const headHeight = h * 0.8;
    const headY = y + (h - headHeight) / 2;
    const headX = x + bodyWidth;
    
    // 箭身（矩形）
    arrow += `    <rect x="${x}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" fill="white" />\n`;
    
    // 箭头三角形（指向右）
    const tipX = headX + headWidth;
    const tipY = y + h / 2;
    const topX = headX;
    const topY = headY;
    const bottomX = headX;
    const bottomY = headY + headHeight;
    
    arrow += `    <polygon points="${tipX},${tipY} ${topX},${topY} ${bottomX},${bottomY}" fill="white" />\n`;
  }
  
  arrow += `  </g>\n`;
  
  return arrow;
}

/**
 * 转义 XML 特殊字符
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

