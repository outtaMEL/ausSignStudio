/**
 * SVG 渲染器和数值面板渲染器
 */

/**
 * 生成 SVG（包含叠加层）
 */
export function generateSVG(model, state) {
  const { board, items, meta } = model;
  const { overlays, template, engine } = state;
  
  let svg = `<svg width="${board.w}" height="${board.h}" xmlns="http://www.w3.org/2000/svg">`;
  
  // 背景和边框
  const cornerRadius = template.corner_radius_h * engine.pxPerH;
  const borderWidth = template.border_h * engine.pxPerH;
  
  svg += `\n  <!-- Board Background -->`;
  svg += `\n  <rect x="${borderWidth/2}" y="${borderWidth/2}" width="${board.w - borderWidth}" height="${board.h - borderWidth}" fill="#2d7a3e" stroke="#fff" stroke-width="${borderWidth}" rx="${cornerRadius}" />`;
  
  // 渲染内容项
  for (const item of items) {
    if (item.type === 'text') {
      svg += `\n  <!-- Text: ${item.text} -->`;
      svg += `\n  <text x="${item.x}" y="${item.y}" font-size="${item.fontSize}" font-family="Arial, sans-serif" fill="white" font-weight="bold">${escapeXml(item.text)}</text>`;
    } else if (item.type === 'roadName') {
      svg += renderRoadName(item, template);
    } else if (item.type === 'roadNumber') {
      svg += renderRoadNumber(item, template);
    } else if (item.type === 'arrow') {
      svg += renderArrow(item);
    } else if (item.type === 'shield') {
      svg += renderShield(item, meta);
    }
  }
  
  // 叠加层
  if (overlays.board) {
    svg += `\n  <!-- Overlay: Board -->`;
    svg += `\n  <rect x="0" y="0" width="${board.w}" height="${board.h}" fill="none" stroke="#ff00ff" stroke-width="1" stroke-dasharray="5,5" opacity="0.5" />`;
  }
  
  if (overlays.contentBbox && model._layout) {
    const pad = meta.board_pad_px;
    const cw = meta.content_w_px;
    const ch = meta.content_h_px;
    svg += `\n  <!-- Overlay: Content BBox -->`;
    svg += `\n  <rect x="${pad}" y="${pad}" width="${cw}" height="${ch}" fill="none" stroke="#00ffff" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />`;
  }
  
  if (overlays.boxes) {
    svg += `\n  <!-- Overlay: Element Boxes -->`;
    for (const item of items) {
      if (item._debug && item._debug.box) {
        const box = item._debug.box;
        svg += `\n  <rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="none" stroke="#ffff00" stroke-width="0.5" opacity="0.6" />`;
      }
    }
  }
  
  if (overlays.baselines) {
    svg += `\n  <!-- Overlay: Baselines -->`;
    for (const item of items) {
      if (item.type === 'text') {
        const x1 = item.x - 10;
        const x2 = item.x + item._debug.box.w + 10;
        svg += `\n  <line x1="${x1}" y1="${item.y}" x2="${x2}" y2="${item.y}" stroke="#ff4444" stroke-width="1" opacity="0.7" />`;
        svg += `\n  <circle cx="${item.x}" cy="${item.y}" r="2" fill="#ff4444" />`;
      }
    }
  }
  
  if (overlays.midline && model._layout) {
    const pad = meta.board_pad_px;
    const ch = meta.content_h_px;
    const midY = pad + ch / 2;
    svg += `\n  <!-- Overlay: Group Midline -->`;
    svg += `\n  <line x1="0" y1="${midY}" x2="${board.w}" y2="${midY}" stroke="#00ff00" stroke-width="1" stroke-dasharray="2,2" opacity="0.6" />`;
  }
  
  if (overlays.spacing) {
    svg += renderSpacingAnnotations(items, meta, board);
  }
  
  if (overlays.grid) {
    svg += renderGrid(board, engine.pxPerH);
  }
  
  svg += `\n</svg>`;
  
  return svg;
}

/**
 * 渲染 Road Name（白底黑字矩形）
 */
function renderRoadName(item, template) {
  const { x, y, w, h, text, fontSize } = item;
  const cornerRadius = (template.roadName_corner_radius_h || 0.3) * (fontSize / (template.roadName_letter_height_h || 6));
  
  let svg = `\n  <!-- Road Name: ${text} -->`;
  svg += `\n  <g>`;
  svg += `\n    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff" rx="${cornerRadius}" />`;
  
  // 文字居中
  const textX = x + w / 2;
  const textY = y + h / 2 + fontSize * 0.35;  // 垂直居中调整
  svg += `\n    <text x="${textX}" y="${textY}" font-size="${fontSize}" font-family="Arial, sans-serif" fill="#000000" font-weight="bold" text-anchor="middle">${escapeXml(text)}</text>`;
  svg += `\n  </g>`;
  
  return svg;
}

