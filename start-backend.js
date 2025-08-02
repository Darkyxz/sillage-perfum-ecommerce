import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando backend de Sillage Perfum...');

const backendProcess = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit'
});

backendProcess.on('error', (error) => {
  console.error('❌ Error iniciando backend:', error);
});

backendProcess.on('close', (code) => {
  console.log(`🔄 Backend cerrado con código: ${code}`);
});

// Manejo de señales para cerrar el proceso
process.on('SIGINT', () => {
  console.log('🔄 Cerrando backend...');
  backendProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🔄 Cerrando backend...');
  backendProcess.kill('SIGTERM');
  process.exit(0);
});
