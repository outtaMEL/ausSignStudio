/**
 * 布局引擎适配器
 * 将 UI 参数转换为 D1-D4 可用的格式并执行布局
 */

import { Box, cloneBox } from '../d1/box.js';
import { stackV, stackH, snapToPixel } from '../d1/primitives.js';
import { layoutG11 } from '../d3/layout-g11.js';
import { layoutG12 } from '../d3/layout-g12.js';

/**
 * 计算完整布局
 * @param {Object} state - UI 状态
 * @returns {Object} 布局模型
 */
export function computeLayout(state) {
  const {
    content,
    template,
    fonts,
    icons,
    engine,
  } = state;
  
  // 1. 识别 sign type
  const signType = state.signType || 'G1-1';
  
  // 2. 准备动态参数
  const fontMetrics = {
    avgCharWidthRatio: fonts.avgCharWidthRatio,
    ascentRatio: fonts.ascentRatio,
    descentRatio: fonts.descentRatio,
  };
  
  const iconConfig = {
    arrow: icons.arrow,
    shield: icons.shield,
  };
  
  // 3. 准备输入数据（根据 sign type 不同）
  let inputData;
  if (signType === 'G1-1') {
    // G1-1: 使用前 2 个 panels
    inputData = {
      panels: content.panels.slice(0, 2),
    };
  } else if (signType === 'G1-2') {
    // G1-2: 使用前 3 个 panels
    inputData = {
      panels: content.panels.slice(0, 3),
    };
  }
  
  // 4. 准备模板参数
  const templateParams = {
    font_series: fonts.series,
    letter_height_h: template.letter_height_h,
    line_spacing_h: template.line_spacing_h,
    group_spacing_h: template.group_spacing_h,
    board_pad_h: template.board_pad_h,
    panel_spacing_h: template.panel_spacing_h || 0.3,
    
    // Road Name 样式
    roadName_letter_height_h: template.roadName_letter_height_h || 6,
    roadName_bg_color: template.roadName_bg_color || '#ffffff',
    roadName_text_color: template.roadName_text_color || '#000000',
    roadName_pad_h: template.roadName_pad_h || 0.5,
    roadName_corner_radius_h: template.roadName_corner_radius_h || 0.3,
    
    // Road Number 样式
    roadNumber_letter_height_h: template.roadNumber_letter_height_h || 7,
    roadNumber_bg_color: template.roadNumber_bg_color || '#ffd700',
    roadNumber_text_color: template.roadNumber_text_color || '#000000',
    roadNumber_pad_h: template.roadNumber_pad_h || 0.3,
    roadNumber_corner_radius_h: template.roadNumber_corner_radius_h || 0.2,
  };
  
  // 5. 调用对应的布局引擎
  const layoutParams = {
    input: inputData,
    template: templateParams,
    pxPerH: engine.pxPerH,
    fontMetrics: fontMetrics,
    iconConfig: iconConfig,
  };
  
  let model;
  switch (signType) {
    case 'G1-1':
      model = layoutG11(layoutParams);
      break;
    case 'G1-2':
      model = layoutG12(layoutParams);
      break;
    default:
      throw new Error(`Unknown sign type: ${signType}`);
  }
  
  // 6. 应用 snap 模式（如果需要）
  const snapFn = getSnapFunction(engine.snapMode, engine.pxPerH);
  model = applySnap(model, snapFn);
  
  // 7. 格式转换（D3 → Web）
  return adaptModelForWeb(model, state);
}

/**
 * 获取对齐函数
 */
function getSnapFunction(mode, pxPerH) {
  switch (mode) {
    case 'round':
      return (px) => Math.round(px);
    case 'half-pixel':
      return (px) => Math.round(px * 2) / 2;
    case 'none':
    default:
      return (px) => px;
  }
}

/**
 * 应用 snap 到模型
 */
