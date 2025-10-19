/**
 * D3: G1-2 模板布局策略（3 块面板堆叠）
 * 支持 dominant panel 检测和对齐
 */

import { layoutSinglePanel, applyAlignmentAndGenerateItems } from './layout-panel.js';
import { stackBoards } from '../d1/primitives.js';

/**
 * 执行 G1-2 布局（3 块面板）
 * @param {Object} params - {input, template, pxPerH, fontMetrics}
 * @returns {Object} 像素级模型
 */
export function layoutG12(params) {
  const { input, template, pxPerH, fontMetrics } = params;
  
  if (!input.panels || input.panels.length < 3) {
    throw new Error('G1-2 requires at least 3 panels');
  }
  
  // === 阶段 1: 布局所有 panels（未对齐）===
  const panelLayouts = [
    layoutSinglePanel(input.panels[0], template, fontMetrics),
    layoutSinglePanel(input.panels[1], template, fontMetrics),
    layoutSinglePanel(input.panels[2], template, fontMetrics),
  ];
  
  // === 阶段 2: 找出 dominant panel ===
  const widths = panelLayouts.map(p => p.board.w);
  const maxWidth = Math.max(...widths);
  const dominantIndex = widths.indexOf(maxWidth);
  
  // === 阶段 3: 应用对齐并生成 items ===
  const panelsWithItems = panelLayouts.map((layout, index) => {
    const isDominant = index === dominantIndex;
    const items = applyAlignmentAndGenerateItems(layout, maxWidth, isDominant, template);
    
    return {
      board: { w: maxWidth, h: layout.board.h },  // 使用统一宽度
      items: items,
    };
  });
  
  // === 阶段 4: 垂直堆叠 panels ===
  const panelSpacing_h = template.panel_spacing_h ?? 0.3;
  const stacked = stackBoards(panelsWithItems, panelSpacing_h, true);
  
  // === 阶段 5: 转换到像素空间 ===
  const boardPx = {
    w: stacked.board.w * pxPerH,
    h: stacked.board.h * pxPerH,
  };
  
  const itemsPx = stacked.items.map(item => {
    const itemPx = {
      ...item,
      x: item.x * pxPerH,
      y: item.y * pxPerH,
    };
    
    if (item.w !== undefined) itemPx.w = item.w * pxPerH;
    if (item.h !== undefined) itemPx.h = item.h * pxPerH;
    if (item.fontSize !== undefined) itemPx.fontSize = item.fontSize * pxPerH;
    
    return itemPx;
  });
  
  // === 阶段 6: 返回模型 ===
  return {
    board: boardPx,
    items: itemsPx,
    meta: {
      signType: 'G1-2',
      panelCount: 3,
      dominantPanelIndex: dominantIndex,
      panel_spacing_h: panelSpacing_h,
      panel_spacing_px: panelSpacing_h * pxPerH,
      letter_height_h: template.letter_height_h,
      letter_height_px: template.letter_height_h * pxPerH,
      line_spacing_h: template.line_spacing_h,
      line_spacing_px: template.line_spacing_h * pxPerH,
      group_spacing_h: template.group_spacing_h,
      group_spacing_px: template.group_spacing_h * pxPerH,
      board_pad_h: template.board_pad_h,
      board_pad_px: template.board_pad_h * pxPerH,
      board_w_h: stacked.board.w,
      board_h_h: stacked.board.h,
      board_w_px: boardPx.w,
      board_h_px: boardPx.h,
      pxPerH,
      ...stacked.meta,
    },
  };
}

