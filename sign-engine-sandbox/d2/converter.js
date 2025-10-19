/**
 * D2: 几何转换器
 * 将文字和图标转换为 h 空间的 Box
 */

import { Box } from '../d1/box.js';

// 加载 Mock 数据（使用内联数据，兼容浏览器）
const fonts = {
  "E": {
    "avgCharWidthRatio": 0.6,
    "ascentRatio": 0.75,
    "descentRatio": 0.25
  }
};

const icons = {
  "arrow-right-std": {
    "nativeW": 100,
    "nativeH": 80,
    "baselineAnchor": "middle"
  },
  "arrow-left-std": {
    "nativeW": 100,
    "nativeH": 80,
    "baselineAnchor": "middle"
  },
  "arrow-forward-std": {
    "nativeW": 80,
    "nativeH": 100,
    "baselineAnchor": "middle"
  },
  "shield-route": {
    "nativeW": 80,
    "nativeH": 100,
    "baselineAnchor": "middle"
  },
  "shield-freeway": {
    "nativeW": 80,
    "nativeH": 100,
    "baselineAnchor": "middle"
  }
};

/**
 * 测量文字尺寸
 * @param {string} text - 文字内容
 * @param {string} fontSeries - 字体系列（如 "E"）
 * @param {number} letter_h - 字母高度（h 单位）
 * @returns {Object} {width_h, ascent_h, descent_h, height_h}
 */
export function measureText(text, fontSeries, letter_h) {
  const font = fonts[fontSeries];
  if (!font) {
    throw new Error(`Font series "${fontSeries}" not found`);
  }

  const width_h = text.length * letter_h * font.avgCharWidthRatio;
  const ascent_h = letter_h * font.ascentRatio;
  const descent_h = letter_h * font.descentRatio;
  const height_h = letter_h; // 总高度 = ascent + descent

  return {
    width_h,
    ascent_h,
    descent_h,
    height_h,
  };
}

/**
 * 测量图标尺寸
 * @param {string} iconId - 图标 ID
 * @param {number} line_h - 文字行高（h 单位）
 * @returns {Object} {width_h, height_h, baselineOffset_h}
 */
export function measureIcon(iconId, line_h) {
  const icon = icons[iconId];
  if (!icon) {
    throw new Error(`Icon "${iconId}" not found`);
  }

  // 根据策略缩放：match_text_line 表示图标高度等于文字行高
  const height_h = line_h;
  const width_h = (icon.nativeW / icon.nativeH) * height_h;

  // baselineOffset：如果是 middle，则图标中心对齐文字基线
  let baselineOffset_h = 0;
  if (icon.baselineAnchor === 'middle') {
    baselineOffset_h = height_h / 2;
  }

  return {
    width_h,
    height_h,
    baselineOffset_h,
  };
}

/**
 * 将文字转换为 Box
 * @param {string} text - 文字内容
 * @param {Object} options - {fontSeries, letter_h, fontMetrics}
 * @returns {Object} Box with metadata
 */
export function toBoxText(text, options) {
  const { fontSeries, letter_h, fontMetrics } = options;
  
  // 从 JSON 读取默认配置
  const defaultFont = fonts[fontSeries];
  if (!defaultFont) {
    throw new Error(`Font series "${fontSeries}" not found`);
  }
  
  // 【关键】字段级合并：fontMetrics 覆盖 defaultFont
  const finalMetrics = fontMetrics 
    ? { ...defaultFont, ...fontMetrics }
    : defaultFont;
  
  // 使用合并后的参数计算
  const width_h = text.length * letter_h * finalMetrics.avgCharWidthRatio;
  const ascent_h = letter_h * finalMetrics.ascentRatio;
  const descent_h = letter_h * finalMetrics.descentRatio;
  const height_h = letter_h;
  
  const box = Box(width_h, height_h);
  
  return {
    ...box,
    type: 'text',
    text,
    fontSeries,
    letter_h,
    ascent_h,
    descent_h,
  };
}

