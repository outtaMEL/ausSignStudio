/**
 * D3: 单个 Panel 的布局逻辑 V2
 * 支持完整的对齐系统
 */

import { toBoxText, toBoxIcon, toBoxRoadName, toBoxRoadNumber } from '../d2/converter.js';
import { stackV, boardSize } from '../d1/primitives.js';
import { cloneBox } from '../d1/box.js';

/**
 * 获取箭头图标 ID（根据方向）
 */
function getArrowIconId(direction) {
  switch (direction) {
    case 'forward':
      return 'arrow-forward-std';
    case 'left':
      return 'arrow-left-std';
    case 'right':
      return 'arrow-right-std';
    default:
      return 'arrow-right-std';
  }
}

/**
 * 布局单个 Panel (返回 h 单位的布局，稍后统一对齐)
 * @param {Object} panelInput - 单个 panel 的输入数据
 * @param {Object} template - 模板参数
 * @param {Object} fontMetrics - 字体参数
 * @returns {Object} { board: {w, h}, rows: [...], items: [...] }
 */
export function layoutSinglePanel(panelInput, template, fontMetrics) {
  const {
    roadName,
    roadNumberType,
    roadNumber,
    shieldLabel,
    destinations,
    direction,
  } = panelInput;
  
  const {
    font_series,
    letter_height_h,
    line_spacing_h,
    group_spacing_h,
    board_pad_h,
    roadName_letter_height_h,
    roadName_pad_h,
    roadNumber_letter_height_h,
  } = template;
  
  // === 1. 创建所有元素 ===
  
  const rows = [];  // 存储所有行的信息
  
  // 1.1 Road Name Row（如果存在）
  let roadNameBox = null;
  if (roadName && roadName.trim() !== '') {
    roadNameBox = toBoxRoadName(roadName, {
      letter_h: roadName_letter_height_h,
      pad_h: roadName_pad_h,
      fontMetrics: fontMetrics,
    });
    
    rows.push({
      type: 'roadName',
      elements: [{ type: 'roadName', box: roadNameBox, data: { text: roadName } }],
      totalWidth: roadNameBox.w,
      height: roadNameBox.h,
      align: 'center',  // Road Name 总是居中
    });
  }
  
  // 1.2 Destinations（1-3个，垂直堆叠为一个组）
  const validDestinations = destinations.filter(d => d && d.trim() !== '');
  
  if (validDestinations.length === 0) {
    throw new Error('At least one destination is required');
  }
  
  const destBoxes = validDestinations.map(dest => 
    toBoxText(dest, {
      fontSeries: font_series,
      letter_h: letter_height_h,
      fontMetrics: fontMetrics,
    })
  );
  
  // 垂直堆叠 destinations
  const destGroup = stackV(destBoxes, line_spacing_h);
  destGroup.children.forEach((child, i) => {
    child.text = validDestinations[i];
    child.ascent_h = destBoxes[i].ascent_h;
  });
  
  // 1.3 Road Number 或 Shield
  let roadNumBox = null;
  let roadNumType = null;
  
  if (roadNumberType === 'number' && roadNumber && roadNumber.trim() !== '') {
    roadNumBox = toBoxRoadNumber(roadNumber, {
      letter_h: roadNumber_letter_height_h,
      fontMetrics: fontMetrics,
    });
    roadNumType = 'roadNumber';
  } else if (roadNumberType === 'shield' && shieldLabel && shieldLabel.trim() !== '') {
    roadNumBox = toBoxIcon('shield-route', {
      line_h: letter_height_h,
      label: shieldLabel,
      fontMetrics: fontMetrics,
    });
    roadNumType = 'shield';
  }
  
  // 1.4 箭头
  const arrowIconId = getArrowIconId(direction);
  const arrowBox = toBoxIcon(arrowIconId, {
    line_h: letter_height_h,
  });
  
  // === 2. 构建主行（根据方向排列）===
  
  const mainRowElements = [];
  
  if (direction === 'forward' || direction === 'left') {
    // 向前/向左：箭头 - RoadNumber - Destinations
    mainRowElements.push({ 
      type: 'arrow', 
      box: cloneBox(arrowBox), 
      data: { iconId: arrowIconId, direction } 
    });
    
    if (roadNumBox) {
      mainRowElements.push({ 
        type: roadNumType, 
        box: cloneBox(roadNumBox),
        data: roadNumType === 'shield' 
          ? { shieldLabel: shieldLabel }
          : { text: roadNumber, ascent_h: roadNumBox.ascent_h }
      });
    }
    
    mainRowElements.push({ 
      type: 'destinations', 
      box: destGroup, 
      data: destGroup 
    });
  } else {
    // 向右：Destinations - RoadNumber - 箭头
    mainRowElements.push({ 
      type: 'destinations', 
      box: destGroup, 
      data: destGroup 
    });
    
    if (roadNumBox) {
      mainRowElements.push({ 
        type: roadNumType, 
        box: cloneBox(roadNumBox),
        data: roadNumType === 'shield' 
          ? { shieldLabel: shieldLabel }
          : { text: roadNumber, ascent_h: roadNumBox.ascent_h }
      });
    }
    
    mainRowElements.push({ 
      type: 'arrow', 
      box: cloneBox(arrowBox), 
      data: { iconId: arrowIconId, direction } 
    });
  }
  
  // 计算主行宽度
  let mainRowWidth = 0;
  for (let i = 0; i < mainRowElements.length; i++) {
    mainRowWidth += mainRowElements[i].box.w;
    if (i < mainRowElements.length - 1) {
      mainRowWidth += group_spacing_h;
    }
  }
  
  const mainRowHeight = Math.max(...mainRowElements.map(el => el.box.h));
  
  // 默认对齐方式
  let defaultAlign = 'center';
  if (direction === 'left') defaultAlign = 'left';
  if (direction === 'right') defaultAlign = 'right';
  
  rows.push({
    type: 'main',
    elements: mainRowElements,
    totalWidth: mainRowWidth,
    height: mainRowHeight,
    align: defaultAlign,
  });
  
  // === 3. 计算 panel 内容尺寸 ===
  
  // 找出最大宽度（用于居中 road name 和 destinations）
  const maxRowWidth = Math.max(...rows.map(r => r.totalWidth));
  
  // 垂直堆叠所有 rows
  let currentY_h = 0;
  const positionedRows = [];
  
  for (const row of rows) {
    positionedRows.push({
      ...row,
      y: currentY_h,
    });
    
    currentY_h += row.height;
    if (positionedRows.length < rows.length) {
      currentY_h += line_spacing_h;
    }
  }
  
  const contentH = currentY_h;
  
  // === 4. 添加边距，计算 panel board 尺寸 ===
  
  const panelBoard = boardSize(maxRowWidth, contentH, board_pad_h);
  
  // === 5. 返回未对齐的布局（稍后在 stackBoards 后统一对齐）===
  
  return {
    board: panelBoard,
    rows: positionedRows,
    maxRowWidth: maxRowWidth,
    direction: direction,
    // 暂不生成 items，等对齐完成后再生成
  };
}

