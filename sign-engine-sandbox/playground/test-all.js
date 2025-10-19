/**
 * 测试所有箭头放置策略
 * 生成多个 SVG 文件用于对比
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { layoutG11 } from '../d3/layout-g11.js';
import { toSVG } from '../d4/svg.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// 读取模板
const templatesPath = join(rootDir, 'd3', 'templates.json');
const templates = JSON.parse(readFileSync(templatesPath, 'utf-8'));

// 测试用例
const testCases = [
  {
    name: 'default',
    inputFile: 'input.json',
    outputFile: 'out-default.svg',
    description: '默认：右箭头 + 几何居中',
  },
  {
    name: 'left',
    inputFile: 'input-left.json',
    outputFile: 'out-left.svg',
    description: '左箭头 + 几何居中',
  },
  {
    name: 'baseline2',
    inputFile: 'input-baseline2.json',
    outputFile: 'out-baseline2.svg',
    description: '右箭头 + 对齐第二行基线',
  },
  {
    name: 'optical',
    inputFile: 'input-optical.json',
    outputFile: 'out-optical.svg',
    description: '右箭头 + 光学下沉',
  },
];

console.log('🧪 开始测试所有箭头放置策略...\n');

const results = [];

for (const testCase of testCases) {
  console.log(`📝 测试: ${testCase.description}`);
  
  try {
    // 读取输入
    const inputPath = join(rootDir, testCase.inputFile);
    const inputData = JSON.parse(readFileSync(inputPath, 'utf-8'));
    
    // 获取模板
    const template = templates[inputData.templateCode];
    if (!template) {
      console.error(`  ❌ 模板 "${inputData.templateCode}" 未找到\n`);
      continue;
    }
    
    // 执行布局
    const model = layoutG11({
      input: inputData.input,
      template,
      pxPerH: inputData.pxPerH,
    });
    
    // 生成 SVG
    const svg = toSVG(model);
    
    // 写出文件
    const outPath = join(rootDir, testCase.outputFile);
    writeFileSync(outPath, svg, 'utf-8');
    
    console.log(`  ✅ 生成: ${testCase.outputFile}`);
    console.log(`     箭头位置: ${model.meta.arrow_placement}`);
    console.log(`     垂直策略: ${model.meta.arrow_v_place}`);
    console.log(`     箭头 Y: ${model.meta.arrow_y_h.toFixed(2)}h = ${model.meta.arrow_y_px.toFixed(1)}px\n`);
    
    results.push({
      name: testCase.name,
      success: true,
      file: testCase.outputFile,
      meta: model.meta,
    });
    
  } catch (error) {
    console.error(`  ❌ 错误: ${error.message}\n`);
    results.push({
      name: testCase.name,
      success: false,
      error: error.message,
    });
  }
}

console.log('📊 测试总结:');
console.log(`  成功: ${results.filter(r => r.success).length}/${results.length}`);
console.log(`  失败: ${results.filter(r => !r.success).length}/${results.length}\n`);

console.log('🔍 对比验收建议:');
console.log('  1. 打开所有生成的 SVG 文件并排对比');
console.log('  2. 观察箭头的垂直位置差异：');
console.log('     - default: 几何居中（中线对齐）');
console.log('     - left: 左侧放置，几何居中');
console.log('     - baseline2: 箭头中心对齐第二行基线');
console.log('     - optical: 略低于几何中线（光学补偿）');
console.log('  3. 左箭头版本应该文字在右，箭头在左\n');

console.log('📁 生成的文件:');
results.filter(r => r.success).forEach(r => {
  console.log(`  - ${r.file}`);
});