/**
 * 渲染 Road Number（黄色字体，无背景）
 */
function renderRoadNumber(item, template) {
  const { x, y, text, fontSize } = item;
  
  let svg = `\n  <!-- Road Number: ${text} -->`;
  // 黄色字体，直接显示在绿色背景上
  svg += `\n  <text x="${x}" y="${y}" font-size="${fontSize}" font-family="Arial, sans-serif" fill="#ffd700" font-weight="bold">${escapeXml(text)}</text>`;
  
  return svg;
}

/**
 * 渲染箭头
 */
function renderArrow(item) {
  const { x, y, w, h, direction = 'right' } = item;
  
  let arrow = `\n  <!-- Arrow: ${item.iconId} (${direction}) -->`;
  arrow += `\n  <g id="arrow">`;
  
  if (direction === 'forward') {
    // 向前箭头 ↑
    const bodyWidth = w * 0.3;
    const bodyHeight = h * 0.6;
    const bodyX = x + (w - bodyWidth) / 2;
    const bodyY = y + h * 0.4;
    
    const headWidth = w * 0.8;
    const headHeight = h * 0.4;
    
    const tipX = x + w / 2;
    const tipY = y;
    const leftX = x + (w - headWidth) / 2;
    const leftY = y + headHeight;
    const rightX = x + (w + headWidth) / 2;
    const rightY = y + headHeight;
    
    arrow += `\n    <polygon points="${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}" fill="white" />`;
    arrow += `\n    <rect x="${bodyX}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" fill="white" />`;
    
  } else if (direction === 'left') {
    const headWidth = w * 0.4;
    const headHeight = h * 0.8;
    const headY = y + (h - headHeight) / 2;
    
    const bodyWidth = w * 0.6;
    const bodyHeight = h * 0.3;
    const bodyX = x + headWidth;
    const bodyY = y + (h - bodyHeight) / 2;
    
    const tipX = x;
    const tipY = y + h / 2;
    const topX = x + headWidth;
    const topY = headY;
    const bottomX = x + headWidth;
    const bottomY = headY + headHeight;
    
    arrow += `\n    <polygon points="${tipX},${tipY} ${topX},${topY} ${bottomX},${bottomY}" fill="white" />`;
    arrow += `\n    <rect x="${bodyX}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" fill="white" />`;
    
  } else {
    const bodyWidth = w * 0.6;
    const bodyHeight = h * 0.3;
    const bodyY = y + (h - bodyHeight) / 2;
    
    const headWidth = w * 0.4;
    const headHeight = h * 0.8;
    const headY = y + (h - headHeight) / 2;
    const headX = x + bodyWidth;
    
    arrow += `\n    <rect x="${x}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" fill="white" />`;
    
    const tipX = headX + headWidth;
    const tipY = y + h / 2;
    const topX = headX;
    const topY = headY;
    const bottomX = headX;
    const bottomY = headY + headHeight;
    
    arrow += `\n    <polygon points="${tipX},${tipY} ${topX},${topY} ${bottomX},${bottomY}" fill="white" />`;
  }
  
  arrow += `\n  </g>`;
  
  return arrow;
}

/**
 * 渲染盾形
 */
function renderShield(item, meta) {
  const { x, y, w, h, label } = item;
  
  let shield = `\n  <!-- Shield: ${item.iconId} -->`;
  shield += `\n  <g id="shield">`;
  
  // 简单的盾形形状
  const path = `M ${x + w/2},${y} L ${x + w},${y + h*0.3} L ${x + w},${y + h*0.7} L ${x + w/2},${y + h} L ${x},${y + h*0.7} L ${x},${y + h*0.3} Z`;
  
  shield += `\n    <path d="${path}" fill="white" stroke="#2d7a3e" stroke-width="2" />`;
  
  if (label) {
    const fontSize = meta.letter_height_px * 0.6;
    shield += `\n    <text x="${x + w/2}" y="${y + h/2 + fontSize * 0.35}" text-anchor="middle" font-size="${fontSize}" font-family="Arial, sans-serif" fill="#2d7a3e" font-weight="bold">${escapeXml(label)}</text>`;
  }
  
  shield += `\n  </g>`;
  
  return shield;
}

