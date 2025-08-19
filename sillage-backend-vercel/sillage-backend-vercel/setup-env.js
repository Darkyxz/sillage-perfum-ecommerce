// Script para configurar variables de entorno en Vercel
const { execSync } = require('child_process');

const envVars = [
  { name: 'EMAIL_FROM_NAME', value: 'Sillage Perfum' },
  { name: 'EMAIL_SERVICE', value: 'gmail' },
  { name: 'EMAIL_USER', value: 'perfumsillage@gmail.com' },
  { name: 'EMAIL_PASS', value: 'Sillage12345!' },
  { name: 'FRONTEND_URL', value: 'https://sillageperfum.cl' },
  { name: 'NODE_ENV', value: 'production' },
  { name: 'DB_HOST', value: 'srv1918.hstgr.io' },
  { name: 'DB_USER', value: 'u172702780_AdminSillage' },
  { name: 'DB_PASS', value: 'M0nkey12345!' },
  { name: 'DB_NAME', value: 'u172702780_Sillagep' },
  { name: 'DB_PORT', value: '3306' },
];

console.log('🔄 Configurando variables de entorno en Vercel...');

envVars.forEach(({ name, value }) => {
  try {
    console.log(`📝 Configurando ${name}...`);
    
    // Usar echo para pasar el valor automáticamente al CLI de Vercel
    const command = `echo "${value}" | vercel env add ${name} production`;
    execSync(command, { stdio: 'inherit', shell: true });
    
    console.log(`✅ ${name} configurado correctamente`);
  } catch (error) {
    console.error(`❌ Error configurando ${name}:`, error.message);
  }
});

console.log('\n🎉 Variables de entorno configuradas. Ahora ejecuta: vercel --prod');
