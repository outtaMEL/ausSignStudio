/**
 * Sign Engine Sandbox - Interactive Web Playground
 * 实时调参与可视化验证工具
 */

// 导入核心模块
import { computeLayout } from './engine.js';
import { generateSVG, renderMetrics as renderMetricsHTML } from './renderer.js';

// ===== 状态管理 =====
const state = {
  // 【新增】Sign Type 选择
  signType: 'G1-1',  // 'G1-1' | 'G1-2'
  
  // A. 内容输入
  content: {
    // 【Phase 2】每个 panel 独立定义
    panels: [
      // Panel 1
      {
        roadName: 'SALTASH HWY',
        roadNumberType: 'shield',  // 'number' | 'shield' | 'none'
        roadNumber: '',
        shieldLabel: 'M1',
        destinations: ['Plumpton'],
        direction: 'left',  // 'forward' | 'left' | 'right'
        alignOverride: {
          // 可选：每个元素独立对齐（默认根据 direction）
          centerGroup: null,  // 'left' | 'right' | null (Road Name + Destinations)
          roadNumber: null,   // 'left' | 'right' | null
          arrow: null,        // 'left' | 'right' | null
        },
      },
      // Panel 2
      {
        roadName: '',
        roadNumberType: 'number',
        roadNumber: 'A85',
        shieldLabel: '',
        destinations: ['Hawker'],
        direction: 'right',
        alignOverride: {
          centerGroup: null,
          roadNumber: null,
          arrow: null,
        },
      },
      // Panel 3 (仅 G1-2 使用)
      {
        roadName: '',
        roadNumberType: 'none',
        roadNumber: '',
        shieldLabel: '',
        destinations: ['Sydney'],
        direction: 'forward',
        alignOverride: {
          centerGroup: null,
          roadNumber: null,
          arrow: null,
        },
      },
    ],
  },
  
  // B. 模板参数
  template: {
    letter_height_h: 8,
    line_spacing_h: 0.75,
    group_spacing_h: 1.0,
    board_pad_h: 1.0,
    panel_spacing_h: 0.3,
    corner_radius_h: 0.5,
    border_h: 0.2,
    
    // Road Name 样式
    roadName_letter_height_h: 6,
    roadName_bg_color: '#ffffff',
    roadName_text_color: '#000000',
    roadName_pad_h: 0.5,
    roadName_corner_radius_h: 0.3,
    
    // Road Number 样式
    roadNumber_letter_height_h: 7,
    roadNumber_bg_color: '#ffd700',
    roadNumber_text_color: '#000000',
    roadNumber_pad_h: 0.3,
    roadNumber_corner_radius_h: 0.2,
  },
  
  // C. 字体覆盖
  fonts: {
    series: 'E',
    avgCharWidthRatio: 0.6,
    ascentRatio: 0.75,
    descentRatio: 0.25,
  },
  
  // D. 图标覆盖
  icons: {
    arrow: {
      scalePolicy: 'match_text_line',
      k: 8,
    },
    shield: {
      scalePolicy: 'match_text_line',
      k: 10,
    },
    baselineAnchor: 'middle',
    baselineOffset_h: 0,
  },
  
  // E. 引擎参数
  engine: {
    pxPerH: 10,
    snapMode: 'half-pixel',
    textAnchor: 'useBaseline',
  },
  
  // F. 叠加层开关
  overlays: {
    contentBbox: true,
    board: true,
    boxes: false,
    baselines: true,
    midline: true,
    grid: false,
    spacing: true,
  },
  
  showMetrics: true,
  
  // UI 状态
  zoom: 1.0,
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  initControls();
  initEventListeners();
  render();
});