/**
 * 渲染工程图纸风格的尺寸标注
 */
function renderSpacingAnnotations(items, meta, board) {
  let svg = `\n  <!-- Overlay: Engineering-style Dimension Annotations -->`;
  
  const pad = meta.board_pad_px;
  const offset = 25; // 标注线距离元素的距离
  
  // === 垂直标注（右侧）===
  const textItems = items.filter(i => i.type === 'text');
  
  if (textItems.length >= 2 && textItems[0]._debug && textItems[1]._debug) {
    const box1 = textItems[0]._debug.box;
    const box2 = textItems[1]._debug.box;
    const rightEdge = Math.max(box1.x + box1.w, box2.x + box2.w);
    const dimX = rightEdge + offset;
    
    // 1. 第一行高度
    svg += drawDimension(dimX, box1.y, dimX, box1.y + box1.h, 
      `${meta.letter_height_h.toFixed(1)}h`, 'right', '#4a9eff');
    
    // 2. 行间距
    const y1Bottom = box1.y + box1.h;
    const y2Top = box2.y;
    svg += drawDimension(dimX + 15, y1Bottom, dimX + 15, y2Top, 
      `${meta.line_spacing_h.toFixed(2)}h`, 'right', '#ffa726');
    
    // 3. 第二行高度
    svg += drawDimension(dimX, box2.y, dimX, box2.y + box2.h, 
      `${meta.letter_height_h.toFixed(1)}h`, 'right', '#4a9eff');
    
    // 4. 总文字组高度
    svg += drawDimension(dimX + 30, box1.y, dimX + 30, box2.y + box2.h, 
      `${meta.text_group_h_h.toFixed(2)}h`, 'right', '#66bb6a');
  }
  
  // === 水平标注（顶部）===
  if (textItems.length > 0) {
    const dimY = pad - offset;
    let currentX = pad;
    
    // 找出所有元素（包括盾形、文字、箭头）
    const allItems = items.filter(i => i._debug);
    
    if (allItems.length > 0) {
      // 板边距（左）
      svg += drawDimension(0, dimY - 15, pad, dimY - 15, 
        `${meta.board_pad_h.toFixed(1)}h`, 'top', '#9c27b0');
      
      // 各元素宽度
      allItems.forEach((item, idx) => {
        const box = item._debug.box;
        svg += drawDimension(box.x, dimY, box.x + box.w, dimY, 
          `${(box.w / meta.pxPerH).toFixed(1)}h`, 'top', '#4a9eff');
        
        // 元素间距
        if (idx < allItems.length - 1) {
          const nextBox = allItems[idx + 1]._debug.box;
          const gapStart = box.x + box.w;
          const gapEnd = nextBox.x;
          if (gapEnd > gapStart) {
            svg += drawDimension(gapStart, dimY - 15, gapEnd, dimY - 15, 
              `${meta.group_spacing_h.toFixed(1)}h`, 'top', '#ffa726');
          }
        }
      });
      
      // 板边距（右）
      const lastBox = allItems[allItems.length - 1]._debug.box;
      svg += drawDimension(lastBox.x + lastBox.w, dimY - 15, board.w, dimY - 15, 
        `${meta.board_pad_h.toFixed(1)}h`, 'top', '#9c27b0');
    }
  }
  
  // === 垂直标注（左侧）- 板面总尺寸 ===
  const dimX = -offset;
  svg += drawDimension(dimX, 0, dimX, board.h, 
    `${meta.board_h_h.toFixed(2)}h`, 'left', '#e91e63');
  
  // === 水平标注（底部）- 板面总尺寸 ===
  const dimY = board.h + offset;
  svg += drawDimension(0, dimY, board.w, dimY, 
    `${meta.board_w_h.toFixed(2)}h`, 'bottom', '#e91e63');
  
  return svg;
}

/**
 * 绘制单个尺寸标注
 * @param {number} x1 - 起点 X
 * @param {number} y1 - 起点 Y
 * @param {number} x2 - 终点 X
 * @param {number} y2 - 终点 Y
 * @param {string} label - 标注文字
 * @param {string} side - 标注位置 (top/bottom/left/right)
 * @param {string} color - 颜色
 */