/**
 * 应用对齐并生成 items
 * @param {Object} panelLayout - layoutSinglePanel 的输出
 * @param {number} boardWidth_h - 最终的 board 宽度（由 dominant panel 决定）
 * @param {boolean} isDominant - 是否是 dominant panel
 * @param {Object} template - 模板参数
 * @returns {Array} items 数组（h 单位）
 */
export function applyAlignmentAndGenerateItems(panelLayout, boardWidth_h, isDominant, template) {
  const {
    rows,
    maxRowWidth,
    direction,
  } = panelLayout;
  
  const {
    font_series,
    letter_height_h,
    line_spacing_h,
    group_spacing_h,
    board_pad_h,
    roadName_letter_height_h,
    roadNumber_letter_height_h,
  } = template;
  
  const items = [];
  
  // 内容区域的宽度（board 减去 padding）
  const contentAreaWidth_h = boardWidth_h - 2 * board_pad_h;
  
  for (const row of rows) {
    const { elements, totalWidth, height, align, y } = row;
    
    // === 计算行的水平起始位置 ===
    let rowStartX_h = 0;
    
    if (isDominant || align === 'left') {
      // Dominant panel 或左对齐：从左边开始
      rowStartX_h = 0;
    } else if (align === 'right') {
      // 右对齐：从右边开始
      rowStartX_h = contentAreaWidth_h - totalWidth;
    } else if (align === 'center') {
      // 居中对齐
      rowStartX_h = (contentAreaWidth_h - totalWidth) / 2;
    }
    
    // === 水平排列元素 ===
    let currentX_h = rowStartX_h;
    
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const offsetX = board_pad_h + currentX_h;
      const offsetY = board_pad_h + y;
      
      // 垂直居中
      const elY = offsetY + (height - el.box.h) / 2;
      
      // 生成 item
      if (el.type === 'roadName') {
        items.push({
          t: 'roadName',
          x: offsetX,
          y: offsetY,
          w: el.box.w,
          h: el.box.h,
          text: el.data.text,
          fontSize: roadName_letter_height_h,
          fontSeries: font_series,
          ascent_h: el.box.ascent_h,
        });
      } else if (el.type === 'destinations') {
        // Destinations 组
        for (const child of el.box.children) {
          items.push({
            t: 'text',
            x: offsetX + child.x,
            y: elY + child.y + child.ascent_h,
            text: child.text,
            fontSize: letter_height_h,
            fontSeries: font_series,
            ascent_h: child.ascent_h,
          });
        }
      } else if (el.type === 'arrow') {
        items.push({
          t: 'arrow',
          x: offsetX,
          y: elY,
          w: el.box.w,
          h: el.box.h,
          iconId: el.data.iconId,
          direction: el.data.direction,
        });
      } else if (el.type === 'shield') {
        items.push({
          t: 'shield',
          x: offsetX,
          y: elY,
          w: el.box.w,
          h: el.box.h,
          iconId: 'shield-route',
          label: el.data.shieldLabel,
        });
      } else if (el.type === 'roadNumber') {
        items.push({
          t: 'roadNumber',
          x: offsetX,
          y: elY + el.data.ascent_h,
          text: el.data.text,
          fontSize: roadNumber_letter_height_h,
          fontSeries: font_series,
          ascent_h: el.data.ascent_h,
        });
      }
      
      currentX_h += el.box.w;
      if (i < elements.length - 1) {
        currentX_h += group_spacing_h;
      }
    }
  }
  
  return items;
}


