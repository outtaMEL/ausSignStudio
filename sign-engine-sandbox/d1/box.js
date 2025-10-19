/**
 * D1: Box 定义（h 单位）
 * 所有尺寸和坐标都在抽象的 h 空间中
 */

/**
 * 创建一个 Box
 * @param {number} w - 宽度（h 单位）
 * @param {number} h - 高度（h 单位）
 * @returns {Object} Box 对象
 */
export function Box(w, h) {
  return {
    x: 0,
    y: 0,
    w,
    h,
  };
}

/**
 * 克隆 Box
 */
export function cloneBox(box) {
  return { ...box };
}

/**
 * 设置 Box 位置
 */
export function setPosition(box, x, y) {
  return { ...box, x, y };
}

