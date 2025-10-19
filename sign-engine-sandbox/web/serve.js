/**
 * 极简静态服务器
 * 用法：node web/serve.js
 */

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};

const server = createServer((req, res) => {
  // 默认路径
  let filePath = req.url === '/' ? '/web/index.html' : req.url;
  
  // 移除查询字符串
  filePath = filePath.split('?')[0];
  
  // 如果不是以 /web 开头，自动添加 /web 前缀（除了根路径）
  if (filePath !== '/web/index.html' && !filePath.startsWith('/web/') && !filePath.startsWith('/d1/') && !filePath.startsWith('/d2/') && !filePath.startsWith('/d3/') && !filePath.startsWith('/d4/')) {
    filePath = '/web' + filePath;
  }
  
  // 构建完整路径
  const fullPath = join(rootDir, filePath);
  
  // 检查文件是否存在
  if (!existsSync(fullPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }
  
  // 读取文件
  try {
    const content = readFileSync(fullPath);
    const ext = extname(fullPath);
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache',
    });
    res.end(content);
    
    console.log(`✓ ${req.method} ${req.url}`);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
    console.error(`✗ ${req.url}: ${error.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Sign Engine Sandbox - Web Playground`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`\n按 Ctrl+C 停止服务器\n`);
});