function applySnap(model, snapFn) {
  return {
    board: {
      w: snapFn(model.board.w),
      h: snapFn(model.board.h),
    },
    items: model.items.map(item => ({
      ...item,
      x: snapFn(item.x),
      y: snapFn(item.y),
      w: item.w ? snapFn(item.w) : undefined,
      h: item.h ? snapFn(item.h) : undefined,
      fontSize: item.fontSize ? snapFn(item.fontSize) : undefined,
    })),
    meta: model.meta,
  };
}

/**
 * 将 D3 模型适配为 Web 格式
 */
function adaptModelForWeb(model, state) {
  const items = model.items.map(item => {
    const itemType = item.t || item.type;
    const adaptedItem = {
      ...item,
      type: itemType,  // 't' → 'type'
    };
    
    // 添加 _debug 信息（用于叠加层）
    if (itemType === 'text' || itemType === 'roadName' || itemType === 'roadNumber') {
      adaptedItem._debug = {
        box: {
          x: item.x,
          y: item.y - (item.ascent_h || 0) * state.engine.pxPerH,
          w: item.text ? item.text.length * item.fontSize * 0.6 : 0,
          h: item.fontSize || item.h,
        },
        baseline_offset: (item.ascent_h || 0) * state.engine.pxPerH,
      };
    } else if (item.w && item.h) {
      adaptedItem._debug = {
        box: {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        },
      };
    }
    
    return adaptedItem;
  });
  
  // 提取文字项用于构建 line1/line2
  const textItems = items.filter(i => i.type === 'text');
  
  // 构建兼容的 meta
  const meta = {
    ...model.meta,
    // 添加一些 web 需要的元数据
    corner_radius_h: state.template.corner_radius_h,
    border_h: state.template.border_h,
    
    // 为 renderMetrics 提供必要的字段
    line1: textItems[0] ? {
      text: textItems[0].text,
      w_h: (textItems[0].text.length * state.template.letter_height_h * state.fonts.avgCharWidthRatio),
      h_h: state.template.letter_height_h,
      ascent_h: state.template.letter_height_h * state.fonts.ascentRatio,
      descent_h: state.template.letter_height_h * state.fonts.descentRatio,
      w_px: textItems[0]._debug.box.w,
      h_px: textItems[0].fontSize,
      baseline_px: textItems[0].y,
    } : null,
    
    line2: textItems[1] ? {
      text: textItems[1].text,
      w_h: (textItems[1].text.length * state.template.letter_height_h * state.fonts.avgCharWidthRatio),
      h_h: state.template.letter_height_h,
      ascent_h: state.template.letter_height_h * state.fonts.ascentRatio,
      descent_h: state.template.letter_height_h * state.fonts.descentRatio,
      w_px: textItems[1]._debug.box.w,
      h_px: textItems[1].fontSize,
      baseline_px: textItems[1].y,
    } : null,
    
    // 内容尺寸（估算）
    content_w_px: model.board.w - 2 * (model.meta.board_pad_px || model.meta.board_pad_h * state.engine.pxPerH),
    content_h_px: model.board.h - 2 * (model.meta.board_pad_px || model.meta.board_pad_h * state.engine.pxPerH),
    
    // 文字组尺寸
    text_group_w_h: model.meta.text_group_w_h || 0,
    text_group_h_h: model.meta.text_group_h_h || 0,
    text_group_w_px: model.meta.text_group_w_px || 0,
    text_group_h_px: model.meta.text_group_h_px || 0,
  };
  
  // 板面尺寸（确保存在）
  if (!meta.board_w_h) {
    meta.board_w_h = model.board.w / state.engine.pxPerH;
    meta.board_h_h = model.board.h / state.engine.pxPerH;
    meta.board_w_px = model.board.w;
    meta.board_h_px = model.board.h;
  }
  
  return {
    board: model.board,
    items: items,
    meta: meta,
    _layout: {},  // 保持兼容性
  };
}