// ===== 控件初始化 =====
function initControls() {
  // Sign Type
  setValue('sign-type', state.signType);
  updateSignTypeUI();
  
  // A. Panel 输入（G1-1 和 G1-2 通用）
  for (let i = 0; i < 3; i++) {
    const panel = state.content.panels[i];
    
    // 确保 alignOverride 存在
    if (!panel.alignOverride) {
      panel.alignOverride = { centerGroup: null, roadNumber: null, arrow: null };
    }
    
    setValue(`panel${i+1}-roadname`, panel.roadName);
    setValue(`panel${i+1}-road-type`, panel.roadNumberType);
    setValue(`panel${i+1}-roadnumber`, panel.roadNumber);
    setValue(`panel${i+1}-shieldlabel`, panel.shieldLabel);
    setValue(`panel${i+1}-dest1`, panel.destinations[0] || '');
    setValue(`panel${i+1}-dest2`, panel.destinations[1] || '');
    setValue(`panel${i+1}-dest3`, panel.destinations[2] || '');
    setValue(`panel${i+1}-direction`, panel.direction);
    setValue(`panel${i+1}-align-center`, panel.alignOverride.centerGroup || '');
    setValue(`panel${i+1}-align-roadnum`, panel.alignOverride.roadNumber || '');
    setValue(`panel${i+1}-align-arrow`, panel.alignOverride.arrow || '');
    updateRoadTypeUI(i+1);  // 初始化时也要更新UI状态
  }
  
  // B. 模板参数
  setValue('tmpl-letter-height', state.template.letter_height_h);
  setValue('tmpl-line-spacing', state.template.line_spacing_h);
  setValue('tmpl-group-spacing', state.template.group_spacing_h);
  setValue('tmpl-board-pad', state.template.board_pad_h);
  setValue('tmpl-panel-spacing', state.template.panel_spacing_h);
  setValue('tmpl-corner-radius', state.template.corner_radius_h);
  setValue('tmpl-border', state.template.border_h);
  setValue('tmpl-arrow-placement', state.template.arrow_placement);
  setValue('tmpl-shield-placement', state.template.shield_placement);
  setValue('tmpl-group-align', state.template.group_align);
  
  // C. 字体度量
  setValue('font-series', state.fonts.series);
  setValue('font-char-width', state.fonts.avgCharWidthRatio);
  setValue('font-ascent', state.fonts.ascentRatio);
  setValue('font-descent', state.fonts.descentRatio);
  updateRangeOutput('font-char-width');
  updateRangeOutput('font-ascent');
  updateRangeOutput('font-descent');
  
  // 验证 ascent + descent = 1
  if (Math.abs(state.fonts.ascentRatio + state.fonts.descentRatio - 1.0) > 0.001) {
    console.warn('⚠️ Ascent + Descent 不等于 1，自动调整');
    state.fonts.descentRatio = 1 - state.fonts.ascentRatio;
    setValue('font-descent', state.fonts.descentRatio);
    updateRangeOutput('font-descent');
  }
  
  // D. 图标度量
  setValue('arrow-scale-policy', state.icons.arrow.scalePolicy);
  setValue('arrow-k', state.icons.arrow.k);
  setValue('shield-scale-policy', state.icons.shield.scalePolicy);
  setValue('shield-k', state.icons.shield.k);
  setValue('icon-baseline-anchor', state.icons.baselineAnchor);
  setValue('icon-baseline-offset', state.icons.baselineOffset_h);
  
  // E. 引擎参数
  setValue('engine-px-per-h', state.engine.pxPerH);
  updateRangeOutput('engine-px-per-h');
  setValue('engine-snap-mode', state.engine.snapMode);
  setValue('engine-text-anchor', state.engine.textAnchor);
  
  // F. 叠加层
  setChecked('overlay-content-bbox', state.overlays.contentBbox);
  setChecked('overlay-board', state.overlays.board);
  setChecked('overlay-boxes', state.overlays.boxes);
  setChecked('overlay-baselines', state.overlays.baselines);
  setChecked('overlay-midline', state.overlays.midline);
  setChecked('overlay-grid', state.overlays.grid);
  setChecked('overlay-spacing', state.overlays.spacing);
  setChecked('show-metrics', state.showMetrics);
}