function drawDimension(x1, y1, x2, y2, label, side, color) {
  let svg = '';
  const isHorizontal = Math.abs(y2 - y1) < 1;
  const isVertical = Math.abs(x2 - x1) < 1;
  
  // 主线
  svg += `\n  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" opacity="0.8" />`;
  
  // 端点标记（短线）
  const tickSize = 4;
  if (isHorizontal) {
    // 水平标注 - 垂直端点线
    svg += `\n  <line x1="${x1}" y1="${y1-tickSize}" x2="${x1}" y2="${y1+tickSize}" stroke="${color}" stroke-width="1" />`;
    svg += `\n  <line x1="${x2}" y1="${y2-tickSize}" x2="${x2}" y2="${y2+tickSize}" stroke="${color}" stroke-width="1" />`;
  } else if (isVertical) {
    // 垂直标注 - 水平端点线
    svg += `\n  <line x1="${x1-tickSize}" y1="${y1}" x2="${x1+tickSize}" y2="${y1}" stroke="${color}" stroke-width="1" />`;
    svg += `\n  <line x1="${x2-tickSize}" y1="${y2}" x2="${x2+tickSize}" y2="${y2}" stroke="${color}" stroke-width="1" />`;
  }
  
  // 标注文字
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  let textX = midX;
  let textY = midY;
  let textAnchor = 'middle';
  let dy = '0.3em';
  
  if (side === 'top') {
    textY = y1 - 6;
  } else if (side === 'bottom') {
    textY = y1 + 12;
  } else if (side === 'left') {
    textX = x1 - 6;
    textAnchor = 'end';
    dy = '0.3em';
  } else if (side === 'right') {
    textX = x1 + 6;
    textAnchor = 'start';
    dy = '0.3em';
  }
  
  // 背景白色矩形（提高可读性）
  const labelWidth = label.length * 7;
  const labelHeight = 14;
  svg += `\n  <rect x="${textX - labelWidth/2}" y="${textY - labelHeight/2}" width="${labelWidth}" height="${labelHeight}" fill="white" opacity="0.8" />`;
  
  // 文字
  svg += `\n  <text x="${textX}" y="${textY}" text-anchor="${textAnchor}" dy="${dy}" font-size="10" fill="${color}" font-family="monospace" font-weight="bold">${escapeXml(label)}</text>`;
  
  return svg;
}

/**
 * 渲染像素网格
 */
function renderGrid(board, pxPerH) {
  let svg = `\n  <!-- Overlay: Pixel Grid -->`;
  const step = pxPerH;
  
  // 垂直线
  for (let x = 0; x <= board.w; x += step) {
    svg += `\n  <line x1="${x}" y1="0" x2="${x}" y2="${board.h}" stroke="#333" stroke-width="0.5" opacity="0.3" />`;
  }
  
  // 水平线
  for (let y = 0; y <= board.h; y += step) {
    svg += `\n  <line x1="0" y1="${y}" x2="${board.w}" y2="${y}" stroke="#333" stroke-width="0.5" opacity="0.3" />`;
  }
  
  return svg;
}

/**
 * 渲染数值面板
 */
