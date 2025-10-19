/**
 * Playground: 主运行脚本
 * 读取 input.json → 执行布局 → 生成 out.svg
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { layoutG11 } from '../d3/layout-g11.js';
import { toSVG } from '../d4/svg.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// 读取输入
console.log('📖 读取 input.json...');
const inputPath = join(rootDir, 'input.json');
const inputData = JSON.parse(readFileSync(inputPath, 'utf-8'));

// 读取模板
console.log('📋 加载模板配置...');
const templatesPath = join(rootDir, 'd3', 'templates.json');
const templates = JSON.parse(readFileSync(templatesPath, 'utf-8'));

const template = templates[inputData.templateCode];
if (!template) {
  console.error(`❌ 模板 "${inputData.templateCode}" 未找到`);
  process.exit(1);
}

// 执行布局
console.log(`🎨 执行 ${inputData.templateCode} 布局...`);
const model = layoutG11({
  input: inputData.input,
  template,
  pxPerH: inputData.pxPerH,
});

// 打印元数据（用于调试）
console.log('\n📊 布局元数据:');
console.log('  pxPerH:', model.meta.pxPerH);
console.log('  字母高度:', `${model.meta.letter_height_h}h = ${model.meta.letter_height_px}px`);
console.log('  行间距:', `${model.meta.line_spacing_h}h = ${model.meta.line_spacing_px}px`);
console.log('  组间距:', `${model.meta.group_spacing_h}h = ${model.meta.group_spacing_px}px`);
console.log('  板边距:', `${model.meta.board_pad_h}h = ${model.meta.board_pad_px}px`);
console.log('  箭头位置:', model.meta.arrow_placement);
console.log('  箭头垂直策略:', model.meta.arrow_v_place);
console.log('  箭头 Y:', `${model.meta.arrow_y_h.toFixed(2)}h = ${model.meta.arrow_y_px.toFixed(1)}px`);
console.log('  文字组尺寸:', `${model.meta.text_group_size_h.w.toFixed(2)}h × ${model.meta.text_group_size_h.h.toFixed(2)}h`);
console.log('             ', `${model.meta.text_group_size_px.w.toFixed(1)}px × ${model.meta.text_group_size_px.h.toFixed(1)}px`);
console.log('  内容尺寸:', `${model.meta.content_size_h.w.toFixed(2)}h × ${model.meta.content_size_h.h.toFixed(2)}h`);
console.log('           ', `${model.meta.content_size_px.w.toFixed(1)}px × ${model.meta.content_size_px.h.toFixed(1)}px`);
console.log('  板面尺寸:', `${model.meta.board_size_h.w.toFixed(2)}h × ${model.meta.board_size_h.h.toFixed(2)}h`);
console.log('           ', `${model.meta.board_size_px.w.toFixed(1)}px × ${model.meta.board_size_px.h.toFixed(1)}px`);

// 生成 SVG
console.log('\n🖼️  生成 SVG...');
const svg = toSVG(model);

// 写出文件
const outPath = join(rootDir, 'out.svg');
writeFileSync(outPath, svg, 'utf-8');

console.log(`\n✅ 成功生成: ${outPath}`);
console.log('\n💡 验收方法:');
console.log('  1. 直接打开: out.svg (双击或拖到浏览器)');
console.log('  2. 预览页面: playground/view.html (用浏览器打开)');
console.log('\n预期结果:');
console.log('  ✓ 两行文字垂直排列，行距正确');
console.log('  ✓ 右侧箭头与文字组水平间距正确');
console.log('  ✓ 箭头垂直居中');
console.log('  ✓ 板面四周有边距');
console.log('  ✓ 边缘清晰（像素对齐）');

