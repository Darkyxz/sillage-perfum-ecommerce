#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let viteProcess = null;

// Función para manejar el cierre limpio
function gracefulExit() {
  console.log('\n🛑 Cerrando servidor de desarrollo...');
  
  if (viteProcess) {
    // En Windows, usamos taskkill para terminar el proceso
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', viteProcess.pid, '/f', '/t'], {
        stdio: 'ignore'
      });
    } else {
      viteProcess.kill('SIGTERM');
    }
  }
  
  console.log('✅ Servidor cerrado correctamente');
  process.exit(0);
}

// Registrar manejadores de señales
process.on('SIGINT', gracefulExit);  // Ctrl+C
process.on('SIGTERM', gracefulExit); // Terminación del proceso
process.on('SIGBREAK', gracefulExit); // Ctrl+Break en Windows

// Iniciar Vite
console.log('🚀 Iniciando servidor de desarrollo...');

viteProcess = spawn('npx', ['vite'], {
  stdio: 'inherit',
  cwd: __dirname,
  shell: true
});

viteProcess.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.log(`❌ El servidor terminó con código: ${code}`);
  }
  process.exit(code);
});

viteProcess.on('error', (err) => {
  console.error('❌ Error iniciando el servidor:', err);
  process.exit(1);
});