/**
 * 将图标转换为 Box
 * @param {string} iconId - 图标 ID
 * @param {Object} options - {line_h, label, fontMetrics}
 * @returns {Object} Box with metadata
 */
export function toBoxIcon(iconId, options) {
  const { line_h, label, fontMetrics } = options;
  
  const icon = icons[iconId];
  if (!icon) {
    throw new Error(`Icon "${iconId}" not found`);
  }
  
  // 基础尺寸计算
  const height_h = line_h;
  let width_h = (icon.nativeW / icon.nativeH) * height_h;
  
  // 【新增】如果是 shield 且有 label，根据文字宽度调整
  if (iconId.includes('shield') && label && fontMetrics) {
    // 1. 测量 label 文字（使用较小字号，约 60% line_h）
    const labelLetterH = line_h * 0.6;
    
    // 获取默认字体参数（如果没有传入 fontMetrics）
    const defaultFont = fonts['E']; // 假设使用 E 系列字体
    const finalMetrics = fontMetrics || defaultFont;
    
    const labelWidth = label.length * labelLetterH * finalMetrics.avgCharWidthRatio;
    
    // 2. shield 最小宽度 = label 宽度 + 左右 padding
    const padding = line_h * 0.4;
    const minWidth = labelWidth + padding;
    
    // 3. 取较大值
    width_h = Math.max(width_h, minWidth);
  }
  
  // baselineOffset 计算
  let baselineOffset_h = 0;
  if (icon.baselineAnchor === 'middle') {
    baselineOffset_h = height_h / 2;
  }
  
  const box = Box(width_h, height_h);
  
  return {
    ...box,
    type: 'icon',
    iconId,
    baselineOffset_h,
    label, // 保存 label 信息
  };
}

/**
 * 将 Road Name 转换为 Box（白底黑字矩形）
 * @param {string} text - Road Name 文字
 * @param {Object} options - {letter_h, pad_h, fontMetrics}
 * @returns {Object} Box with metadata
 */
export function toBoxRoadName(text, options) {
  const { letter_h, pad_h, fontMetrics } = options;
  
  // 从 JSON 读取默认配置
  const defaultFont = fonts['E'];
  const finalMetrics = fontMetrics 
    ? { ...defaultFont, ...fontMetrics }
    : defaultFont;
  
  // 计算文字尺寸（增加宽度系数以确保覆盖）
  const textWidth_h = text.length * letter_h * finalMetrics.avgCharWidthRatio * 1.1;  // 增加10%余量
  const textHeight_h = letter_h;
  
  // 加上 padding（增加padding确保覆盖）
  const width_h = textWidth_h + 2.5 * pad_h;  // 增加padding
  const height_h = textHeight_h + 2 * pad_h;
  
  const box = Box(width_h, height_h);
  
  return {
    ...box,
    type: 'roadName',
    text,
    letter_h,
    pad_h,
    textWidth_h,
    textHeight_h,
    ascent_h: letter_h * finalMetrics.ascentRatio,
    descent_h: letter_h * finalMetrics.descentRatio,
  };
}

/**
 * 将 Road Number 转换为 Box（黄色字体，无背景）
 * @param {string} text - Road Number 文字
 * @param {Object} options - {letter_h, fontMetrics}
 * @returns {Object} Box with metadata
 */
export function toBoxRoadNumber(text, options) {
  const { letter_h, fontMetrics } = options;
  
  // 从 JSON 读取默认配置
  const defaultFont = fonts['E'];
  const finalMetrics = fontMetrics 
    ? { ...defaultFont, ...fontMetrics }
    : defaultFont;
  
  // 计算文字尺寸（现在不需要背景框，直接用文字尺寸）
  const width_h = text.length * letter_h * finalMetrics.avgCharWidthRatio;
  const height_h = letter_h;
  
  const box = Box(width_h, height_h);
  
  return {
    ...box,
    type: 'roadNumber',
    text,
    letter_h,
    textWidth_h: width_h,
    textHeight_h: height_h,
    ascent_h: letter_h * finalMetrics.ascentRatio,
    descent_h: letter_h * finalMetrics.descentRatio,
  };
}

export { fonts, icons };