// ===== 事件监听 =====
function initEventListeners() {
  // Sign Type 切换
  on('sign-type', 'change', e => {
    state.signType = e.target.value;
    updateSignTypeUI();
    render();
  });
  
  // A. Panel 输入（G1-1 和 G1-2 通用）
  for (let i = 0; i < 3; i++) {
    on(`panel${i+1}-roadname`, 'input', e => { 
      state.content.panels[i].roadName = e.target.value; 
      render(); 
    });
    on(`panel${i+1}-road-type`, 'change', e => { 
      state.content.panels[i].roadNumberType = e.target.value;
      updateRoadTypeUI(i+1);
      render(); 
    });
    on(`panel${i+1}-roadnumber`, 'input', e => { 
      state.content.panels[i].roadNumber = e.target.value; 
      render(); 
    });
    on(`panel${i+1}-shieldlabel`, 'input', e => { 
      state.content.panels[i].shieldLabel = e.target.value; 
      render(); 
    });
    on(`panel${i+1}-dest1`, 'input', e => { 
      state.content.panels[i].destinations[0] = e.target.value; 
      render(); 
    });
    on(`panel${i+1}-dest2`, 'input', e => { 
      state.content.panels[i].destinations[1] = e.target.value; 
      render(); 
    });
    on(`panel${i+1}-dest3`, 'input', e => { 
      state.content.panels[i].destinations[2] = e.target.value; 
      render(); 
    });
    on(`panel${i+1}-direction`, 'change', e => { 
      state.content.panels[i].direction = e.target.value; 
      render(); 
    });
    on(`panel${i+1}-align-center`, 'change', e => {
      state.content.panels[i].alignOverride.centerGroup = e.target.value || null;
      render();
    });
    on(`panel${i+1}-align-roadnum`, 'change', e => {
      state.content.panels[i].alignOverride.roadNumber = e.target.value || null;
      render();
    });
    on(`panel${i+1}-align-arrow`, 'change', e => {
      state.content.panels[i].alignOverride.arrow = e.target.value || null;
      render();
    });
  }
  
  // B. 模板参数
  on('tmpl-letter-height', 'input', e => { state.template.letter_height_h = +e.target.value; render(); });
  on('tmpl-line-spacing', 'input', e => { state.template.line_spacing_h = +e.target.value; render(); });
  on('tmpl-group-spacing', 'input', e => { state.template.group_spacing_h = +e.target.value; render(); });
  on('tmpl-board-pad', 'input', e => { state.template.board_pad_h = +e.target.value; render(); });
  on('tmpl-panel-spacing', 'input', e => { state.template.panel_spacing_h = +e.target.value; render(); });
  on('tmpl-corner-radius', 'input', e => { state.template.corner_radius_h = +e.target.value; render(); });
  on('tmpl-border', 'input', e => { state.template.border_h = +e.target.value; render(); });
  on('tmpl-arrow-placement', 'change', e => { state.template.arrow_placement = e.target.value; render(); });
  on('tmpl-shield-placement', 'change', e => { state.template.shield_placement = e.target.value; render(); });
  on('tmpl-group-align', 'change', e => { state.template.group_align = e.target.value; render(); });
  
  // C. 字体度量
  on('font-series', 'change', e => { state.fonts.series = e.target.value; render(); });
  on('font-char-width', 'input', e => { state.fonts.avgCharWidthRatio = +e.target.value; updateRangeOutput('font-char-width'); render(); });
  on('font-ascent', 'input', e => { 
    state.fonts.ascentRatio = +e.target.value; 
    state.fonts.descentRatio = 1 - state.fonts.ascentRatio;  // 约束：ascent + descent = 1
    setValue('font-descent', state.fonts.descentRatio);
    updateRangeOutput('font-ascent'); 
    updateRangeOutput('font-descent'); 
    render(); 
  });
  on('font-descent', 'input', e => { 
    state.fonts.descentRatio = +e.target.value; 
    state.fonts.ascentRatio = 1 - state.fonts.descentRatio;  // 约束：ascent + descent = 1
    setValue('font-ascent', state.fonts.ascentRatio);
    updateRangeOutput('font-descent'); 
    updateRangeOutput('font-ascent'); 
    render(); 
  });
  
  // D. 图标度量
  on('arrow-scale-policy', 'change', e => {
    state.icons.arrow.scalePolicy = e.target.value;
    document.getElementById('arrow-k').disabled = e.target.value !== 'fixed_k_h';
    render();
  });
  on('arrow-k', 'input', e => { state.icons.arrow.k = +e.target.value; render(); });
  on('shield-scale-policy', 'change', e => {
    state.icons.shield.scalePolicy = e.target.value;
    document.getElementById('shield-k').disabled = e.target.value !== 'fixed_k_h';
    render();
  });
  on('shield-k', 'input', e => { state.icons.shield.k = +e.target.value; render(); });
  on('icon-baseline-anchor', 'change', e => {
    state.icons.baselineAnchor = e.target.value;
    document.getElementById('icon-baseline-offset').disabled = e.target.value !== 'baselineOffset';
    render();
  });
  on('icon-baseline-offset', 'input', e => { state.icons.baselineOffset_h = +e.target.value; render(); });
  
  // E. 引擎参数
  on('engine-px-per-h', 'input', e => {
    state.engine.pxPerH = +e.target.value;
    updateRangeOutput('engine-px-per-h');
    render();
  });
  on('engine-snap-mode', 'change', e => { state.engine.snapMode = e.target.value; render(); });
  on('engine-text-anchor', 'change', e => { state.engine.textAnchor = e.target.value; render(); });
  
  // F. 叠加层
  on('overlay-content-bbox', 'change', e => { state.overlays.contentBbox = e.target.checked; render(); });
  on('overlay-board', 'change', e => { state.overlays.board = e.target.checked; render(); });
  on('overlay-boxes', 'change', e => { state.overlays.boxes = e.target.checked; render(); });
  on('overlay-baselines', 'change', e => { state.overlays.baselines = e.target.checked; render(); });
  on('overlay-midline', 'change', e => { state.overlays.midline = e.target.checked; render(); });
  on('overlay-grid', 'change', e => { state.overlays.grid = e.target.checked; render(); });
  on('overlay-spacing', 'change', e => { state.overlays.spacing = e.target.checked; render(); });
  on('show-metrics', 'change', e => {
    state.showMetrics = e.target.checked;
    document.getElementById('metrics-panel').style.display = e.target.checked ? 'flex' : 'none';
  });
  
  // G. 场景测试
  on('btn-long-text', 'click', () => {
    state.content.destinationName = 'Sydney Opera House';
    state.content.distanceKm = '245';
    setValue('input-destination', state.content.destinationName);
    setValue('input-distance', state.content.distanceKm);
    render();
  });
  
  on('btn-short-text', 'click', () => {
    state.content.destinationName = 'CBD';
    state.content.distanceKm = '5';
    setValue('input-destination', state.content.destinationName);
    setValue('input-distance', state.content.distanceKm);
    render();
  });
  
  on('btn-extreme-small', 'click', () => {
    state.template.letter_height_h = 6;
    state.engine.pxPerH = 6;
    setValue('tmpl-letter-height', 6);
    setValue('engine-px-per-h', 6);
    updateRangeOutput('engine-px-per-h');
    render();
  });
  
  on('btn-extreme-large', 'click', () => {
    state.template.letter_height_h = 12;
    state.engine.pxPerH = 20;
    setValue('tmpl-letter-height', 12);
    setValue('engine-px-per-h', 20);
    updateRangeOutput('engine-px-per-h');
    render();
  });
  
  on('btn-reset', 'click', () => {
    if (confirm('确定要重置所有参数为默认值吗？')) {
      location.reload();
    }
  });
  
  // 导出/导入
  on('btn-export-svg', 'click', exportSVG);
  on('btn-copy-svg', 'click', copySVG);
  on('btn-copy-config', 'click', copyConfig);
  on('file-load-config', 'change', loadConfig);
  
  // 缩放控制
  on('btn-zoom-in', 'click', () => { state.zoom = Math.min(state.zoom + 0.25, 3); updateZoom(); });
  on('btn-zoom-out', 'click', () => { state.zoom = Math.max(state.zoom - 0.25, 0.25); updateZoom(); });
  on('btn-zoom-reset', 'click', () => { state.zoom = 1; updateZoom(); });
  
  // 数值面板折叠
  on('btn-toggle-metrics', 'click', () => {
    const panel = document.getElementById('metrics-panel');
    panel.classList.toggle('collapsed');
    document.getElementById('btn-toggle-metrics').textContent = 
      panel.classList.contains('collapsed') ? '+' : '−';
  });
}

