const path = require('path');
const fs = require('fs');

// Verificar si el archivo dist/main.js existe
const distPath = path.join(__dirname, 'dist', 'main.js');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist/main.js not found. Building project...');
  // Intentar cargar desde src como fallback
  try {
    require('ts-node/register');
    module.exports = require('./src/main.ts');
  } catch (error) {
    console.error('❌ Could not load from src either:', error.message);
    throw new Error('Build files not found. Please run "npm run build" first.');
  }
} else {
  console.log('✅ Loading from dist/main.js');
  module.exports = require('./dist/main.js');
}