export function renderMetrics(model) {
  const { meta } = model;
  
  let html = '';
  
  // 板面
  html += `<div class="metrics-section">`;
  html += `<h4>板面 (Board)</h4>`;
  html += `<table class="metrics-table">`;
  html += `<tr><td>宽度</td><td>${fmt(meta.board_w_h)} h</td><td>${fmt(meta.board_w_px)} px</td></tr>`;
  html += `<tr><td>高度</td><td>${fmt(meta.board_h_h)} h</td><td>${fmt(meta.board_h_px)} px</td></tr>`;
  html += `<tr><td>边距</td><td>${fmt(meta.board_pad_h)} h</td><td>${fmt(meta.board_pad_px)} px</td></tr>`;
  html += `</table>`;
  html += `</div>`;
  
  // 文字行
  if (meta.line1 && meta.line2) {
    html += `<div class="metrics-section">`;
    html += `<h4>文字行 (Text Lines)</h4>`;
    html += `<table class="metrics-table">`;
    html += `<tr><td colspan="3"><strong>第 1 行: ${meta.line1.text}</strong></td></tr>`;
    html += `<tr><td>宽度</td><td>${fmt(meta.line1.w_h)} h</td><td>${fmt(meta.line1.w_px)} px</td></tr>`;
    html += `<tr><td>高度</td><td>${fmt(meta.line1.h_h)} h</td><td>${fmt(meta.line1.h_px)} px</td></tr>`;
    html += `<tr><td>Ascent</td><td>${fmt(meta.line1.ascent_h)} h</td><td>—</td></tr>`;
    html += `<tr><td>Descent</td><td>${fmt(meta.line1.descent_h)} h</td><td>—</td></tr>`;
    html += `<tr><td>基线 Y</td><td>—</td><td>${fmt(meta.line1.baseline_px)} px${checkSnap(meta.line1.baseline_px)}</td></tr>`;
    
    html += `<tr><td colspan="3"><strong>第 2 行: ${meta.line2.text}</strong></td></tr>`;
    html += `<tr><td>宽度</td><td>${fmt(meta.line2.w_h)} h</td><td>${fmt(meta.line2.w_px)} px</td></tr>`;
    html += `<tr><td>高度</td><td>${fmt(meta.line2.h_h)} h</td><td>${fmt(meta.line2.h_px)} px</td></tr>`;
    html += `<tr><td>Ascent</td><td>${fmt(meta.line2.ascent_h)} h</td><td>—</td></tr>`;
    html += `<tr><td>Descent</td><td>${fmt(meta.line2.descent_h)} h</td><td>—</td></tr>`;
    html += `<tr><td>基线 Y</td><td>—</td><td>${fmt(meta.line2.baseline_px)} px${checkSnap(meta.line2.baseline_px)}</td></tr>`;
    html += `</table>`;
    html += `</div>`;
  }
  
  // 文字组
  html += `<div class="metrics-section">`;
  html += `<h4>文字组 (Text Group)</h4>`;
  html += `<table class="metrics-table">`;
  html += `<tr><td>宽度</td><td>${fmt(meta.text_group_w_h)} h</td><td>${fmt(meta.text_group_w_px)} px</td></tr>`;
  html += `<tr><td>高度</td><td>${fmt(meta.text_group_h_h)} h</td><td>${fmt(meta.text_group_h_px)} px</td></tr>`;
  html += `</table>`;
  html += `</div>`;
  
  // 图标
  if (meta.shield || meta.arrow) {
    html += `<div class="metrics-section">`;
    html += `<h4>图标 (Icons)</h4>`;
    html += `<table class="metrics-table">`;
    
    if (meta.shield) {
      html += `<tr><td colspan="3"><strong>盾形 (Shield)</strong></td></tr>`;
      html += `<tr><td>宽度</td><td>${fmt(meta.shield.w_h)} h</td><td>${fmt(meta.shield.w_px)} px</td></tr>`;
      html += `<tr><td>高度</td><td>${fmt(meta.shield.h_h)} h</td><td>${fmt(meta.shield.h_px)} px</td></tr>`;
    }
    
    if (meta.arrow) {
      html += `<tr><td colspan="3"><strong>箭头 (Arrow)</strong></td></tr>`;
      html += `<tr><td>宽度</td><td>${fmt(meta.arrow.w_h)} h</td><td>${fmt(meta.arrow.w_px)} px</td></tr>`;
      html += `<tr><td>高度</td><td>${fmt(meta.arrow.h_h)} h</td><td>${fmt(meta.arrow.h_px)} px</td></tr>`;
    }
    
    html += `</table>`;
    html += `</div>`;
  }
  
  // 间距
  html += `<div class="metrics-section">`;
  html += `<h4>关键间距 (Spacing)</h4>`;
  html += `<table class="metrics-table">`;
  html += `<tr><td>行间距</td><td>${fmt(meta.line_spacing_h)} h</td><td>${fmt(meta.line_spacing_px)} px</td></tr>`;
  html += `<tr><td>组间距</td><td>${fmt(meta.group_spacing_h)} h</td><td>${fmt(meta.group_spacing_px)} px</td></tr>`;
  html += `</table>`;
  html += `</div>`;
  
  // 引擎参数
  html += `<div class="metrics-section">`;
  html += `<h4>引擎参数 (Engine)</h4>`;
  html += `<table class="metrics-table">`;
  html += `<tr><td>px/h 比例</td><td colspan="2">${meta.pxPerH}</td></tr>`;
  html += `<tr><td>对齐模式</td><td colspan="2">${meta.snapMode}</td></tr>`;
  html += `</table>`;
  html += `</div>`;
  
  return html;
}

// 工具函数
function fmt(n) {
  return typeof n === 'number' ? n.toFixed(2) : n;
}

function checkSnap(px) {
  const isInteger = px === Math.floor(px);
  const isHalf = (px * 2) === Math.floor(px * 2);
  
  if (!isInteger && !isHalf) {
    return ` <span class="metric-warn">⚠</span>`;
  }
  return '';
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