// ===== 核心渲染函数 =====
function render() {
  try {
    const model = computeLayout(state);
    const svg = generateSVG(model, state);
    
    document.getElementById('preview-stage').innerHTML = svg;
    renderMetrics(model);
    
    // 应用缩放
    updateZoom();
  } catch (error) {
    console.error('渲染错误:', error);
    document.getElementById('preview-stage').innerHTML = 
      `<div style="color: #f44336; padding: 2rem;">
        <h3>❌ 渲染错误</h3>
        <pre>${error.message}\n\n${error.stack}</pre>
      </div>`;
  }
}

// ===== 数值面板渲染 =====
function renderMetrics(model) {
  const content = document.getElementById('metrics-content');
  content.innerHTML = renderMetricsHTML(model);
}

// ===== 工具函数 =====
function on(id, event, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(event, handler);
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function setChecked(id, checked) {
  const el = document.getElementById(id);
  if (el) el.checked = checked;
}

function updateRangeOutput(id) {
  const input = document.getElementById(id);
  const output = document.getElementById(`${id}-val`);
  if (input && output) {
    output.textContent = input.value;
  }
}

function updateZoom() {
  const svg = document.querySelector('#preview-stage svg');
  if (svg) {
    svg.style.transform = `scale(${state.zoom})`;
  }
  document.getElementById('zoom-level').textContent = `${Math.round(state.zoom * 100)}%`;
}

// 【新增】切换 Sign Type UI
function updateSignTypeUI() {
  const panel1 = document.getElementById('panel-1-section');
  const panel2 = document.getElementById('panel-2-section');
  const panel3 = document.getElementById('panel-3-section');
  const panelSpacingRow = document.getElementById('panel-spacing-row');
  
  if (state.signType === 'G1-1') {
    // G1-1: 显示 2 个 panels
    if (panel1) panel1.style.display = 'block';
    if (panel2) panel2.style.display = 'block';
    if (panel3) panel3.style.display = 'none';
    if (panelSpacingRow) panelSpacingRow.style.display = 'table-row';
  } else if (state.signType === 'G1-2') {
    // G1-2: 显示 3 个 panels
    if (panel1) panel1.style.display = 'block';
    if (panel2) panel2.style.display = 'block';
    if (panel3) panel3.style.display = 'block';
    if (panelSpacingRow) panelSpacingRow.style.display = 'table-row';
  }
}

// 【新增】根据 road type 切换输入框
function updateRoadTypeUI(panelNum) {
  const roadType = state.content.panels[panelNum - 1].roadNumberType;
  const numberInput = document.getElementById(`panel${panelNum}-roadnumber`);
  const shieldInput = document.getElementById(`panel${panelNum}-shieldlabel`);
  
  if (roadType === 'number') {
    if (numberInput) numberInput.disabled = false;
    if (shieldInput) shieldInput.disabled = true;
  } else if (roadType === 'shield') {
    if (numberInput) numberInput.disabled = true;
    if (shieldInput) shieldInput.disabled = false;
  } else {
    if (numberInput) numberInput.disabled = true;
    if (shieldInput) shieldInput.disabled = true;
  }
}

// ===== 导出/导入功能 =====
function exportSVG() {
  const svg = document.querySelector('#preview-stage svg');
  if (!svg) return alert('没有可导出的 SVG');
  
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `sign-${Date.now()}.svg`;
  a.click();
  
  URL.revokeObjectURL(url);
}

function copySVG() {
  const svg = document.querySelector('#preview-stage svg');
  if (!svg) return alert('没有可复制的 SVG');
  
  const svgData = new XMLSerializer().serializeToString(svg);
  navigator.clipboard.writeText(svgData).then(() => {
    alert('✅ SVG 源码已复制到剪贴板');
  });
}

function copyConfig() {
  const config = JSON.stringify(state, null, 2);
  navigator.clipboard.writeText(config).then(() => {
    alert('✅ 配置 JSON 已复制到剪贴板');
  });
}

function loadConfig(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const config = JSON.parse(event.target.result);
      Object.assign(state, config);
      initControls();
      render();
      alert('✅ 配置已加载');
    } catch (error) {
      alert('❌ 配置文件格式错误：' + error.message);
    }
  };
  reader.readAsText(file);
}

